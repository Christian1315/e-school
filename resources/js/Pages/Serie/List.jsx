import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cibBuffer } from "@coreui/icons";

export default function List({ series }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Les déries d'écoles
                </h2>
            }
        >
            <Head title="Les Classes d'écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('classe.create') ?
                            (<div className="row d-flex justify-content-center">
                                <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("serie.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Libelle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    series.data.map((serie, index) => (
                                        <tr key={serie.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{serie.school?.raison_sociale || '---'}</td>
                                            <td>{serie.libelle}</td>
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
