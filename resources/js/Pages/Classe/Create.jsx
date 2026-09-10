import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilList, cibBuffer, cilPlus, cilTrash } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'
import { useEffect } from 'react';

export default function Create({ schools, professeurs, matieres, series }) {
    const permissions = usePage().props.auth.permissions;
    const authUser = usePage().props.auth;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        post,
        processing,
    } = useForm({
        libelle: '',
        school_id: '',
        serie_id: '',
        scolarite: '',
        lignes: [
            { professeur_id: '', matiere_id: '', coefficient: '' },
        ],
    });

    useEffect(() => {
        console.log("Data changed", data);
    }, [data])

    const professeurOptions = professeurs.map((p) => ({
        value: p.id,
        label: `${p.firstname ?? ''} ${p.lastname ?? ''}`.trim() || p.firstname,
    }));

    const matiereOptions = matieres.map((m) => ({
        value: m.id,
        label: m.libelle ?? m.nom,
    }));

    const serieOptions = (series || []).map((s) => ({
        value: s.id,
        label: s.libelle ?? s.nom,
    }));

    const addLigne = () => {
        setData('lignes', [
            ...data.lignes,
            { professeur_id: '', matiere_id: '', coefficient: '' },
        ]);
    };

    const removeLigne = (index) => {
        if (data.lignes.length === 1) return; // garder au moins une ligne
        const newLignes = data.lignes.filter((_, i) => i !== index);
        setData('lignes', newLignes);
    };

    const updateLigne = (index, field, value) => {
        const newLignes = [...data.lignes];
        newLignes[index] = { ...newLignes[index], [field]: value };
        setData('lignes', newLignes);
    };

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

        post(route('classe.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Classe créee avec succès',
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Ajout des classes
                </h2>
            }
        >
            <Head title="Ajouter une classe" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('classe.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("classe.index")}> <CIcon icon={cilList} /> Liste des classes</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    {/* schools */}
                                    {!authUser.school &&
                                        <div className="col-md-6">
                                            <div className='mb-3'>
                                                <InputLabel htmlFor="school_id" value="L'école concernée" >  <span className="text-danger">*</span> </InputLabel>

                                                <Select
                                                    placeholder="Rechercher une école ..."
                                                    name="school_id"
                                                    id="school_id"
                                                    required
                                                    className="form-control mt-1 block w-full"
                                                    options={schools.map((school) => ({
                                                        value: school.id,
                                                        label: `${school.raison_sociale}`,
                                                    }))}
                                                    value={schools
                                                        .map((school) => ({
                                                            value: school.id,
                                                            label: `${school.raison_sociale}`,
                                                        }))
                                                        .find((option) => option.value === data.school_id)}
                                                    onChange={(option) => setData('school_id', option.value)}
                                                />

                                                <InputError className="mt-2" message={errors.school_id} />
                                            </div>
                                        </div>
                                    }

                                    <div className="col-md-4">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="serie_id" value="Série concernée" > <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Choisir une série ..."
                                                name="serie_id"
                                                id="serie_id"
                                                className="form-control mt-1 block w-full"
                                                options={serieOptions}
                                                value={serieOptions.find((option) => option.value === data.serie_id) || null}
                                                onChange={(option) => setData('serie_id', option ? option.value : '')}
                                            />
                                            <InputError className="mt-2" message={errors.serie_id} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="libelle" value="Libelle de la classe" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="libelle"
                                                className="mt-1 block w-full"
                                                value={data.libelle}
                                                placeholder="Ex: Tle (Terminale)"
                                                onChange={(e) => setData('libelle', e.target.value)}
                                                autoComplete="libelle"
                                                required
                                            />

                                            <InputError className="mt-2" message={errors.libelle} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="scolarite" value="Scolarite" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="scolarite"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.scolarite}
                                                placeholder="500.000"
                                                onChange={(e) => setData('scolarite', e.target.value)}
                                                autoComplete="scolarite"
                                                required
                                            />

                                            <InputError className="mt-2" message={errors.scolarite} />
                                        </div>
                                    </div>
                                </div>

                                {/* Lignes : professeur / matiere / coefficient */}
                                <div className="mt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <InputLabel value="Professeurs / Matières / Coefficients" >
                                            <span className="text-danger">*</span>
                                        </InputLabel>
                                        <button
                                            type="button"
                                            className="btn btn-sm bg-success bg-hover text-white"
                                            onClick={addLigne}
                                        >
                                            <CIcon icon={cilPlus} /> Ajouter une ligne
                                        </button>
                                    </div>

                                    <InputError className="mt-1 mb-2" message={errors.lignes} />

                                    {data.lignes.map((ligne, index) => (
                                        <div key={index} className="row align-items-start border rounded p-2 mb-2 mx-0 bg-white">
                                             <div className="col-md-4">
                                                <div className="mb-2">
                                                    <InputLabel htmlFor={`matiere_id_${index}`} value="Matière" />
                                                    <Select
                                                        placeholder="Rechercher une matière ..."
                                                        name={`lignes[${index}][matiere_id]`}
                                                        id={`matiere_id_${index}`}
                                                        className="form-control mt-1 block w-full"
                                                        options={matiereOptions}
                                                        value={matiereOptions.find(
                                                            (option) => option.value === ligne.matiere_id
                                                        ) || null}
                                                        onChange={(option) =>
                                                            updateLigne(index, 'matiere_id', option ? option.value : '')
                                                        }
                                                    />
                                                    <InputError
                                                        className="mt-1"
                                                        message={errors[`lignes.${index}.matiere_id`]}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="mb-2">
                                                    <InputLabel htmlFor={`professeur_id_${index}`} value="Professeur" />
                                                    <Select
                                                        placeholder="Rechercher un professeur ..."
                                                        name={`lignes[${index}][professeur_id]`}
                                                        id={`professeur_id_${index}`}
                                                        className="form-control mt-1 block w-full"
                                                        options={professeurOptions}
                                                        value={professeurOptions.find(
                                                            (option) => option.value === ligne.professeur_id
                                                        ) || null}
                                                        onChange={(option) =>
                                                            updateLigne(index, 'professeur_id', option ? option.value : '')
                                                        }
                                                    />
                                                    <InputError
                                                        className="mt-1"
                                                        message={errors[`lignes.${index}.professeur_id`]}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="mb-2">
                                                    <InputLabel htmlFor={`coefficient_${index}`} value="Coefficient" />
                                                    <TextInput
                                                        id={`coefficient_${index}`}
                                                        type="number"
                                                        step="0.01"
                                                        className="mt-1 block w-full"
                                                        value={ligne.coefficient}
                                                        placeholder="Ex: 2"
                                                        onChange={(e) =>
                                                            updateLigne(index, 'coefficient', e.target.value)
                                                        }
                                                    />
                                                    <InputError
                                                        className="mt-1"
                                                        message={errors[`lignes.${index}.coefficient`]}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-1 d-flex align-items-center justify-content-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger mt-4"
                                                    onClick={() => removeLigne(index)}
                                                    disabled={data.lignes.length === 1}
                                                    title="Supprimer cette ligne"
                                                >
                                                    <CIcon icon={cilTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}> <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'} </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}