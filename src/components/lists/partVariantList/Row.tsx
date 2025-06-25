import DeleteVariantButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/DeleteVariantButton';
import UpdateVariantButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/UpdateVariantButton';
import PartVariant from '@schemas/partVariant';
import React, { FC, useState } from 'react';

interface PartVariantListRowProps extends React.HTMLAttributes<HTMLLIElement> {
  variant: PartVariant;
}

const PartVariantListRow: FC<PartVariantListRowProps> = ({
  variant,
  ...rest
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <li
      {...rest}
      onMouseOver={(e) => {
        setShowSettings(true);
        if (rest.onMouseOver) {
          rest.onMouseOver(e);
        }
      }}
      onMouseLeave={(e) => {
        setShowSettings(false);
        if (rest.onMouseLeave) {
          rest.onMouseLeave(e);
        }
      }}
    >
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">{variant.name}</p>
          {variant.description !== '' ? (
            <p className="text-xs text-gray-400">{variant.description}</p>
          ) : (
            <p className=" text-red-500">Mangler beskrivelse!</p>
          )}
        </div>
        <p>{variant.price} kr</p>
      </div>

      {showSettings && (
        <div className="flex flex-row w-full gap-2">
          <UpdateVariantButton variant={variant} />
          <DeleteVariantButton variant={variant} />
        </div>
      )}
    </li>
  );
};

export default PartVariantListRow;
