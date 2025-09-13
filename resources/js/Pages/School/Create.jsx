import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarMenu from '@/Components/SidebarMenu';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend,cilArrowCircleLeft,cilLibraryAdd } from "@coreui/icons";

export default function Create() {
    const {
        data,
        setData,
        errors,
        put,
        post,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = () => {

    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilLibraryAdd} /> Panel d'ajout des écoles
                </h2>
            }

            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Ajouter école" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            <div className=" text-center  items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("school.index")}> <CIcon icon={cilArrowCircleLeft} /> Liste des écoles</Link>
                            </div>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div>
                                            <InputLabel htmlFor="raison_sociale" value="Raison Sociale" />

                                            <TextInput
                                                id="raison_sociale"
                                                className="mt-1 block w-full"
                                                value={data.lastname}
                                                onChange={(e) => setData('raison_sociale', e.target.value)}
                                                required
                                                isFocused
                                                autoComplete="raison_sociale"
                                            />

                                            <InputError className="mt-2" message={errors.raison_sociale} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="adresse" value="Adresse" />
                                            <TextInput
                                                id="adresse"
                                                className="mt-1 block w-full"
                                                value={data.firstname}
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                required
                                                isFocused
                                                autoComplete="adresse"
                                            />

                                            <InputError className="mt-2" message={errors.adresse} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="ifu" value="IFU" />

                                            <TextInput
                                                id="ifu"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData('ifu', e.target.value)}
                                                required
                                                autoComplete="ifu"
                                            />

                                            <InputError className="mt-2" message={errors.ifu} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                autoComplete="username"
                                            />

                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone" value="Telephone" />
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                required
                                                autoComplete="phone"
                                            />

                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="rccm" value="RCCM" />

                                            <TextInput
                                                id="rccm"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData('rccm', e.target.value)}
                                                required
                                                autoComplete="rccm"
                                            />

                                            <InputError className="mt-2" message={errors.rccm} />
                                        </div>
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
