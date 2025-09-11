import SidebarMenu from '@/Components/SidebarMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Dashboard" />

        </AuthenticatedLayout>
    );
}
