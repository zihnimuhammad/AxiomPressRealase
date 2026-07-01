'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Upload, CreditCard, ArrowLeft, 
  CheckCircle, Loader2, Sparkles, Building, User, Mail, Phone 
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartDiscount, cartTotal, voucher, clearCart } = useApp();
  const { data: session } = useSession();
  const router = useRouter();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [brandName, setBrandName] = useState('');
  const [anchorText, setAnchorText] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [articleFile, setArticleFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Prefill details if logged in
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      router.push('/media');
    }
  }, [cart, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArticleFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!name || !email || !whatsapp || !brandName || !anchorText || !targetUrl) {
      setSubmitError('Harap isi semua kolom wajib yang bertanda bintang (*)');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Create FormData to support file upload
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('whatsapp', whatsapp);
      formData.append('brandName', brandName);
      formData.append('anchorText', anchorText);
      formData.append('targetUrl', targetUrl);
      formData.append('notes', notes);
      formData.append('paymentMethod', paymentMethod);
      formData.append('subtotal', cartSubtotal.toString());
      formData.append('discount', cartDiscount.toString());
      formData.append('total', cartTotal.toString());
      
      if (voucher) {
        formData.append('voucherCode', voucher.code);
      }

      // Append items
      formData.append('items', JSON.stringify(cart.map(item => ({
        id: item.id,
        price: item.price,
        type: item.type
      }))));

      if (articleFile) {
        formData.append('article', articleFile);
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: formData, // Browser sets Content-Type automatically for FormData
      });

      const data = await res.json();
      if (res.ok) {
        // Clear global cart
        clearCart();
        // Redirect to order status page
        router.push(`/order/${data.orderId}`);
      } else {
        setSubmitError(data.message || 'Gagal mengirim order. Silakan coba lagi.');
      }
    } catch (err) {
      setSubmitError('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  if (cart.length === 0 && !isSubmitting) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button 
            onClick={() => router.push('/cart')}
            className="flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Kembali ke Keranjang
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Fields Column */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Kontak Informasi */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    1. Informasi Kontak Pemesan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="cth: Budi Santoso"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Utama *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="cth: budi@gmail.com"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="cth: 081234567890 (Wajib aktif untuk koordinasi)"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Detail Brief Artikel */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    2. Brief Publikasi & Artikel
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Brand / Perusahaan *</label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="cth: HijabModern"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Link / URL *</label>
                      <input
                        type="url"
                        required
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="cth: https://hijabmodern.com"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anchor Text (Teks Tautan) *</label>
                      <input
                        type="text"
                        required
                        value={anchorText}
                        onChange={(e) => setAnchorText(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="cth: toko hijab murah online"
                      />
                    </div>
                    
                    {/* File Upload for Article */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Upload File Artikel (Opsional)</label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/20 relative">
                        <input
                          type="file"
                          accept=".doc,.docx,.pdf,.txt"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="space-y-2">
                          <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto shadow-sm">
                            <Upload className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {articleFile ? articleFile.name : 'Pilih file artikel Anda'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Format yang diterima: .doc, .docx, .pdf, .txt (Maks. 5MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catatan Tambahan untuk Redaksi</label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                        placeholder="cth: Mohon untuk dipublish di rubrik gaya hidup atau bisnis..."
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Metode Pembayaran */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    3. Metode Pembayaran
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('QRIS')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        paymentMethod === 'QRIS'
                          ? 'border-blue-500 dark:border-blue-600 bg-blue-50/20 dark:bg-blue-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/10'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">QRIS Instan</p>
                        <p className="text-xs text-slate-400">Bayar otomatis pakai GoPay, OVO, Dana, LinkAja</p>
                      </div>
                      <div className="h-4 w-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        {paymentMethod === 'QRIS' && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('BANK_TRANSFER')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        paymentMethod === 'BANK_TRANSFER'
                          ? 'border-blue-500 dark:border-blue-600 bg-blue-50/20 dark:bg-blue-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/10'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Transfer Bank Manual</p>
                        <p className="text-xs text-slate-400">Kirim transfer langsung ke rekening bank BCA kami</p>
                      </div>
                      <div className="h-4 w-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        {paymentMethod === 'BANK_TRANSFER' && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                      </div>
                    </button>
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm font-semibold text-red-500 text-center">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-colors shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sedang Memproses Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Konfirmasi & Buat Order</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Review Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  Review Keranjang
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 mb-6 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between text-sm first:pt-0">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {item.type === 'media' 
                            ? 'Media Satuan' 
                            : item.type === 'backlink' 
                              ? 'Jasa Backlink' 
                              : 'Paket Hemat'}
                        </p>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white">{formatRupiah(item.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(cartSubtotal)}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Kupon Diskon</span>
                      <span className="font-semibold">-{formatRupiah(cartDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <span>Total Pembayaran</span>
                    <span>{formatRupiah(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
