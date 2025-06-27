import { NextPage } from 'next';

interface PageProps {}

const Page: NextPage<PageProps> = async ({}) => {
  return (
    <div className="w-full flex grow items-center justify-center">
      <p>Booking findes ikke.</p>
    </div>
  );
};

export default Page;
