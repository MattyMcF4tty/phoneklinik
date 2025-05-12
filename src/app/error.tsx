'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    toast.error(error.message || 'En uventet fejl opstod');
  }, [error]);

  return (
    <html>
      <body>
        <div className="p-6">
          <h2 className="text-2xl font-bold">Noget gik galt</h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            Prøv igen
          </button>
          <Link href="/">Til forsiden</Link>
        </div>
      </body>
    </html>
  );
}
