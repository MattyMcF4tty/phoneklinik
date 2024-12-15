import Navbar from '@/components/Navbar';
import OrderRepair from '@/components/OrderRepair';
import { getBrands } from '@/utils/supabase/brands';

export default async function SellPhonePage() {
  const brands = (await getBrands()).map((brand) => ({ ...brand }));
  return (
    <div className="bg-gray-100 h-screen w-full">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Sælg din enhed</h1>
        <p className="text-sm md:text-lg mb-6 w-1/2">
          Giv din telefon nyt liv og få penge på lommen. I stedet for, at din
          gamle iPhone ligger og samler støv i skuffen, så sælg den hellere til
          os og få betaling direkte. Uanset standen eller om den er defekt.
        </p>
        <p>
          Svar på nedenstående skema og så svarer vi tilbage hurtigst muligt!
        </p>
      </div>
      <div className="flex items-center justify-center w-full">
        {<OrderRepair brands={brands} Titel="Sælg din enhed" />}
      </div>
    </div>
  );
}
