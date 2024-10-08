// File: src/app/(public)/merch/page.tsx

import React from 'react';
import MerchItem from '@/components/MerchItem';
import prisma from '@/lib/prisma';

export default async function MerchPage() {
  const merchItems = await prisma.merchItem.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Merchandise</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {merchItems.map((item) => (
          <MerchItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}