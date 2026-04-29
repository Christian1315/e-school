import React, { useState } from "react"
import {
    CSidebar,
    CSidebarNav,
    CNavGroup,
    CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cibBuffer, cibGooglesCholar, cibMyspace, cibMendeley, cibPatreon, cibReadme, cibSamsungPay, cibCoOp, cibFitbit, cibMastodon, cibMeetup, cibReadTheDocs, cibAsana, cibBathasu, cibBing, cibCodacy, cibCoderwall, cibCoursera, cilContact, cibBancontact, cibMailRu } from '@coreui/icons'
import { Link, useForm, usePage } from '@inertiajs/react'
import ApplicationLogo from './ApplicationLogo'
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from "sweetalert2"

export default function SidebarMenu(props) {

    const authUser = usePage().props.auth;
    const showDashboard = usePage().props.auth.showDashboard;
    const user = usePage().props.auth.user;
    const permissions = usePage().props.auth.permissions;
    const trimestres = usePage().props.auth.trimestres;

    console.log("Show Dashboard : ", showDashboard);

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [showInterroTrimestreModal, setShowInterroTrimestreModal] = useState(false);
    const [showDevoirTrimestreModal, setShowDevoirTrimestreModal] = useState(false);
    const [currentTrimestre, setCurrentTrimestre] = useState(null);

    const openInterroTrimestreModal = (e, trimestre) => {
        e.preventDefault();
        setCurrentTrimestre(trimestre);
        setShowInterroTrimestreModal(true);
    }

    const openDevoirTrimestreModal = (e, trimestre) => {
        e.preventDefault();
        setCurrentTrimestre(trimestre);
        setShowDevoirTrimestreModal(true);
    }

    const [date, setDate] = useState('');
    const { get } = useForm({})

    // interrogations moyenne filter
    const filtreInterroTrimestre = (e) => {
        e.preventDefault();
        setShowInterroTrimestreModal(false);

        get(route("moyenne.interro", { trimestre: currentTrimestre.id, annee_scolaire: date }), {
            onSuccess: () => {
                Swal.close();
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

    // devoirs moyenne filter
    const filtreDevoirTrimestre = (e) => {
        console.log("filtre devoir trimestre");
        e.preventDefault();
        setShowInterroTrimestreModal(false);

        get(route("moyenne.devoir", { trimestre: currentTrimestre.id, annee_scolaire: date }), {
            onSuccess: () => {
                Swal.close();
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
                        {showDashboard ?
                            (<>
                                <CNavTitle>Dashboard</CNavTitle>
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibBuffer} /> Tableau de board
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
                            </>) : null
                        }

                        {(checkPermission('ecole.view') || checkPermission('ecole.create') ||
                            checkPermission("utilisateur.view") || checkPermission("utilisateur.create") ||
                            checkPermission("apprenant.view") || checkPermission("apprenant.create") ||
                            checkPermission('inscription.view') || checkPermission('inscription.create') ||
                            checkPermission('paiement.view') || checkPermission('paiement.create') ||
                            checkPermission('interrogation.view') || checkPermission('interrogation.create') ||
                            checkPermission('devoir.view') || checkPermission('devoir.create')) && <CNavTitle>Gestion</CNavTitle>}

                        {/* ecoles */}
                        {checkPermission('ecole.view') || checkPermission('ecole.create') ?
                            (
                                !user.school_id ?
                                    <CNavGroup
                                        toggler={
                                            <>
                                                <CIcon customClassName="nav-icon text-success" icon={cibGooglesCholar} /> Les Ecoles
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
                                        <CIcon customClassName="nav-icon text-success" icon={cibMyspace} /> Les Parents
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

                        {/* professeurs */}
                        {checkPermission("utilisateur.view") || checkPermission("utilisateur.create") ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibMendeley} /> Les Professeurs
                                    </>
                                }
                            >
                                {checkPermission('utilisateur.view') ?
                                    (<Link href={route('professeur.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des professeurs
                                    </Link>) : null}
                            </CNavGroup>) : null
                        }

                        {/* apprenants */}
                        {checkPermission("apprenant.view") || checkPermission("apprenant.create") ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibPatreon} /> Les Apprenants
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
                                        <CIcon customClassName="nav-icon text-success" icon={cibReadme} /> Les Inscriptions
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
                                        <CIcon customClassName="nav-icon text-success" icon={cibSamsungPay} /> Les paiements
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
                                        <CIcon customClassName="nav-icon text-success" icon={cibCoOp} /> Les Intérrogations
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
                                            <CIcon customClassName="nav-icon text-success" icon={cibFitbit} /> Les devoirs
                                        </>
                                    }
                                >
                                    {checkPermission('devoir.view') ?
                                        (<Link component={Link} href={route('devoir.index')} className="nav-link">
                                            <span className="nav-icon">
                                                <span className="nav-icon-bullet text-danger"></span>
                                            </span>
                                            Liste des devoirs
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


                        {(checkPermission('moyenne_interro.view') || checkPermission('moyenne_devoir.view')) && (
                            <CNavTitle>Moyennes</CNavTitle>
                        )}

                        {/* Moyennes des Interrogations */}
                        {checkPermission('moyenne_interro.view') ?
                            (
                                <CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibMastodon} /> Moyennes des Intérros
                                        </>
                                    }
                                >
                                    {
                                        trimestres.length > 0 ? (
                                            trimestres.map((trimestre) => (
                                                <Link
                                                    key={trimestre.id}
                                                    // href={route("moyenne.interro", { trimestre: trimestre.id })}
                                                    onClick={(e) => openInterroTrimestreModal(e, trimestre)}
                                                    className="nav-link"
                                                >
                                                    <span className="nav-icon">
                                                        <span className="nav-icon-bullet text-danger"></span>
                                                    </span>
                                                    {trimestre.libelle} <small className="mx-1">{!user.school_id ? trimestre.school?.raison_sociale : ''}</small>
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
                                        <CIcon customClassName="nav-icon text-success" icon={cibMeetup} /> Moyennes des devoir
                                    </>
                                }
                            >
                                {
                                    trimestres.length > 0 ? (
                                        trimestres.map((trimestre) => (
                                            <Link
                                                key={trimestre.id}
                                                // href={route("moyenne.devoir", { trimestre: trimestre.id })}
                                                onClick={(e) => openDevoirTrimestreModal(e, trimestre)}
                                                className="nav-link"
                                            >
                                                <span className="nav-icon">
                                                    <span className="nav-icon-bullet text-danger"></span>
                                                </span>
                                                {trimestre.libelle} <small className="mx-1">{!user.school_id ? trimestre.school?.raison_sociale : ''}</small>
                                            </Link>
                                        ))
                                    ) : (
                                        <span>Aucun trimestre!</span>
                                    )
                                }
                            </CNavGroup>) : null
                        }

                        {(checkPermission('bulletin.view')) && (
                            <CNavTitle>Les Bulletins</CNavTitle>
                        )}

                        {/* Bulletins des trimestres*/}
                        {checkPermission('bulletin.view') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibReadTheDocs} /> Les bulletins
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
                                                {trimestre.libelle} <small className="mx-1">{!user.school_id ? trimestre.school?.raison_sociale : ''}</small>
                                            </Link>
                                        ))
                                    ) : (
                                        <span>Aucun trimestre!</span>
                                    )
                                }
                            </CNavGroup>) : null
                        }

                        {(checkPermission('utilisateur.view') || checkPermission('utilisateur.create') ||
                            checkPermission('serie.view') || checkPermission('serie.create') ||
                            checkPermission('classe.view') || checkPermission('classe.create') ||
                            checkPermission('matiere.view') || checkPermission('matiere.create') ||
                            checkPermission('trimestre.view') || checkPermission('trimestre.create')) && <CNavTitle>Paramètrage</CNavTitle>}

                        {/* utilisateurs */}
                        {checkPermission('utilisateur.view') || checkPermission('utilisateur.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibAsana} /> Les utilisateurs
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

                        {/* Series */}
                        {checkPermission('serie.view') || checkPermission('serie.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success bold" icon={cibBathasu} /> Les Séries
                                    </>
                                }
                            >
                                {checkPermission('serie.view') ?
                                    (<Link component={Link} href={route('serie.index')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet text-danger"></span>
                                        </span>
                                        Liste des séries
                                    </Link>) : null
                                }

                                {checkPermission('serie.create') ?
                                    (<Link href={route('serie.create')} className="nav-link">
                                        <span className="nav-icon">
                                            <span className="nav-icon-bullet"></span>
                                        </span>
                                        Ajouter une série
                                    </Link>) : null
                                }
                            </CNavGroup>) : null
                        }

                        {/* Classes */}
                        {checkPermission('classe.view') || checkPermission('classe.create') ?
                            (<CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibBing} /> Les Classes
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
                                        <CIcon customClassName="nav-icon text-success" icon={cibCodacy} /> Les Matières
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
                                        <CIcon customClassName="nav-icon text-success" icon={cibCoderwall} /> Les Trimestres
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

                        {(checkPermission('role.view') || checkPermission('role.view')) &&
                            <CNavTitle>Gestion des Rôles</CNavTitle>}

                        {
                            checkPermission('role.view') || checkPermission('role.view') ?
                                (<CNavGroup
                                    toggler={
                                        <>
                                            <CIcon customClassName="nav-icon text-success" icon={cibCoursera} /> Les Rôles
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

                        {/* // contact */}
                        {!authUser.school &&
                            <CNavGroup
                                toggler={
                                    <>
                                        <CIcon customClassName="nav-icon text-success" icon={cibMailRu} /> Les Contacts
                                    </>
                                }
                            >
                                <Link component={Link} href={route('contact.index')} className="nav-link">
                                    <span className="nav-icon">
                                        <span className="nav-icon-bullet text-danger"></span>
                                    </span>
                                    Liste des contacts
                                </Link>
                            </CNavGroup>}
                    </CSidebarNav>
                </CSidebar>
            </div>

            {/*Interro Modal */}
            <Modal show={showInterroTrimestreModal} onClose={() => setShowInterroTrimestreModal(false)}>
                <form onSubmit={(e) => filtreInterroTrimestre(e)} className="p-3">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Trimestre concerné : <em className='text-success'>{currentTrimestre?.libelle} </em>
                    </h2>
                    <div className="border rounded">
                        <input type="number"
                            name="interro_date"
                            className="form-control w-full"
                            min={2000}
                            max={2030}
                            required
                            placeholder="Année scolaire (ex: 2023)"
                            onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowInterroTrimestreModal(false)}>
                            Fermer
                        </SecondaryButton>
                        <PrimaryButton className="mx-1">
                            Appliquer le filtre
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/*Devoir Modal */}
            <Modal show={showDevoirTrimestreModal} onClose={() => setShowDevoirTrimestreModal(false)}>
                <form onSubmit={(e) => filtreDevoirTrimestre(e)} className="p-3">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Trimestre concerné : <em className='text-success'>{currentTrimestre?.libelle} </em>
                    </h2>
                    <div className="border rounded">
                        <input type="number"
                            name="interro_date"
                            className="form-control w-full"
                            min={2000}
                            max={2030}
                            required
                            placeholder="Année scolaire (ex: 2023)"
                            onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowDevoirTrimestreModal(false)}>
                            Fermer
                        </SecondaryButton>
                        <PrimaryButton className="mx-1">
                            Appliquer le filtre
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    )
}