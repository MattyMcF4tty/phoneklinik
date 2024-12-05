import Cardholder from '@/components/Cardholder';
import Navbar from '@/components/Navbar';
import { queryDevices } from '@/utils/supabase/devices';

interface Context {
  params: Promise<{ brand: string; model: string }>;
}

export default async function TelefonReparationPage({ params }: Context) {
  const { brand, model } = await params;
  const devices = await queryDevices({ brand: brand, model: model });
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Reparation af {model}
        </h1>
        <p className="text-sm md:text-lg mb-6">
          Find din {model} og få din enhed repareret hurtigt og sikkert.
        </p>
      </div>

      {/* iPhone Models Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
          {devices.map((device) => (
            <Cardholder
              key={device.id}
              cardName={`${device.model} ${device.version}`}
              imageUrl={device.image_url}
              linkUrl={`/reparation/${device.brand.toLowerCase()}/${device.model.toLowerCase()}/${device.version.toLowerCase()}`}
              buttonText={`Find dit ${device.model} produkt`}
            />
          ))}{' '}
        </div>
      </div>
    </div>
  );
}
