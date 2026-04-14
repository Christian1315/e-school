import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilDelete, cilLibraryAdd, cilList, cilPencil, cilMenu, cibAddthis, cibBuffer } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ schools }) {
    const permissions = usePage().props.auth.permissions;
   
    // Vérifier si l'utilisateur a la permission
    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const showImg = (e, school) => {
        e.preventDefault();
        Swal.fire({
            text: `Profile de : ${school?.raison_sociale}`,
            imageUrl: school.logo,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profil",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Ok"
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h5 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success ' icon={cibBuffer} /> Liste d'écoles
                </h5>
            }
        >
            <Head title="Les écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('ecole.create') ?
                            (<div className="row d-flex justify-content-center">
                                <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("school.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Logo</th>
                                    <th scope="col">Statut</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Ifu</th>
                                    <th scope="col">Rccm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    schools.data.map((school,index) => (
                                        <tr key={school.id} className='align-items-center'>
                                            <td>{index + 1}</td>
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

                                                        {checkPermission('ecole.edit') ?
                                                            (<li><Link
                                                                className='btn text-warning'
                                                                href={route('school.edit', school.id)}
                                                            >
                                                                <CIcon icon={cilPencil} />  Modifier
                                                            </Link></li>) : null
                                                        }

                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                {school.logo ? <img src={school.logo}
                                                    onClick={(e) => showImg(e, school)}
                                                    className='img-fluid img-circle shadow'
                                                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 5px #f6f6f6', cursor: 'pointer' }}
                                                /> : '---'}
                                            </td>
                                            <th scope="row">
                                                <td>
                                                    <span
                                                        className={`badge p-1 bg-${school.statut ? 'success' : 'danger'} border rounded text-light`}
                                                    >
                                                        {school.statut ? (
                                                            <>
                                                                <CIcon icon={cilCheck} /> Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CIcon icon={cilDelete} /> Desactivé
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                            </th>
                                            <td><span className="badge bg-light text-dark">{school.raison_sociale}</span></td>
                                            <td>{school.adresse}</td>
                                            <td>{school.phone}</td>
                                            <td>{school.email}</td>
                                            <td>{school.ifu}</td>
                                            <td>{school.rccm}</td>
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
