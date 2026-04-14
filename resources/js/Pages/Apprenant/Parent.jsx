import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import Swal from 'sweetalert2';
import { cilList, cilInfo, cilSend, cilCloudDownload, cilMenu, cilPencil, cilDelete, cibBuffer } from "@coreui/icons";
import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function List({ users }) {

    /** Data initialization */
    const { data, setData, errors, processing, post, delete: destroy } = useForm({
        parents: '',
    })

    const permissions = usePage().props.auth.permissions;
    const [showModal, setShowModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [currentParent, setCurrentParent] = useState(null);

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    useEffect(() => {
        console.log("Data des parents : ", data);
    }, [data])

    /**Show modal */
    const confirmShowModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    }

    /**Close modal */
    const closeModal = () => {
        setShowModal(false);
    };

    /** SHow user's profile */
    const showUserProfile = (user) => {
        Swal.fire({
            text: `Profile de : ${user.firstname} - ${user.lastname}`,
            imageUrl: user.detail?.profile_img,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profile",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Ok"
        });
    }

    // importation des parents
    const submitImport = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('parent.import'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Importation effectuée avec succès`,
                });
                setShowModal(false)
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                setShowModal(false)
            },
        });
    };

    // update parent
    const handleUpdate = (e, user) => {
        e.preventDefault();

        // initialize current parent
        setCurrentParent(user);

        setShowUpdateModal(true);
        setData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.detail?.phone || '',
            profile_img: '',
            role_id: user.roles?.[0]?.id || '',
        })
    }

    /**
     * Submit update
     */
    const submitUpdate = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('user.update', currentParent.id, { forceFormData: true }), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Mise à jour effectuée avec succès`,
                });
                setShowUpdateModal(false);
            },
            onError: (e) => {
                console.log("Erreur lors de la mise à jour : ", e);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? JSON.stringify(e)}`,
                });
                setShowUpdateModal(false);
            },
        });

    }

    /**
     * Deleting parent
     */
    const deleteParent = (e, user) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le parent sera supprimé de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Suppression en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                destroy(route('user.destroy', user.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le parent a été supprimé avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Suppression échouée </span>', // yellow text
                            text: `${e.exception ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                })
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Panel des parents
                </h2>
            }
        >
            <Head title="Les Parents" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('utilisateur.create') ?
                            (<div className="items-center gap-4">
                                <button className="btn btn-sm bg-success bg-hover text-white"
                                    onClick={(e) => confirmShowModal(e)}> <CIcon className='' icon={cilCloudDownload} /> Importer des parents</button>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Rôles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.data.map((user, index) => (
                                        <tr key={user.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <div className="dropstart">
                                                    <button
                                                        type="button"
                                                        className="dropdown-toggle items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                        data-bs-toggle="dropdown" aria-expanded="false"
                                                    >
                                                        <CIcon icon={cilMenu} /> Gérer
                                                    </button>
                                                    <ul className="dropdown-menu p-2 border rounded shadow" aria-labelledby="dropdownMenuButton1">

                                                        {checkPermission('utilisateur.edit') ?
                                                            (<li><Link className='btn text-warning'
                                                                onClick={(e) => handleUpdate(e, user)}><CIcon icon={cilPencil} />  Modifier
                                                            </Link></li>) : null}

                                                        {checkPermission('utilisateur.delete') ?
                                                            (<li><Link className='btn text-danger'
                                                                onClick={(e) => deleteParent(e, user)}><CIcon icon={cilDelete} />  Supprimer
                                                            </Link></li>) : null}
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                {user.detail?.profile_img ?
                                                    <img src={user.detail?.profile_img} alt="Profile"
                                                        onClick={(e) => showUserProfile(user)}
                                                        className='img-fluid img-circle shadow' srcSet=""
                                                        style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid 5px #f6f6f6', cursor: 'pointer' }}
                                                    /> : '---'
                                                }
                                            </td>
                                            <td><span className="badge bg-light text-dark"> {user.school?.raison_sociale || '---'}</span></td>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.email || '---'}</td>
                                            <td>{user.detail?.phone || '---'}</td>
                                            <td className='text-center'>
                                                {
                                                    user.roles?.length > 0 ?
                                                        user.roles.map((role, index) => (
                                                            <span key={index} className="m-1 badge bg-light text-dark border rounded">{role.name}</span>
                                                        )) : '---'
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* modal d'importation  */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submitImport} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Importation de nouveaux  <em className='text-success'> parents </em>
                    </h2>

                    <div className="alert alert-success">
                        <CIcon className='text-success' icon={cilInfo} />
                        <ol className="">
                            <li className="">Télecharger le modèle</li>
                            <li className="">Remplissez le modèle</li>
                            <li className="">Uploader le fichier remplit</li>
                        </ol>
                    </div>

                    <div className="my-2">
                        <a
                            target="_blank"
                            href="/parents-model.xlsx"
                            className="w-100 text-white btn btn-sm bg-success btn-hover"
                        >
                            <CIcon icon={cilCloudDownload} />
                            Télécharger le modèle
                        </a>
                    </div>


                    <div className="my-2">
                        <InputLabel htmlFor="parents" value="Les parents en fichier excel" > <span className="text-danger">*</span>  </InputLabel>
                        <TextInput
                            type="file"
                            name="parents"
                            id="parents"
                            required
                            className='form-control mt-1 block w-full'
                            onChange={(e) => setData('parents', e.target.files[0])}
                        />

                        <InputError className="mt-2" message={errors.parents} />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Abandonner
                        </SecondaryButton>

                        <PrimaryButton disabled={processing}>
                            <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer les modifications'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* modal de modification  */}
            <Modal show={showUpdateModal} onClose={(e) => setShowUpdateModal(false)}>
                <form onSubmit={submitUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Modification du parent : <em className='text-success'> {currentParent?.firstname} {currentParent?.lastname} </em>
                    </h2>

                    <div className="my-2">
                        <div className="row">
                            <div className="col-md-6">
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
                                    <InputLabel htmlFor="phone" value="Numéro de télépone" ></InputLabel>
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

                            {/* photo */}
                            <div className="col-12">
                                <InputLabel htmlFor="profile_img" value="Photo" />
                                <TextInput
                                    name="profile_img"
                                    id="profile_img"
                                    type="file"
                                    className='form-control mt-1 block w-full'
                                    onChange={(e) => setData('profile_img', e.target.files[0])}
                                />
                            </div>
                        </div>

                        {/* Bouton */}
                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={e => setShowUpdateModal(false)}>
                                Abandonner
                            </SecondaryButton>

                            <PrimaryButton disabled={processing}>
                                <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer les modifications'}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
