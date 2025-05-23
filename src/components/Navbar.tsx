'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LinkButton from '@/components/LinkButton';
import Searchbar from './Searchbar';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Client-side mounted check

  // Run only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure no rendering until client-side
  if (!mounted) return null;

  return (
    <div>
      {/* Navbar */}
      <div className="bg-white flex items-center justify-between px-4 md:px-10 py-4 w-full">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/phoneklinik.jpg"
              width={150}
              height={150}
              alt="logo"
              className="md:w-26"
            />
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex flex-row items-center">
          <Searchbar />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none ml-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex flex-row items-center space-x-4">
            <LinkButton variant="navbar" url="/reparation">
              Reparation
            </LinkButton>
            <LinkButton variant="navbar" url="/saelg-enhed">
              Sælg din enhed
            </LinkButton>
            <LinkButton variant="navbar" url="/om-os">
              Om os
            </LinkButton>
            <LinkButton variant="navbar" url="/kontakt-os">
              Kontakt os
            </LinkButton>
          </div>
          <div className="flex items-center space-x-2 w-2/5">
            <Searchbar />
            <LinkButton variant="navbar2" url="/bestil-reparation">
              Bestil reparation
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="bg-white flex flex-col items-center space-y-4 p-4 md:hidden">
          <LinkButton variant="navbar" url="/reparation">
            Reparation
          </LinkButton>
          <LinkButton variant="navbar" url="/saelg-enhed">
            Sælg din enhed
          </LinkButton>
          <LinkButton variant="navbar" url="/om-os">
            Om os
          </LinkButton>
          <LinkButton variant="navbar" url="/kontakt-os">
            Kontakt os
          </LinkButton>

          {/* Search Input & "Bestil Reparation" in Mobile Menu */}
          <div className="flex flex-col items-center w-full mt-4">
            <LinkButton variant="navbar2" url="/bestil-reparation">
              Bestil reparation
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
