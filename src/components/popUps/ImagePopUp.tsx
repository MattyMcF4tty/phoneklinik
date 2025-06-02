'use client';

import Image from 'next/image';
import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RiCloseLargeLine } from 'react-icons/ri';

interface ImagePopUpProps {
  imageUrl: string;
  altText?: string;
  onClose?: () => void;
}

const ImagePopUp: FC<ImagePopUpProps> = ({ imageUrl, altText, onClose }) => {
  // Deny scroll on body when popup is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative z-20 shadow-xl">
        <button
          className="absolute top-2 right-2 z-30 h-6 w-6 hover:bg-gray-700 rounded-full flex items-center justify-center"
          onClick={onClose}
        >
          <RiCloseLargeLine className="text-white w-full h-full" />
        </button>
        <Image
          src={imageUrl}
          alt={altText ?? 'Ukendt billede'}
          layout="responsive"
          width={100}
          height={100}
        />
      </div>
    </div>,
    document.body
  );
};

export default ImagePopUp;
