import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Om os</h1>
        <p className="text-sm md:text-lg mb-6">
          Hos PhoneKlinik sætter vi en ære i at levere førsteklasses service og
          kvalitetsprodukter til vores kunder.
        </p>
      </div>

      {/* About Section */}
      <div className="p-10 bg-white text-gray-800 flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Vores mission og værdier
        </h2>
        <p className="mb-4 text-center md:w-1/2">
          PhoneKlinik blev grundlagt med en vision om at hjælpe vores kunder med
          at få deres enheder tilbage i perfekt stand på en hurtig og pålidelig
          måde. Vi tilbyder ikke kun reparationer, men også et bredt udvalg af
          tilbehør, der kombinerer funktionalitet og design.
        </p>
        <p className="mb-4 text-center mt-16">
          Vi stræber efter at levere den bedste kundeoplevelse gennem:
        </p>
        <ul className="list-disc list-inside mx-auto max-w-3xl text-left">
          <li>Professionelle reparationer udført af eksperter.</li>
          <li>Kvalitetsprodukter, der beskytter og forbedrer din enhed.</li>
          <li>En dedikeret kundeservice, der altid er klar til at hjælpe.</li>
        </ul>
      </div>

      {/* Team Section */}
      <div className="p-10 bg-gray-100">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Mød vores team
        </h2>
        <p className="text-center mb-6">
          Vores team består af erfarne teknikere og passionerede medarbejdere,
          der er dedikeret til at levere den bedste service til dig.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <Image
              src={'/team_member_1.jpg'}
              alt={'Team Member'}
              className="w-24 h-24 rounded-full mx-auto mb-4"
              width={0}
              height={0}
              sizes="100vw"
            />
            <h3 className="font-semibold">Anna Jensen</h3>
            <p>Teknikchef</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <Image
              src={'/team_member_2.jpg'}
              alt={'Team Member'}
              className="w-24 h-24 rounded-full mx-auto mb-4"
              width={0}
              height={0}
              sizes="100vw"
            />
            <h3 className="font-semibold">Lars Nielsen</h3>
            <p>Kundeservicemedarbejder</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <Image
              src={'/team_member_3.jpg'}
              alt={'Team Member'}
              className="w-24 h-24 rounded-full mx-auto mb-4"
              width={0}
              height={0}
              sizes="100vw"
            />
            <h3 className="font-semibold">Sofie Pedersen</h3>
            <p>Produktansvarlig</p>
          </div>
        </div>
      </div>
    </div>
  );
}
