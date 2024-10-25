import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex sm:justify-center ">
            <div className="w-6/12 bg-[#004F59] min-h-screen ">
        {/* <img /> */}
            </div>
            <div className="w-6/12 min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
