'use client';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import React, { FC, useState } from 'react';

interface ImageFieldProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'type' | 'accept' | 'className' | 'style'
  > {
  defaultImage?: { src: string | StaticImport; alt: string };
  labelText: string;
}

const ImageField: FC<ImageFieldProps> = ({
  labelText,
  defaultImage,
  ...rest
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
    if (rest.onChange) rest.onChange(e); // forward event if provided
  };

  const imageToShow =
    previewUrl || (defaultImage ? String(defaultImage.src) : null);

  return (
    <label
      className={`relative w-full h-fit cursor-pointer flex flex-col`}
      htmlFor={rest.id}
    >
      <p className="label-default">{labelText}</p>
      {imageToShow ? (
        <div className="relative w-fit h-fit group">
          <Image
            src={imageToShow}
            alt={defaultImage?.alt || 'Valgt billede'}
            width={160}
            height={160}
            className="object-contain w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
        </div>
      ) : (
        <span className="text-sm w-full py-1 px-2 bg-blue-500 text-white rounded-md shadow-md hover:shadow-inner">
          Vælg billede
        </span>
      )}
      <input
        name=""
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute w-full h-full"
        style={{ display: 'none' }}
        {...rest}
      />
    </label>
  );
};

export default ImageField;
