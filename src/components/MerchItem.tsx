// File: src/components/MerchItem.tsx

import React from 'react';
import Image from 'next/image';
import { MerchItem as MerchItemType } from '@prisma/client';

interface MerchItemProps {
  item: MerchItemType;
}

const MerchItem: React.FC<MerchItemProps> = ({ item }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {item.image && (
        <div className="relative h-48">
          <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <p className="text-lg font-bold mb-2">${item.price.toFixed(2)}</p>
        <button className="btn-primary w-full">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MerchItem;