import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilPencil, cilList } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Update({ apprenants, schools, paiement }) {
    const authUser = usePage().props.auth;
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    console.log("le paiement :", paiement)

    const {
        data,
        setData,
        errors,
        patch,
        processing,
        // progress
    } = useForm({
        school_id: paiement.school_id || "",
        apprenant_id: paiement.apprenant_id || "",
        montant: paiement.montant || "",
        date_paiement: paiement.date_paiement?.split("T")?.[0] || "",
        annee_scolaire: paiement.annee_scolaire || '', // default to current year
    });

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

        patch(route('paiement.update', paiement.id), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Paiement mis à jour avec succès',
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cilPencil} /> Mofication du paiement de <span className="badge bg-light border rounded text-success">{`${paiement.apprenant?.firstname} - ${paiement.apprenant?.lastname}`}</span>
                </h2>
            }
        >
            <Head title="Modification de paiement" />

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
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="school_id" value="École concernée" > </InputLabel>

                                            <Select
                                                placeholder="Rechercher une école ..."
                                                name="school_id"
                                                id="school_id"
                                                // required
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
                                                    .find((option) => option.value === data.school_id)} // set selected option
                                                onChange={(option) => setData('school_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>
                                    }
                                    <div className="col-md-6">
                                        {/* Montant */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="montant" value="Montant versé" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="montant"
                                                type="number"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: 50000"
                                                value={data.montant}
                                                onChange={(e) => setData('montant', e.target.value)}
                                                autoComplete="montant"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.montant} />
                                        </div>

                                        {/* Date de paiement */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="date_paiement" value="Date de paiement" />
                                            <TextInput
                                                id="date_paiement"
                                                type="date"
                                                className="mt-1 block w-full"
                                                placeholder="YYYY-MM-DD"
                                                value={data.date_paiement || ""}
                                                onChange={(e) => setData('date_paiement', e.target.value)}
                                                autoComplete="date_paiement"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.date_paiement} />
                                        </div>
                                    </div>
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
                                                    label: `${apprenant.firstname} - ${apprenant.lastname} ${!authUser.school ? apprenant.school?.raison_sociale ?? '' : ''}`,
                                                }))}
                                                value={apprenants
                                                    .map((apprenant) => ({
                                                        value: apprenant.id,
                                                        label: `${apprenant.firstname} - ${apprenant.lastname} ${!authUser.school ? apprenant.school?.raison_sociale ?? '' : ''}`,
                                                    }))
                                                    .find((option) => option.value === data.apprenant_id)} // set selected option
                                                onChange={(option) => setData('apprenant_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.apprenant_id} />
                                        </div>

                                        {/* Annee scolaire */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="annee_scolaire" value="Année scolaire" required={true} />
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
            </div>
        </AuthenticatedLayout>
    );
}
