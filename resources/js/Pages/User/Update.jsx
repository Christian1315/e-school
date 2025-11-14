import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cilPencil } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Update({ schools, roles, user,role }) {
    const permissions = usePage().props.auth.permissions;

    console.log("Le user concerné :", user)
    console.log("Le role concerné :", role)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }
    const {
        data,
        setData,
        errors,
        post,
        patch,
        processing,
        progress
    } = useForm({
        role_id: role.id || '',
        school_id: user.school_id || "",
        phone: user.phone || "",
        email: user.email || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
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

        patch(route('user.update', user.id), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Utilisateur mis à jour avec succès',
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilPencil} /> Modification de l'utilisateur <span className="badge bg-lidgt rounded border text-success">{user.firstname} - {user.lastname}</span>
                </h2>
            }
        >
            <Head title="Modification d'utilisateur" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">
                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('utilisateur.view') ?
                                (<div className="text-center items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("user.index")}>
                                        <CIcon icon={cilArrowCircleLeft} /> Liste des utilisateurs
                                    </Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* École */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="school_id" value="École concernée" > <span className="text-danger">*</span> </InputLabel>
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
                                                    .find((option) => option.value === data.school_id)} // set selected option
                                                onChange={(option) => setData('school_id', option.value)} // update state with id
                                            />
                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>


                                        {/* Firstname */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="firstname" value="Nom" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="firstname"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Doe"
                                                value={data.firstname}
                                                onChange={(e) => setData('firstname', e.target.value)}
                                                autoComplete="firstname"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.firstname} />
                                        </div>

                                        {/* Phone */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phome" value="Numéro de télépone" ></InputLabel>
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="+2290156854397"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                autoComplete="phone"
                                            />
                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        {/* Role */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="role_id" value="Affectez-lui un rôle" > <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un rôle ..."
                                                name="role_id"
                                                id="role_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={roles.map((role) => ({
                                                    value: role.id,
                                                    label: `${role.name} ${role.school_id ? '(' + role.school.raison_sociale + ')' : ''}`,
                                                }))}
                                                value={roles
                                                    .map((role) => ({
                                                        value: role.id,
                                                        label: `${role.name}`,
                                                    }))
                                                    .find((option) => option.value === data.role_id)} // set selected option
                                                onChange={(option) => setData('role_id', option.value)} // update state with id
                                            />
                                            <InputError className="mt-2" message={errors.role_id} />
                                        </div>
                                        {/* Lastname */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="lastname" value="Prénom" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                name="lastname"
                                                id="lastname"
                                                required
                                                placeholder="John"
                                                className='form-control mt-1 block w-full'
                                                value={data.lastname}
                                                onChange={(e) => setData('lastname', e.target.value)}
                                            />

                                            <InputError className="mt-2" message={errors.lastname} />
                                        </div>

                                        {/* Email */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" > <span className="text-danger">*</span>  </InputLabel>
                                            <TextInput
                                                name="email"
                                                id="email"
                                                required
                                                placeholder="joe@gmail.com"
                                                className='form-control mt-1 block w-full'
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />

                                            <InputError className="mt-2" message={errors.email} />
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
