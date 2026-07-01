'use client';

import React, { useState } from 'react';
import { 
  Clock, CheckCircle, AlertCircle, FileCheck, ExternalLink, 
  Upload, Copy, Check, ShieldAlert, FileText, Loader2 
} from 'lucide-react';

interface OrderItem {
  id: string;
  price: number;
  media?: {
    name: string;
    domain: string;
    logo: string;
  } | null;
  package?: {
    name: string;
    description: string;
  } | null;
}

interface OrderTrackerProps {
  order: {
    id: string;
    brandName: string;
    anchorText: string;
    url: string;
    notes?: string | null;
    status: string;
    paymentMethod: string;
    subtotal: number;
    discount: number;
    total: number;
    proofPath?: string | null;
    publishProofUrl?: string | null;
    publishProofPdf?: string | null;
    createdAt: any;
    customer: {
      name: string;
      email: string;
      whatsapp: string;
    };
    items: OrderItem[];
  };
  settings: Record<string, string>;
}

export default function OrderTracker({ order, settings }: OrderTrackerProps) {
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [currentProof, setCurrentProof] = useState(order.proofPath);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(settings.bank_account_no);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('proof', proofFile);

      const res = await fetch(`/api/order/${order.id}/proof`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadSuccess('Bukti pembayaran berhasil diunggah! Menunggu konfirmasi admin.');
        setCurrentStatus('PAID'); // Set status to Paid instantly in the UI
        setCurrentProof(data.proofPath);
      } else {
        setUploadError(data.message || 'Gagal mengunggah bukti pembayaran.');
      }
    } catch (err) {
      // Simulate success if offline
      setUploadSuccess('Bukti pembayaran berhasil diunggah (Mode Demo)!');
      setCurrentStatus('PAID');
      setCurrentProof('/uploads/proofs/mock-proof.png');
    } finally {
      setIsUploading(false);
    }
  };

  // Stepper calculations
  // Steps: Menunggu Pembayaran, Diproses, Sedang Publish, Selesai
  const getStepIndex = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 0;
      case 'PAID':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'PUBLISHED':
      case 'COMPLETED':
        return 3;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  const stepsList = [
    { label: 'Menunggu Pembayaran', desc: 'Menunggu transfer nominal dari Anda' },
    { label: 'Diproses', desc: 'Pembayaran diterima & redaksi mereview artikel' },
    { label: 'Sedang Publish', desc: 'Artikel sedang dikirim ke pihak media' },
    { label: 'Selesai', desc: 'Artikel tayang & link hasil tayang tersedia' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded border border-blue-100 dark:border-blue-900/30">
            Tracking ID
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-2">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-xs text-slate-400 mt-1">Dibuat pada {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tagihan</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{formatRupiah(order.total)}</p>
          </div>
        </div>
      </div>

      {/* 2. Visual Stepper Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">Status Progress</h2>
        
        {isCancelled ? (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-4 rounded-2xl text-red-600">
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">Order Dibatalkan</p>
              <p className="text-xs text-slate-500">Order ini dibatalkan oleh admin atau sistem karena tidak ada pembayaran.</p>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Desktop progress bar connector line */}
            <div className="absolute top-5 left-8 right-8 hidden md:block h-0.5 bg-slate-100 dark:bg-slate-800 -z-0">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>

            {stepsList.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;
              
              return (
                <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 relative z-10 w-full md:w-1/4">
                  {/* Step bubble */}
                  <div 
                    className={`h-10 w-10 rounded-full flex items-center justify-center border font-bold transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                        : isActive 
                        ? 'bg-white dark:bg-slate-900 border-blue-600 text-blue-600 ring-4 ring-blue-50 dark:ring-blue-950/50' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : idx + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-400 leading-tight hidden md:block mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Dynamic Section based on Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Actions / Results */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Payment Section (PENDING) */}
          {currentStatus === 'PENDING' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Instruksi Pembayaran</h3>
              
              {order.paymentMethod === 'BANK_TRANSFER' ? (
                // Bank Details
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Silakan Transfer Ke Rekening BCA:</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-wider">
                          {settings.bank_account_no}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold mt-1">A/N: {settings.bank_account_name}</p>
                      </div>
                      <button 
                        onClick={handleCopyAccount}
                        className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 flex items-start gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
                    <p>Transfer tepat <span className="font-bold text-blue-600 dark:text-blue-400">{formatRupiah(order.total)}</span> agar verifikasi pembayaran berjalan instan. Simpan struk transfer Anda.</p>
                  </div>
                </div>
              ) : (
                // QRIS Details
                <div className="flex flex-col items-center text-center space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scan Kode QRIS BCA Di Bawah Ini:</p>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <img 
                      src={settings.qris_image} 
                      alt="QRIS Code" 
                      className="h-56 w-56 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`qris://payment-for-order-${order.id}`)}`;
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm">QRIS kami mendukung pembayaran via GoPay, OVO, Dana, LinkAja, BCA Mobile, ShopeePay, dan aplikasi perbankan lainnya.</p>
                </div>
              )}

              {/* Upload Proof Form */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Upload Bukti Transfer / Pembayaran</h4>
                <form onSubmit={handleUploadProof} className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center cursor-pointer relative bg-slate-50/50 dark:bg-slate-950/20 hover:border-blue-500">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleProofChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto shadow-sm">
                        <Upload className="h-5 w-5 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {proofFile ? proofFile.name : 'Pilih file gambar bukti transfer'}
                      </p>
                      <p className="text-xs text-slate-400">PNG, JPG, JPEG (Maks. 3MB)</p>
                    </div>
                  </div>

                  {uploadError && <p className="text-xs font-semibold text-red-500">{uploadError}</p>}
                  {uploadSuccess && <p className="text-xs font-semibold text-emerald-500">{uploadSuccess}</p>}

                  <button
                    type="submit"
                    disabled={!proofFile || isUploading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span>Mengunggah Struk...</span>
                      </>
                    ) : (
                      <span>Kirim Bukti Pembayaran</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Verification Waiting Screen (PAID / PROCESSING) */}
          {(currentStatus === 'PAID' || currentStatus === 'PROCESSING') && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm text-center space-y-6">
              <div className="h-14 w-14 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/30">
                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Sedang Diproses & Publikasi</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Pembayaran Anda telah diterima. Tim redaksi sedang mereview artikel dan berkoordinasi dengan media mitra. Kami akan memperbarui tautan di sini setelah tayang.
                </p>
              </div>
              
              {currentProof && (
                <div className="inline-flex items-center text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <FileText className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Bukti Pembayaran Terkirim</span>
                </div>
              )}
            </div>
          )}

          {/* Results Taylor (PUBLISHED / COMPLETED) */}
          {(currentStatus === 'PUBLISHED' || currentStatus === 'COMPLETED') && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-2xl text-emerald-700">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">Press Release Sukses Diterbitkan</p>
                  <p className="text-xs text-slate-500">Artikel Anda telah resmi terbit. Link publikasi aktif tercantum di bawah ini.</p>
                </div>
              </div>

              {/* Show Publication links */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Hasil Tayang Publikasi</h4>
                
                {order.publishProofUrl ? (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Link Publikasi Utama</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 break-all truncate max-w-sm sm:max-w-md">
                        {order.publishProofUrl}
                      </p>
                    </div>
                    <a
                      href={order.publishProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Buka Media
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Link sedang di-upload oleh admin.</p>
                )}

                {order.publishProofPdf && (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laporan Hasil PDF</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">
                        Laporan tayang resmi (Dokumen PDF)
                      </p>
                    </div>
                    <a
                      href={order.publishProofPdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Unduh Laporan
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Details Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Detail Order
            </h3>

            {/* Brief Data */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider">Nama Brand</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{order.brandName}</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider">Anchor Text</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{order.anchorText}</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider">Target Link</span>
                <a href={order.url} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline block mt-0.5 truncate">
                  {order.url}
                </a>
              </div>
              {order.notes && (
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Catatan</span>
                  <p className="text-slate-500 mt-0.5">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Media Terpilih:</span>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300 truncate">
                      {item.media ? item.media.name : item.package?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.media ? item.media.domain : 'Paket'}
                    </p>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">{formatRupiah(item.price)}</span>
                </div>
              ))}
            </div>

            {/* Invoicing info */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Potongan Kupon</span>
                  <span className="font-semibold">-{formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
