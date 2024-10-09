// src/components/MerchItem.tsx

import React from 'react';
import { MerchItem as MerchItemType } from '@/types';
import { purchaseMerch } from '@/lib/api';

interface MerchItemProps {
  item: MerchItemType;
}

const MerchItem: React.FC<MerchItemProps> = ({ item }) => {
  const handlePurchase = async () => {
    try {
      await purchaseMerch(item.id, 1);
      alert('Item purchased successfully!');
    } catch (error) {
      alert('Failed to purchase item. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <p className="text-lg font-bold mb-4">${item.price.toFixed(2)}</p>
        <button
          onClick={handlePurchase}
          className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MerchItem;