import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import Swal from 'sweetalert2';
import { cilUserX, cilCenterFocus, cilAlignCenter, cilLibraryAdd, cilList, cilTrash, cilSave, cilLink, cilInfo, cilSend, cilCloudDownload } from "@coreui/icons";
import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import Checkbox from '@/Components/Checkbox';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function List({ users, roles }) {
    const authUser = usePage().props.auth.user;

    const permissions = usePage().props.auth.permissions;
    const [currentUser, setCurrentUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    useEffect(() => (
        setData("user_id", currentUser?.id)
    ), [currentUser]);

    const confirmShowModal = (e, user) => {
        e.preventDefault();
        setShowModal(true);
        console.log("Current user :", currentUser)

        setCurrentUser(user)
    };
    const closeModal = () => {
        setShowModal(false);
    };

    const confirmShowImportModal = (e) => {
        setShowImportModal(true);
    };
    const closeImportModal = () => {
        setShowImportModal(false);
    };

    const showUserProfile = (user) => {
        Swal.fire({
            text: `Profile de : ${user.firstname} - ${user.lastname}`,
            imageUrl: user.detail?.profile_img,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profile",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });
    }

    const [formatedRoles, setFormatedRoles] = useState(roles.map((role) => ({
        'id': role.id,
        'name': role.name,
        'school_id': role.school_id,
        'school': role.school,
        'checked': false
    })))

    const { data, errors, setData, processing, post } = useForm({
        role_id: '',
        user_id: currentUser?.id,
    })

    useEffect(() => {
        const selectedRole = formatedRoles.find(role => role.checked);
        setData("role_id", selectedRole ? selectedRole.id : null);
    }, [formatedRoles]);

    /**
     * DataTable hundle
     */

    const selectRole = (role) => {
        const newRoles = formatedRoles.map(r => ({
            ...r,
            checked: r.id === role.id  // ✅ seul le rôle cliqué devient true
        }));
        setFormatedRoles(newRoles);
    };

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

        post(route('affect.role'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Rôle affecté au user (${currentUser?.firstname} - ${currentUser?.lastname}) avec succès`,
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
                setShowModal(false);
            },
        });
    };

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

        post(route('user.import'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Importation effectuée avec succès`,
                });
                setShowImportModal(false)
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });

                console.log("Erreure lors de l'importation")
                setShowImportModal(false)
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des utilisateurs
                </h2>
            }
        >
            <Head title="Les Utilisateurs" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('utilisateur.create') ?
                            (<div className="items-center gap-4">
                                <Link className="mx-2 btn btn-sm bg-success bg-hover text-white" href={route("user.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>

                                <button className="btn btn-sm bg-success bg-hover text-white"
                                    onClick={(e) => confirmShowImportModal(e)}> <CIcon className='' icon={cilCloudDownload} /> Importer des utilisateurs</button>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Email/Phone</th>
                                    {/* <th scope="col">Phone</th> */}
                                    <th scope="col">Rôles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.data.map((user, index) => (
                                        <tr key={user.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border bg-hover shadow-sm'
                                                    onClick={() => showUserProfile(user)}
                                                >
                                                    <CIcon icon={cilCenterFocus} />
                                                </button>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <span className="inline-flex rounded-md">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                            >
                                                                <CIcon icon={cilAlignCenter} /> Gérer
                                                            </button>
                                                        </span>
                                                    </Dropdown.Trigger>

                                                    <Dropdown.Content>
                                                        {/* Un user ne peuut pas s'affceter un role */}
                                                        {checkPermission('affect.role') && authUser.id != user.id ?
                                                            (<Dropdown.Link
                                                                href='#'
                                                                onClick={(e) => confirmShowModal(e, user)}
                                                            >
                                                                <CIcon icon={cilLink} />  Affecter à un rôle
                                                            </Dropdown.Link>) : null
                                                        }

                                                        {checkPermission('utilisateur.delete') ?
                                                            (<Dropdown.Link
                                                                href="#"
                                                            // onClick={(e) => confirmShowModal(e, user)}
                                                            >
                                                                <CIcon icon={cilUserX} />  Supprimer
                                                            </Dropdown.Link>) : null
                                                        }
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                            <td>{user.school?.raison_sociale || '---'}</td>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.email}/{user.detail?.phone || '---'}</td>
                                            {/* <td>{user.detail?.phone}</td> */}
                                            <td className='text-center'>
                                                {
                                                    user.roles?.length > 0 ?
                                                        user.roles.map((role, index) => (
                                                            <span key={index} className="m-1  bg-light text-dark border rounded">{role.name}</span>
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

            {/* Modal d'affcetation */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Affectation de rôle à <em className='text-success'>{currentUser?.firstname} -  {currentUser?.lastname} </em>
                    </h2>

                    <p className="alert alert-warning">
                        <CIcon className='text-danger' icon={cilInfo} /> En affectant un rôle à un utilisateur, tous les autres utilisateurs disposant de ce rôle vont tous le perdre
                    </p>

                    {/*  */}
                    <table className="shadow-sm table table-striped" id='myTable' style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th scope="col">N°</th>
                                <th scope="col">Libele</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                formatedRoles.length > 0 ?
                                    formatedRoles.map((role, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td ><span className="badge bg-light rounded border text-dark">{role.name}</span></td>
                                            <td>
                                                <Checkbox
                                                    checked={role.checked}          // ⚡ important : bind à role.checked
                                                    onChange={() => selectRole(role)}
                                                />
                                            </td>
                                        </tr>
                                    )) : (<tr><td colSpan={3} className='text-danger'>Aucun rôle!</td> </tr>)
                            }
                        </tbody>
                    </table>

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

            {/* Model d'importation */}
            <Modal show={showImportModal} onClose={closeImportModal}>
                <form onSubmit={submitImport} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Importation de nouveaux <em className='text-success'>utilisateurs</em>
                    </h2>

                    <p className="alert alert-success">
                        <CIcon className='text-success' icon={cilInfo} />
                        <ul className="">
                            <li className="">Télecharger le modèle</li>
                            <li className="">Remplissez le modèle</li>
                            <li className="">Uploader le fichier remplit</li>
                        </ul>
                    </p>

                    <div className="my-2">
                        <a
                            target="_blank"
                            href="/users-model.xlsx"
                            className="w-100 text-white btn btn-sm bg-success btn-hover"
                        >
                            <CIcon icon={cilCloudDownload} />
                            Télécharger le modèle
                        </a>
                    </div>

                    <div className="my-2">
                        <InputLabel htmlFor="users" value="Les utilisateurs en fichier excel" > <span className="text-danger">*</span>  </InputLabel>
                        <TextInput
                            type="file"
                            name="users"
                            id="users"
                            required
                            className='form-control mt-1 block w-full'
                            onChange={(e) => setData('users', e.target.files[0])}
                        />

                        <InputError className="mt-2" message={errors.users} />
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
        </AuthenticatedLayout>
    );
}
