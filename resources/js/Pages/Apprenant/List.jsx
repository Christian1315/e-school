import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarMenu from '@/Components/SidebarMenu';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import { cilUserX, cilSchool, cilCheck, cilDelete, cilAlignCenter, cilLibraryAdd, cilList, cilTrash } from "@coreui/icons";
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { useState } from 'react';
import InputError from '@/Components/InputError';

export default function List({ apprenants }) {
    const [showModal, setShowModal] = useState(false);
    const confirmShowModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);

        clearErrors();
        reset();
    };
    const { data, passwordInput, errors, processing } = useForm({
        passwordInput: "",
    })

    const generateReceit = () => {

    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des listes d'apprenants
                </h2>
            }

            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Les apprenants" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        <div className="  items-center gap-4">
                            <Link className="btn btn-sm bg-success bg-hover text-white" href={route("apprenant.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                        </div>
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Photo</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Parent</th>
                                    <th scope="col">Classe</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Sexe</th>
                                    <th scope="col">Date de naissance</th>
                                    <th scope="col">Lieu de naissance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    apprenants.data.map((apprenant, index) => (
                                        <tr key={apprenant.id}>
                                            <th scope="row">{index + 1}</th>

                                            <td>
                                                <CIcon customClassName="nav-icon text-success" icon={cilSchool} />
                                                {/* <img src={apprenant.logo} className='img-fluid img-circle shadow' srcSet="" /> */}
                                            </td>
                                            <td><span className="badge bg-light border text-dark border">{apprenant.school?.raison_sociale}</span></td>
                                            <td>{apprenant.firstname}</td>
                                            <td>{apprenant.lastname}</td>
                                            <td>{apprenant.parent?.firstname} {apprenant.parent?.lastname}</td>
                                            <td>{apprenant.classe?.libelle}</td>
                                            <td>{apprenant.email}</td>
                                            <td>{apprenant.adresse}</td>
                                            <td>{apprenant.phone}</td>
                                            <td>{apprenant.sexe}</td>
                                            <td><span className="badge bg-light border rounded text-dark">{apprenant.date_naissance}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{apprenant.lieu_naissance}</span></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={generateReceit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Êtes-vous sûr de vouloir supprimer votre compte ?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Une fois votre compte supprimé, toutes ses ressources et
                        données seront définitivement supprimées. Veuillez saisir votre
                        mot de passe pour confirmer que vous souhaitez supprimer définitivement
                        votre compte.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Abandonner
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            <CIcon icon={cilTrash} />  Supprimer
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
