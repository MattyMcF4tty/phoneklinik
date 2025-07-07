import DevicePart from '@schemas/devicePart';
import PartVariant from '@schemas/partVariant';
import React, { FC, FormHTMLAttributes } from 'react';

interface PartVariantFormProps
  extends React.DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  partId: DevicePart['id'];
  defaultVariant?: PartVariant;
  buttonText?: string;
  loading?: boolean;
}

const PartVariantForm: FC<PartVariantFormProps> = ({
  partId,
  defaultVariant,
  buttonText = 'Submit',
  loading = false,
  ...rest
}) => {
  return (
    <form {...rest}>
      <input type="hidden" id="partId" name="partId" defaultValue={partId} />

      <label htmlFor="variantName">
        <p className="label-default">Variantens navn</p>
        <input
          required
          type="text"
          name="variantName"
          id="variantName"
          className="input-default"
          defaultValue={defaultVariant?.name}
        />
      </label>
      <label htmlFor="variantDescription">
        <p className="label-default">Beskrivelse</p>
        <textarea
          required
          name="variantDescription"
          id="variantDescription"
          className="input-default min-h-40"
          defaultValue={defaultVariant?.description}
        />
      </label>
      <label htmlFor="variantPrice">
        <p className="label-default">Variantens pris</p>
        <input
          required
          name="variantPrice"
          id="variantPrice"
          type="number"
          className="input-default"
          defaultValue={defaultVariant?.price}
        />
      </label>
      <label htmlFor="variantRepairTime">
        <p className="label-default">
          Variantens estimerede reparations tid (minutter)
        </p>
        <input
          required
          name="variantRepairTime"
          id="variantRepairTime"
          type="number"
          className="input-default"
          defaultValue={defaultVariant?.estimatedMinutes}
        />
      </label>
      <label htmlFor="variantRepairTime">
        <p className="label-default">Variantens grade</p>
        <input
          required
          name="variantGrade"
          id="variantGrade"
          type="number"
          className="input-default "
          defaultValue={defaultVariant?.gradeLevel}
        />
      </label>
      <button
        disabled={loading}
        className="bg-blue-500 p-2 rounded-md text-white"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default PartVariantForm;
