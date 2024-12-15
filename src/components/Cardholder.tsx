import Image from 'next/image';
import Link from 'next/link';

interface cardProps {
  cardName: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
}

const Cardholder: React.FC<cardProps> = ({
  cardName,
  imageUrl,
  linkUrl,
  buttonText,
}) => {
  return (
    <div>
      <div className="bg-white p-6 rounded shadow flex flex-col items-center">
        <Image
          src={imageUrl}
          alt={cardName}
          width={0}
          height={0}
          sizes="100vw"
          className="h-20 md:h-32 w-auto mx-auto mb-4 relative"
        />

        <h3 className="font-semibold mb-2">{cardName}</h3>
        <Link
          className="flex items-center justify-center w-1/2 h-10 bg-gradient-to-r from-main-purple to-main-blue text-white rounded"
          href={linkUrl}
        >
          <button>{buttonText}</button>
        </Link>
      </div>
    </div>
  );
};
export default Cardholder;
