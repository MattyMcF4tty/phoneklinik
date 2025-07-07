'use client';

import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface PopUpWrapperProps {
  children?: React.ReactNode;
}

const PopUpWrapper: FC<PopUpWrapperProps> = ({ children }) => {
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const container = document.createElement('div');
    container.setAttribute('id', 'portal-container');
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.removeChild(container);
    };
  }, []);

  if (!portalContainer) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 w-full h-full">
      {children}
    </div>,
    portalContainer
  );
};

export default PopUpWrapper;
