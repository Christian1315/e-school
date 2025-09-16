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
import { cilSchool, cilSmilePlus, cilWallet, cilPeople } from '@coreui/icons'
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
                                        <CNavItem component={Link} href={route('school.index')}>
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des écoles
                                        </CNavItem>

                                        <CNavItem component={Link} href={route('school.create')}>
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter une école
                                        </CNavItem>
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
                                <CNavItem component={Link} href={route('apprenant.index')}>
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des apprenants
                                </CNavItem>

                                <CNavItem component={Link} href={route('apprenant.create')}>
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter un apprenant
                                </CNavItem>
                            </CNavGroup>

                            {/* inscriptions */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilWallet} /> Les Inscriptions
                                    </>
                                }
                            >
                                <CNavItem component={Link} href={route('inscription.index')}>
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des inscriptions
                                </CNavItem>

                                <CNavItem component={Link} href={route('inscription.create')}>
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter une inscription
                                </CNavItem>
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
                                <CNavItem component={Link} href={route('user.index')}>
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des utilisateurs
                                </CNavItem>

                                <CNavItem component={Link} href={route('user.create')}>
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter un utilisateur
                                </CNavItem>
                            </CNavGroup>
                        </CSidebarNav>
                    </CSidebar>
                </div>
            </div>
        </>
    )
}