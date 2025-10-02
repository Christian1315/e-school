import React, { useState } from "react"
import {
    CSidebar,
    CSidebarNav,
    CNavGroup,
    CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilSchool, cilSmilePlus, cilWallet, cilPeople, cilApplications, cilBraille, cibAmazonPay, cilList, cilBlur, cilGrain, cilHealing, cilLayers, cilLibrary, cilBook } from '@coreui/icons'
import { Link, usePage } from '@inertiajs/react'
import ApplicationLogo from './ApplicationLogo'

export default function SidebarMenu(props) {
    // const [visible, setVisible] = useState(false)
    console.log(props)

    const user = usePage().props.auth.user;
    const permissions = usePage().props.auth.permissions;
    const trimestres = usePage().props.auth.trimestres;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    return (
        <>
            <div className="">
                <CSidebar
                    visible={props.visible}
                    onVisibleChange={(val) => props.setVisible(val)}
                    unfoldable
                    overlaid={false}   // ⬅️ enlève l’overlay sombre
                >

                    <div className="m-2">
                        <Link href="/">
                            <ApplicationLogo className="block text-gray-800 dark:text-gray-200" />
                        </Link>
                    </div>

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
                        {checkPermission('ecole.view') || checkPermission('ecole.create') ?
                            (user.school_id == null ?
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cilSchool} /> Les Ecoles
                                        </>
                                    }
                                >
                                    {checkPermission('ecole.view') ?
                                        (<Link href={route('school.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des écoles
                                        </Link>) : null}

                                    {checkPermission('ecole.create') ? (<Link href={route('school.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une école
                                    </Link>) : null}
                                </CNavGroup> : null) : null
                        }

                        {/* parents */}
                        {checkPermission("utilisateur.view") || checkPermission("utilisateur.create") ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilPeople} /> Les Parents
                                    </>
                                }
                            >
                                {checkPermission('utilisateur.view') ?
                                    (<Link href={route('parent.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des parents
                                    </Link>) : null}
                            </CNavGroup>) : null
                        }

                        {/* apprenants */}
                        {checkPermission("apprenant.view") || checkPermission("apprenant.create") ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilSmilePlus} /> Les Apprenants
                                    </>
                                }
                            >
                                {checkPermission('apprenant.view') ?
                                    (<Link href={route('apprenant.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des apprenants
                                    </Link>) : null}

                                {checkPermission('apprenant.create') ?
                                    (<Link href={route('apprenant.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un apprenant
                                    </Link>) : null}
                            </CNavGroup>) : null
                        }

                        {/* inscriptions */}
                        {checkPermission('inscription.view') || checkPermission('inscription.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilWallet} /> Les Inscriptions
                                    </>
                                }
                            >
                                {checkPermission('inscription.view') ?
                                    (<Link href={route('inscription.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des inscriptions
                                    </Link>) : null}

                                {checkPermission('inscription.create') ?
                                    (<Link href={route('inscription.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une inscription
                                    </Link>) : null}
                            </CNavGroup>
                            ) : null}

                        {/* payements */}
                        {checkPermission('paiement.view') || checkPermission('paiement.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibAmazonPay} /> Les paiements
                                    </>
                                }
                            >
                                {checkPermission('paiement.view') ?
                                    (<Link href={route('paiement.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des paiements
                                    </Link>) : null}

                                {checkPermission('paiement.create') ?
                                    (<Link href={route('paiement.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un paiement
                                    </Link>) : null}
                            </CNavGroup>) : null
                        }

                        {/* Interrogations */}
                        {checkPermission('interrogation.view') || checkPermission('interrogation.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilGrain} /> Les Intérrogations
                                    </>
                                }
                            >
                                {checkPermission('interrogation.view') ?
                                    (<Link component={Link} href={route('interrogation.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des intérrogations
                                    </Link>) : null
                                }

                                {checkPermission('interrogation.create') ?
                                    (<Link href={route('interrogation.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une intérrogation
                                    </Link>) : null
                                }
                            </CNavGroup>) : null
                        }

                        {/* Devoirs */}
                        {checkPermission('devoir.view') || checkPermission('devoir.create') ?
                            (
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cilList} /> Les devoirs
                                        </>
                                    }
                                >
                                    {checkPermission('devoir.view') ?
                                        (<Link component={Link} href={route('devoir.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des devoir
                                        </Link>) : null
                                    }

                                    {checkPermission('devoir.create') ?
                                        (<Link href={route('devoir.create')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet"></span>
                                            </span>
                                            Ajouter un dévoir
                                        </Link>) : null
                                    }
                                </CNavGroup>)
                            ) : null}


                        <CNavTitle>Moyennes</CNavTitle>

                        {/* Moyennes des Interrogations */}
                        {checkPermission('moyenne_interro.view') ?
                            (<CNavGroup
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

                            </CNavGroup>) : null
                        }

                        {/* Moyennes des devoirs */}
                        {checkPermission('moyenne_devoir.view') ?
                            (<CNavGroup
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
                            </CNavGroup>) : null
                        }

                        <CNavTitle>Les Bulletins</CNavTitle>

                        {/* Bulletins des trimestres*/}
                        {checkPermission('bulletin.view') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilBook} /> Les bulletins
                                    </>
                                }
                            >
                                {
                                    trimestres.length > 0 ? (
                                        trimestres.map((trimestre) => (
                                            <Link
                                                key={trimestre.id}
                                                href={route("bulletin", { trimestre: trimestre.id })}
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
                            </CNavGroup>) : null
                        }

                        <CNavTitle>Paramètrage</CNavTitle>

                        {/* utilisateurs */}
                        {checkPermission('utilisateur.view') || checkPermission('utilisateur.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilPeople} /> Les utilisateurs
                                    </>
                                }
                            >
                                {checkPermission('utilisateur.view') ?
                                    (<Link component={Link} href={route('user.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des utilisateurs
                                    </Link>) : null}

                                {checkPermission('utilisateur.create') ?
                                    (<Link href={route('user.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un utilisateur
                                    </Link>) : null
                                }
                            </CNavGroup>) : null
                        }

                        {/* Classes */}
                        {checkPermission('classe.view') || checkPermission('classe.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilBlur} /> Les Classes
                                    </>
                                }
                            >
                                {checkPermission('classe.view') ?
                                    (<Link component={Link} href={route('classe.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des classes
                                    </Link>) : null
                                }

                                {checkPermission('classe.create') ?
                                    (<Link href={route('classe.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une classe
                                    </Link>) : null
                                }
                            </CNavGroup>) : null
                        }

                        {/* Matières */}
                        {checkPermission('matiere.view') || checkPermission('matiere.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilBraille} /> Les Matières
                                    </>
                                }
                            >
                                {checkPermission('matiere.view') ?
                                    (<Link component={Link} href={route('matiere.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des matières
                                    </Link>) : null
                                }

                                {checkPermission('matiere.create') ?
                                    (<Link href={route('matiere.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une matière
                                    </Link>) : null
                                }
                            </CNavGroup>) : null
                        }

                        {/* Trimestres */}
                        {checkPermission('trimestre.view') || checkPermission('trimestre.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cilHealing} /> Les Trimestres
                                    </>
                                }
                            >
                                {checkPermission('trimestre.view') ?
                                    (<Link component={Link} href={route('trimestre.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des trimestres
                                    </Link>) : null
                                }

                                {checkPermission('trimestre.create') ?
                                    (<Link href={route('trimestre.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter un trimestre
                                    </Link>) : null
                                }
                            </CNavGroup>) : null
                        }

                        <CNavTitle>Gestion des Rôles</CNavTitle>

                        {
                            checkPermission('role.view') || checkPermission('role.view') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cilHealing} /> Les Rôles
                                        </>
                                    }
                                >
                                    <Link component={Link} href={route('role.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des rôles
                                    </Link>
                                </CNavGroup>) : null

                        }
                    </CSidebarNav>
                </CSidebar>
            </div>
        </>
    )
}