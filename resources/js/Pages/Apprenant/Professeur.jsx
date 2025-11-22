import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import Swal from 'sweetalert2';
import { cilCenterFocus, cilList, cilInfo, cilSend, cilCloudDownload } from "@coreui/icons";
import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Link } from 'react-admin';


export default function List({ users }) {
    const authUser = usePage().props.auth.user;

    const permissions = usePage().props.auth.permissions;

    const [showModal, setShowModal] = useState(false)
    const [showClasseModal, setShowClasseModal] = useState(false)
    const [currentProf, setCurrentProf] = useState(null)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const confirmShowModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    };

    const confirmShowClasseModal = (e, prof) => {
        e.preventDefault();
        setShowClasseModal(true);
        setCurrentProf(prof)
    }

    const closeClasseModal = () => {
        setShowClasseModal(false);
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

    const { data, setData, errors, processing, post } = useForm({
        parents: '',
    })

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

        post(route('professeur.import'), {
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des professeurs
                </h2>
            }
        >
            <Head title="Les Professeurs" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('utilisateur.create') ?
                            (<div className="items-center gap-4">
                                <button className="btn btn-sm bg-success bg-hover text-white"
                                    onClick={(e) => confirmShowModal(e)}> <CIcon className='' icon={cilCloudDownload} /> Importer des professeurs</button>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Email/Phone</th>
                                    <th scope='col'>Les classes</th>
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
                                            <td>{user.school?.raison_sociale || '---'}</td>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.email}/{user.detail?.phone || '---'}</td>
                                            <td><button className="badge bg-light border rounded text-dark shadow"
                                                onClick={(e) => confirmShowClasseModal(e, user)}> {classe.professeurs.length} <CIcon icon={cilList} className='text-success' /> </button></td>
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

            {/* Modal des Classes */}
            <Modal show={showClasseModal} onClose={closeClasseModal}>
                {({ tableRef }) =>
                    <div className="p-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Liste des classes  du professeur: <em className='text-success'>{`${currentProf?.lastname}-${currentProf?.firstname}`} </em>
                        </h2>

                        <table className="table table-striped min-w-full" id='modalTable' ref={tableRef} >
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">Scolarité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentProf?.classes.length > 0 ?
                                        currentProf?.classes.map((classe, index) => (
                                            <tr key={classe.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{`${classe.libelle}`}</td>
                                                <td>{`${classe.scolarite}`}</td>
                                            </tr>
                                        )) :
                                        <tr className='text-center'>Aucun element trouvé</tr>
                                }
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeClasseModal}>
                                Fermer
                            </SecondaryButton>
                        </div>
                    </div>
                }
            </Modal>

            {/* Importation modal */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Importation de nouveaux  <em className='text-success'> professeurs </em>
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
                            href="/professeurs-model.xlsx"
                            className="w-100 text-white btn btn-sm bg-success btn-hover"
                        >
                            <CIcon icon={cilCloudDownload} />
                            Télécharger le modèle
                        </a>
                    </div>


                    <div className="my-2">
                        <InputLabel htmlFor="professeurs" value="Les professeurs en fichier excel" > <span className="text-danger">*</span>  </InputLabel>
                        <TextInput
                            type="file"
                            name="professeurs"
                            id="professeurs"
                            required
                            className='form-control mt-1 block w-full'
                            onChange={(e) => setData('professeurs', e.target.files[0])}
                        />

                        <InputError className="mt-2" message={errors.professeurs} />
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
