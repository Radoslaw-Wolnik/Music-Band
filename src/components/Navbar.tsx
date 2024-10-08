// src/components/Navbar.tsx

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserRole } from '@/types';

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-primary-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Music Band
        </Link>
        <div className="space-x-4">
          <Link href="/events" className="hover:text-primary-200">Events</Link>
          <Link href="/merch" className="hover:text-primary-200">Merch</Link>
          {session ? (
            <>
              {session.user.role === UserRole.MANAGER && (
                <Link href="/admin" className="hover:text-primary-200">Admin</Link>
              )}
              {session.user.role === UserRole.BAND_MEMBER && (
                <Link href="/band-member" className="hover:text-primary-200">Band Member</Link>
              )}
              {session.user.role === UserRole.PATRON && (
                <Link href="/patron" className="hover:text-primary-200">Patron</Link>
              )}
              <Link href="/profile" className="hover:text-primary-200">Profile</Link>
              <button onClick={() => signOut()} className="hover:text-primary-200">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary-200">Login</Link>
              <Link href="/register" className="hover:text-primary-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;