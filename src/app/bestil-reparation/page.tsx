import Navbar from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import OrderRepair from '@/components/repairFormWithContext/OrderRepair2';
import Image from 'next/image';
import { getBrands } from '@/utils/supabase/brands';
import PartSelect from '@/components/repairFormWithContext/PartSelect';
import RepairFormProvider from '@/components/repairFormWithContext/RepairFormProvider';

export default async function ReparationPage() {
  const brands = (await getBrands()).map((brand) => ({ ...brand }));

  return (
    <div className="bg-gray-100 h-full w-full md:mb-20 mb-6">
      <Navbar />

      <div className="flex flex-col items-center justify-center">
        <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white min-h-[25vh] w-full flex flex-col justify-center items-center text-center px-6">
          <p>
            Du kan altid komme ind i en af vores butikker uden tidsbestilling og
            få repararet din enhed. Vi har 95% af alle reservedele på lager, og
            kan i de fleste tilfælde reparere din enhed mens du venter. Hvis du
            vil være helt sikker, kan du bestille en tid.
          </p>
        </div>
        <h1 className="mt-6 mb-8 text-3xl font-bold text-gray-700">
          PhoneKlinik København
        </h1>
      </div>
      <div className="flex md:flex-row flex-col md:items-start h-full justify-center  items-center">
        {/* Info Box */}
        <div className="flex flex-col bg-white rounded-lg shadow-md p-4 md:w-1/5 w-[18rem]  md:ml-0 mt-4">
          {/* Billede */}
          <Image
            src={'/butik.jpg'}
            alt={'billede'}
            className="w-full h-48 object-cover rounded-t-lg"
            width={150}
            height={400}
          />
          {/* Tekst */}
          <div className="mt-4">
            <h2 className="text-lg font-bold text-gray-800">Adresse:</h2>
            <p className="text-gray-600 mt-2">Kalvebod Brygge 59 København</p>
            <h2 className="mt-6 text-lg font-bold text-gray-800">
              Åbningstider:
            </h2>
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
            <div className="flex flex-col mt-2">
              <h2 className="mt-6 text-lg font-bold text-gray-800 mb-4">
                Kontakt:
              </h2>
              <div className="flex flex-row">
                <FontAwesomeIcon icon={faPhone} className="w-[20px]" />
                <p className="text-gray-600 ml-4">+45 22 55 66 67</p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FontAwesomeIcon icon={faEnvelope} className="mr-4 w-[20px]" />
              <p className="text-gray-600">phoneklinik@icloud.com</p>
            </div>
          </div>
        </div>
        {/* Form Box */}
        <RepairFormProvider deviceData={undefined}>
          <div className="px-10 mt-10">
            <PartSelect />
          </div>
          <OrderRepair brands={brands} />
        </RepairFormProvider>
        <form></form>
      </div>
    </div>
  );
}
