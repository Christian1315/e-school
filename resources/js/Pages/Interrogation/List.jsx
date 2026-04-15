import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cibBuffer, cilCheck, cilDelete, cilLibraryAdd, cilList, cilMenu, cilPencil, cilPlaylistAdd, cilSave } from "@coreui/icons";
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import Select from 'react-select'
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function List({ interrogations, schools, trimestres, matieres, classes, series }) {
    const auth = usePage().props.auth.user;
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [interros, setInterros] = useState(interrogations.data.map((interro) => (
        {
            id: interro.id,
            checked: interro.is_validated,
        }
    )))

    const [showModal, setShowModal] = useState(false);

    const [trimestre, setTrimestre] = useState(false);
    const [_trimestres, setTrimestres] = useState(trimestres.data);

    const [matiere, setMatiere] = useState(false);
    const [_matieres, setMatieres] = useState(matieres.data);

    const [classe, setClasse] = useState(false);
    const [_classes, setClasses] = useState(classes.data);

    const [serie, setSerie] = useState(false);
    const [_series, setSeries] = useState(series.data);

    const [selectedSchool, setSelectedSchool] = useState({})


    const { data, patch, get, post, errors, processing, setData, reset, delete: destroy } = useForm({
        // school_id: "",
        trimestre_id: "",
        classe_id: "",
        serie_id: "",
        matiere_id: "",
        interroscheckeds: []
    })

    // Fields handling
    const changeSchool = (option) => {
        // setData('school_id', option.value)

        const selectedSchool = schools.data.find((s) => s.id === option.value);
        console.log("École sélectionnée :", selectedSchool);

        setSelectedSchool(selectedSchool)

        // Access trimestres directly
        console.log("Trimestres :", trimestres.data);
        console.log("Matières :", matieres.data);
        console.log("Classes :", classes.data);

        // setTrimestres(selectedSchool.trimestres ?? trimestres.data)
        // setTrimestre(true)

        // setMatieres(selectedSchool.matieres ?? matieres.data)
        // setMatiere(true)

        // setClasses(selectedSchool.classes ?? classes.data)
        // setClasse(true)

        console.log("Trimestres après sélection :", trimestre, _trimestres);
        console.log("Matières après sélection :", matiere, _matieres);
        console.log("Classes après sélection :", classe, _classes);
    }

    // validation d'une intérrogation
    const validateInterrogation = (e, interrogation) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        patch(route('interrogation.valide', interrogation.id), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Interrogation validée avec succès',
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

    const confirmShowModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        reset()
    };

    useEffect(() => {
        let interroscheckeds = interros.filter((interro) => interro.checked)

        setData("interroscheckeds", interroscheckeds)
        console.log("Finals dats to send :", interroscheckeds)
    }, [interros])

    const checkedLine = (index, e) => {
        const updated = interros.map((interro, i) =>
            i === index ? { ...interro, checked: e.target.checked } : interro
        );
        setInterros(updated);
    }

    // validation des interrogations selectionnées
    const validate = (e) => {
        e.preventDefault()

        if (data.interroscheckeds.length <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Aucune interrogation sélectionnée',
                text: 'Veuillez sélectionner au moins une interrogation à valider.'
            });
            return;
        }

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('interrogation.validate-multiple'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération éffectuée!',
                    text: "Interrogations validées avec succès!"
                })
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

        get(route('interrogation.get-store-multiple'), {
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

    // suppression d'interrogation
    const deleteInterrogation = (e, interro) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `L'interrogation sera supprimée de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Suppression en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                destroy(route('interrogation.destroy', interro.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `L'interrogation a été supprimée avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Suppression échouée </span>', // yellow text
                            text: `${e.exception ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                })
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Les intérrogations
                </h2>
            }
        >
            <Head title="Les Interrogations d'écoles" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('interrogation.create') ?
                            (<div className="row d-flex justify-content-center">
                                <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("interrogation.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                                <Link className="my-2 w-50 btn btn-sm bg-success bg-hover text-white mx-3"
                                    href="#"
                                    onClick={(e) => confirmShowModal(e)}> <CIcon className='' icon={cilPlaylistAdd} /> Faire un ajout groupé</Link>
                            </div>) : null
                        }

                        <form onSubmit={validate}>
                            <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th scope="col">N°</th>
                                        <th scope='col'>Validée</th>
                                        <th scope='col'>Action</th>
                                        <th scope='col'>Reference</th>
                                        <th scope='col'>Statut</th>
                                        <th scope="col">Ecole</th>
                                        <th scope="col">Année scolaire</th>
                                        <th scope="col">Apprenant</th>
                                        <th scope="col">Trimestre</th>
                                        <th scope="col">Matiere</th>
                                        <th scope="col">Note</th>
                                        <th scope="col">Inserée par</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        interrogations.data.map((interrogation, index) => (
                                            <tr key={interrogation.id} className={`bg-${interrogation.is_validated ? 'success' : 'danger'}`}>
                                                <th>
                                                    <span className="badge bg-light text-dark border rounded shadow">{index + 1}</span>
                                                </th>
                                                <th scope="row">
                                                    {
                                                        checkPermission('interrogation.edit') ?
                                                            (
                                                                !interrogation.is_validated ?
                                                                    <TextInput
                                                                        type="checkbox"
                                                                        className=" mt-1 block _w-full"
                                                                        checked={interros[index]?.checked || false}
                                                                        onChange={(e) => checkedLine(index, e)} /> : '---'
                                                            ) : null
                                                    }
                                                </th>
                                                <td className='text-center'>
                                                    {
                                                        !interrogation.is_validated ?
                                                            <div className="dropstart">
                                                                <button
                                                                    type="button"
                                                                    className="dropdown-toggle items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                                    data-bs-toggle="dropdown" aria-expanded="false"
                                                                >
                                                                    <CIcon icon={cilMenu} /> Gérer
                                                                </button>
                                                                <ul className="dropdown-menu p-2 border rounded shadow" aria-labelledby="dropdownMenuButton1">

                                                                    {checkPermission('interrogation.edit') ?
                                                                        (<li><Link
                                                                            className='btn btn-success text-white w-100'
                                                                            onClick={(e) => validateInterrogation(e, interrogation)}
                                                                        >
                                                                            <CIcon icon={cilCheck} />  Valider
                                                                        </Link></li>
                                                                        ) : null
                                                                    }

                                                                    {checkPermission('interrogation.edit') ?
                                                                        (<li><Link
                                                                            className='btn text-warning'
                                                                            href={route('interrogation.edit', interrogation.id)}
                                                                        >
                                                                            <CIcon icon={cilPencil} />  Modifier
                                                                        </Link></li>
                                                                        ) : null
                                                                    }

                                                                    {checkPermission('interrogation.delete') ?
                                                                        (<li><Link
                                                                            className='btn text-danger'
                                                                            onClick={(e) => deleteInterrogation(e, interrogation)}
                                                                        >
                                                                            <CIcon icon={cilDelete} />  Supprimer
                                                                        </Link></li>) : null
                                                                    }

                                                                </ul>
                                                            </div> : '--'
                                                    }
                                                </td>
                                                <td> <span className="badge bg-light text-dark border rounded shadow">{interrogation.numero ?? '---'}</span> </td>
                                                <td>
                                                    <span
                                                        className={`btn btn-sm badge bg-${interrogation.is_validated ? 'success' : 'danger'} border rounded text-light`}
                                                    >
                                                        {interrogation.is_validated ? (
                                                            <>
                                                                Validée
                                                            </>
                                                        ) : (
                                                            <>
                                                                Non validée
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td><span className="badge bg-light text-dark border rounded"> {interrogation.school?.raison_sociale ?? '---'}</span></td>
                                                <td><span className="badge bg-light text-dark border rounded"> {interrogation.annee_scolaire ?? '---'}</span></td>
                                                <td>{`${interrogation.apprenant?.firstname} - ${interrogation.apprenant?.lastname}`}</td>
                                                <td>{interrogation.trimestre?.libelle}</td>
                                                <td>{interrogation.matiere?.libelle}</td>
                                                <td><span className="badge bg-light text-dark border rounded"> {interrogation.note ?? '00'}</span></td>
                                                <td><span className="badge bg-light text-dark border rounded"> {`${interrogation.createdBy?.firstname} - ${interrogation.createdBy?.lastname}`}</span></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                            <br />
                            <div className="row justify-content-center d-flex">
                                <div className="col-6">
                                    <PrimaryButton className="ms-3 w-50" disabled={processing}>
                                        <CIcon icon={cilSave} />  Valider ma selection
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal de filtre */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Ajout groupé des intérrogations
                    </h2>

                    <div className="row">
                        {!auth.school_id &&
                            <div className="col-md-12">
                                <div className='mb-3'>
                                    <InputLabel htmlFor="school_id" value="L'école concernée" >  <span className="text-danger">*</span> </InputLabel>

                                    <Select
                                        placeholder="Rechercher une école ..."
                                        name="school_id"
                                        id="school_id"
                                        // required
                                        className="form-control mt-1 block w-full"
                                        cleanable
                                        options={schools?.data.map((school) => ({
                                            value: school.id,
                                            label: `${school.raison_sociale}`,
                                        }))}
                                        value={schools.data.map((school) => ({
                                            value: school.id,
                                            label: `${school.raison_sociale}`,
                                            trimestres: school.trimestres
                                        }))
                                            .find((option) => option.value === data.school_id)} // set selected option
                                        onChange={(option) => changeSchool(option)} // update state with id
                                    />

                                    <InputError className="mt-2" message={errors.school_id} />
                                </div>
                            </div>
                        }

                        {/* Trimestre */}
                        {
                            (selectedSchool.trimestres ?? trimestres.data).length > 0 &&
                            <div className="col-md-12">
                                <div className='mb-3'>
                                    <InputLabel htmlFor="trimestre_id" value="Le trimestre concerné" >  <span className="text-danger">*</span> </InputLabel>

                                    <Select
                                        placeholder="Rechercher un trimestre ..."
                                        name="trimestre_id"
                                        id="trimestre_id"
                                        required
                                        className="form-control mt-1 block w-full"
                                        options={(selectedSchool.trimestres ?? trimestres.data).map((trimestre) => ({
                                            value: trimestre.id,
                                            label: `${trimestre.libelle}`,
                                        }))}
                                        value={(selectedSchool.trimestres ?? trimestres.data).map((trimestre) => ({
                                            value: trimestre.id,
                                            label: `${trimestre.libelle}`,
                                        }))
                                            .find((option) => option.value === data.trimestre_id)} // set selected option
                                        onChange={(option) => setData('trimestre_id', option.value)} // update state with id
                                    />

                                    <InputError className="mt-2" message={errors.trimestre_id} />
                                </div>
                            </div>
                        }

                        {/* Matière */}
                        {
                            (selectedSchool.matieres ?? matieres.data).length > 0 &&
                            <div className="col-md-12">
                                <div className='mb-3'>
                                    <InputLabel htmlFor="matiere_id" value="La matière concernée" >  <span className="text-danger">*</span> </InputLabel>

                                    <Select
                                        placeholder="Rechercher une matière ..."
                                        name="matiere_id"
                                        id="matiere_id"
                                        required
                                        className="form-control mt-1 block w-full"
                                        options={(selectedSchool.matieres ?? matieres.data).map((matiere) => ({
                                            value: matiere.id,
                                            label: `${matiere.libelle}`,
                                        }))}
                                        value={(selectedSchool.matieres ?? matieres.data).map((matiere) => ({
                                            value: matiere.id,
                                            label: `${matiere.libelle}`,
                                        }))
                                            .find((option) => option.value === data.matiere_id)} // set selected option
                                        onChange={(option) => setData('matiere_id', option.value)} // update state with id
                                    />

                                    <InputError className="mt-2" message={errors.matiere_id} />
                                </div>
                            </div>
                        }

                        {/* Les classes */}
                        {(selectedSchool.classes ?? classes.data).length > 0 &&
                            <div className="col-md-12">
                                <div className='mb-3'>
                                    <InputLabel htmlFor="classe_id" value="La classe concernée" >  <span className="text-danger">*</span> </InputLabel>

                                    <Select
                                        placeholder="Rechercher une classe ..."
                                        name="classe_id"
                                        id="classe_id"
                                        required
                                        className="form-control mt-1 block w-full"
                                        options={(selectedSchool.classes ?? classes.data).map((classe) => ({
                                            value: classe.id,
                                            label: `${classe.libelle}`,
                                        }))}
                                        value={(selectedSchool.classes ?? classes.data).map((classe) => ({
                                            value: classe.id,
                                            label: `${classe.libelle}`,
                                        }))
                                            .find((option) => option.value === data.classe_id)} // set selected option
                                        onChange={(option) => setData('classe_id', option.value)} // update state with id
                                    />

                                    <InputError className="mt-2" message={errors.classe_id} />
                                </div>
                            </div>
                        }

                        {/* Les series */}
                        {(selectedSchool.series ?? series.data).length > 0 &&
                            <div className="col-md-12">
                                <div className='mb-3'>
                                    <InputLabel htmlFor="serie_id" value="La série concernée" >  <span className="text-danger">*</span> </InputLabel>

                                    <Select
                                        placeholder="Rechercher une série ..."
                                        name="serie_id"
                                        id="serie_id"
                                        required
                                        className="form-control mt-1 block w-full"
                                        options={(selectedSchool.series ?? series.data).map((serie) => ({
                                            value: serie.id,
                                            label: `${serie.libelle}`,
                                        }))}
                                        value={(selectedSchool.series ?? series.data).map((serie) => ({
                                            value: serie.id,
                                            label: `${serie.libelle}`,
                                        }))
                                            .find((option) => option.value === data.serie_id)} // set selected option
                                        onChange={(option) => setData('serie_id', option.value)} // update state with id
                                    />

                                    <InputError className="mt-2" message={errors.classe_id} />
                                </div>
                            </div>
                        }
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Abandonner
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={processing}>
                            <CIcon icon={cilSave} />  Filtrer la selection
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
