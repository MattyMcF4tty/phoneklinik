import { NextPage } from 'next';
import { GiAutoRepair } from 'react-icons/gi';

const MaintenancePage: NextPage = () => {
  return (
    <div className="flex grow w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <GiAutoRepair className="w-fit h-60" />
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <p className="text-lg">
          The site is currently undergoing maintenance. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
