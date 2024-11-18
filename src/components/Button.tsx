import React, { FC } from 'react';

interface buttonProps {
  buttonText: string;
}

const Button: FC<buttonProps> = ({ buttonText }) => {
  return (
    <div>
      <button className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-main-purple hover:to-main-blue hover:font-semibold text-black w-40 h-12">
        {buttonText}
      </button>
    </div>
  );
};

export default Button;
