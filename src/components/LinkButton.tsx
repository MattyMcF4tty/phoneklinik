import { cn } from '@/utils/misc';
import { VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import React, { FC } from 'react';

const buttonVariants = cva(
  'bg-white rounded-md flex justify-center items-center px-1',
  {
    variants: {
      variant: {
        default:
          'bg-white text-main-purple px-6 py-3 font-semibold rounded shadow',
        navbar:
          ' hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-main-purple hover:to-main-blue hover:font-semibold text-black w-40 h-12',
        navbar2:
          'w-64 h-10 mt-2 md:mt-0 md:ml-2 bg-gradient-to-r from-main-purple to-main-blue text-white font-semibold rounded border border-green',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  buttonText: string;
  url: string;
}

const LinkButton: FC<LinkButtonProps> = ({
  className,
  variant,
  buttonText,
  url,
  ...props
}) => {
  return (
    <Link
      href={url}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      {buttonText}
    </Link>
  );
};

LinkButton.displayName = 'LinkButton';

export default LinkButton;
