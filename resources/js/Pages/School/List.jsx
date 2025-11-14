import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilDelete, cilAlignCenter, cilLibraryAdd, cilList, cilPencil, cilMenu, cilLocationPin, cilSend } from "@coreui/icons";
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';


export default function List({ schools }) {
    const permissions = usePage().props.auth.permissions;
    // const [showModal, setShowModal] = useState(false);

    const [showImgModal, setShowImgModal] = useState(false)
    const [currentSchool, setCurrentSchool] = useState(null)

    // Vérifier si l'utilisateur a la permission
    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const showImg = (e, school) => {
        e.preventDefault();
        Swal.fire({
            text: `Profile de : ${school?.raison_sociale}`,
            imageUrl: school.logo,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profil",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });
    }

    const showImgUpdating = (e, school) => {
        e.preventDefault();
        setCurrentSchool(school)
        setShowImgModal(true);
    }

    const closeImgModal = () => {
        setShowImgModal(false);
    }

    const { data, setData, errors, processing, post } = useForm({
        logo: null,
    })

    // updating img
    const submitImg = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('school.profile-update', currentSchool?.id), {
            forceFormData: true, // 👈 this is the key line
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Profile mis à jour avec succès`,
                });
                setShowImgModal(false)
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                setShowImgModal(false)
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des listes d'écoles
                </h2>
            }
        >
            <Head title="Les écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('ecole.create') ?
                            (<div className="items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("school.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Logo</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Ifu</th>
                                    <th scope="col">Rccm</th>
                                    <th scope="col">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    schools.data.map((school, index) => (
                                        // <tr key={school.id} className={!school.statut?'bg-danger':''}>
                                        <tr key={school.id}>
                                            <th scope="row">
                                                {index + 1}
                                                <CIcon icon={cilLocationPin} className={!school.statut ? 'text-danger' : 'text-success'} />
                                            </th>
                                            <td>
                                                <div className="dropstart">
                                                    <button
                                                        type="button"
                                                        className="dropdown-toggle items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                        data-bs-toggle="dropdown" aria-expanded="false"
                                                    >
                                                        <CIcon icon={cilMenu} /> Gérer
                                                    </button>
                                                    <ul className="dropdown-menu p-2 border rounded shadow" aria-labelledby="dropdownMenuButton1">

                                                        {checkPermission('ecole.edit') ?
                                                            (<li><Link
                                                                className='btn text-warning'
                                                                href={route('school.edit', school.id)}
                                                            >
                                                                <CIcon icon={cilPencil} />  Modifier
                                                            </Link></li>) : null
                                                        }

                                                        {/* {checkPermission('ecole.delete') ?
                                                            (<li><Link
                                                                className='btn text-danger'
                                                            >
                                                                <CIcon icon={cilDelete} />  Supprimer
                                                            </Link></li>) : null
                                                        } */}
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="badge bg-light d-flex rounded border shadow" >
                                                    <img src={school.logo}
                                                        onClick={(e) => showImg(e, school)}
                                                        className='img-fluid img-circle shadow' srcSet=""
                                                        style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid 5px #f6f6f6', cursor: 'pointer' }}
                                                    />

                                                    {checkPermission('apprenant.edit') ?
                                                        <CIcon className='text-success'
                                                            style={{ cursor: 'pointer', width: 500 }}
                                                            icon={cilPencil}
                                                            onClick={(e) => showImgUpdating(e, school)} /> : '---'
                                                    }

                                                </div>
                                            </td>
                                            <td>{school.raison_sociale}</td>
                                            <td>{school.adresse}</td>
                                            <td>{school.phone}</td>
                                            <td>{school.email}</td>
                                            <td>{school.ifu}</td>
                                            <td>{school.rccm}</td>
                                            <td>
                                                <span
                                                    className={`badge p-1 bg-${school.statut ? 'success' : 'danger'} border rounded text-light`}
                                                >
                                                    {school.statut ? (
                                                        <>
                                                            <CIcon icon={cilCheck} /> Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CIcon icon={cilDelete} /> Desactivé
                                                        </>
                                                    )}
                                                </span>
                                            </td>

                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/*  Update image */}
            <Modal show={showImgModal} onClose={closeImgModal}>
                <form onSubmit={submitImg} className="p-6" encType="multipart/form-data">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Modifier le profil de l'école <em className='text-success'>{`${currentSchool?.raison_sociale}`}</em>
                    </h2>

                    <div className="my-2">
                        <InputLabel htmlFor="logo" value="Le logo de l'école" > <span className="text-danger">*</span>  </InputLabel>
                        <TextInput
                            type="file"
                            name="logo"
                            id="logo"
                            required
                            className='form-control mt-1 block w-full'
                            onChange={(e) => setData('logo', e.target.files[0])}
                        />

                        <InputError className="mt-2" message={errors.logo} />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeImgModal}>
                            Abandonner
                        </SecondaryButton>

                        <PrimaryButton disabled={processing}>
                            <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer les modifications'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
