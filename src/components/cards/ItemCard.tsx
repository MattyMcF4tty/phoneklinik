import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

interface ItemCardProps {
  itemName: string;
  href?: string;
  imageUrl?: string;
  buttons?:
    | React.ReactElement<HTMLButtonElement>
    | React.ReactElement<HTMLButtonElement>[];
}

const ItemCard: FC<ItemCardProps> = ({ itemName, href, imageUrl, buttons }) => {
  const CardContent: FC<{ buttons?: ItemCardProps['buttons'] }> = ({
    buttons,
  }) => (
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
      <div className="w-full flex justify-center gap-4">
        {Array.isArray(buttons)
          ? buttons.map((button, index) =>
              React.cloneElement(button, {
                key: button.key ?? `${itemName}-${index}`,
              })
            )
          : buttons}
      </div>
    </div>
  );

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl duration-150 p-4 w-72 min-h-80 ${
        href && 'hover:scale-[1.02]'
      }`}
    >
      {href ? (
        <Link href={href} className="h-full w-full">
          <CardContent buttons={buttons} />
        </Link>
      ) : (
        <CardContent buttons={buttons} />
      )}
    </div>
  );
};

export default ItemCard;
