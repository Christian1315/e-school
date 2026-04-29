import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function RegisterLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center py-5 bg-gray pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-8">
                        <div className="mt-6 w-full bg-white px-6 py-4 shadow-md sm:rounded-lg dark:bg-gray-800">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
