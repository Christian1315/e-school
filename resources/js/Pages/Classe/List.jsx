import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilDelete, cilLibraryAdd, cilList, cilMenu, cilPencil } from "@coreui/icons";
import Modal from '@/Components/Modal';
import { useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';

export default function List({ classes }) {
    const permissions = usePage().props.auth.permissions;

    console.log("Les classes :", classes)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const { data, delete: destroy } = useForm({})

    const [showModal, setShowModal] = useState(false);
    const [showProfModal, setShowProfModal] = useState(false);
    const [currentClasse, setCurrentClasse] = useState(null);

    const confirmShowModal = (e, classe) => {
        e.preventDefault();
        setCurrentClasse(classe)
        setShowModal(true);

        console.log("La classe actuelle :", currentClasse)
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Prof modal
    const confirmShowProfModal = (e, classe) => {
        e.preventDefault();
        setCurrentClasse(classe)
        setShowProfModal(true);
    }

    const closeProfModal = () => {
        setShowProfModal(false);
    };

    // suppression de la classe
    const deleteClasse = (e, classe) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `La classe sera supprimée de façon permanente !`,
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
                destroy(route('classe.destroy', classe.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `La classe a été supprimée avec succès.`,
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des classes d'écoles
                </h2>
            }
        >
            <Head title="Les Classes d'écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('classe.create') ?
                            (<div className="  items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("classe.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">Scolarité</th>
                                    <th scope="col">Apprenants</th>
                                    <th scope="col">Professeurs</th>
                                    <th scope="col">Ecole</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    classes.data.map((classe, index) => (
                                        <tr key={classe.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td className='text-center'>
                                                {
                                                    <div className="dropstart">
                                                        <button
                                                            type="button"
                                                            className="dropdown-toggle items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                            data-bs-toggle="dropdown" aria-expanded="false"
                                                        >
                                                            <CIcon icon={cilMenu} /> Gérer
                                                        </button>
                                                        <ul className="dropdown-menu p-2 border rounded shadow" aria-labelledby="dropdownMenuButton1">

                                                            {checkPermission('classe.edit') ?
                                                                (<li><Link
                                                                    className='btn text-warning'
                                                                    href={route('classe.edit', classe.id)}
                                                                >
                                                                    <CIcon icon={cilPencil} />  Modifier
                                                                </Link></li>
                                                                ) : null
                                                            }

                                                            {checkPermission('classe.delete') ?
                                                                (<li><Link
                                                                    className='btn text-danger'
                                                                    onClick={(e) => deleteClasse(e, classe)}
                                                                >
                                                                    <CIcon icon={cilDelete} />  Supprimer
                                                                </Link></li>) : null
                                                            }

                                                        </ul>
                                                    </div>
                                                }
                                            </td>
                                            <td>{classe.libelle}</td>
                                            <td><span className="badge bg-light text-dark border rounded"> {classe.scolarite ?? '00'} FCFA</span></td>
                                            <td><button className="badge bg-light border rounded text-dark shadow"
                                                onClick={(e) => confirmShowModal(e, classe)}> {classe.apprenants.length} <CIcon icon={cilList} className='text-success' /> </button></td>
                                            <td><button className="badge bg-light border rounded text-dark shadow"
                                                onClick={(e) => confirmShowProfModal(e, classe)}> {classe.professeurs.length} <CIcon icon={cilList} className='text-success' /> </button></td>
                                            <td><span className="badge bg-light border rounded text-dark shadow">{classe.school?.raison_sociale ?? '---'}</span></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

             {/* Modal des professeurs */}
            <Modal show={showProfModal} onClose={closeProfModal}>
                {({ tableRef }) =>
                    <div className="p-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Liste des professeurs de la classe: <em className='text-success'>{currentClasse?.libelle} </em>
                        </h2>

                        <table className="table table-striped min-w-full" id='modalTable' ref={tableRef} >
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Nom & Prénom</th>
                                    <th scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentClasse?.professeurs.length > 0 ?
                                        currentClasse?.professeurs.map((prof, index) => (
                                            <tr key={prof.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{`${prof.firstname || '--'}-${prof?.lastname || '--'}`}</td>
                                                <td>{`${prof.email}`}</td>
                                            </tr>
                                        )) :
                                        <tr className='text-center'>Aucun element trouvé</tr>
                                }
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeProfModal}>
                                Fermer
                            </SecondaryButton>
                        </div>
                    </div>
                }
            </Modal>

            {/* Modal des apprenants */}
            <Modal show={showModal} onClose={closeModal}>
                {({ tableRef }) =>
                    <div className="p-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Liste des apprenants de la classe: <em className='text-success'>{currentClasse?.libelle} </em>
                        </h2>

                        <table className="table table-striped min-w-full" id='modalTable' ref={tableRef} >
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Nom & Prénom</th>
                                    <th scope="col">Parent</th>
                                    <th scope="col">Serie</th>
                                    <th scope="col">Télephone</th>
                                    <th scope="col">Edu cMaster</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentClasse?.apprenants.length > 0 ?
                                        currentClasse?.apprenants.map((apprenant, index) => (
                                            <tr key={apprenant.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{`${apprenant.firstname}-${apprenant.lastname}`}</td>
                                                <td>{`${apprenant.parent?.firstname || '--'}-${apprenant.parent?.lastname || '--'}`}</td>
                                                <td>{`${apprenant.serie?.libelle}`}</td>
                                                <td>{apprenant.phone}</td>
                                                <td>{apprenant.educ_master}</td>
                                            </tr>
                                        )) :
                                        <tr className='text-center'>Aucun element trouvé</tr>
                                }
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>
                                Fermer
                            </SecondaryButton>
                        </div>
                    </div>
                }
            </Modal>
        </AuthenticatedLayout>
    );
}
