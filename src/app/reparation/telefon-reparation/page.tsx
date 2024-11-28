import Navbar from "@/components/Navbar";

const iphoneModels = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15",
  // Tilføj flere modeller her
];

export default function TelefonReparationPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Reparation af iPhones
        </h1>
        <p className="text-sm md:text-lg mb-6">
          Find din iPhone-model og få din enhed repareret hurtigt og sikkert.
        </p>
      </div>

      {/* iPhone Models Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {iphoneModels.map((model, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow text-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={`/iphone-images/${model.toLowerCase().replace(/ /g, "-")}.jpg`}
                alt={model}
                className="h-24 mx-auto mb-4"
              />
              <h3 className="font-semibold"><button className="w-1/2 h-10 bg-gradient-to-r from-main-purple to-main-blue text-white rounded"> se priser </button></h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
