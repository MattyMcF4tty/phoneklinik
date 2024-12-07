import Cardholder from '@/components/Cardholder';
import Navbar from '@/components/Navbar';
import { getModels } from '@/utils/supabase/models';

interface Context {
  params: Promise<{ brand: string }>;
}

export default async function TelefonReparationPage({ params }: Context) {
  const { brand } = await params;
  const models = await getModels(brand);
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Reparation af {brand} produkter
        </h1>
        <p className="text-sm md:text-lg mb-6">
          Find dit {brand} produkt og få din enhed repareret hurtigt og sikkert.
        </p>
      </div>

      {/* iPhone Models Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
          {models.map((model) => (
            <Cardholder
              key={model.id}
              cardName={model.name}
              imageUrl={model.image_url}
              linkUrl={`/reparation/${brand.toLowerCase()}/${model.name.toLowerCase()}`}
              buttonText={`Find dit ${model.name} produkt`}
            />
          ))}{' '}
        </div>
      </div>
    </div>
  );
}
