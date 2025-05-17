import Image from 'next/image';
import React, { FC } from 'react';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <nav className="w-full bg-white shadow-lg h-16 flex flex-row fixed top-0 z-50">
      <div className="relative h-full w-40 aspect-square ">
        <Image
          className="object-contain "
          src={'/phoneklinik.jpg'}
          alt="PhoneKlinik"
          fill
        />
      </div>
    </nav>
  );
};

export default Navbar;
