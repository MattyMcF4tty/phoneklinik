import Cardholder from '@/components/Cardholder';
import Navbar from '@/components/Navbar';
import { getBrands } from '@/utils/supabase/brands';

export const revalidate = 86400; // Revalidate every 24 hours (in seconds)

const ReparationPage = async () => {
  const brands = await getBrands();
  return (
    <div className="bg-gray-100 min-h-screen h-full w-full">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Reparation af dine enheder
        </h1>
        <p className="text-sm md:text-lg mb-6">
          Vi tilbyder reparation af telefoner, MacBooks, ipads og smartwatches
          til alle modeller på markedet.
        </p>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
          {brands.map((brand) => (
            <Cardholder
              key={brand.id}
              cardName={brand.name}
              imageUrl={brand.image_url}
              linkUrl={`/reparation/${brand.name
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
              buttonText={`Find dit ${brand.name} produkt`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ReparationPage;
