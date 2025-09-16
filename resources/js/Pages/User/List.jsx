import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarMenu from '@/Components/SidebarMenu';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';
import { cilUserX, cilCenterFocus, cilAlignCenter, cilLibraryAdd, cilList, cilTrash, cilSave } from "@coreui/icons";

export default function List({ users }) {
    console.log(users)

    const confirmShowModal = (e, user) => {
        e.preventDefault();
        setShowModal(true);

        setCurrentUser(user)
    };
    const closeModal = () => {
        setShowModal(false);

        // clearErrors();
        reset();
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des utilisateurs
                </h2>
            }

            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Les Utilisateurs" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        <div className="  items-center gap-4">
                            <Link className="btn btn-sm bg-success bg-hover text-white" href={route("user.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                        </div>
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Action</th>
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
                                            <td>{user.school?.raison_sociale || '---'}</td>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.email}</td>
                                            <td>{user.detail?.phone}</td>
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
                                                        <Dropdown.Link
                                                            href="#"
                                                            onClick={(e) => confirmShowModal(e, user)}
                                                        >
                                                            <CIcon icon={cilUserX} />  Generer un reçu
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
