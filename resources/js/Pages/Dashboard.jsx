import SidebarMenu from '@/Components/SidebarMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CIcon from '@coreui/icons-react';
import { cilBlur } from "@coreui/icons";
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                  <CIcon className='text-success' icon={cilBlur} />  Dashboard
                </h2>
            }
            SidebarMenu={<SidebarMenu />}
        >
            <Head title="Dashboard" />
            
        </AuthenticatedLayout>
    );
}
