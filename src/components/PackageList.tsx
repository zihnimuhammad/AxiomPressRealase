'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  domain: string;
}

interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  status: string;
  media: MediaItem[];
}

export default function PackageList({ packages }: { packages: any[] }) {
  const { cart, addToCart } = useApp();
  const router = useRouter();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleOrder = (pkg: PackageItem) => {
    // Add to cart
    addToCart({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price - (pkg.price * pkg.discount) / 100, // apply default discount
      type: 'package',
      discount: pkg.discount,
    });
    // Redirect to cart
    router.push('/cart');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      {packages.map((pkg) => {
        const isPopular = pkg.name.toLowerCase().includes('professional') || pkg.name.toLowerCase().includes('populer');
        const discountedPrice = pkg.price - (pkg.price * pkg.discount) / 100;
        
        return (
          <div 
            key={pkg.id} 
            className={`flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 relative ${
              isPopular 
                ? 'border-blue-500 dark:border-blue-600 shadow-xl ring-1 ring-blue-500/20 scale-100 lg:scale-[1.03] z-10' 
                : 'border-slate-200/80 dark:border-slate-800/85 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
            } p-8`}
          >
            {isPopular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md shadow-blue-500/10">
                Paling Populer
              </span>
            )}

            <div>
              {/* Header */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{pkg.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed min-h-[60px]">{pkg.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                {pkg.discount > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold line-through text-slate-400">
                        {formatRupiah(pkg.price)}
                      </span>
                      <span className="text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                        Hemat {pkg.discount}%
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {formatRupiah(discountedPrice)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatRupiah(pkg.price)}
                    </span>
                  </div>
                )}
              </div>

              {/* Included Media Checklist */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Termasuk {pkg.media.length} Media Mitra:
                </p>
                <ul className="space-y-3">
                  {pkg.media.map((m: MediaItem) => (
                    <li key={m.id} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Check className="h-4.5 w-4.5 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" />
                      <span className="truncate">
                        {m.name} <span className="text-xs text-slate-400">({m.domain})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleOrder(pkg)}
              className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all ${
                isPopular 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10' 
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              <span>Pesan Paket</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
