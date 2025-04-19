import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } : any = useSession();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BlogApp
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/blogs" className="hover:underline">Blogs</Link>
          <Link href="/about" className="hover:underline">About</Link>
          
          {status === 'authenticated' ? (
            <>
              {session.user.role === 'admin' && (
                <Link href="/admin" className="hover:underline">Admin</Link>
              )}
              <button 
                onClick={() => signOut()}
                className="hover:underline"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:underline">Login</Link>
              <Link href="/auth/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}