'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import LinkButton from '@/components/LinkButton';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-100 h-screen w-screen">
      {/* Navbar */}
      <div className="bg-white flex items-center justify-between px-4 md:px-10 py-4 w-full">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/phoneklinik.jpg"
            width={150}
            height={150}
            alt="logo"
            className="md:w-26" // Adjust the size for larger screens
          />
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex flex-row items-center">
          <input
            type="text"
            className="block w-full h-10 p-2 text-gray-900 bg-gray-50 rounded border border-gray-300 mr-2"
            placeholder="Find din enhed..."
          />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
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
            <LinkButton buttonText="Reparation" variant={'navbar'} url="" />
            <LinkButton buttonText="Sælg din enhed" variant={'navbar'} url="" />
            <LinkButton buttonText="Om os" variant={'navbar'} url="" />
            <LinkButton buttonText="Kontakt os" variant={'navbar'} url="" />
          </div>
          <div className="flex items-center space-x-2 w-2/5">
            <input
              type="text"
              className="block w-full h-10 p-2 text-gray-900 bg-gray-50 rounded border border-gray-300"
              placeholder="Find din enhed..."
            />
            <LinkButton
              buttonText="Bestil reparation"
              variant={'navbar2'}
              url=""
            />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="bg-white flex flex-col items-center space-y-4 p-4 md:hidden">
          <LinkButton buttonText="Reparation" variant={'navbar'} url="" />
          <LinkButton buttonText="Sælg din enhed" variant={'navbar'} url="" />
          <LinkButton buttonText="Om os" variant={'navbar'} url="" />
          <LinkButton buttonText="Kontakt os" variant={'navbar'} url="" />

          {/* Search Input & "Bestil Reparation" in Mobile Menu */}
          <div className="flex flex-col items-center w-full md:flex-row md:items-center mt-4">
            <LinkButton
              buttonText="Bestil reparation"
              variant={'navbar2'}
              url=""
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[60vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Velkommen til PhoneKlinik
        </h1>
        <p className="text-sm md:text-lg mb-6">
          Vi tilbyder reparation af telefoner og MacBooks, samt salg af covers,
          opladere og andre telefonprodukter.
        </p>
        <LinkButton buttonText="Kontakt os" variant={'default'} url="" />
      </div>

      {/* Info Section */}
      <div className="p-10 text-center bg-gray-100">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Hvad kan vi hjælpe med?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <img
              src="/screen-repair.jpg"
              alt="Reparation"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Reparation</h3>
            <p>
              Få din telefon eller MacBook repareret hurtigt og professionelt.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <img
              src="/covers.jpg"
              alt="Covers"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Covers</h3>
            <p>Beskyt din enhed med vores stilfulde covers.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <img
              src="/chargers.jpg"
              alt="Tilbehør"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Tilbehør</h3>
            <p>Find tilbehør, der passer til din enhed.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 text-center">
        <p>&copy; 2024 PhoneKlinik. Alle rettigheder forbeholdt.</p>
        <p>
          Kontakt os:{' '}
          <a href="mailto:info@phoneklinik.dk" className="underline">
            info@phoneklinik.dk
          </a>
        </p>
      </footer>
    </div>
  );
}
