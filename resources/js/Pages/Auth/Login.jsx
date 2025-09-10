import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2'

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Connexion en cours...',
            text: 'Veuillez patienter pendant que nous vérifions vos informations.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('login'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Connexion réussie',
                    text: 'Vous avez été connecté(e) avec succès.',
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Connexion échouée',
                    text: 'Veuillez vérifier vos informations et réessayer.',
                });
                console.log(e);
            },
            onFinish: () => reset('password'),
        });
    };


    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div uk-scrollspy="cls:uk-animation-slide-bottom" className="relative inline-block w-full max-w-md mx-auto ">
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
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 block flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                                <span className="border ms-2 text-sm text-gray-600 dark:text-gray-400">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                href={route('register')}
                                className="border rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Pas inscrit ?
                            </Link>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="border rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                                >
                                    Forgot your password?
                                </Link>
                            )}

                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <button disabled={processing} className="btn btn-sm w-100 bg-success text-white bg-hover rounded"><i className="bi bi-check2-circle"></i> {processing?'Connexion ...':' Se connecter'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
