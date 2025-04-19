import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { data: session, status }: any = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
        } else if (status === 'authenticated' && adminOnly && session.user.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router, adminOnly]);

    if (status === 'loading' || status === 'unauthenticated' || (adminOnly && session?.user.role !== 'admin')) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}