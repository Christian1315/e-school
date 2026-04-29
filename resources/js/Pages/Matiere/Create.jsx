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


export default function Create({ schools,professeurs }) {
    const permissions = usePage().props.auth.permissions;
    const authUser = usePage().props.auth.user;

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
        libelle: "",
        school_id: "",
        coefficient: '',
        professeur_ids: null
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

        post(route('matiere.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Matière créee avec succès',
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
            // onFinish: () => reset('password'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Ajout des matières d'école
                </h2>
            }
        >
            <Head title="Ajouter une matière" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('matiere.view') ?
                                (<div className="row d-flex justify-content-center">
                                    <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("matiere.index")}> <CIcon icon={cilList} /> Liste des matières</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    {!authUser.school_id &&
                                        <div className="col-md-6">
                                            <div className='mb-3'>
                                                <InputLabel htmlFor="school_id" value="L'école concernée" >  </InputLabel>

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

                                        </div>}

                                    {/* professeurs */}
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="professeur_ids" value="Les professeurs" >  </InputLabel>

                                            <Select
                                                placeholder="Rechercher un professeur ..."
                                                name="professeur_ids"
                                                id="professeur_ids"
                                                // required
                                                isMulti
                                                className="mt-1 block w-full"
                                                options={professeurs.map((professeur) => ({
                                                    value: professeur.id,
                                                    label: `${professeur.firstname} ${professeur.lastname} ${!authUser.school ? professeur.school?.raison_sociale ?? '' : ''}`,
                                                }))}

                                                // Valeurs sélectionnées (tableau)
                                                value={professeurs
                                                    .map((professeur) => ({
                                                        value: professeur.id,
                                                        label: `${professeur.firstname} ${professeur.lastname} ${!authUser.school ? professeur.school?.raison_sociale ?? '' : ''}`,
                                                    }))
                                                    .filter((option) =>
                                                        data.professeur_ids?.includes(option.value)
                                                    )
                                                }

                                                // Mise à jour du state (tableau d'IDs)
                                                onChange={(options) =>
                                                    setData(
                                                        'professeur_ids',
                                                        options ? options.map((opt) => opt.value) : []
                                                    )
                                                }
                                            />

                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="libelle" value="Libelle de la matière" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="libelle"
                                                className="mt-1 block w-full"
                                                value={data.libelle}
                                                placeholder="Ex: Sport"
                                                onChange={(e) => setData('libelle', e.target.value)}
                                                autoComplete="libelle"
                                                required
                                            />

                                            <InputError className="mt-2" message={errors.libelle} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className='mb-3'>
                                        <InputLabel htmlFor="coefficient" value="Coefficient" > <span className="text-danger">*</span> </InputLabel>
                                        <TextInput
                                            id="coefficient"
                                            className="mt-1 block w-full"
                                            value={data.coefficient}
                                            placeholder="Ex: 3"
                                            onChange={(e) => setData('coefficient', e.target.value)}
                                            autoComplete="coefficient"
                                            required
                                        />

                                        <InputError className="mt-2" message={errors.coefficient} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}> <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'} </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
