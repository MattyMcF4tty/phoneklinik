import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen w-full shadow-md rounded-md">
      {/* --- Intro / Hero --------------------------------------------------- */}
      <section className="flex flex-col items-center text-center px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          Om os
        </h1>

        <p className="text-base md:text-lg text-gray-600 mb-10">
          Hos PhoneKlinik er vi specialister i at reparere alle typer
          smartphones og tablets. Uanset om du skal have skiftet skærmen på din
          iPhone, udskiftet batteriet på din Samsung eller repareret en ødelagt
          ladeport, står vi klar til at hjælpe dig hurtigt og effektivt.
        </p>

        <Link
          href="/kontakt-os"
          className="w-48 h-10 flex items-center justify-center rounded-md bg-gradient-to-r from-main-purple to-main-blue text-white"
        >
          Kontakt os
        </Link>
      </section>

      {/* --- Services ------------------------------------------------------- */}
      <section className="px-6 md:px-10 py-16 bg-blue-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Vores ydelser inkluderer
        </h2>

        <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Service */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Skærmreparation</h3>
            <p className="text-sm text-gray-600">
              Udskiftning af ødelagte skærme på både iPhone, Android og andre
              mærker.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Batteriudskiftning</h3>
            <p className="text-sm text-gray-600">
              Giv din telefon nyt liv med et frisk batteri.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Ladeproblemer</h3>
            <p className="text-sm text-gray-600">
              Få din enhed til at oplade igen – uanset om det er porten eller
              noget andet, der driller.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Vand- og væskeskader</h3>
            <p className="text-sm text-gray-600">
              Redning af din telefon, hvis den har været udsat for væske.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Reparation af kamera &amp; højtaler
            </h3>
            <p className="text-sm text-gray-600">
              Udskiftning eller reparation af defekte komponenter – fuld
              funktionalitet tilbage.
            </p>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us -------------------------------------------------- */}
      <section className="px-6 md:px-10 py-20 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Hvorfor vælge os?
        </h2>

        <ul className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2 text-sm text-gray-700">
          <li>
            <span className="font-semibold">Hurtig reparationstid:</span> De
            fleste reparationer udføres på stedet og er færdige inden for få
            timer.
          </li>
          <li>
            <span className="font-semibold">Kvalitet &amp; pålidelighed:</span>{' '}
            Vi bruger kun dele af høj kvalitet og giver garanti på alle
            reparationer.
          </li>
          <li>
            <span className="font-semibold">Erfarne teknikere:</span> Vores team
            har mange års erfaring og følger altid de nyeste teknikker.
          </li>
          <li>
            <span className="font-semibold">Konkurrencedygtige priser:</span>{' '}
            Fair, transparente priser – du ved præcis, hvad du betaler for.
          </li>
        </ul>
      </section>
    </div>
  );
}
