'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="w-full flex flex-col grow items-center justify-center">
      <div className="relative w-full h-24 aspect-square">
        <Image
          src={'/brokenMobile.png'}
          alt="Broken mobile"
          fill
          className="object-contain"
        />
      </div>

      <div className="w-full mb-8 mt-2 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold">Beklager noget gik galt</h2>
        <p className="mt-2 text-gray-600 italic">{error.message}</p>
      </div>

      <div className="w-full flex flex-row items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-black text-white rounded h-full"
        >
          Prøv igen
        </button>
        <Link href="/">Til forsiden</Link>
      </div>
    </div>
  );
}
