import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

export default async function RootLayout({ children }: { children: ReactNode }) {
    const isUserAuthenticated = await isAuthenticated();

    // Redirect unauthenticated users to sign-in
    if (!isUserAuthenticated) {
        redirect('/sign-in');
    }

    return (
        <div className='root-layout'>
            <nav>
                <Link href="/" className='flex items-center gap-2'>
                    <Image 
                        src="/logo.svg"  
                        alt="logo" 
                        width={38} 
                        height={32}
                    />
                    <h2 className='text-primary-100'>PrepWiser</h2>
                </Link>
            </nav>
            {children}
        </div>
    );
}