import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import SidebarMenu from '@/Components/SidebarMenu';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import { cilUserX, cilSchool, cilCheck, cilDelete, cilAlignCenter, cilLibraryAdd, cilList } from "@coreui/icons";
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

export default function List({ matieres }) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des matières d'écoles
                </h2>
            }

            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Les Matières d'écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        <div className="  items-center gap-4">
                            <Link className="btn btn-sm bg-success bg-hover text-white" href={route("matiere.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                        </div>
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">Coefficient</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    matieres.data.map((matiere, index) => (
                                        <tr key={matiere.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{matiere.school?.raison_sociale??'---'}</td>
                                            <td>{matiere.libelle}</td>
                                            <td><span className="badge bg-light text-dark border rounded">{matiere.coefficient} </span> </td>
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
