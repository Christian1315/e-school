import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cibBuffer, cilDelete, cilList, cilMenu, cilPencil } from "@coreui/icons";
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function List({ matieres }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    // suppression de la matiere
    const deleteMatiere = (e, matiere) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `La matiere sera supprimée de façon permanente !`,
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
                destroy(route('matiere.destroy', matiere.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `La matière a été supprimée avec succès.`,
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

    const { data, delete: destroy } = useForm({})

    const [showProfModal, setShowProfModal] = useState(false);
    const [currentMatiere, setCurrentMatiere] = useState(null);

    const confirmShowProfModal = (e, matiere) => {
        e.preventDefault();
        setCurrentMatiere(matiere)
        setShowProfModal(true);

        console.log("La matiere actuelle :", currentMatiere)
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Matières d'écoles
                </h2>
            }
        >
            <Head title="Les Matières d'écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('matiere.create') ?
                            (<div className="row d-flex justify-content-center">
                                <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("matiere.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">Coeficient</th>
                                    <th scope="col">Professeurs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    matieres?.data?.map((matiere, index) => (
                                        <tr key={matiere.id}>
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

                                                            {checkPermission('matiere.edit') ?
                                                                (<li><Link
                                                                    className='btn text-warning'
                                                                    href={route('matiere.edit', matiere.id)}
                                                                >
                                                                    <CIcon icon={cilPencil} />  Modifier
                                                                </Link></li>
                                                                ) : null
                                                            }

                                                            {checkPermission('matiere.delete') ?
                                                                (<li><Link
                                                                    className='btn text-danger'
                                                                    onClick={(e) => deleteMatiere(e, matiere)}
                                                                >
                                                                    <CIcon icon={cilDelete} />  Supprimer
                                                                </Link></li>) : null
                                                            }

                                                        </ul>
                                                    </div>
                                                }
                                            </td>
                                            <td>{matiere.school?.raison_sociale ?? '---'}</td>
                                            <td>{matiere.libelle}</td>
                                            <td><span className="badge bg-light text-dark border rounded">{matiere.coefficient} </span> </td>
                                            <td className='text-center'>
                                                <button
                                                    className="badge bg-light border rounded text-dark shadow"
                                                    onClick={(e) => confirmShowProfModal(e, matiere)}>
                                                    {matiere.professeurs?.length} <CIcon icon={cilList} className='text-success' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal des professeurs */}
            <Modal show={showProfModal} onClose={() => setShowProfModal(false)}>
                {({ tableRef }) =>
                    <div className="p-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Liste des professeurs de la matiere: <em className='text-success'>{currentMatiere?.libelle} </em>
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
                                    currentMatiere?.professeurs?.length > 0 ?
                                        currentMatiere?.professeurs?.map((prof, index) => (
                                            <tr key={prof.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{`${prof.firstname || '--'}-${prof?.lastname || '--'}`}</td>
                                                <td>{`${prof.email}`}</td>
                                            </tr>
                                        )) : <tr className='text-center'><td>Aucun element trouvé!</td></tr>
                                }
                            </tbody>
                        </table>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={() => setShowProfModal(false)}>
                                Fermer
                            </SecondaryButton>
                        </div>
                    </div>
                }
            </Modal>
        </AuthenticatedLayout>
    );
}
