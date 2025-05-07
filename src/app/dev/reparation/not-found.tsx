import { NextPage } from 'next';
import Link from 'next/link';

interface PageProps {}

const Page: NextPage<PageProps> = async ({}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 – Siden blev ikke fundet</h1>
      <p className="mb-6">Den side, du leder efter, findes ikke.</p>
      <Link href="/" className="text-blue-600 underline">
        Gå til forsiden
      </Link>
    </div>
  );
};

export default Page;
