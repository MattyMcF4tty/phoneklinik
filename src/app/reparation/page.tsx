import Navbar from "@/components/Navbar";

export default function ReparationPage() {
    return( 
    <div className="bg-gray-100 h-screen w-full">
          <Navbar/>
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
           
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
          <a href='/reparation'>
            <img
              src="/Reparation.png"
              alt="Reparation"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Reparation</h3>
            </a>
            <p>
              Få din telefon eller MacBook repareret hurtigt og professionelt.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <img
              src="/cover.jpg"
              alt="Covers"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Covers</h3>
            <p>Beskyt din enhed med vores stilfulde covers.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <img
              src="/tilbehor.jpg"
              alt="Tilbehør"
              className="h-20 md:h-32 mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Tilbehør</h3>
            <p>Find tilbehør, der passer til din enhed.</p>
          </div>
        </div>
        
          </div>
          </div>
);}
  