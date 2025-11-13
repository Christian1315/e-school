import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilDelete, cilLibraryAdd, cilList, cilMenu, cilPencil } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ interrogations }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {patch} = useForm({})

    const validateInterrogation = (e, interrogation) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        patch(route('interrogation.valide',interrogation.id), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Interrogation validée avec succès',
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
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des intérrogations
                </h2>
            }
        >
            <Head title="Les Interrogations d'écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('interrogation.create') ?
                            (<div className="  items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("interrogation.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope='col'>Action</th>
                                    <th scope='col'>Statut</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Apprenant</th>
                                    <th scope="col">Trimestre</th>
                                    <th scope="col">Matiere</th>
                                    <th scope="col">Note</th>
                                    <th scope="col">Inserée par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    interrogations.data.map((interrogation, index) => (
                                        <tr key={interrogation.id} className={`bg-${interrogation.is_validated ? 'success' : 'danger'}`}>
                                            <th scope="row">{index + 1}</th>
                                            <td className='text-center'>
                                                {
                                                    !interrogation.is_validated ?
                                                        <div className="dropstart">
                                                            <button
                                                                type="button"
                                                                className="dropdown-toggle items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                                data-bs-toggle="dropdown" aria-expanded="false"
                                                            >
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>
                                                            <ul className="dropdown-menu p-2 border rounded shadow" aria-labelledby="dropdownMenuButton1">

                                                                {checkPermission('interrogation.edit') ?
                                                                    (<li><Link
                                                                        className='btn btn-success text-white w-100'
                                                                        onClick={(e) => validateInterrogation(e, interrogation)}
                                                                    // href={route('interrogation.edit', interrogation.id)}
                                                                    >
                                                                        <CIcon icon={cilCheck} />  Valider
                                                                    </Link></li>
                                                                    ) : null
                                                                }

                                                                {checkPermission('interrogation.edit') ?
                                                                    (<li><Link
                                                                        className='btn text-warning'
                                                                        href={route('interrogation.edit', interrogation.id)}
                                                                    >
                                                                        <CIcon icon={cilPencil} />  Modifier
                                                                    </Link></li>
                                                                    ) : null
                                                                }

                                                                {checkPermission('interrogation.delete') ?
                                                                    (<li><Link
                                                                        className='btn text-danger'
                                                                    >
                                                                        <CIcon icon={cilDelete} />  Supprimer
                                                                    </Link></li>) : null
                                                                }

                                                            </ul>
                                                        </div> : '--'
                                                }
                                            </td>
                                            <td>
                                                <span
                                                    className={`btn btn-sm badge bg-${interrogation.is_validated ? 'success' : 'danger'} border rounded text-light`}
                                                >
                                                    {interrogation.is_validated ? (
                                                        <>
                                                            Validée
                                                        </>
                                                    ) : (
                                                        <>
                                                            Non validée
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td>{interrogation.school?.raison_sociale ?? '---'}</td>
                                            <td>{`${interrogation.apprenant?.firstname} - ${interrogation.apprenant?.lastname}`}</td>
                                            <td>{interrogation.trimestre?.libelle}</td>
                                            <td>{interrogation.matiere?.libelle}</td>
                                            <td><span className="badge bg-light text-dark border rounded"> {interrogation.note ?? '00'}</span></td>
                                            <td><span className="badge bg-light text-dark border rounded"> {`${interrogation.createdBy?.firstname} - ${interrogation.createdBy?.lastname}`}</span></td>
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
