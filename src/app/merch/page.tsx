// src/app/merch/page.tsx

import React from 'react';
import Layout from '@/components/Layout';
import MerchList from '@/components/MerchList';
import { getMerchItems } from '@/lib/api';

export default async function MerchPage() {
  const merchItems = await getMerchItems();

  return (
    <Layout title="Merchandise | Music Band">
      <h1 className="text-3xl font-bold mb-6">Merchandise</h1>
      <MerchList items={merchItems} />
    </Layout>
  );
}