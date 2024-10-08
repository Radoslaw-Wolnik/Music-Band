// src/app/page.tsx

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="Home | Music Band">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Music Band</h1>
        <p className="text-xl mb-8">Experience the best live music and events!</p>
        <div className="space-x-4">
          <Link href="/events" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded">
            View Upcoming Events
          </Link>
          <Link href="/merch" className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded">
            Shop Merchandise
          </Link>
        </div>
      </div>
    </Layout>
  );
}