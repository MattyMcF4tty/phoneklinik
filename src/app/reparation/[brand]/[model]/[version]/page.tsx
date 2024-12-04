import Cardholder from "@/components/Cardholder";
import LinkButton from "@/components/LinkButton";
import Navbar from "@/components/Navbar";
import OrderRepair from "@/components/OrderRepair";
import { decodeUrlSpaces } from "@/utils/misc";
import { queryDeviceName } from "@/utils/supabase/devices";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function TelefonReparationPage({ params }: any) {
  const { brand, model, version } = await params;
  const device = await queryDeviceName(`${model} ${decodeUrlSpaces(version)}`);
  if (!device) {
    throw new Error("device does not exist");
  }
  await device.fetchParts();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <div className="flex w-full max-w-4xl items-center space-x-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src={device.iconUrl}
              alt={model}
              className="h-full object-contain max-h-48"
            />
          </div>

          {/* Text */}
          <div className="flex-grow">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-start">
              {model} {decodeUrlSpaces(version)} reparation
            </h1>
            <p className="text-sm md:text-lg mb-6 text-start">
              Har du brug for {model} {decodeUrlSpaces(version)} reparation, kan du få hjælp hos PhoneKlinik. PhoneKlinik tilbyder skærmskift af {model} {decodeUrlSpaces(version)} samt udskiftning af batteri og reparation af andre reservedele. Vi har hos PhoneKlinik mere end 2 års erfaring, så du kan trygt overlade reparationen af din {model}{" "}
              {decodeUrlSpaces(version)} til os. Besøg os i dag.
            </p>
          </div>
        </div>
      </div>

      {/* Info Boxes Section */}
      <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-6 p-6">
         {/* Pricing Section */}
         <div className=" bg-white rounded-lg shadow-md p-6 flex flex-col w-full mt-4 md:w-1/3">
          <h1 className="text-xl font-bold mb-6">Priser på {model} {decodeUrlSpaces(version)} reparation</h1>
          {device.parts && device.parts.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {device.parts.map((part) => (
                <div
                  key={part.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{part.name}</span>
                  <span className="font-bold">{part.price} kr.</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Ingen dele fundet til denne enhed.</p>
          )}
        </div>
        <div>
      <OrderRepair/>
      </div>
       
      </div>
    </div>
  );
}
