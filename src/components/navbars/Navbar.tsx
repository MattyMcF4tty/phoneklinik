'use client';

import Image from 'next/image';
import React, { FC, useState } from 'react';
import DeviceSearchField from '../inputfields/DeviceSearchField';
import Link from 'next/link';

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-[999] flex justify-between items-center px-4 h-[var(--navbar-height)]">
      {/* Logo */}
      <Link href="/" className="relative h-[140%] w-40 aspect-square">
        <Image
          className="object-contain"
          src={'/phoneklinik.jpg'}
          alt="PhoneKlinik"
          fill
        />
      </Link>

      {/* Buttons */}
      <div className="hidden md:flex flex-row space-x-4">
        <Link href="/reparation" className="button-navbar">
          Reparation
        </Link>
        <Link href="/saelg-enhed" className="button-navbar">
          Sælg din enhed
        </Link>
        <Link href="/om-os" className="button-navbar">
          Om os
        </Link>
        <Link href="/kontakt-os" className="button-navbar">
          Kontakt os
        </Link>
      </div>

      {/* Search + Hamburger on Mobile */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <DeviceSearchField />
        </div>

        {/* Hamburger for Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white flex flex-col items-start p-4 space-y-4 shadow-md border-t">
          <Link
            href="/reparation"
            className="button-navbar w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Reparation
          </Link>
          <Link
            href="/saelg-enhed"
            className="button-navbar w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Sælg din enhed
          </Link>
          <Link
            href="/om-os"
            className="button-navbar w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Om os
          </Link>
          <Link
            href="/kontakt-os"
            className="button-navbar w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Kontakt os
          </Link>
          <DeviceSearchField />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
