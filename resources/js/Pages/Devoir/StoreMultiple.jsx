import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cilPencil, cibBuffer, cilList } from "@coreui/icons";
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

export default function StoreMultiple({ trimestre, matiere, classe, apprenants }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    // les lignes à soumettre enfin
    const {
        data,
        setData,
        errors,
        post,
        processing,
    } = useForm({
        // school_id: school.id || "",
        apprenant_id: "",
        trimestre_id: trimestre.id || "",
        matiere_id: matiere.id || "",
        classe_id: classe.id || "",
        apprenants: [],
        annee_scolaire: new Date().getFullYear()
    });

    //reformatage des apprennants pour afficher dans le tableau
    const [_apprenants, setApprenants] = useState(
        apprenants.data.map((apprenant) => (
            {
                id: apprenant.id,
                name: `${apprenant.firstname} - ${apprenant.lastname}`,
                note: 0,
                checked: false
            }
        ))
    );

    useEffect(() => {
        let checkeds = _apprenants.filter((a) => a.checked)
        console.log("les apprenants à considerer :", checkeds)

        setData("apprenants", checkeds)
    }, [_apprenants])

    const changeLigne = (index, e) => {
        let value = e.target.value

        if (e.target.value != '') {
            if (value > 20 || value < 0) {
                Swal.fire({ icon: 'error', text: "La note doit être comprise entre 0 et 20" })
                e.target.value = 0
            }
            const updated = [..._apprenants];
            updated[index].note = value;
            updated[index].checked = true;

            setApprenants(updated);
        } else {
            const updated = [..._apprenants];
            updated[index].checked = false;
            setApprenants(updated);
        }
    }

    const submit = (e) => {
        e.preventDefault();

        let checkeds = _apprenants.filter((a) => a.checked)

        if (checkeds.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Opération échouée",
                text: "Renseignez au moins une note de devoir"
            })
            return
        } else {
            post(route('devoir.post-store-multiple'), {
                onSuccess: () => {
                    Swal.close();
                    Swal.fire({
                        icon: 'success',
                        title: 'Opération réussie',
                        text: 'Devoir(s) crée(s) avec succès',
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
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 panel-title">
                    <CIcon className='text-success' icon={cibBuffer} /> Insertion de devoirs groupées
                </h2>
            }
        >
            <Head title="Ajouter un groupe de devoir" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('devoir.view') ?
                                (<div className="row d-flex justify-content-center">
                                    <Link className="w-50 btn btn-sm bg-success bg-hover text-white" href={route("devoir.index")}> <CIcon icon={cilList} /> Liste des devoirs</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    {/*  */}
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="trimestre_id" value="Le trimestre concerné" ></InputLabel>

                                            <TextInput
                                                className="form-control mt-1 block w-full"
                                                readOnly
                                                value={trimestre.libelle} />

                                            <InputError className="mt-2" message={errors.trimestre_id} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="matiere_id" value="La matière concernée" > </InputLabel>
                                            <TextInput
                                                className="form-control mt-1 block w-full"
                                                readOnly
                                                value={matiere.libelle} />

                                            <InputError className="mt-2" message={errors.matiere_id} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="classe_id" value="La classe concernée" ></InputLabel>
                                            <TextInput
                                                className="form-control mt-1 block w-full"
                                                readOnly
                                                value={classe.libelle} />

                                            <InputError className="mt-2" message={errors.classe_id} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="annee_scolaire" value="Année scolaire" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="annee_scolaire"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.annee_scolaire}
                                                placeholder="Ex: 2026"
                                                onChange={(e) => setData('annee_scolaire', e.target.value)}
                                                autoComplete="annee_scolaire"
                                                min={2000}
                                                max={2030}
                                                required
                                            />

                                            <InputError className="mt-2" message={errors.annee_scolaire} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className='mb-3'>
                                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th scope="col">N°</th>
                                                    <th scope="col">Nom & Prénom</th>
                                                    <th scope="col">Note</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    _apprenants.map((apprenant, index) => (
                                                        <tr key={apprenant.id}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{apprenant.name}</td>
                                                            <td className='text-center'>
                                                                <TextInput
                                                                    type="number"
                                                                    step="0.001"
                                                                    className="form-control mt-1 block w-full"
                                                                    onChange={(e) => changeLigne(index, e)} />
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
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
