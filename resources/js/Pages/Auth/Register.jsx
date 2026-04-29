import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import RegisterLayout from '@/Layouts/RegisterLayout';
import { cibGooglesCholar, cilArrowCircleLeft, cilArrowCircleRight, cilSend, cilUserFollow } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Register() {

    const {
        data,
        setData,
        errors,
        post,
        reset,
        progress
    } = useForm({
        // data ecole
        raison_sociale: "",
        adresse: "",
        email: "",
        phone: "",
        logo: "",
        ifu: "",
        rccm: "",
        slogan: "",
        description: "",

        // data administrateur
        firstname: "",
        lastname: "",
        profile_img: "",
        password: "",
        password_confirmation: ""
    });

    // handle submit button
    const [isDisabled, setIsDisabled] = useState(false);

    // initialization
    useEffect(() => {
        let { raison_sociale,
            adresse,
            email,
            phone,
            // logo,
            ifu,
            rccm,
            slogan,
            description,
            firstname,
            lastname,
            password,
            password_confirmation
        } = data;
        if (raison_sociale && adresse && email && phone && ifu && rccm && slogan && description && firstname && lastname && password && password_confirmation) {
            setIsDisabled(true)
        }

        console.log("Les datas :", data)
    }, [data]);

    // Next step
    const [next, setNext] = useState(false)
    const nextStep = (e) => {
        e.preventDefault();
        setNext((prev) => !prev)
    }

    // submit
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

        post(route('register'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Compte crée avec succès',
                });
            },
            onError: (e) => {
                Swal.close();
                const errorMessage = e.exception || e.errors?.[0] || 'Veuillez vérifier vos informations et réessayer.';
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: errorMessage,
                });
                console.log(e);
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <RegisterLayout>
            <Head title="Register" />

            <div uk-scrollspy="cls:uk-animation-slide-bottom" className="relative inline-block w-full mx-auto ">
                {/* Fond jaune décalé */}
                <div
                    className="absolute bg-yellow-400"
                    style={{
                        top: "-5px",          // décale vers le bas
                        left: "-2px",         // décale vers la droite
                        width: "100%",
                        height: "100%",
                        borderRadius: "15px",
                        transform: "rotate(-2deg)",
                        zIndex: 0,
                    }}
                ></div>

                {/* Contenu au-dessus (le formulaire) */}
                <div className="relative z-10 bg-white rounded-xl shadow-lg p-6">
                    <form onSubmit={submit}>
                        {/* L'école */}
                        {!next &&
                            <div className="">
                                <div className="col-md-12">
                                    <h5 className="text-center text-success panel-title" > <CIcon icon={cibGooglesCholar} /> Les Informations relatives à l'école</h5>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="raison_sociale" value="Raison Sociale" >  <span className="text-danger">*</span> </InputLabel>

                                            <TextInput
                                                id="raison_sociale"
                                                className="mt-1 block w-full"
                                                value={data.raison_sociale}
                                                placeholder="Ex: Complexe Scolaire Bilingue"
                                                onChange={(e) => setData('raison_sociale', e.target.value)}
                                                required
                                                isFocused
                                                autoComplete="raison_sociale"
                                            />

                                            <InputError className="mt-2" message={errors.raison_sociale} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="adresse" value="Adresse" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="adresse"
                                                className="mt-1 block w-full"
                                                value={data.adresse}
                                                required
                                                placeholder="Ex: Cotonou | Rue 234"
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                autoComplete="adresse"
                                            />

                                            <InputError className="mt-2" message={errors.adresse} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="ifu" value="IFU" ><span className="text-danger">*</span> </InputLabel>

                                            <TextInput
                                                id="ifu"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: 87654436597865765"
                                                value={data.ifu}
                                                required
                                                onChange={(e) => setData('ifu', e.target.value)}
                                                autoComplete="ifu"
                                            />

                                            <InputError className="mt-2" message={errors.ifu} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="slogan" value="Slogan" ><span className="text-danger">*</span></InputLabel>

                                            <TextInput
                                                id="slogan"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.slogan}
                                                required
                                                placeholder="Ex: Discipline - Travail - Succès"
                                                onChange={(e) => setData('slogan', e.target.value)}
                                                autoComplete="slogan"
                                            />

                                            <InputError className="mt-2" message={errors.slogan} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="logo" value="Logo de l'école" ></InputLabel>

                                            <TextInput
                                                id="logo"
                                                type="file"
                                                className="mt-1 block w-full"
                                                // required
                                                onChange={(e) => setData('logo', e.target.files[0])}
                                                autoComplete="logo"
                                            />

                                            {progress && (
                                                <progress value={progress.percentage} max="100">
                                                    {progress.percentage}%
                                                </progress>
                                            )}

                                            <InputError className="mt-2" message={errors.logo} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" > <span className="text-danger">*</span></InputLabel>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: bilingue@gmail.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                autoComplete="username"
                                            />

                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="rccm" value="RCCM"><span className="text-danger">*</span></InputLabel>

                                            <TextInput
                                                id="rccm"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: RB/COT/17B 765498"
                                                value={data.rccm}
                                                onChange={(e) => setData('rccm', e.target.value)}
                                                autoComplete="rccm"
                                            />

                                            <InputError className="mt-2" message={errors.rccm} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="description" value="Description" ><span className="text-danger">*</span></InputLabel>

                                            <TextInput
                                                id="rccm"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.description}
                                                placeholder="Ex: Enseignement Maternel et Primaire"
                                                required
                                                onChange={(e) => setData('description', e.target.value)}
                                                autoComplete="description"
                                            />

                                            <InputError className="mt-2" message={errors.description} />
                                        </div>
                                    </div>

                                </div>

                                <div className="flex items-center justify-content-center">
                                    <button
                                        className="btn btn-success text-white  rounded border shadow"
                                        onClick={e => nextStep(e)}>Suivant <CIcon icon={cilArrowCircleRight} /></button>
                                </div>
                            </div>
                        }

                        {/* L'administrateur */}
                        {next &&
                            <div className="">
                                <div className="col-md-12">
                                    <h5 className="text-center text-success panel-title" > <CIcon icon={cilUserFollow} /> Les Informations relatives à l'administrateur</h5>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Firstname */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="firstname" value="Nom" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="firstname"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: Doe"
                                                value={data.firstname}
                                                onChange={(e) => setData('firstname', e.target.value)}
                                                autoComplete="firstname"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.firstname} />
                                        </div>

                                        {/* Lastname */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="lastname" value="Prénom" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                name="lastname"
                                                id="lastname"
                                                required
                                                placeholder="Ex: John"
                                                className='form-control mt-1 block w-full'
                                                value={data.lastname}
                                                onChange={(e) => setData('lastname', e.target.value)}
                                            />

                                            <InputError className="mt-2" message={errors.lastname} />
                                        </div>

                                        {/* Phone */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phone" value="Numéro de télépone" ></InputLabel>
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: +2290156854397"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                autoComplete="phone"
                                            />
                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">

                                        <div className="mb-3">
                                            <InputLabel htmlFor="password" value="Mot de passe" ><span className="text-danger">*</span> </InputLabel>

                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                placeholder="*******"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />

                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div className="mb-3">
                                            <InputLabel
                                                htmlFor="password_confirmation"
                                                value="Confirmation de mot de passe"
                                            > <span className="text-danger">*</span> </InputLabel>

                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                placeholder="*******"
                                                onChange={(e) =>
                                                    setData('password_confirmation', e.target.value)
                                                }
                                                required
                                            />

                                            <InputError
                                                message={errors.password_confirmation}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* profile img */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="profile_img" value="Photo de profil" ></InputLabel>

                                            <TextInput
                                                id="profile_img"
                                                type="file"
                                                className="mt-1 block w-full"
                                                // required
                                                onChange={(e) => setData('profile_img', e.target.files[0])}
                                                autoComplete="profile_img"
                                            />

                                            {progress && (
                                                <progress value={progress.percentage} max="100">
                                                    {progress.percentage}%
                                                </progress>
                                            )}

                                            <InputError className="mt-2" message={errors.profile_img} />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <Link
                                    href={route('login')}
                                    className="rounded-md text-sm border text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                                >
                                    Avez-vous déjà un compte?
                                </Link>

                                <div className="flex items-center justify-content-center my-2">
                                    <button
                                        className="btn btn-dark text-white  rounded border shadow"
                                        onClick={e => nextStep(e)}><CIcon icon={cilArrowCircleLeft} /> Retour</button>
                                </div>

                                {isDisabled &&
                                    <div className="mt-4 flex items-center justify-end">
                                        <button className="btn btn-sm w-100 bg-success text-white bg-hover rounded"><i className="bi bi-check2-circle"></i> Enregistrer</button>
                                    </div>
                                }
                            </div>
                        }
                    </form>

                </div>
            </div>
        </RegisterLayout>
    );
}
