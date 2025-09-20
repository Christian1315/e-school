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
import { cilSchool, cilSmilePlus, cilWallet, cilPeople, cilApplications, cilBraille, cibAmazonPay, cilList, cilBlur, cilGrain, cilHealing, cilLayers, cilLibrary } from '@coreui/icons'
import { Link, usePage } from '@inertiajs/react'
import ApplicationLogo from './ApplicationLogo'

export default function SidebarMenu() {
    const user = usePage().props.auth.user;
    const school = usePage().props.auth.school;
    const trimestres = usePage().props.auth.trimestres;
    // console.log("trimestres", trimestres)

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
                            <CNavTitle>Dashboard</CNavTitle>
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
                                user.school_id == null ?
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

                            {/* payements */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibAmazonPay} /> Les paiements
                                    </>
                                }
                            >
                                <Link href={route('paiement.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des paiements
                                </Link>

                                <Link href={route('paiement.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter un paiement
                                </Link>
                            </CNavGroup>

                            {/* Interrogations */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilGrain} /> Les Intérrogations
                                    </>
                                }
                            >
                                <Link component={Link} href={route('interrogation.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des intérrogations
                                </Link>

                                <Link href={route('interrogation.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter une intérrogation
                                </Link>
                            </CNavGroup>


                            {/* Devoirs */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilList} /> Les devoirs
                                    </>
                                }
                            >
                                <Link component={Link} href={route('devoir.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des devoir
                                </Link>

                                <Link href={route('devoir.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter un dévoir
                                </Link>
                            </CNavGroup>


                            <CNavTitle>Moyennes</CNavTitle>

                            {/* Moyennes des Interrogations */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilLayers} /> Moyennes des Intérros
                                    </>
                                }
                            >
                                {
                                    trimestres.length > 0 ? (
                                        trimestres.map((trimestre) => (
                                            <Link
                                                key={trimestre.id}
                                                href={route("moyenne.interro", { trimestre: trimestre.id })}
                                                className="nav-link"
                                            >
                                                <span className="nav-icon">
                                                    <span className="nav-icon-bullet text-danger"></span>
                                                </span>
                                                {trimestre.libelle}
                                            </Link>
                                        ))
                                    ) : (
                                        <span>Aucun trimestre!</span>
                                    )
                                }

                            </CNavGroup>

                            {/* Moyennes des devoirs */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilLibrary} /> Moyennes des devoir
                                    </>
                                }
                            >
                                {
                                    trimestres.length > 0 ? (
                                        trimestres.map((trimestre) => (
                                            <Link
                                                key={trimestre.id}
                                                href={route("moyenne.devoir", { trimestre: trimestre.id })}
                                                className="nav-link"
                                            >
                                                <span className="nav-icon">
                                                    <span className="nav-icon-bullet text-danger"></span>
                                                </span>
                                                {trimestre.libelle}
                                            </Link>
                                        ))
                                    ) : (
                                        <span>Aucun trimestre!</span>
                                    )
                                }

                                {/* <Link component={Link} href={route("moyenne.devoir")} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des moyennes
                                </Link> */}
                            </CNavGroup>


                            <CNavTitle>Paramètrage</CNavTitle>

                            {/* utilisateurs */}
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

                            {/* Classes */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilBlur} /> Les Classes
                                    </>
                                }
                            >
                                <Link component={Link} href={route('classe.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des classes
                                </Link>

                                <Link href={route('classe.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter une classe
                                </Link>
                            </CNavGroup>

                            {/* Matières */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilBraille} /> Les Matières
                                    </>
                                }
                            >
                                <Link component={Link} href={route('matiere.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des matières
                                </Link>

                                <Link href={route('matiere.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter une matière
                                </Link>
                            </CNavGroup>

                            {/* Trimestres */}
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilHealing} /> Les Trimestres
                                    </>
                                }
                            >
                                <Link component={Link} href={route('trimestre.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des trimestres
                                </Link>

                                <Link href={route('trimestre.create')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet"></span>
                                    </span>
                                    Ajouter un trimestre
                                </Link>
                            </CNavGroup>

                        </CSidebarNav>
                    </CSidebar>
                </div>
            </div>
        </>
    )
}