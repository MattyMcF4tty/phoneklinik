import Cardholder from "@/components/Cardholder";
import Navbar from "@/components/Navbar";
import { decodeUrlSpaces } from "@/utils/misc";
import { queryDeviceName, queryDevices } from "@/utils/supabase/devices";



export default async function TelefonReparationPage({ params }: any) {
  const { brand, model, version } = await params;
  const device = await queryDeviceName(`${model} ${decodeUrlSpaces(version)}`)
  if (!device ){
    throw new Error("device does not exist")
  }
  await device.fetchParts()

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Reparation af {}
        </h1>
        <p className="text-sm md:text-lg mb-6">
          Find din iPhone-model og få din enhed repareret hurtigt og sikkert.
        </p>
      </div>

      {/* iPhone Models Section */}
      <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
      {device.parts && device.parts.map((part) => (
        <div key={part.id}>
          
          {part.name}
          {part.price}
        </div>
      ))}   
                    </div>
      </div>
    </div>
  );
}
