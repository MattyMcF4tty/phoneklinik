'use client';

import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface PopUpWrapperProps {
  children?: React.ReactNode;
}

const PopUpWrapper: FC<PopUpWrapperProps> = ({ children }) => {
  // Deny scroll on body when popup is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 w-full h-full">
      {children}
    </div>,
    document.body
  );
};

export default PopUpWrapper;
