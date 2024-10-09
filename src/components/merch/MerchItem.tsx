import React from 'react';
import { MerchItem as MerchItemType } from '@/types';
import { purchaseMerch } from '@/lib/api';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

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
    <Card>
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <p className="text-lg font-bold mb-4">${item.price.toFixed(2)}</p>
        <Button onClick={handlePurchase} variant="secondary" className="w-full">
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default MerchItem;