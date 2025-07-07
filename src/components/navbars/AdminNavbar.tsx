import { signOut } from '@/app/(pages)/admin/auth/login/actions';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

const AdminNavbar: FC = () => {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-[999] flex justify-between items-center px-4 h-[var(--navbar-height)]">
      {/* Logo */}
      <Link href="/admin" className="relative h-[140%] w-40 aspect-square">
        <Image
          className="object-contain"
          src={'/phoneklinik.jpg'}
          alt="PhoneKlinik"
          fill
        />
      </Link>

      {/* Buttons */}
      <div className="h-full flex items-center justify-center gap-4">
        <Link href="/admin/maerker" className="button-navbar">
          Mærker
        </Link>
        <Link href="/admin/tilbehoer" className="button-navbar">
          Tilbehør
        </Link>
        <Link href="/admin/reparation" className="button-navbar">
          Reparation
        </Link>
        <Link href="/admin/brugtsalg" className="button-navbar">
          Brugtsalg
        </Link>
      </div>
      <form className="h-full flex items-center justify-center">
        <button
          className="bg-red-600 text-white h-1/2 px-2 rounded-lg"
          formAction={signOut}
        >
          Sign out
        </button>
      </form>
    </nav>
  );
};

export default AdminNavbar;
