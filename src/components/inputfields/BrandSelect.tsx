'use server';

import { BrandClient } from '@lib/clients/brandClient';
import React, { FC } from 'react';

interface BrandSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const BrandSelect: FC<BrandSelectProps> = async ({ ...rest }) => {
  const brands = await BrandClient.query();
  return (
    <select {...rest}>
      {brands.map((brand) => (
        <option key={brand.name} value={brand.name}>
          {brand.name}
        </option>
      ))}
    </select>
  );
};

export default BrandSelect;
