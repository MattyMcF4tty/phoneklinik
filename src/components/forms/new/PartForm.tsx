import DevicePart from '@schemas/devicePart';
import React, { FC, FormHTMLAttributes } from 'react';

interface PartFormProps
  extends React.DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  deviceId: number;
  defaultPart?: DevicePart;
  buttonText?: string;
  loading?: boolean;
}

const PartForm: FC<PartFormProps> = ({
  deviceId,
  defaultPart,
  buttonText = 'Submit',
  loading = false,
  ...rest
}) => {
  return (
    <form {...rest}>
      <input
        type="hidden"
        id="deviceId"
        name="deviceId"
        defaultValue={deviceId}
      />

      <label htmlFor="partName">
        <p className="label-default">Delens navn</p>
        <input
          required
          type="text"
          name="partName"
          id="partName"
          className="input-default"
          defaultValue={defaultPart?.name}
        />
      </label>
      <label htmlFor="partDescription">
        <p className="label-default">Beskrivelse</p>
        <textarea
          required
          name="partDescription"
          id="partDescription"
          className="input-default min-h-40"
          defaultValue={defaultPart?.description}
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

export default PartForm;
