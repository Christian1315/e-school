import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cibBuffer, cilList } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Create({ apprenants }) {
    const authUser = usePage().props.auth;
    const permissions = usePage().props.auth.permissions;

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
        apprenant_id: "",
        numero_educ_master: "",
        frais_inscription: "",
        dossier_transfert: "",
        annee_scolaire: new Date().getFullYear()
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

        post(route('inscription.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Inscription créée avec succès',
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
                    <CIcon className='text-success' icon={cibBuffer} /> Nouvelle inscription
                </h2>
            }
        >
            <Head title="Nouvelle inscription" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">
                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('inscription.view') ?
                                (<div className="row d-flex justify-content-center">
                                    <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("inscription.index")}>
                                        <CIcon icon={cilList} /> Liste des inscriptions
                                    </Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Frais */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="frais_inscription" value="Frais d'inscription" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="frais_inscription"
                                                type="number"
                                                className="mt-1 block w-full"
                                                placeholder="50000"
                                                value={data.frais_inscription}
                                                onChange={(e) => setData('frais_inscription', e.target.value)}
                                                autoComplete="frais_inscription"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.frais_inscription} />
                                        </div>

                                        {/* Dossier de transfert */}
                                        <div className="col-12">
                                            <div className='mb-3'>
                                                <InputLabel htmlFor="dossier_transfert" value="Dossier de transfert" />
                                                <TextInput
                                                    id="dossier_transfert"
                                                    type="file"
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('dossier_transfert', e.target.files[0])}
                                                    autoComplete="dossier_transfert"
                                                />
                                                {progress && (
                                                    <progress value={progress.percentage} max="100">
                                                        {progress.percentage}%
                                                    </progress>
                                                )}
                                                <InputError className="mt-2" message={errors.dossier_transfert} />
                                            </div>
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

                                        {/* Numéro Educ Master */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="numero_educ_master" value="Numéro Educ Master" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="numero_educ_master"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="###RTYU87654"
                                                value={data.numero_educ_master}
                                                onChange={(e) => setData('numero_educ_master', e.target.value)}
                                                autoComplete="numero_educ_master"
                                            />
                                            <InputError className="mt-2" message={errors.numero_educ_master} />
                                        </div>


                                        {/* Annee scolaire */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="annee_scolaire" value="Anné scolaire" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="annee_scolaire"
                                                type="number"
                                                min={2000}
                                                max={2030}
                                                required
                                                className="mt-1 block w-full"
                                                placeholder="2026"
                                                value={data.annee_scolaire}
                                                onChange={(e) => setData('annee_scolaire', e.target.value)}
                                                autoComplete="annee_scolaire"
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
