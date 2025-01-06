import Navbar from '@/components/Navbar';

export default function AboutUs() {
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Om os</h1>
        <p className="text-sm md:text-lg mb-6 w-1/2">
          Hos PhoneKlinik er vi specialister i at reparere alle typer
          smartphones og tablets. Uanset om du har brug for at få skiftet
          skærmen på din iPhone, udskiftet batteriet på din Samsung, eller
          repareret en ødelagt ladeport, er vi her for at hjælpe dig hurtigt og
          effektivt.
        </p>
      </div>

      {/* About Section */}
      <div className="p-10 bg-white text-gray-800 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Vores ydelser inkluderer:
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Skærmreparation</h3>
            <p className="text-sm text-gray-600">
              Vi udskifter ødelagte skærme på både iPhone, Android og andre
              mærker.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Batteriudskiftning</h3>
            <p className="text-sm text-gray-600">
              Giver din telefon nyt liv med et nyt batteri.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ladeproblemer</h3>
            <p className="text-sm text-gray-600">
              Får din telefon til at oplade igen, uanset om det er porten eller
              noget andet, der er problemet.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Vand- og væskeskader</h3>
            <p className="text-sm text-gray-600">
              Vi hjælper med at redde din telefon, hvis den er blevet udsat for
              væske.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Reparation af kamera og højtaler
            </h3>
            <p className="text-sm text-gray-600">
              Vi reparerer eller udskifter defekte komponenter, så du får fuld
              funktionalitet tilbage.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">Hvorfor vælge os?</h3>
          <ul className="text-sm text-gray-600 space-y-4">
            <li>
              <span className="font-bold">Hurtig reparation:</span> De fleste
              reparationer udføres på stedet og er færdige inden for få timer.
            </li>
            <li>
              <span className="font-bold">Kvalitet og pålidelighed:</span> Vi
              bruger kun dele af høj kvalitet, og vi tilbyder garanti på alle
              reparationer.
            </li>
            <li>
              <span className="font-bold">Erfarne teknikere:</span> Vores
              tekniske team har mange års erfaring med telefonreparationer, og
              vi holder os opdateret med de nyeste teknologier og
              reparationsteknikker.
            </li>
            <li>
              <span className="font-bold">Konkurrencedygtige priser:</span> Vi
              tilbyder fair og transparente priser, så du ved præcis, hvad du
              betaler for.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
