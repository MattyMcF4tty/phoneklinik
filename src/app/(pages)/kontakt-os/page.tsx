import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ContactForm from '@/app/(pages)/kontakt-os/components/ContactForm';
import WaveHeader from '@components/headers/WaveHeader';

export default function ContactUs() {
  return (
    <div className="bg-gray-50 min-h-screen w-full relative overflow-x-hidden">
      <WaveHeader
        title="Kontakt os"
        subtitle="Har du spørgsmål? Vi er her for at hjælpe!"
      />

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
