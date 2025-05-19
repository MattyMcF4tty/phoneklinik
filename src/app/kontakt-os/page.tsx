'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { sendMail } from '@/utils/misc';
import { FormEvent } from 'react';

export default function ContactUs() {
  async function handleContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Fix typo

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('tel') as string;
    const message = formData.get('message') as string;

    await sendMail(
      `User Question from ${name}`,
      `Message: ${message}\n\nEmail: ${email}\nPhone: ${phone}`
    );

    alert('Tak for din besked! Vi vender tilbage så hurtigt som muligt.');
    e.currentTarget.reset(); // Reset form after submission
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full">
     

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Kontakt os</h1>
        <p className="text-sm md:text-lg">
          Har du spørgsmål? Vi er her for at hjælpe!
        </p>
      </div>

      {/* Contact Section */}
      <div className="p-10 bg-white text-gray-800">
        <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">
          Kontaktinformation
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex flex-col bg-white rounded-lg shadow-md p-6 md:w-1/3">
            <Image
              src={'/butik.jpg'}
              alt={'billede'}
              className="w-full h-48 object-cover rounded-lg mb-4"
              width={600}
              height={10}
            />
            <h3 className="text-lg font-bold text-gray-800">Adresse:</h3>
            <p className="text-gray-600 mb-4">Kalvebod Brygge 59, København</p>
            <h3 className="text-lg font-bold text-gray-800">Åbningstider:</h3>
            <div className="flex flex-row justify-between">
              <p className="text-gray-600 mt-2">Mandag-Fredag</p>
              <p className="text-gray-600 mt-2">10:00 - 20:00</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-gray-600 mt-2">Lørdag</p>
              <p className="text-gray-600 mt-2">10:00 - 20:00</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-gray-600 mt-2">Søndag</p>
              <p className="text-gray-600 mt-2">10:00 - 20:00</p>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mt-6">Kontakt:</h3>
            <div className="flex items-center mt-2">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-main-purple w-5 mr-2"
              />
              <p className="text-gray-600">+45 22 55 66 67</p>
            </div>
            <div className="flex items-center mt-2">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-main-purple w-5 mr-2"
              />
              <p className="text-gray-600">info@phoneklinik.dk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-10 bg-gray-50">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Skriv til os
        </h2>
        <form
          onSubmit={handleContact}
          className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 mx-auto"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Navn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-purple"
              placeholder="Indtast dit navn"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-purple"
              placeholder="Indtast din e-mail"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telefon
            </label>
            <input
              type="tel"
              id="tel"
              name="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-purple"
              placeholder="Indtast din e-mail"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Besked
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-purple"
              placeholder="Skriv din besked her"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-main-purple text-white py-2 rounded-lg hover:bg-main-blue focus:outline-none focus:ring-2 focus:ring-main-blue"
          >
            Send besked
          </button>
        </form>
      </div>
    </div>
  );
}
