import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import SidebarMenu from '@/Components/SidebarMenu';
import CIcon from '@coreui/icons-react';
import { cilLibraryAdd, cilList } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ apprenants }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const showImg = (apprenant) => {
        Swal.fire({
            // title: `${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`,
            text: `Profile de : ${apprenant.parent?.firstname} - ${apprenant.parent?.lastname}`,
            imageUrl: apprenant.photo,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profil",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });

    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des listes d'apprenants
                </h2>
            }

            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Les apprenants" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('apprenant.create') ?
                            (<div className="  items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("apprenant.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Photo</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Parent</th>
                                    <th scope="col">Classe</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Sexe</th>
                                    <th scope="col">Date de naissance</th>
                                    <th scope="col">Lieu de naissance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    apprenants.data.map((apprenant, index) => (
                                        <tr key={apprenant.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {apprenant.photo?
                                                (<img src={apprenant.photo}
                                                    onClick={() => showImg(apprenant)}
                                                    className='img-fluid img-circle shadow' srcSet=""
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid 5px #f6f6f6', cursor: 'pointer' }} />):'---'
                                                }
                                            </td>
                                            <td><span className="badge bg-light border text-dark border">{apprenant.school?.raison_sociale}</span></td>
                                            <td>{apprenant.firstname}</td>
                                            <td>{apprenant.lastname}</td>
                                            <td>{apprenant.parent?.firstname} {apprenant.parent?.lastname}</td>
                                            <td>{apprenant.classe?.libelle} - {apprenant.serie?.libelle} </td>
                                            <td>{apprenant.email}</td>
                                            <td>{apprenant.adresse}</td>
                                            <td>{apprenant.phone}</td>
                                            <td>{apprenant.sexe}</td>
                                            <td><span className="badge bg-light border rounded text-dark">{apprenant.date_naissance}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{apprenant.lieu_naissance}</span></td>
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
