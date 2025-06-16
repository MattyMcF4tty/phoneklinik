import ValuationRequest from '@schemas/valuationRequest';
import Link from 'next/link';
import React, { FC } from 'react';

interface ValuationListRowProps {
  valuation: ValuationRequest;
}

const ValuationListRow: FC<ValuationListRowProps> = ({ valuation }) => {
  return (
    <li className="w-full rounded-md bg-white shadow-md h-10 px-2">
      <Link
        className="w-full h-full flex items-center"
        href={`/admin/brugtsalg/${valuation.id}`}
      >
        <span className="border-r pr-2 mr-2 text-subtle text-sm">
          {valuation.id}
        </span>
        <div className="w-full h-full flex items-center justify-between">
          <span>{valuation.deviceName}</span>
          <span className="italic">
            {new Date(valuation.createdAt).toLocaleString('da-DK', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default ValuationListRow;
