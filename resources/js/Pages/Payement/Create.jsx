import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cibAddthis, cilList } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Create({ apprenantsData, schools }) {
    const authUser = usePage().props.auth;
    const permissions = usePage().props.auth.permissions;
    const apprenants = apprenantsData.data

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        post,
        processing,
        progress
    } = useForm({
        school_id: "",
        apprenant_id: "",
        montant: "",
        date_paiement: "",
        paiement_receit: "",
        annee_scolaire: new Date().getFullYear(), // default to current year
    });

    const handleFrais = (e) => {
        const montant = e.target.value;
        console.log("montant :", montant)

        const apprenant = apprenants.find(
            (item) => item.id === data.apprenant_id
        );

        if (montant === '') {
            setData('montant', e.target.value)
            return;
        }

        const montantNumber = Number(montant);
        const restToPay = Number(apprenant?.restToPay);
        if (!Number.isNaN(restToPay) && montantNumber > restToPay) {
            Swal.fire({
                text: `La valeur saisie ${montant} ne doit pas dépasser le reste de la scolarité à payer ${restToPay}.`,
            });
            return
        }

        setData('montant', e.target.value)
    }

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('paiement.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Paiement créée avec succès',
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                console.log(e);
            },
        });
    };

    console.log("apprenants :", apprenants)
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibAddthis} /> Nouveau paiement
                </h2>
            }
        >
            <Head title="Nouveau paiement" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">
                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('paiement.view') ?
                                (<div className="row d-flex justify-content-center">
                                    <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("paiement.index")}>
                                        <CIcon icon={cilList} /> Liste des paiements
                                    </Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    {/* École */}
                                    {!authUser.school &&
                                        <div className="col-12 mb-3">
                                            <InputLabel htmlFor="school_id" value="École concernée">
                                                <span className="text-danger">*</span>
                                            </InputLabel>

                                            <Select
                                                placeholder="Rechercher une école ..."
                                                name="school_id"
                                                id="school_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={schools.map((school) => ({
                                                    value: school.id,
                                                    label: `${school.raison_sociale}`,
                                                }))}
                                                value={schools
                                                    .map((school) => ({
                                                        value: school.id,
                                                        label: `${school.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.school_id)}
                                                onChange={(option) => setData('school_id', option?.value ?? '')}
                                            />

                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>
                                    }
                                    <div className="col-md-6">
                                        {/* Apprenant */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="apprenant_id" value="Apprenant concerné" > <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher un apprenant ..."
                                                name="apprenant_id"
                                                id="apprenant_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={apprenants.map((apprenant) => ({
                                                    value: apprenant.id,
                                                    label: `${apprenant.firstname} ${apprenant.lastname} | ${apprenant?.classe?.libelle} ${apprenant?.classe?.serie?.libelle} (Reste à payer : ${apprenant?.restToPay}) ${!authUser.school ? apprenant.school?.raison_sociale ?? '' : ''}`,
                                                }))}
                                                value={apprenants
                                                    .map((apprenant) => ({
                                                        value: apprenant.id,
                                                        label: `${apprenant.firstname} ${apprenant.lastname} | ${apprenant?.classe?.libelle} ${apprenant?.classe?.serie?.libelle} (Reste à payer : ${apprenant?.restToPay}) ${!authUser.school ? apprenant.school?.raison_sociale ?? '' : ''}`,
                                                    }))
                                                    .find((option) => option.value === data.apprenant_id)}
                                                onChange={(option) => setData('apprenant_id', option?.value ?? '')}
                                            />

                                            <InputError className="mt-2" message={errors.apprenant_id} />
                                        </div>

                                        {/* Justificatif de paiement */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="paiement_receit" value="Justificatif du paiement" />
                                            <TextInput
                                                id="paiement_receit"
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('paiement_receit', e.target.files[0])}
                                                autoComplete="paiement_receit"
                                            />
                                            {progress && (
                                                <progress value={progress.percentage} max="100">
                                                    {progress.percentage}%
                                                </progress>
                                            )}
                                            <InputError className="mt-2" message={errors.paiement_receit} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Montant */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="montant" value="Montant versé">
                                                <span className="text-danger">*</span>
                                            </InputLabel>
                                            <TextInput
                                                id="montant"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: 50000"
                                                value={data.montant}
                                                onChange={(e) => handleFrais(e)}
                                                autoComplete="montant"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.montant} />
                                        </div>

                                        {/* Date de paiement */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="date_paiement" value="Date de paiement">
                                                <span className="text-danger">*</span>
                                            </InputLabel>
                                            <TextInput
                                                id="date_paiement"
                                                type="date"
                                                className="mt-1 block w-full"
                                                value={data.date_paiement}
                                                onChange={(e) => setData('date_paiement', e.target.value)}
                                                autoComplete="date_paiement"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.date_paiement} />
                                        </div>

                                        {/* Annee scolaire */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="annee_scolaire" value="Année scolaire">
                                                <span className="text-danger">*</span>
                                            </InputLabel>
                                            <TextInput
                                                id="annee_scolaire"
                                                type="number"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: 2023"
                                                value={data.annee_scolaire}
                                                onChange={(e) => setData('annee_scolaire', e.target.value)}
                                                autoComplete="annee_scolaire"
                                                min="2000"
                                                max="2030"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.annee_scolaire} />
                                        </div>
                                    </div>
                                </div>

                                {/* Bouton */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </AuthenticatedLayout >
    );
}
