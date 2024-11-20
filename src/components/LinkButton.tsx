import { cn } from '@/utils/misc';
import { VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

const buttonVariants = cva(
  'bg-white rounded-md flex justify-center items-center px-1',
  {
    variants: {
      variant: {
        default:
          'bg-white text-main-purple px-6 py-3 font-semibold rounded shadow',
        navbar:
          'md:ml-10 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-main-purple hover:to-main-blue hover:font-semibold text-black w-40 h-12 relative before:absolute before:w-0 before:h-[2px] before:bg-gradient-to-r before:from-main-purple before:to-main-blue before:bottom-0 before:left-0 before:transition-all before:duration-300 hover:before:w-full',
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
  url: string;
  children: ReactNode; // Prop for the content between the tags
}

const LinkButton: FC<LinkButtonProps> = ({
  className,
  variant,
  url,
  children,
  ...props
}) => {
  return (
    <Link
      href={url}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      {children} {/* Render the children prop */}
    </Link>
  );
};

LinkButton.displayName = 'LinkButton';

export default LinkButton;
