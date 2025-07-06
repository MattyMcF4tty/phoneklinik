'use client';

import { contactPhoneKlinik } from '@/app/(pages)/kontakt-os/actions';
import { ActionResponse } from '@schemas/types';
import { useRouter } from 'next/navigation';
import React, { FC, useActionState, useEffect } from 'react';
import { toast } from 'sonner';

const ContactForm: FC = () => {
  const router = useRouter();
  const initialState: ActionResponse = {
    success: undefined,
    message: '',
  };

  const [state, formAction, pending] = useActionState(
    contactPhoneKlinik,
    initialState
  );

  useEffect(() => {
    if (pending === true) {
      toast.loading('Opdatere booking...', { id: 'update-booking' });
    } else {
      toast.dismiss('update-booking');

      if (state.success === true) {
        toast.success(state.message || 'Booking opdateret');
        router.refresh();
      } else if (state.success === false) {
        toast.error(state.message || 'Noget gik galt');
      }
    }
  }, [pending, state, router]);
  return (
    <form
      action={formAction}
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
        disabled={pending}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#12308b] via-[#1561c9] to-[#08a5f4] text-white font-medium hover:opacity-90 transition"
      >
        Send besked
      </button>
    </form>
  );
};

export default ContactForm;
