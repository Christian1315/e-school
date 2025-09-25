import "./../../../public/fichiers/base.css";
import SidebarMenu from '@/Components/SidebarMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CIcon from '@coreui/icons-react';
import { cilBlur } from "@coreui/icons";
import { Head } from '@inertiajs/react';
import { cilWallet, cilSmilePlus, cilPeople } from "@coreui/icons";
import { useEffect, useRef } from 'react';
import Chart from "chart.js/auto";

export default function Dashboard({ schools, apprenants, inscriptions, users }) {
    const monthlyChartRef = useRef(null);
    const dailyChartRef = useRef(null);

    useEffect(() => {
        if (!monthlyChartRef.current || !dailyChartRef.current) return;

        // 🔹 Dataset mensuel
        const monthlyChart = new Chart(monthlyChartRef.current, {
            type: "bar",
            data: {
                labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
                datasets: [
                    {
                        label: "Nombre (mensuel)",
                        data: apprenants.data,
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // 🔹 important si tu veux contrôler la taille
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        // 🔹 Dataset journalier
        const labelsDaily = Array.from({ length: apprenants.length }, (_, i) => (i + 1).toString());
        const dailyChart = new Chart(dailyChartRef.current, {
            type: "bar",
            data: {
                labels: labelsDaily,
                datasets: [
                    {
                        label: "Nombre (journalier)",
                        data: inscriptions.data,
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        // 🔹 Nettoyer les instances pour éviter les doublons
        return () => {
            monthlyChart.destroy();
            dailyChart.destroy();
        };
    }, [apprenants, inscriptions]);


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilBlur} />  Tableau de board
                </h2>
            }
            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Dashboard" />

            {/*  */}
            <div className="py-6">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Totaux */}
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-bottom"
                                    className="shadow bg-light border border-gray-200 p-4 rounded-full border-4 border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"><strong className="text-danger"> {schools.data.length < 10 ? '0' + schools.data.length : schools.data.length} </strong> </p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cilWallet} /> Ecoles </h2>
                                </div>
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-top"
                                    className="shadow bg-light border border-gray-200 p-4 rounded-full border-4 border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"> <strong className="text-success"> {apprenants.data.length < 10 ? '0' + apprenants.data.length : apprenants.data.length} </strong>  </p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cilSmilePlus} /> Apprenants </h2>
                                </div>
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-top"
                                    className="shadow bg-light border border-gray-200 p-4 rounded-full border-4 border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"><strong className="text-danger"> {inscriptions.data.length < 10 ? '0' + inscriptions.data.length : inscriptions.data.length} </strong></p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cilWallet} /> Inscriptions </h2>
                                </div>
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-bottom"
                                    className="shadow bg-light border border-gray-200 p-4 rounded-full border-4 border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"><strong className="text-success"> {users.data.length < 10 ? '0' + users.data.length : users.data.length} </strong></p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cilPeople} /> Utilisateurs </h2>
                                </div>
                            </div>

                            <br /><br />
                            {/* Graphics */}
                            <div className="grid grid-cols-2 gap-4 bg-light rounded shadow-sm p-2">
                                <div className="h-80"> {/* 🔹 hauteur fixée */}
                                    <h3 className="text-center mb-3 font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cilPeople} /> Apprenants enregistrés par mois </h3>
                                    <canvas ref={monthlyChartRef}></canvas>
                                </div>
                                <div className="h-80">
                                    <h3 className="text-center mb-3 font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cilPeople} /> Inscriptions enregistrés par jours </h3>
                                    <canvas ref={dailyChartRef}></canvas>
                                </div>
                            </div>

                            <br /><br /><br />
                            {/* Details */}
                            <div className="mt-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cilPeople} /> Utilisateurs récents </h3>
                                        <table id="" className="table-auto border-collapse border-b border-slate-400 mt-4 w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Nom </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Prénom </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Phone </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Inseré le </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    users.data.map((user, index) => (
                                                        <tr key={user.id}>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{user.firstname}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{user.lastname}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{user?.detail?.phone || '---'}</span> </td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded"> {user.created_at}</span></td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cilWallet} /> Inscriptions récentes </h3>
                                        <table id="" className="table-auto border-collapse border-b border-slate-400 mt-4 w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Ecole </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Apprenant </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Numéro Educ Master </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Frais d'inscription </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    inscriptions.data.map((inscription, index) => (
                                                        <tr key={inscription.id}>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{inscription.school?.raison_sociale}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{inscription.apprenant?.firstname} - {inscription.apprenant?.lastname}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{inscription.numero_educ_master}</span> </td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded"> {inscription.frais_inscription}</span></td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
