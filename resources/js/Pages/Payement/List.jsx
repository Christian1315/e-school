import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { cilUserX, cilLibraryAdd, cilList, cilSave, cilMenu, cilPencil, cilDelete, cilCloudDownload } from "@coreui/icons";

export default function List({ payements }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }
    const [showModal, setShowModal] = useState(false);
    const [currentPayement, setCurrentPayement] = useState(null);

    const { reset, setData, data, reste, errors, processing, delete: destroy } = useForm({
        reste: null,
    })

    const confirmShowModal = (e, paiement) => {
        e.preventDefault();
        setShowModal(true);

        // console.log(paiement)
        setCurrentPayement(paiement)
    };
    const closeModal = () => {
        setShowModal(false);

        // clearErrors();
        reset();
    };

    const generateReceit = (e) => {
        e.preventDefault();
        setShowModal(false);

        Swal.fire({
            icon: 'info',
            title: 'Opération en cours...',
            text: "Veuillez patienter un instant",
            allowOutsideClick: false,   // empêche de fermer en cliquant dehors
            didOpen: () => {
                Swal.showLoading();
            },
            timer: 3000, // ⏳ 3 secondes
            timerProgressBar: true     // affiche une barre de progression
        }).then(() => {
            // Quand le timer est fini, tu peux lancer une autre alerte
            Swal.fire({
                icon: 'success',
                html: `
                    <div style="text-align: center;">
                        <p class=''>
                            Reçu généré avec succès ! Cliquez sur 
                            <strong>le lien</strong> ci-dessous pour le récupérer :
                        </p>
                        <p>
                            <a target="_blank" href="${route('paiement.generate-receit', { paiement: currentPayement?.id })}">
                            📥 Télécharger le reçu
                            </a>
                        </p>
                    </div>
                `,
                showConfirmButton: false
            })
        });
    }

    // suppression du paiement
    const deletePaiement = (e, paiement) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le paiement sera supprimé de façon permanente !`,
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
                destroy(route('paiement.destroy', paiement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le paiement a été supprimé avec succès.`,
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
                    <CIcon className='text-success' icon={cilList} /> Panel des paiements
                </h2>
            }
        >
            <Head title="Les paiements" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('paiement.create') ?
                            (<div className="items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("paiement.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Apprenant</th>
                                    <th scope="col">Montant versé</th>
                                    <th scope="col">Inséré par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    payements.data.map((paiement, index) => (
                                        <tr key={paiement.id}>
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

                                                        {checkPermission('paiement.imprimer.receit') ?
                                                            (
                                                                <li>
                                                                    <Link
                                                                        className='btn btn-light'
                                                                        href="#"
                                                                        onClick={(e) => confirmShowModal(e, paiement)}
                                                                    >
                                                                        <CIcon icon={cilCloudDownload} />  Generer un reçu
                                                                    </Link>
                                                                </li>
                                                            ) : null
                                                        }

                                                        {checkPermission('paiement.edit') ?
                                                            (<li><Link
                                                                className='btn text-warning'
                                                                href={route('paiement.edit', paiement.id)}
                                                            >
                                                                <CIcon icon={cilPencil} />  Modifier
                                                            </Link></li>) : null
                                                        }

                                                        {checkPermission('paiement.delete') ?
                                                            (<li><Link
                                                                className='btn text-danger'
                                                                onClick={(e) => deletePaiement(e, paiement)}
                                                            >
                                                                <CIcon icon={cilDelete} />  Supprimer
                                                            </Link></li>) : null
                                                        }

                                                    </ul>
                                                </div>
                                            </td>
                                            <td className="text-center"><span className="badge bg-light border rounded text-dark">{paiement.numero}</span></td>
                                            <td><span className="badge bg-light text-dark border">  {`${paiement.school?.raison_sociale}`}</span></td>
                                            <td><span className="badge bg-light text-dark border">  {`${paiement.apprenant?.firstname} - ${paiement.apprenant?.lastname}`}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{paiement.montant}</span></td>
                                            <td>{`${paiement.createdBy?.firstname} - ${paiement.createdBy?.lastname}`}</td>

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
                        Reçu pour le paiement de l'apprenant : <em className='text-success'>{currentPayement?.apprenant?.firstname} -  {currentPayement?.apprenant?.lastname} </em>
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Une fois le reçu generé, un lien vous ai renvoyé via alert! Cliquez dessus pour télécharger le reçu.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Abandonner
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={processing}>
                            <CIcon icon={cilSave} />  Generer maintenant
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
