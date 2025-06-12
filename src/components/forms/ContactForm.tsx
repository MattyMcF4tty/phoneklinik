import { contactPhoneKlinik } from '@/app/(pages)/kontakt-os/actions';
import React, { FC } from 'react';

const ContactForm: FC = () => {
  return (
    <form
      action={contactPhoneKlinik}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-5"
    >
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Navn"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1561c9]"
      />
      <input
        type="email"
        name="email"
        id="email"
        placeholder="E-mail"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1561c9]"
      />
      <input
        type="tel"
        name="phoneNumber"
        id="phoneNumber"
        placeholder="Telefon"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1561c9]"
      />
      <textarea
        name="message"
        id="message"
        placeholder="Besked"
        className="w-full h-32 border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#1561c9]"
      />
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#12308b] via-[#1561c9] to-[#08a5f4] text-white font-medium hover:opacity-90 transition"
      >
        Send besked
      </button>
    </form>
  );
};

export default ContactForm;
