import Image from 'next/image';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

interface ItemCardProps {
  itemName: string;
  href?: string;
  imageUrl?: string;
  children?: ReactNode;
}

const ItemCard: FC<ItemCardProps> = ({
  itemName,
  href,
  imageUrl,
  children,
}) => {
  const CardContent = (
    <div
      className={`flex flex-col items-center h-full ${
        imageUrl && 'justify-center'
      }`}
    >
      {imageUrl && (
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="relative w-full max-w-[80%] aspect-square">
            <Image
              className="object-contain"
              src={imageUrl || ''}
              alt={`${itemName} image`}
              fill
            />
          </div>
        </div>
      )}
      <h1 className="font-medium text-xl text-center mb-4">{itemName}</h1>
      <div className="w-full h-fit">{children}</div>
    </div>
  );

  return (
    <div
      className={`content-box hover flex flex-col hover:shadow-xl duration-150 p-4 w-72 min-h-80 ${
        href && 'hover:scale-[1.02]'
      }`}
    >
      {href ? (
        <Link href={href} className="h-full w-full">
          {CardContent}
        </Link>
      ) : (
        <div className="w-full h-full">{CardContent}</div>
      )}
    </div>
  );
};

export default ItemCard;
