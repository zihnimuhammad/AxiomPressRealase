'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Search, SlidersHorizontal, Check, Plus, ArrowUpDown, 
  BarChart2, Globe, TrendingUp, RefreshCw 
} from 'lucide-react';

interface MediaItem {
  id: string;
  logo: string;
  name: string;
  domain: string;
  categoryId: string;
  da: number;
  dr: number;
  traffic: number;
  price: number;
  status: string;
  notes?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default function MediaCatalog({ 
  initialMedia, 
  categories 
}: { 
  initialMedia: any[]; 
  categories: CategoryItem[]; 
}) {
  const { cart, addToCart, removeFromCart } = useApp();
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [minDa, setMinDa] = useState<number>(0);
  const [minDr, setMinDr] = useState<number>(0);
  const [minTraffic, setMinTraffic] = useState<number>(0);
  const [sortBy, setSortBy] = useState('name-az');
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
    setSelectedCategory('all');
    setMaxPrice(10000000);
    setMinDa(0);
    setMinDr(0);
    setMinTraffic(0);
    setSortBy('name-az');
  };

  // Filter and Sort Logic
  const filteredMedia = useMemo(() => {
    return initialMedia
      .filter((item) => {
        // Search
        const matchesSearch = 
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.domain.toLowerCase().includes(search.toLowerCase());
        
        // Category
        const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
        
        // Price
        const matchesPrice = item.price <= maxPrice;
        
        // DA
        const matchesDa = item.da >= minDa;

        // DR
        const matchesDr = item.dr >= minDr;

        // Traffic
        const matchesTraffic = item.traffic >= minTraffic;

        // Active only
        const isActive = item.status === 'ACTIVE';

        return matchesSearch && matchesCategory && matchesPrice && matchesDa && matchesDr && matchesTraffic && isActive;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'da-desc') return b.da - a.da;
        if (sortBy === 'traffic-desc') return b.traffic - a.traffic;
        if (sortBy === 'name-az') return a.name.localeCompare(b.name);
        if (sortBy === 'name-za') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [initialMedia, search, selectedCategory, maxPrice, minDa, minDr, minTraffic, sortBy]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters (Desktop) */}
      <aside className="hidden lg:block bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm h-fit space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2 text-blue-500" />
            Filter Pencarian
          </h2>
          <button 
            onClick={resetFilters}
            className="text-xs text-slate-400 hover:text-blue-500 flex items-center transition-colors"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </button>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Max Price Filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Harga Maksimal</label>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{formatRupiah(maxPrice)}</span>
          </div>
          <input
            type="range"
            min={1000000}
            max={15000000}
            step={500000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Min DA Filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min. DA (Domain Authority)</label>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{minDa}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minDa}
            onChange={(e) => setMinDa(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Min DR Filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min. DR (Domain Rating)</label>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{minDr}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minDr}
            onChange={(e) => setMinDr(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Min Traffic Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min. Estimasi Trafik bulanan</label>
          <select
            value={minTraffic}
            onChange={(e) => setMinTraffic(Number(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Semua Trafik</option>
            <option value={100000}>100k+ Trafik</option>
            <option value={500000}>500k+ Trafik</option>
            <option value={1000000}>1M+ Trafik</option>
            <option value={5000000}>5M+ Trafik</option>
            <option value={10000000}>10M+ Trafik</option>
          </select>
        </div>
      </aside>

      {/* Main Content Catalog Grid */}
      <section className="lg:col-span-3 space-y-6">
        {/* Search, Mobile Filter Toggle, and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-az">Nama A-Z</option>
                <option value="name-za">Nama Z-A</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="da-desc">DA Tertinggi</option>
                <option value="traffic-desc">Trafik Terbanyak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filters Drawer Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="relative ml-0 mr-auto flex h-full w-80 max-w-sm flex-col overflow-y-auto bg-white dark:bg-slate-900 p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Filter Pencarian</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-sm font-semibold text-slate-400">Tutup</button>
              </div>

              {/* Duplicate Filters inside Mobile Modal */}
              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {/* Price */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Harga Maksimal</label>
                    <span className="text-xs font-bold text-blue-600">{formatRupiah(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={15000000}
                    step={500000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                {/* DA */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min. DA</label>
                    <span className="text-xs font-bold text-blue-600">{minDa}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={minDa}
                    onChange={(e) => setMinDa(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                {/* DR */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min. DR</label>
                    <span className="text-xs font-bold text-blue-600">{minDr}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={minDr}
                    onChange={(e) => setMinDr(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                {/* Traffic */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min. Trafik</label>
                  <select
                    value={minTraffic}
                    onChange={(e) => setMinTraffic(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value={0}>Semua Trafik</option>
                    <option value={100000}>100k+</option>
                    <option value={500000}>500k+</option>
                    <option value={1000000}>1M+</option>
                  </select>
                </div>
                <button
                  onClick={() => { resetFilters(); setShowMobileFilters(false); }}
                  className="w-full py-2.5 text-center text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-500 rounded-xl"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Cards Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-slate-400 text-sm">Tidak ada media yang cocok dengan filter pencarian Anda.</p>
            <button 
              onClick={resetFilters} 
              className="mt-4 inline-flex items-center text-sm font-bold text-blue-600 hover:underline"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item) => {
              const isInCart = cart.some((c) => c.id === item.id && c.type === 'media');
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/85 hover:border-blue-500/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Category Indicator Top Right */}
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                    {item.category?.name || 'News'}
                  </span>

                  <div>
                    {/* Media Info */}
                    <div className="flex items-center space-x-4 mb-5">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform overflow-hidden">
                        <img 
                          src={item.logo} 
                          alt={item.name} 
                          className="h-full w-full object-cover" 
                          onError={(e) => {
                            // Fallback logo generator
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=2563EB&color=fff`;
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-800 dark:text-white leading-tight">{item.name}</h3>
                        <a 
                          href={`https://${item.domain}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center mt-0.5"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {item.domain}
                        </a>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl mb-5 text-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">DA</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.da}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">DR</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.dr}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Traffic</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 text-emerald-500 mr-0.5" />
                          {formatTraffic(item.traffic)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Publish</p>
                      <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{formatRupiah(item.price)}</p>
                    </div>

                    {isInCart ? (
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:border-red-900/40 transition-colors group/btn"
                      >
                        <Check className="h-5 w-5 group-hover/btn:hidden" />
                        <span className="hidden group-hover/btn:inline text-xs font-bold px-1">Hapus</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          logo: item.logo,
                          domain: item.domain,
                          da: item.da,
                          dr: item.dr,
                          traffic: item.traffic,
                          category: item.category?.name,
                          type: 'media'
                        })}
                        className="inline-flex items-center justify-center p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-500/10"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
