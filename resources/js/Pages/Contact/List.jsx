import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibBuffer, cilToggleOff, cilToggleOn } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ contacts }) {
    const permissions = usePage().props.auth.permissions;

    const { data, setData, patch } = useForm({})

    // Marquer comme lu
    const readContact = (e, contact) => {
        e.preventDefault()

        setData("read", true)

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        patch(route('contact.update', contact.id), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Contact marqué comme lu',
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Les Contacts
                </h2>
            }
        >
            <Head title="Les Contacts" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >


                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Nom complet</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Télephone</th>
                                    <th scope="col">message</th>
                                    <th scope="col">Envoyé le</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    contacts.data?.map((contact, index) => (
                                        <tr key={contact.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td className='text-center'>
                                                <button
                                                    className={`btn btn-sm shadow border rounded bg-${contact.read ? 'success' : 'warning'}`}
                                                    title='Marquer comme lu'
                                                    disabled={contact.read}
                                                    onClick={(e) => readContact(e, contact)}> <CIcon icon={contact.read ? cilToggleOn : cilToggleOff} /> </button>
                                            </td>
                                            <td><span className="badge bg-light text-dark"> {contact.read ? 'Déjà lu' : 'Non lu'}</span></td>
                                            <td>{contact.fullname}</td>
                                            <td><span className="badge bg-light text-dark border rounded"> {contact.email}</span></td>
                                            <td>{contact.phone}</td>
                                            <td>
                                                <textarea rows={1} className='form-control' placeholder={contact.message} readOnly></textarea>
                                            </td>
                                            <td><span className="badge bg-light text-dark border rounded"> {contact.createdAt}</span></td>
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
