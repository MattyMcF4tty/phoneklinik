import LinkButton from "@/components/LinkButton";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ReparationPage() {
    return( 
    <div className="bg-gray-100 h-screen w-full">
          <Navbar/>
           {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
Reparation af dine enheder
        </h1>
        <p className="text-sm md:text-lg mb-6">
          Vi tilbyder reparation af telefoner, MacBooks og ipads til alle modeller på markedet.
        </p>
            </div>
          <div className="flex items-center justify-center w-full h-[40vh]">
           
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
          <div className="bg-white p-6 rounded shadow flex flex-col items-center">
            <img
              src="/iphone.jpg"
              alt="Reparation"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Reparation af Iphone</h3>
            <Link className="flex items-center justify-center w-1/2 h-10 bg-gradient-to-r from-main-purple to-main-blue text-white rounded" href={"/reparation/telefon-reparation"}>
            <button >
              Find din Iphone.
            </button>
            </Link>
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col items-center">
            <img
              src="/macbook.jpg"
              alt="Covers"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Reparation af MacBook</h3>
            <Link className="flex items-center justify-center w-1/2 h-10 bg-gradient-to-r from-main-purple to-main-blue text-white rounded" href={"/reparation/macbook-reparation"}>
            <button >
              Find din MacBook.
            </button>
            </Link>
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col items-center">
            <img
              src="/ipad.jpg"
              alt="Tilbehør"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Reparation af ipad</h3>
            <Link className="flex items-center justify-center w-1/2 h-10 bg-gradient-to-r from-main-purple to-main-blue text-white rounded" href={"/reparation/ipad-reparation"}>
            <button >
              Find din ipad.
            </button>
            </Link>          </div>
        </div>
        
          </div>
          </div>
);}
  