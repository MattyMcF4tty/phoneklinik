import Navbar from '@/components/Navbar';
import SellDeviceForm from '@/components/SellDeviceForm';
import { getBrands } from '@/utils/supabase/brands';

export default async function SellPhonePage() {
  const brands = await getBrands();
  const brandsData = brands.map((brand) => brand.toPlainObject());

  return (
    <div className="bg-gray-100 h-full w-full">
                <Navbar/>

      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Sælg din enhed</h1>
        <p className="text-sm md:text-lg mb-6 md:w-1/2">
          Giv din telefon nyt liv og få penge på lommen. I stedet for, at din
          gamle iPhone ligger og samler støv i skuffen, så sælg den hellere til
          os og få betaling direkte. Uanset standen eller om den er defekt.
        </p>
        <p className="text-sm md:text-lg mb-6 md:w-1/2">
          Svar på nedenstående skema og så svarer vi tilbage hurtigst muligt!
        </p>
      </div>
      <div className="flex items-center justify-center w-full">
        <SellDeviceForm brands={brandsData} Titel="Sælg din enhed" />
      </div>
    </div>
  );
}
