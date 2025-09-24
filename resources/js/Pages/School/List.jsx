import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarMenu from '@/Components/SidebarMenu';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import { cilUserX, cilCheck, cilDelete, cilAlignCenter, cilLibraryAdd, cilList } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ schools }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const showImg = (school) => {
        Swal.fire({
            // title: `${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`,
            text: `Profile de : ${school.raison_sociale}`,
            imageUrl: school.logo,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Logo d'école'",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });

    }
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des listes d'écoles
                </h2>
            }

            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Les écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('ecole.create') ?
                            (<div className="items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("school.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Logo</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Ifu</th>
                                    <th scope="col">Rccm</th>
                                    <th scope="col">Statut</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    schools.data.map((school, index) => (
                                        <tr key={school.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {/* <CIcon customClassName="nav-icon text-success" icon={cilSchool} /> */}
                                                {/* <img src={school.logo} className='img-fluid shadow' srcSet="" style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid 5px #f6f6f6' }} /> */}

                                                <img src={school.logo}
                                                    onClick={() => showImg(school)}
                                                    className='img-fluid img-circle shadow' srcSet=""
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid 5px #f6f6f6', cursor: 'pointer' }} />
                                            </td>
                                            <td>{school.raison_sociale}</td>
                                            <td>{school.adresse}</td>
                                            <td>{school.phone}</td>
                                            <td>{school.email}</td>
                                            <td>{school.ifu}</td>
                                            <td>{school.rccm}</td>
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
                                                        {checkPermission('ecole.edit') ?
                                                            (<Dropdown.Link
                                                                href={route('school.edit', 1)}
                                                            >
                                                                <CIcon icon={cilUserX} />  Modifier
                                                            </Dropdown.Link>) : null
                                                        }

                                                        {checkPermission('ecole.delete') ?
                                                            (<Dropdown.Link
                                                                href={route('school.destroy', 1)}
                                                            >
                                                                <CIcon icon={cilUserX} />  Supprimer
                                                            </Dropdown.Link>) : null
                                                        }
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
