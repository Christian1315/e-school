import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cibBuffer, cilCheck, cilDelete, cilMenu, cilPencil } from "@coreui/icons";

// kkiapay
import { useKKiaPay } from 'kkiapay-react';
import Swal from 'sweetalert2';


export default function List({ reglements, callback, KKIAPAY_SECRET_KEY }) {
    const permissions = usePage().props.auth.permissions;
    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    // validation
    const { openKkiapayWidget } = useKKiaPay();
    const validateReglement = (e) => {
        e.preventDefault();

        alert("gogoog")

        try {
            openKkiapayWidget({
                amount: amount,
                api_key: KKIAPAY_SECRET_KEY,
                sandbox: true,
                phone: "97000000",
                position: "right",
                callback: callback,
            });
        } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
        }

    }

    // suppression du reglement
    const deleteReglement = (e, reglement) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le reglement sera supprimé de façon permanente !`,
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
                destroy(route('reglement.destroy', reglement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le reglèment a été supprimé avec succès.`,
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
                    <CIcon className='text-success' icon={cibBuffer} /> Les reglements
                </h2>
            }
        >
            <Head title="Les reglements" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('reglement.create') ?
                            (<div className="row d-flex justify-content-center">
                                <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("reglement.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Transaction ID</th>
                                    <th scope="col">Montant</th>
                                    <th scope="col">Année scolaire</th>
                                    <th scope="col">Inséré le</th>
                                    <th scope="col">Inséré par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reglements.data?.map((reglement, index) => (
                                        <tr key={reglement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!reglement.validatedBy ?
                                                    <div className="dropstart">
                                                        <button
                                                            type="button"
                                                            className="dropdown-toggle items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                            data-bs-toggle="dropdown" aria-expanded="false"
                                                        >
                                                            <CIcon icon={cilMenu} /> Gérer
                                                        </button>
                                                        <ul className="dropdown-menu p-2 border rounded shadow" aria-labelledby="dropdownMenuButton1">

                                                            {checkPermission('reglement.validate') ?
                                                                (<li><Link
                                                                    className='btn text-success'
                                                                    onClick={(e) => validateReglement(e)}
                                                                >
                                                                    <CIcon icon={cilCheck} />  Valider
                                                                </Link></li>) : null
                                                            }

                                                            {checkPermission('reglement.delete') ?
                                                                (<li><Link
                                                                    className='btn text-danger'
                                                                    onClick={(e) => deleteReglement(e, reglement)}
                                                                >
                                                                    <CIcon icon={cilDelete} />  Supprimer
                                                                </Link></li>) : null
                                                            }

                                                        </ul>
                                                    </div> : '---'
                                                }
                                            </td>
                                            <td className="text-center"><span className="badge bg-light border rounded text-dark">{reglement.numero}</span></td>
                                            <td className="text-center"><span className="badge bg-light border rounded text-dark">{reglement.transactionId || '---'}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{reglement.montant}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{reglement.annee_scolaire}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{reglement.created_at || '---'}</span></td>
                                            <td>{`${reglement.createdBy?.firstname} - ${reglement.createdBy?.lastname}`}</td>
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
