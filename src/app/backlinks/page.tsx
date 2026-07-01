export const dynamic = 'force-dynamic';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBacklinks } from '@/lib/data';
import BacklinksCatalog from '@/components/BacklinksCatalog';

export const metadata = {
  title: 'Katalog Jasa Backlink Premium | Axiom Press Release',
  description: 'Tingkatkan ranking SEO dan otoritas domain Anda melalui backlink berkualitas tinggi dari jaringan blog dan portal web terpercaya.',
};

export default async function BacklinksPage() {
  const backlinks = await getBacklinks();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Direktori Jasa Backlink</h1>
            <p className="text-slate-500">Pilih situs berkualitas tinggi untuk menanam backlink kontekstual penunjang SEO website Anda.</p>
          </div>
          <BacklinksCatalog initialBacklinks={backlinks} />
        </div>
      </main>
      <Footer />
    </>
  );
}
