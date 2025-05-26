
import SellDeviceForm from '@/components/SellDeviceForm';
import DeviceClient from '@/lib/clients/deviceClient';

export default async function SellPhonePage() {
  const brands = await DeviceClient.getUniqueBrands();

  return (
    <div className="bg-gray-50 min-h-screen items-center justify-center align-middle flex flex-col w-full relative overflow-x-hidden">

     

      <section className="max-w-3xl mx-auto  px-6">
        <div className="bg-white rounded-2xl shadow-md px-8 py-12 flex flex-col md:flex-row gap-8 items-center">
          {/* text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sælg din enhed
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Giv din telefon nyt liv og sælg den til os. I stedet for at din
              gamle iPhone ligger og samler støv i skuffen, så sælg den hellere
              til os og få en fair pris – uanset stand og alder på enheden.
            </p>
            <p className='mt-4 text-gray-600'>Svar på nedenstående skema og så vender vi tilbage hurtigst muligt.</p>
           
          </div>

          {/* simple icon */}
          <div className=" md:block">
            <svg
              width="80"
              height="120"
              viewBox="0 0 60 90"
              fill="none"
              stroke="#1661c9"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <rect x="6" y="3" width="48" height="84" rx="6" />
              <line x1="20" y1="12" x2="40" y2="12" />
              <circle cx="45" cy="52" r="11" />
              <text
                x="45"
                y="57"
                textAnchor="middle"
                fontSize="12"
                fill="#1661c9"
                fontWeight="600"
              >
                kr
              </text>
            </svg>
          </div>
        </div>
      </section>   

        {/*   <div className="p-6">
            <SellDeviceForm brands={brands} Titel="Sælg din enhed" />
          </div> */}
    </div>
  );
}
