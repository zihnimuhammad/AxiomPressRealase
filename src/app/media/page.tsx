export const dynamic = 'force-dynamic';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMedia, getCategories } from '@/lib/data';
import MediaCatalog from '@/components/MediaCatalog';

export const metadata = {
  title: 'Daftar Media Jasa Press Release | Axiom Press Release',
  description: 'Cari dan pilih dari 1000+ media online nasional dan lokal. Filter berdasarkan DA, DR, Trafik, dan Kategori.',
};

export default async function MediaPage() {
  const [media, categories] = await Promise.all([
    getMedia(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Direktori Media Press Release</h1>
            <p className="text-slate-500">Pilih media satuan secara eceran sesuai dengan target segmen pembaca Anda.</p>
          </div>
          <MediaCatalog initialMedia={media} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
