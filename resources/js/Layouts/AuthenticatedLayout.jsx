import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import CIcon from '@coreui/icons-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { cilAccountLogout, cilUserX, cilBellExclamation,cilApplications } from '@coreui/icons'

import { useEffect } from 'react';
import DataTable from 'datatables.net-dt';

import 'datatables.net-buttons-dt'; // styles des boutons

// Plugins boutons
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';

// dépendances Excel / PDF
import jszip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// JSZip est utilisé par Excel
window.JSZip = jszip;

// pdfmake a besoin des polices
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = pdfFonts.vfs; // ✅ not pdfFonts.pdfMake.vfs

import 'datatables.net-responsive';
import 'datatables.net-responsive-dt';

export default function AuthenticatedLayout({header, children, SidebarMenu }) {
    useEffect(() => {
        const table = new DataTable('#myTable', {
            pagingType: 'full_numbers', // Affiche "First, Prev, Next, Last" + numéros
            responsive: true,
            // dom: 'Bfrtip',
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

        return () => table.destroy();
    }, []);


    const user = usePage().props.auth.user;
    const school = usePage().props.auth.school;
    // console.log('auth',user)

    const receivedNotificationsNbr = usePage().props.auth.receivedNotificationsNbr;

    const { post } = useForm();

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const logout = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Déconnexion en cours...',
            // text: 'Veuillez patienter pendant que nous vérifions vos informations.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        post(route('logout'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Déconnexion réussie',
                    text: 'Vous avez été déconnecté(e) avec succès.',
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur de déconnexion',
                    text: 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.',
                });
                console.log(e);
            },
        });
    }

    return (
        <div className="fixed top-0 left-0 w-full z-50 min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="items-center flex">
                                <Link href="/">
                                    <ApplicationLogo className="block text-gray-800 dark:text-gray-200" />
                                </Link>

                                <NavLink
                                    data-bs-toggle="offcanvas" href="#offcanvasMenu" role="button" aria-controls="offcanvasExample"
                                >
                                    <button className="space-x-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400">
                                       <CIcon icon={cilApplications} />
                                    </button>
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="flex shrink-0 items-center">
                                <span className="badge bg-light rounded"> <CIcon className='text-dark' icon={cilBellExclamation} /> </span>
                                <strong className='text-danger' style={{ position: "absolute", marginRight: "-10" }} >{receivedNotificationsNbr < 9 ? `0 ${receivedNotificationsNbr}` : receivedNotificationsNbr}</strong>
                            </div>
                            <div className="relative ms-3">

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user?.firstname}  - {user?.lastname}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            <CIcon icon={cilUserX} />  Profile
                                        </Dropdown.Link>

                                        <Dropdown.Link
                                            href="#"
                                            onClick={logout}
                                        >
                                            <CIcon icon={cilAccountLogout} />  Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Tableau de board
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user?.firstname}  - {user?.lastname}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user?.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Déconnexion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-sm text-center dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/*  */}
            <div className="row">
                {SidebarMenu}
                <div className="col-md-12" style={{ overflowX: "scroll!important" }}>
                    <div className={`h-[600px] overflow-y-auto`}>
                        {children}

                        {/* <!-- footer --> */}
                        <div className="py-12">
                            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                                    <div className="pt-3 text-gray-900 dark:text-gray-100">
                                        <p style={{ fontSize: "12px" }} className="text-center">@Copyright <strong className="badge bg-light text-success border">{new Date().getFullYear()}</strong> | Tous droits réservés </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}