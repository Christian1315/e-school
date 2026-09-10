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
import { useEffect } from 'react';

export default function Create() {
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
        // progress
    } = useForm({
        montant: "",
        date_reglement: "",
        annee_scolaire: new Date().getFullYear(), // default to current year
    });

    useEffect(() => {
        console.log("Les datas updated :", data)
    }, [data]);

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

        post(route('reglement.store'), {
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibAddthis} /> Nouveau règlement
                </h2>
            }
        >
            <Head title="Nouveau règlement" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">
                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('reglement.view') ?
                                (<div className="row d-flex justify-content-center">
                                    <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("paiement.index")}>
                                        <CIcon icon={cilList} /> Liste des règlements
                                    </Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
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
                                    </div>
                                    <div className="col-md-6">
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
            </div >
        </AuthenticatedLayout >
    );
}
