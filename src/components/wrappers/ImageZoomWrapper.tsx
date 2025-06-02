'use client';

import React, { FC, useState } from 'react';
import ImagePopUp from '../popUps/ImagePopUp';

interface ImageZoomWrapperProps {
  imageUrl: string;
  altText?: string;
  children?: React.ReactNode;
}

const ImageZoomWrapper: FC<ImageZoomWrapperProps> = ({
  imageUrl,
  children,
}) => {
  const [showImage, setShowImage] = useState(false);
  return (
    <div className="w-fit h-fit">
      <button onClick={() => setShowImage(true)}>{children}</button>
      {showImage && (
        <ImagePopUp imageUrl={imageUrl} onClose={() => setShowImage(false)} />
      )}
    </div>
  );
};

export default ImageZoomWrapper;
