'use server';

import { BrandClient } from '@lib/clients/brandClient';
import React, { FC } from 'react';

const BrandSelect: FC<React.SelectHTMLAttributes<HTMLSelectElement>> = async ({
  ...rest
}) => {
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
