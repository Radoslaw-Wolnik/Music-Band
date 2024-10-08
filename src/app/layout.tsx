// File: src/app/layout.tsx

import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Music Band Website',
  description: 'Official website for our music band',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}