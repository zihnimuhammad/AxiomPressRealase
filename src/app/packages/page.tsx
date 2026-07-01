export const dynamic = 'force-dynamic';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPackages } from '@/lib/data';
import PackageList from '@/components/PackageList';

export const metadata = {
  title: 'Pilihan Paket Press Release Hemat | Axiom Press Release',
  description: 'Dapatkan eksposur maksimal dengan paket distribusi media nasional kami. Hemat hingga 20% dibandingkan harga eceran.',
};

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
              Hemat Paket Media
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Pilihan Paket Press Release</h1>
            <p className="max-w-2xl mx-auto text-slate-500">
              Pilihan paket bundel media nasional untuk eksposur branding yang masif dengan harga yang jauh lebih hemat.
            </p>
          </div>
          <PackageList packages={packages} />
        </div>
      </main>
      <Footer />
    </>
  );
}
