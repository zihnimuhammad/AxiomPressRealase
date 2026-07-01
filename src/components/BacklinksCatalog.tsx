'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Search, SlidersHorizontal, Check, Plus, ArrowUpDown, 
  BarChart2, Globe, TrendingUp, RefreshCw 
} from 'lucide-react';

interface BacklinkItem {
  id: string;
  logo: string;
  name: string;
  domain: string;
  da: number;
  dr: number;
  traffic: number;
  price: number;
  status: string;
  notes?: string | null;
}

export default function BacklinksCatalog({ 
  initialBacklinks 
}: { 
  initialBacklinks: BacklinkItem[]; 
}) {
  const { cart, addToCart, removeFromCart } = useApp();
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [minDa, setMinDa] = useState<number>(0);
  const [minDr, setMinDr] = useState<number>(0);
  const [minTraffic, setMinTraffic] = useState<number>(0);
  const [sortBy, setSortBy] = useState('price-asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Helper formatting functions
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const formatTraffic = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(0) + 'K';
    }
    return val.toString();
  };

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setMaxPrice(5000000);
    setMinDa(0);
    setMinDr(0);
    setMinTraffic(0);
    setSortBy('price-asc');
  };

  // Filter and Sort Logic
  const filteredBacklinks = useMemo(() => {
    return initialBacklinks
      .filter((item) => {
        const matchesSearch = 
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.domain.toLowerCase().includes(search.toLowerCase());
        
        const matchesPrice = item.price <= maxPrice;
        const matchesDa = item.da >= minDa;
        const matchesDr = item.dr >= minDr;
        const matchesTraffic = item.traffic >= minTraffic;
        
        return matchesSearch && matchesPrice && matchesDa && matchesDr && matchesTraffic;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'da-desc') return b.da - a.da;
        if (sortBy === 'dr-desc') return b.dr - a.dr;
        if (sortBy === 'traffic-desc') return b.traffic - a.traffic;
        return a.name.localeCompare(b.name);
      });
  }, [initialBacklinks, search, maxPrice, minDa, minDr, minTraffic, sortBy]);

  // Check if item is in cart
  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id && item.type === 'backlink');
  };

  const handleCartAction = (item: BacklinkItem) => {
    if (isInCart(item.id)) {
      removeFromCart(item.id);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        logo: item.logo,
        domain: item.domain,
        da: item.da,
        dr: item.dr,
        traffic: item.traffic,
        type: 'backlink'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama blog atau domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="da-desc">DA Tertinggi</option>
              <option value="dr-desc">DR Tertinggi</option>
              <option value="traffic-desc">Trafik Tertinggi</option>
            </select>

            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl p-3 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <RefreshCw className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Desktop Filter Panel */}
        <div className={`md:grid grid-cols-4 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 ${showMobileFilters ? 'block space-y-4' : 'hidden'}`}>
          {/* Max Price */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Harga Maksimal</label>
            <div className="space-y-1">
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span>100K</span>
                <span className="text-blue-600 dark:text-blue-400">{formatRupiah(maxPrice)}</span>
                <span>5M</span>
              </div>
            </div>
          </div>

          {/* Min DA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Domain Authority (DA) Min</label>
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                value={minDa}
                onChange={(e) => setMinDa(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span>0</span>
                <span className="text-blue-600 dark:text-blue-400">DA {minDa}</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Min DR */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Domain Rating (DR) Min</label>
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                value={minDr}
                onChange={(e) => setMinDr(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span>0</span>
                <span className="text-blue-600 dark:text-blue-400">DR {minDr}</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Min Traffic */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Trafik Min (Per Bulan)</label>
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={minTraffic}
                onChange={(e) => setMinTraffic(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span>0</span>
                <span className="text-blue-600 dark:text-blue-400">{formatTraffic(minTraffic)}</span>
                <span>100K+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBacklinks.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl space-y-4">
            <p className="text-slate-400 font-semibold">Tidak ada layanan backlink yang cocok dengan filter Anda.</p>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 underline decoration-2 cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          filteredBacklinks.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="h-12 w-12 rounded-2xl object-cover bg-slate-50 border border-slate-100 dark:border-slate-800 dark:bg-slate-950"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">{item.name}</h3>
                    <p className="text-xs text-blue-500 font-semibold truncate max-w-[180px]">{item.domain}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">DA</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white flex items-center justify-center gap-0.5">
                      <BarChart2 className="h-3.5 w-3.5 text-indigo-500" />
                      {item.da}
                    </p>
                  </div>
                  <div className="space-y-0.5 border-l border-r border-slate-150 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">DR</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white flex items-center justify-center gap-0.5">
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      {item.dr}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Trafik</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white flex items-center justify-center gap-0.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      {formatTraffic(item.traffic)}
                    </p>
                  </div>
                </div>

                {/* Description/Notes */}
                {item.notes && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic line-clamp-2 leading-relaxed">
                    "{item.notes}"
                  </p>
                )}
              </div>

              {/* Footer pricing & Add to cart */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 mt-auto">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Harga Pasang</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white">{formatRupiah(item.price)}</p>
                </div>
                
                <button
                  onClick={() => handleCartAction(item)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isInCart(item.id)
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:hover:bg-red-950/20 dark:hover:text-red-400 dark:hover:border-red-900/40'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10'
                  }`}
                >
                  {isInCart(item.id) ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Masuk Keranjang</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Pesan Backlink</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
