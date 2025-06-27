import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ContactForm from '@/components/forms/ContactForm';

export default function ContactUs() {
  return (
    <div className="bg-gray-50 min-h-screen w-full relative overflow-x-hidden">
      {/* ---------- Gradient hero with wave ---------- */}
      <header className="relative h-[42vh] bg-gradient-to-r from-[#12308b] via-[#1561c9] to-[#08a5f4] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Kontakt os
        </h1>
        <p className="text-white text-base md:text-lg opacity-90">
          Har du spørgsmål? Vi er her for at hjælpe!
        </p>

        {/* decorative bottom wave */}
        <svg
          className="absolute -bottom-px w-full h-24 text-gray-50"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,192L60,170.7C120,149,240,107,360,90.7C480,75,600,85,720,117.3C840,149,960,203,1080,202.7C1200,203,1320,149,1380,122.7L1440,96V320H0Z"
          />
        </svg>
      </header>

      {/* ---------- Floating info card ---------- */}
      <section className="max-w-3xl mx-auto -mt-5 px-6">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-full md:w-44">
            <Image
              src="/butik.jpg"
              alt="Butik"
              width={400}
              height={300}
              className="rounded-xl w-full object-cover"
            />
          </div>

          <div className="flex-1 text-gray-800">
            <h3 className="text-lg font-bold mb-1">Adresse:</h3>
            <p className="mb-4">Kalvebod Brygge 59, København</p>

            <h3 className="text-lg font-bold mb-1">Åbningstider:</h3>
            <ul className="mb-4 space-y-1">
              <li className="flex justify-between">
                <span>Mandag – Fredag</span>
                <span>10:00 – 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Lørdag</span>
                <span>10:00 – 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Søndag</span>
                <span>10:00 – 20:00</span>
              </li>
            </ul>

            <h3 className="text-lg font-bold mb-1">Kontakt:</h3>
            <p className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-[#1561c9] size-5"
              />
              +45 22 55 66 67
            </p>
            <p className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-[#1561c9] size-5"
              />
              info@phoneklinik.dk
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Form card ---------- */}
      <section className="max-w-xl mx-auto mt-14 px-6 pb-24">
        <h2 className="text-center text-2xl font-bold mb-6">Skriv til os</h2>
        <ContactForm />
      </section>
    </div>
  );
}
