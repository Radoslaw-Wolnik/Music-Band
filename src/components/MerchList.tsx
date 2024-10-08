// src/components/MerchList.tsx

import React from 'react';
import MerchItem from './MerchItem';
import { MerchItem as MerchItemType } from '@/types';

interface MerchListProps {
  items: MerchItemType[];
}

const MerchList: React.FC<MerchListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MerchItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MerchList;