'use client';

import ValuationRequest from '@schemas/valuationRequest';
import React, { FC, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import Link from 'next/link';

/* --- LIST --- */
interface ValuationListProps {
  important?: boolean;
  title: string;
  valuationRequests: ValuationRequest[];
}

const ValuationList: FC<ValuationListProps> = ({
  important = false,
  title,
  valuationRequests,
}) => {
  const requestCount = valuationRequests.length;
  const [collapse, setCollapse] = useState(!(important && requestCount > 0));

  return (
    <div
      className={`w-full h-fit overflow-hidden rounded-md border ${
        important && requestCount > 0
          ? 'border-orange-300 shadow-sm shadow-orange-300'
          : ''
      }`}
    >
      {/* Title */}
      <div className={`w-full flex justify-between bg-white h-12 items-center`}>
        <div className="flex items-center">
          <button
            className="w-12 px-4 h-full flex justify-center items-center"
            onClick={() => {
              setCollapse(!collapse);
            }}
          >
            <FaChevronUp
              className={`text-black duration-150 h-full w-full ${
                collapse ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
          <h1 className="text-title">{title}</h1>
        </div>
        <span className="pr-4">{requestCount}</span>
      </div>

      {/* Rows */}
      <ul
        className={`p-2 bg-slate-100 gap-4 shadow-inner ${
          collapse ? 'hidden' : 'flex flex-col'
        }`}
      >
        {requestCount ? (
          valuationRequests.map((request) => (
            <ValuationListRow key={request.id} valuation={request} />
          ))
        ) : (
          <p className="place-self-center">Ingen anmodninger fundet</p>
        )}
      </ul>
    </div>
  );
};

export default ValuationList;

/* --- ROW --- */
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
