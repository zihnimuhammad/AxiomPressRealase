'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { Trash2, Ticket, ArrowRight, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { 
    cart, removeFromCart, clearCart, 
    cartSubtotal, cartDiscount, cartTotal, 
    voucher, applyVoucher 
  } = useApp();
  const router = useRouter();

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsValidating(true);
    setVoucherError('');
    setVoucherSuccess('');

    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, subtotal: cartSubtotal }),
      });

      const data = await res.json();
      if (res.ok) {
        applyVoucher(data.voucher);
        setVoucherSuccess(`Kupon "${data.voucher.code}" berhasil diterapkan!`);
      } else {
        setVoucherError(data.message || 'Kupon tidak valid');
      }
    } catch (err) {
      setVoucherError('Gagal memverifikasi kupon. Silakan coba lagi.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveVoucher = () => {
    applyVoucher(null);
    setVoucherCode('');
    setVoucherSuccess('');
    setVoucherError('');
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Keranjang Belanja
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
              <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Keranjang Anda Kosong</h2>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Anda belum menambahkan media atau paket ke keranjang belanja Anda. Silakan jelajahi direktori media kami.
                </p>
              </div>
              <Link
                href="/media"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Lihat Direktori Media
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Daftar Media & Paket ({cart.length})
                    </span>
                    <button 
                      onClick={clearCart}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Kosongkan Keranjang
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cart.map((item) => (
                      <div key={item.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-4 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-800/50">
                            {item.type === 'media' ? 'M' : item.type === 'backlink' ? 'B' : 'P'}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</h3>
                            <p className="text-xs text-slate-500 capitalize">
                              {item.type === 'media' 
                                ? `${item.domain} • Eceran` 
                                : item.type === 'backlink' 
                                  ? `${item.domain} • Jasa Backlink` 
                                  : 'Paket Hemat'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                            {formatRupiah(item.price)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            aria-label="Hapus item"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary & Voucher */}
              <div className="space-y-6">
                {/* Voucher Box */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center">
                    <Ticket className="h-4.5 w-4.5 text-blue-500 mr-2" />
                    Kupon Diskon
                  </h3>

                  {voucher ? (
                    <div className="space-y-2">
                      <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-3.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                            Kupon Aktif
                          </span>
                          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{voucher.code}</p>
                        </div>
                        <button 
                          onClick={handleRemoveVoucher}
                          className="text-xs font-semibold text-red-500 hover:text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                      {cartSubtotal < voucher.minSpend && (
                        <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-500 leading-snug">
                          Tambahkan belanjaan senilai {formatRupiah(voucher.minSpend - cartSubtotal)} lagi untuk menggunakan kupon ini.
                        </p>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleApplyVoucher} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Kode Kupon (cth: PRLAUNCH)"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.trim().toUpperCase())}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={isValidating}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-11 rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Terapkan Kupon
                      </button>
                      {voucherError && <p className="text-[11px] font-semibold text-red-500 mt-1">{voucherError}</p>}
                    </form>
                  )}
                  {voucherSuccess && <p className="text-[11px] font-semibold text-emerald-500 mt-2">{voucherSuccess}</p>}
                </div>

                {/* Summary Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Ringkasan Order
                  </h3>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(cartSubtotal)}</span>
                    </div>

                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Diskon</span>
                        <span className="font-semibold">-{formatRupiah(cartDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <span>Total</span>
                      <span>{formatRupiah(cartTotal)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 transition-colors shadow-lg shadow-blue-500/10"
                  >
                    Lanjutkan ke Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
