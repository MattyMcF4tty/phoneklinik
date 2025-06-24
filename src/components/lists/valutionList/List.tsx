'use client';

import ValuationRequest from '@schemas/valuationRequest';
import React, { FC, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import ValuationListRow from './Row';

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
