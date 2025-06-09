import YoutubeVideo from '@/components/YoutubeVideo';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white flex flex-col grow w-full shadow-lg rounded-md">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 gap-10">
        {/* Text content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Velkommen til PhoneKlinik
          </h1>
          <p className="text-md md:text-xl text-gray-600 mb-8">
            Vi tilbyder reparation af telefoner og MacBooks, samt salg af
            covers, opladere og andre telefonprodukter.
          </p>
          <div className="flex justify-center md:justify-start">
            <Link className="button-highlighted" href="/kontakt-os">
              Kontakt os
            </Link>
          </div>
        </div>

        {/* Video */}
        <div className="w-full md:w-1/2 max-w-2xl aspect-video rounded-xl overflow-hidden">
          <YoutubeVideo
            videoId="9Vjfxn5soBs"
            options={{
              autoplay: '1',
              mute: '1',
              loop: '1',
              playlist: '9Vjfxn5soBs',
              controls: '0',
              modestbranding: '1',
              rel: '0',
              fs: '0',
              disablekb: '1',
              playsinline: '1',
            }}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-10 text-center bg-gray-100">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Hvad kan vi hjælpe med?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <Link href="/reparation">
              <Image
                src="/Reparation.png"
                alt="Reparation"
                width={0}
                height={0}
                sizes="100vw"
                className="h-20 md:h-32 w-auto mx-auto mb-4"
              />
              <h3 className="font-semibold mb-2">Reparation</h3>
            </Link>
            <p>
              Få din telefon eller MacBook repareret hurtigt og professionelt.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Image
              src="/cover.jpg"
              alt="Covers"
              width={0}
              height={0}
              sizes="100vw"
              className="h-20 md:h-32 w-auto mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Covers</h3>
            <p>Beskyt din enhed med vores stilfulde covers.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Image
              src="/tilbehor.jpg"
              alt="Tilbehør"
              width={0}
              height={0}
              sizes="100vw"
              className="h-20 md:h-32 w-auto mx-auto mb-4"
            />
            <h3 className="font-semibold mb-2">Tilbehør</h3>
            <p>Find tilbehør, der passer til din enhed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
