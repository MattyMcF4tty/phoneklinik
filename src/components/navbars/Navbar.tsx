import Image from 'next/image';
import React, { FC } from 'react';
import DeviceSearchField from '../inputfields/DeviceSearchField';
import Link from 'next/link';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <nav className="w-full bg-white shadow-md h-[var(--navbar-height)] flex flex-row fixed top-0 z-50 justify-between items-center p-4">
      <Link href="/" className="relative h-[140%] w-40 aspect-square">
        <Image
          className="object-contain "
          src={'/phoneklinik.jpg'}
          alt="PhoneKlinik"
          fill
        />
      </Link>

      <div className="flex flex-row">
        <Link href={'/reparation'} className="button-navbar">
          Reparation
        </Link>
        <Link href={'/saelg-enhed'} className="button-navbar">
          Sælg din enhed
        </Link>
        <Link href={'/om-os'} className="button-navbar">
          Om os
        </Link>
        <Link href={'/kontakt-os'} className="button-navbar">
          Kontakt os
        </Link>
      </div>

      <DeviceSearchField />
    </nav>
  );
};

export default Navbar;
