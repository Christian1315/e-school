import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarMenu from '@/Components/SidebarMenu';
import CIcon from '@coreui/icons-react';
import { cilList, cilArrowLeft, cilSend } from "@coreui/icons";
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function List({ role }) {

    const [ckeckUsers, setCheckUsers] = useState(role.users.map((user) => ({
        'id': user.id,
        'checked': true
    })))

    const { data, errors, setData, processing, post, patch } = useForm({
        users: ckeckUsers
    })

    useEffect(() => {
        setData("users", ckeckUsers.filter((user) => user.checked))
    }, [ckeckUsers]);

    /**
     * DataTable hundle
     */
    useEffect(() => {
        if (ckeckUsers.length > 0) {
            // Détruire une ancienne instance si elle existe (évite doublons en React)
            if ($.fn.DataTable.isDataTable('#newMyTable')) {
                $('#newMyTable').DataTable().destroy();
            }

            // Init DataTable sur le DOM existant
            new DataTable('#newMyTable', {
                pagingType: 'full_numbers',
                responsive: true,
                dom: `
        <'d-flex justify-content-between mb-2'
          <'dt-search'f>
          <'dt-buttons'B>
        >
        <'table-responsive'tr>
        <'d-flex justify-content-between mt-2'
          i
          p
        >
      `,
                order: [[0, 'desc']],
                columns: [null, null, null, null], // ⬅️ correspond aux 4 <th>
                buttons: [
                    {
                        extend: 'copy',
                        className: 'btn btn-sm btn-primary',
                        text: '<i class="fas fa-copy"></i> Copier'
                    },
                    {
                        extend: 'excel',
                        className: 'btn btn-sm btn-success',
                        text: '<i class="fas fa-file-excel"></i> Excel'
                    },
                    {
                        extend: 'pdf',
                        className: 'btn btn-sm btn-danger',
                        text: '<i class="fas fa-file-pdf"></i> PDF'
                    },
                    {
                        extend: 'print',
                        className: 'btn btn-sm btn-warning',
                        text: '<i class="fas fa-print"></i> Imprimer'
                    }
                ],
                language: {
                    decimal: ",",
                    thousands: " ",
                    emptyTable: "Aucune donnée disponible",
                    info: "Affichage de _START_ à _END_ sur _TOTAL_ lignes",
                    infoEmpty: "Affichage de 0 à 0 sur 0 lignes",
                    infoFiltered: "(filtré de _MAX_ lignes au total)",
                    lengthMenu: "Afficher _MENU_ lignes",
                    loadingRecords: "Chargement...",
                    processing: "Traitement...",
                    search: "Rechercher :",
                    zeroRecords: "Aucun enregistrement trouvé",
                    paginate: {
                        first: "Premier",
                        last: "Dernier",
                        next: "Suivant",
                        previous: "Précédent"
                    },
                    aria: {
                        sortAscending: ": activer pour trier par ordre croissant",
                        sortDescending: ": activer pour trier par ordre décroissant"
                    },
                    buttons: {
                        copy: "Copier",
                        excel: "Exporter Excel",
                        pdf: "Exporter PDF",
                        print: "Imprimer",
                        colvis: "Visibilité colonnes"
                    }
                }
            });
        }
    }, [ckeckUsers]); // ⬅️ relance quand tes données changent


    const refreshUsers = (e, permission) => {
        let newPers = ckeckUsers.map(per =>
            user.id === permission.id
                ? { ...per, checked: !user.checked }
                : per
        );

        setCheckUsers(newPers);
    };

    const checkAllUsers = (e) => {
        const val = e.target.checked; // true or false
        let newPers = ckeckUsers.map(per => ({ ...per, checked: val }));

        setCheckUsers(newPers);
    }

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        patch(route('role.update.users', role.id), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Users du rôle ${role.name} actualisées avec succès`,
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
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Les users associées au rôle : <em>{role.name}</em>
                </h2>
            }

            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Les Users" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="items-center gap-4">
                            <Link className="btn btn-sm bg-success bg-hover text-white" href={route("role.index")}> <CIcon className='' icon={cilArrowLeft} /> Retour</Link>
                        </div>

                        <form onSubmit={submit} >
                            <div className="text-center">
                                <InputLabel htmlFor="checkAll"><span className="btn btn-sm bg-success text-white shadow-sm btn-hover">Tout selectionner ou deselectionner</span></InputLabel>
                                <br />
                                <Checkbox
                                    id="checkAll"
                                    // hidden
                                    onChange={(e) => checkAllUsers(e)}
                                /></div>
                            <table className="shadow-sm table table-striped" id='newMyTable' style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th scope="col">N°</th>
                                        <th scope="col">Nom & Prénom</th>
                                        <th scope="col">Ecole</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ckeckUsers.length > 0 ?
                                            ckeckUsers.map((user, index) => (
                                                <tr key={user.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td ><span className="badge bg-light rounded border text-dark">{`${user.firtname} - ${user.lastname}`}</span></td>
                                                    <td><span className="badge bg-light text-dark border rounded">{user.school?.raison_sociale} </span> </td>
                                                    <td><span className="badge bg-light text-dark border rounded">{user.detail?.phone} </span> </td>
                                                    <td>
                                                        <Checkbox
                                                            checked={user.checked}
                                                            onChange={(e) => refreshUsers(e, user)}
                                                        />
                                                    </td>
                                                </tr>
                                            )) : (<tr><td colSpan={4} className='text-danger'>Aucun utilisateur!</td> </tr>)
                                    }
                                </tbody>
                            </table>
                            <br />
                            {/* Bouton */}
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer les modifications'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
