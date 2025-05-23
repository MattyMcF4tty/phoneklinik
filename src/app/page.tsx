'use client';

import LinkButton from '@/components/LinkButton';
import Navbar from '@/components/Navbar';
import VideoEmbed from '@/components/Video';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-100 h-full w-full">
      {/* Navbar */}
      <Navbar />

      <div className="relative md:h-[35vh] h-[30vh] flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Video Background */}
        <div className="w-full h-full bg-gradient-to-r from-main-purple to-main-blue flex items-center justify-center">
          <div className="text-white p-6 flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              Velkommen til PhoneKlinik
            </h1>
            <p className="text-sm md:text-lg mb-6">
              Vi tilbyder reparation af telefoner og MacBooks, samt salg af
              covers, opladere og andre telefonprodukter.
            </p>
            <LinkButton variant="default" url="/kontakt-os" className="w-1/2">
              Kontakt os
            </LinkButton>
          </div>
        </div>
      </div>

      <div className="h-[50vh] md:h-[56vh]">
        <VideoEmbed />
      </div>

      {/* Info Section */}
      <div className="p-10 text-center bg-gray-100">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Hvad kan vi hjælpe med?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <Link href="/reparation">
              <Image
                src="/Reparation.png"
                alt="Reparation"
                width={0}
                height={0}
                sizes="100vw"
                className="h-20 md:h-32 w-auto mx-auto mb-4"
              />
              <h3 className="font-semibold mb-2">Reparation</h3>
            </Link>
            <p>
              Få din telefon eller MacBook repareret hurtigt og professionelt.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Image
              src="/cover.jpg"
              alt="Covers"
              width={0}
              height={0}
              sizes="100vw"
              className="h-20 md:h-32 w-auto mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Covers</h3>
            <p>Beskyt din enhed med vores stilfulde covers.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Image
              src="/tilbehor.jpg"
              alt="Tilbehør"
              width={0}
              height={0}
              sizes="100vw"
              className="h-20 md:h-32 w-auto mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Tilbehør</h3>
            <p>Find tilbehør, der passer til din enhed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
