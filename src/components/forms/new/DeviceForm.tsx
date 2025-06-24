import ImageField from '@components/inputfields/ImageField';
import Brand from '@schemas/brand';
import Device from '@schemas/device';
import React, { FC } from 'react';

interface DeviceFormProps extends React.HTMLAttributes<HTMLFormElement> {
  defaultDevice?: Partial<Device>;
  brands: Brand[];
}

const DeviceForm: FC<DeviceFormProps> = ({
  defaultDevice,
  brands,
  ...rest
}) => {
  return (
    <form {...rest}>
      <ImageField
        placeholder={
          defaultDevice?.imageUrl
            ? {
                src: defaultDevice.imageUrl,
                alt:
                  defaultDevice.brand &&
                  defaultDevice.model &&
                  defaultDevice.version
                    ? `${defaultDevice.brand} ${defaultDevice.model} ${defaultDevice.version} - Billede`
                    : 'Enheds - Billede',
              }
            : undefined
        }
        labelText={defaultDevice ? 'Skift billede' : 'Tilføj billede'}
        name="deviceImage"
        id="deviceImage"
      />
      <label htmlFor="deviceBrand">
        <p className="label-default">Enheds mærke</p>
        <select
          name="deviceBrand"
          id="deviceBrand"
          defaultValue={defaultDevice?.brand}
        >
          {brands.map((brand) => (
            <option key={brand.name} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="deviceModel">
        <p className="label-default">Enheds model</p>
        <input
          type="text"
          id="deviceModel"
          name="deviceModel"
          className="input-default"
          placeholder='F.eks. "iPhone"'
          defaultValue={defaultDevice?.model}
        />
      </label>
      <label htmlFor="deviceVersion">
        <p className="label-default">Enheds version</p>
        <input
          type="text"
          id="deviceVersion"
          name="deviceVersion"
          className="input-default"
          placeholder='F.eks. "14 Pro"'
          defaultValue={defaultDevice?.version}
        />
      </label>
      <label htmlFor="deviceType">
        <p className="label-default">Enheds type</p>
        <input
          type="text"
          id="deviceType"
          name="deviceType"
          className="input-default"
          placeholder='F.eks. "Mobil"'
          defaultValue={defaultDevice?.type}
        />
      </label>
      <label htmlFor="deviceReleaseDate">
        <p className="label-default">Enheds udgivelses dato</p>
        <input
          type="date"
          id="deviceReleaseDate"
          name="deviceReleaseDate"
          className="input-default"
          defaultValue={
            defaultDevice?.releaseDate
              ? new Date(defaultDevice?.releaseDate).toISOString()
              : ''
          }
        />
      </label>
      <button className="bg-blue-500 py-2 rounded-md text-white">
        Tilføj enhed
      </button>
    </form>
  );
};

export default DeviceForm;
