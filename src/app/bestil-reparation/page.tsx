import LinkButton from "@/components/LinkButton";
import Navbar from "@/components/Navbar";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function ReparationPage() {
    return( 
    <div className="bg-gray-100 h-screen w-full">
          <Navbar/>
          <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[50vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Bestil tid til din reparation her!
        </h1>
        <p className="text-sm md:text-lg mb-6">
        Bestil nemt via formularen nedenfor, eller giv os et kald. Betaling sker først efter reparationen, og vi tager både MobilePay og kort. Uanset hvor du bor, står vi klar til at hjælpe.
                </p>
                <div className="flex flex-row">
  <LinkButton variant="default" url="" className="mr-4">
    Bestil tid i butik
    
    <FontAwesomeIcon icon={faHouse} style={{ fontSize: '16px' }} />
  </LinkButton>
  <LinkButton variant="default" url="">
    Send med posten
  </LinkButton>
</div>

      </div>
          </div>
);}
  