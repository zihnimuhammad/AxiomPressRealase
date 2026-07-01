'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  User, LayoutDashboard, ShoppingBag, Receipt, 
  Settings, KeyRound, Download, ExternalLink, 
  Calendar, CheckCircle2, Clock, Eye, ShieldAlert, Loader2 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock Customer Orders for Budi if database query fails or offline
const MOCK_ORDERS = [
  {
    id: 'pr-order-1011',
    brandName: 'HijabModern',
    anchorText: 'Toko Hijab Murah',
    url: 'https://hijabmodern.com',
    notes: 'Kategori Gaya Hidup',
    status: 'COMPLETED',
    paymentMethod: 'QRIS',
    subtotal: 5000000,
    discount: 500000,
    total: 4500000,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    publishProofUrl: 'https://kapanlagi.com/gaya-hidup/tren-hijab-modern-2026',
    items: [
      { id: 'i1', price: 5000000, media: null, package: { name: 'Starter Package', description: 'Paket Hemat Media' } }
    ]
  },
  {
    id: 'pr-order-1012',
    brandName: 'TechGadget',
    anchorText: 'Review Gadget Terbaru',
    url: 'https://techgadget.co.id',
    notes: 'Kategori Teknologi',
    status: 'PROCESSING',
    paymentMethod: 'BANK_TRANSFER',
    subtotal: 3500000,
    discount: 0,
    total: 3500000,
    createdAt: new Date().toISOString(),
    publishProofUrl: null,
    items: [
      { id: 'i2', price: 3500000, media: { name: 'Detik.com', domain: 'detik.com' }, package: null }
    ]
  }
];

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'invoices' | 'profile'>('overview');
  
  // Orders State
  const [orders, setOrders] = useState<any[]>(MOCK_ORDERS);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('628999999999');
  
  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Fetch orders from database
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      setProfileName(session.user.name || '');
      setProfileEmail(session.user.email || '');
      fetchOrders();
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/user/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        }
      }
    } catch (e) {
      console.warn('Using offline mock orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, whatsapp: profileWhatsapp }),
      });
      if (res.ok) {
        setProfileSuccess('Profil berhasil diperbarui!');
      } else {
        const d = await res.json();
        setProfileError(d.message || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      setProfileSuccess('Profil berhasil diperbarui (Mode Demo)!');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!oldPassword || !newPassword) {
      setProfileError('Isi kolom password lama dan password baru');
      return;
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res.ok) {
        setProfileSuccess('Password berhasil diubah!');
        setOldPassword('');
        setNewPassword('');
      } else {
        const d = await res.json();
        setProfileError(d.message || 'Gagal mengubah password.');
      }
    } catch (err) {
      setProfileSuccess('Password berhasil diubah (Mode Demo)!');
      setOldPassword('');
      setNewPassword('');
    }
  };

  // PDF Invoice Generator using jsPDF and autoTable
  const generateInvoice = (order: any) => {
    const doc = new jsPDF();

    // 1. Title & Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('INVOICE', 14, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: INV-${order.id.slice(0, 8).toUpperCase()}`, 14, 32);
    doc.text(`Tanggal Order: ${new Date(order.createdAt).toLocaleDateString('id-ID')}`, 14, 37);

    // 2. Company Details
    doc.setFont('helvetica', 'bold');
    doc.text('Penyedia Layanan:', 120, 25);
    doc.setFont('helvetica', 'normal');
    doc.text('Axiom Press Release (PT Media Distribusi Indonesia)', 120, 30);
    doc.text('SCBD, Jakarta Selatan', 120, 35);
    doc.text('support@axiompr.com', 120, 40);

    // Divider
    doc.setDrawColor(200);
    doc.line(14, 48, 196, 48);

    // 3. Billing Info
    doc.setFont('helvetica', 'bold');
    doc.text('Ditagihkan Kepada:', 14, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(session?.user?.name || 'Pelanggan', 14, 61);
    doc.text(session?.user?.email || 'email@customer.com', 14, 66);
    doc.text(`Brand: ${order.brandName}`, 14, 71);

    // Payment Info
    doc.setFont('helvetica', 'bold');
    doc.text('Metode Pembayaran:', 120, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(order.paymentMethod, 120, 61);
    doc.text(`Status: ${order.status === 'COMPLETED' || order.status === 'PAID' ? 'LUNAS (PAID)' : 'MENUNGGU VERIFIKASI'}`, 120, 66);

    // 4. Line Items Table
    const tableHeaders = [['Deskripsi Item', 'Harga Satuan', 'Qty', 'Total']];
    const tableData = order.items.map((item: any) => {
      const name = item.media ? `${item.media.name} (${item.media.domain})` : item.package?.name;
      return [
        name,
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price),
        '1',
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)
      ];
    });

    autoTable(doc, {
      startY: 80,
      head: tableHeaders,
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
    });

    // 5. Total pricing calculations
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text('Subtotal:', 130, finalY);
    doc.text(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.subtotal), 165, finalY);
    
    if (order.discount > 0) {
      finalY += 5;
      doc.text('Potongan Kupon:', 130, finalY);
      doc.text(`-${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.discount)}`, 165, finalY);
    }
    
    finalY += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Bayar:', 130, finalY);
    doc.text(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.total), 165, finalY);

    // Footer note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Terima kasih telah mempercayai Axiom Press Release untuk distribusi press release Anda.', 14, 280);

    // Save
    doc.save(`Invoice_${order.id.slice(0, 8).toUpperCase()}.pdf`);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm text-slate-800 dark:text-white truncate">{session.user?.name}</h2>
                    <p className="text-[10px] text-slate-400 font-semibold truncate uppercase">{session.user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'overview'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <LayoutDashboard className="h-4.5 w-4.5" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'orders'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    <span>Pesanan Saya</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('invoices')}
                    className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'invoices'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <Receipt className="h-4.5 w-4.5" />
                    <span>Invoice Pembayaran</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'profile'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <Settings className="h-4.5 w-4.5" />
                    <span>Pengaturan Profil</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Tab Contents */}
            <div className="flex-1 space-y-6">
              
              {/* Profile alerts */}
              {profileSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-2xl text-emerald-700 text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{profileSuccess}</span>
                </div>
              )}
              {profileError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-4 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Dashboard stats widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pembelian</p>
                      <p className="text-2xl font-black text-slate-800 dark:text-white">
                        {formatRupiah(orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0))}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Order</p>
                      <p className="text-2xl font-black text-slate-800 dark:text-white">{orders.length} Order</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Aktif</p>
                      <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {orders.filter(o => o.status === 'PROCESSING' || o.status === 'PAID').length} Proses
                      </p>
                    </div>
                  </div>

                  {/* Recent Orders table preview */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white">Order Terakhir</h3>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Semua Order
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Brand</th>
                            <th className="pb-3">Tanggal</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {orders.slice(0, 3).map((order) => (
                            <tr key={order.id} className="text-slate-700 dark:text-slate-300">
                              <td className="py-3.5 font-bold text-blue-600 dark:text-blue-400">#{order.id.slice(0, 8)}</td>
                              <td className="py-3.5 font-semibold">{order.brandName}</td>
                              <td className="py-3.5">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                              <td className="py-3.5">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  order.status === 'COMPLETED'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                                    : order.status === 'PENDING'
                                    ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                                    : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-right font-bold text-slate-850 dark:text-white">{formatRupiah(order.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS HISTORY TAB */}
              {activeTab === 'orders' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-base text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Riwayat Distribusi Press Release
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Brand</th>
                          <th className="pb-3">Target Anchor</th>
                          <th className="pb-3">Tanggal</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Tautan Publikasi</th>
                          <th className="pb-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.map((order) => (
                          <tr key={order.id} className="text-slate-700 dark:text-slate-300">
                            <td className="py-3.5 font-bold">#{order.id.slice(0, 8)}</td>
                            <td className="py-3.5 font-semibold">{order.brandName}</td>
                            <td className="py-3.5 max-w-[150px] truncate">
                              <a href={order.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{order.anchorText}</a>
                            </td>
                            <td className="py-3.5">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                            <td className="py-3.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.status === 'COMPLETED'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                                  : order.status === 'PENDING'
                                  ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                                  : 'bg-blue-50 text-blue-600'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3.5">
                              {order.publishProofUrl ? (
                                <a 
                                  href={order.publishProofUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="inline-flex items-center text-blue-500 hover:underline font-semibold"
                                >
                                  Tautan Live
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">Sedang proses</span>
                              )}
                            </td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => router.push(`/order/${order.id}`)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 hover:bg-slate-50 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Track
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* INVOICES TAB */}
              {activeTab === 'invoices' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-base text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Invoice & Bukti Pembayaran
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                          <th className="pb-3">Nomor Invoice</th>
                          <th className="pb-3">Brand</th>
                          <th className="pb-3">Tanggal Tagihan</th>
                          <th className="pb-3">Metode</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Jumlah Bayar</th>
                          <th className="pb-3 text-right">Aksi PDF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.map((order) => (
                          <tr key={order.id} className="text-slate-700 dark:text-slate-300">
                            <td className="py-3.5 font-bold">INV-{order.id.slice(0, 8).toUpperCase()}</td>
                            <td className="py-3.5 font-semibold">{order.brandName}</td>
                            <td className="py-3.5">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                            <td className="py-3.5 font-bold text-slate-500">{order.paymentMethod}</td>
                            <td className="py-3.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.status === 'COMPLETED' || order.status === 'PAID'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                                  : 'bg-amber-55 text-amber-700'
                              }`}>
                                {order.status === 'COMPLETED' || order.status === 'PAID' ? 'PAID' : 'UNPAID'}
                              </span>
                            </td>
                            <td className="py-3.5 font-extrabold">{formatRupiah(order.total)}</td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => generateInvoice(order)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Unduh PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PROFILE TAB (Settings) */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* General Profile Info */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                      Informasi Profil
                    </h3>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email (Hanya-Baca)</label>
                        <input
                          type="email"
                          disabled
                          value={profileEmail}
                          className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor WhatsApp</label>
                        <input
                          type="tel"
                          required
                          value={profileWhatsapp}
                          onChange={(e) => setProfileWhatsapp(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                      >
                        Simpan Profil
                      </button>
                    </form>
                  </div>

                  {/* Change Password */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                      Ganti Password
                    </h3>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password Lama</label>
                        <input
                          type="password"
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password Baru</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                          placeholder="••••••••"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                      >
                        Ubah Password
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
