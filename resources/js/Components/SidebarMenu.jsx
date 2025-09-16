import React from 'react'
import {
    CBadge,
    CSidebar,
    CSidebarBrand,
    CSidebarHeader,
    CSidebarNav,
    CSidebarToggler,
    CNavGroup,
    CNavItem,
    CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilSchool, cilSmilePlus, cilWallet, cilPeople,cilApplications } from '@coreui/icons'
import { Link, usePage } from '@inertiajs/react'
import ApplicationLogo from './ApplicationLogo'

export default function SidebarMenu() {
    const user = usePage().props.auth.user;
    const school = usePage().props.auth.school;
    console.log("school", school)

    return (
        <>
            <div className="offcanvas offcanvas-start" style={{ width: '300px' }} tabIndex="-1" id="offcanvasMenu" aria-labelledby="offcanvasLabel">
                <div className="offcanvas-header shadow-sm">
                    <div className="items-center">
                        <Link href="/">
                            <ApplicationLogo className="block text-gray-800 dark:text-gray-200" />
                        </Link>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <CSidebar style={{ height: "100vh", overflowY: 'auto' }}>
                        <CSidebarNav>
                            {/* Dashboard */}
                            <CNavTitle>Gestion</CNavTitle>
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilApplications} /> Tableau de board
                                    </>
                                }
                            >
                                <Link href={route('dashboard')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Dashboard
                                </Link>
                            </CNavGroup>

                            <CNavTitle>Gestion</CNavTitle>

                            {/* ecoles */}
                            {
                                school == null ?
                                    <CNavGroup
                                        toggler={
                                            <>
                                                <CIcon customClassName="nav-icon text-success" icon={cilSchool} /> Les Ecoles
                                            </>
                                        }
                                    >
                                        <Link href={route('school.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des écoles
                                        </Link>


                                        <Link href={route('school.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter une école
                                        </Link>
                                    </CNavGroup> : null
                            }


                            {/* apprenants */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilSmilePlus} /> Les Apprenants
                                    </>
                                }
                            >
                                <Link href={route('apprenant.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des apprenants
                                </Link>

                                <Link href={route('apprenant.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter un apprenant
                                </Link>
                            </CNavGroup>

                            {/* inscriptions */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilWallet} /> Les Inscriptions
                                    </>
                                }
                            >
                                <Link href={route('inscription.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des inscriptions
                                </Link>

                                <Link href={route('inscription.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter une inscription
                                </Link>
                            </CNavGroup>

                            <CNavTitle>Paramètrage</CNavTitle>

                            {/* ecoles */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilPeople} /> Les utilisateurs
                                    </>
                                }
                            >
                                <Link component={Link} href={route('user.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des utilisateurs
                                </Link>

                                <Link href={route('user.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter un utilisateur
                                </Link>
                            </CNavGroup>
                        </CSidebarNav>
                    </CSidebar>
                </div>
            </div>
        </>
    )
}