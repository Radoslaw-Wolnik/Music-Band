// File: src/app/(public)/page.tsx

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary-700 mb-6">Welcome to Our Band</h1>
      <p className="text-lg mb-4">Check out our latest events and music!</p>
      <div className="space-y-4">
        <Link href="/events" className="btn-primary">
          View Events
        </Link>
        <Link href="/merch" className="btn-secondary">
          Shop Merch
        </Link>
      </div>
    </div>
  );
}