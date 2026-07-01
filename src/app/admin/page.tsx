'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  LayoutDashboard, Globe, Briefcase, ShoppingCart, 
  Users, Ticket, FileText, Settings, 
  Plus, Edit, Trash2, Upload, 
  Percent, FileSpreadsheet, FileDown, CheckCircle2, 
  Loader2, Save, Link2, Search, MessageSquare 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      const role = (session.user as any).role;
      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'STAFF') {
        router.push('/dashboard');
      }
    }
  }, [session, status, router]);

  // View tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'packages' | 'orders' | 'customers' | 'vouchers' | 'blogs' | 'settings'>('overview');

  // Main CRUD states
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [vouchersList, setVouchersList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  
  // Settings Form State
  const [siteTitle, setSiteTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [whatsappAdmin, setWhatsappAdmin] = useState('');
  const [bankNo, setBankNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [footerDesc, setFooterDesc] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Backlink states
  const [backlinksList, setBacklinksList] = useState<any[]>([]);
  const [showBacklinkModal, setShowBacklinkModal] = useState(false);
  const [selectedBacklink, setSelectedBacklink] = useState<any>(null);
  const [backlinkName, setBacklinkName] = useState('');
  const [backlinkDomain, setBacklinkDomain] = useState('');
  const [backlinkDa, setBacklinkDa] = useState('');
  const [backlinkDr, setBacklinkDr] = useState('');
  const [backlinkTraffic, setBacklinkTraffic] = useState('');
  const [backlinkPrice, setBacklinkPrice] = useState('');
  const [backlinkStatus, setBacklinkStatus] = useState('ACTIVE');
  const [backlinkNotes, setBacklinkNotes] = useState('');
  const [backlinkLogo, setBacklinkLogo] = useState('');
  const [bulkBacklinkPercentage, setBulkBacklinkPercentage] = useState('');
  const [bulkBacklinkType, setBulkBacklinkType] = useState<'increase' | 'decrease'>('increase');
  const [bulkBacklinkSuccess, setBulkBacklinkSuccess] = useState('');
  const [backlinkSearch, setBacklinkSearch] = useState('');

  // Testimonial states
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [testName, setTestName] = useState('');
  const [testCompany, setTestCompany] = useState('');
  const [testAvatar, setTestAvatar] = useState('');
  const [testContent, setTestContent] = useState('');
  const [testRating, setTestRating] = useState('5');
  const [testimonialSearch, setTestimonialSearch] = useState('');

  // Overview Stats
  const [overviewStats, setOverviewStats] = useState<any>({
    totalIncome: 0,
    totalOrders: 0,
    totalMedia: 0,
    totalCustomers: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  // Loading States
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Bulk Price State
  const [bulkPercentage, setBulkPercentage] = useState('');
  const [bulkType, setBulkType] = useState<'increase' | 'decrease'>('increase');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // MODALS STATE
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [mediaName, setMediaName] = useState('');
  const [mediaDomain, setMediaDomain] = useState('');
  const [mediaCategoryId, setMediaCategoryId] = useState('');
  const [mediaDa, setMediaDa] = useState('');
  const [mediaDr, setMediaDr] = useState('');
  const [mediaTraffic, setMediaTraffic] = useState('');
  const [mediaPrice, setMediaPrice] = useState('');
  const [mediaStatus, setMediaStatus] = useState('ACTIVE');
  const [mediaNotes, setMediaNotes] = useState('');
  const [mediaLogo, setMediaLogo] = useState('');

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDiscount, setPkgDiscount] = useState('');
  const [pkgStatus, setPkgStatus] = useState('ACTIVE');
  const [pkgMediaIds, setPkgMediaIds] = useState<string[]>([]);
  
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [vouchCode, setVouchCode] = useState('');
  const [vouchType, setVouchType] = useState('PERCENT');
  const [vouchValue, setVouchValue] = useState('');
  const [vouchMinSpend, setVouchMinSpend] = useState('');
  const [vouchExpiredAt, setVouchExpiredAt] = useState('');
  const [vouchStatus, setVouchStatus] = useState('ACTIVE');

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogThumbnail, setBlogThumbnail] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogSeoTitle, setBlogSeoTitle] = useState('');
  const [blogSeoDesc, setBlogSeoDesc] = useState('');

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editOrderStatus, setEditOrderStatus] = useState('PENDING');
  const [editOrderUrl, setEditOrderUrl] = useState('');

  // General Notification Alert State
  const [successAlert, setSuccessAlert] = useState('');

  // Fetch all data from APIs
  const fetchAllData = async () => {
    if (status !== 'authenticated') return;
    try {
      setIsLoadingData(true);
      
      // 1. Overview Stats
      const overviewRes = await fetch('/api/admin/overview');
      if (overviewRes.ok) {
        const oData = await overviewRes.json();
        setOverviewStats({
          totalIncome: oData.totalIncome,
          totalOrders: oData.totalOrders,
          totalMedia: oData.totalMedia,
          totalBacklinks: oData.totalBacklinks || 0,
          totalCustomers: oData.totalCustomers
        });
        setChartData(oData.chartData || []);
      }

      // 2. Media & Categories
      const mediaRes = await fetch('/api/admin/media');
      if (mediaRes.ok) {
        const mData = await mediaRes.json();
        setMediaList(mData.media || []);
        setCategories(mData.categories || []);
      }

      // 3. Packages
      const packagesRes = await fetch('/api/admin/packages');
      if (packagesRes.ok) {
        const pData = await packagesRes.json();
        setPackagesList(pData.packages || []);
      }

      // 4. Vouchers
      const vouchersRes = await fetch('/api/admin/vouchers');
      if (vouchersRes.ok) {
        const vData = await vouchersRes.json();
        setVouchersList(vData.vouchers || []);
      }

      // 5. Blogs
      const blogsRes = await fetch('/api/admin/blogs');
      if (blogsRes.ok) {
        const bData = await blogsRes.json();
        setBlogsList(bData.blogs || []);
      }

      // 6. Settings
      const settingsRes = await fetch('/api/admin/settings');
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData.settings) {
          setSiteTitle(sData.settings.site_title || '');
          setMetaDesc(sData.settings.meta_description || '');
          setWhatsappAdmin(sData.settings.whatsapp_admin || '');
          setBankNo(sData.settings.bank_account_no || '');
          setBankName(sData.settings.bank_name || '');
          setHeroTitle(sData.settings.hero_title || '');
          setFooterDesc(sData.settings.footer_description || '');
          setContactAddress(sData.settings.contact_address || '');
          setEmailAdmin(sData.settings.email_admin || '');
        }
      }

      // 8. Backlinks
      const backlinksRes = await fetch('/api/admin/backlinks');
      if (backlinksRes.ok) {
        const blData = await backlinksRes.json();
        setBacklinksList(blData.backlinks || []);
      }

      // 9. Testimonials
      const testimonialsRes = await fetch('/api/admin/testimonials');
      if (testimonialsRes.ok) {
        const tData = await testimonialsRes.json();
        setTestimonialsList(tData.testimonials || []);
      }

      // 7. Orders & Customers
      const ordersRes = await fetch('/api/admin/orders');
      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        setOrdersList(ordData.orders || []);

        // Derive Customers from Orders
        const custMap: Record<string, any> = {};
        (ordData.orders || []).forEach((o: any) => {
          if (o.customer) {
            const email = o.customer.email;
            if (!custMap[email]) {
              custMap[email] = {
                name: o.customer.name,
                email: o.customer.email,
                whatsapp: o.customer.whatsapp,
                totalOrders: 0,
                totalSpend: 0
              };
            }
            if (o.status !== 'CANCELLED') {
              custMap[email].totalOrders += 1;
              custMap[email].totalSpend += o.total;
            }
          }
        });
        setCustomersList(Object.values(custMap));
      }

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAllData();
    }
  }, [status]);

  // Bulk Price Calculation Action
  const handleBulkPriceUpdate = async () => {
    const percent = parseFloat(bulkPercentage);
    if (isNaN(percent) || percent <= 0) return;

    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: bulkType, percentage: percent })
      });
      if (res.ok) {
        setBulkSuccess(`Berhasil ${bulkType === 'increase' ? 'menaikkan' : 'menurunkan'} harga semua media sebesar ${percent}%!`);
        setBulkPercentage('');
        fetchAllData();
        setTimeout(() => setBulkSuccess(''), 4000);
      } else {
        alert('Gagal memperbarui harga massal.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Import Media from Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        let importedCount = 0;
        for (const row of (data as any[])) {
          const name = row.Nama || row.name || 'Unnamed Media';
          const domain = row.Domain || row.domain || 'example.com';
          const da = parseInt(row.DA || row.da || '20');
          const dr = parseInt(row.DR || row.dr || '20');
          const traffic = parseInt(row.Traffic || row.traffic || '50000');
          const price = parseFloat(row.Harga || row.price || '1500000');
          const notes = row.Catatan || row.notes || '';

          // Create in DB
          await fetch('/api/admin/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name, domain, categoryId: categories[0]?.id || '1', da, dr, traffic, price, notes
            })
          });
          importedCount++;
        }

        setSuccessAlert(`Sukses mengimpor ${importedCount} media dari Excel!`);
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } catch (err) {
        alert('Gagal mengimpor file Excel. Pastikan format kolom sesuai.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Export Media to Excel / CSV / PDF
  const handleExport = (type: 'excel' | 'csv' | 'pdf') => {
    const cleanData = mediaList.map(m => ({
      Nama: m.name,
      Domain: m.domain,
      DA: m.da,
      DR: m.dr,
      Trafik: m.traffic,
      Harga: m.price,
      Status: m.status
    }));

    if (type === 'excel') {
      const ws = XLSX.utils.json_to_sheet(cleanData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Mitra Media');
      XLSX.writeFile(wb, 'Mitra_Media_AxiomPR.xlsx');
    } else if (type === 'csv') {
      const ws = XLSX.utils.json_to_sheet(cleanData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "Mitra_Media_AxiomPR.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Daftar Mitra Media Press Release - Axiom Press Release', 14, 20);
      
      const headers = [['Nama Media', 'Domain', 'DA', 'DR', 'Estimasi Trafik', 'Harga Publish']];
      const rows = mediaList.map(m => [
        m.name,
        m.domain,
        m.da.toString(),
        m.dr.toString(),
        new Intl.NumberFormat('id-ID').format(m.traffic),
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(m.price)
      ]);

      autoTable(doc, {
        startY: 25,
        head: headers,
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.save('Daftar_Mitra_Media_AxiomPR.pdf');
    }
  };

  // Update Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_title: siteTitle,
          meta_description: metaDesc,
          whatsapp_admin: whatsappAdmin,
          bank_account_no: bankNo,
          bank_name: bankName,
          hero_title: heroTitle,
          footer_description: footerDesc,
          contact_address: contactAddress,
          email_admin: emailAdmin
        })
      });
      if (res.ok) {
        setSettingsSuccess('Pengaturan website berhasil diperbarui!');
        fetchAllData();
        setTimeout(() => setSettingsSuccess(''), 4000);
      } else {
        alert('Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Management Status Edit Action
  const handleOpenOrderEdit = (order: any) => {
    setSelectedOrder(order);
    setEditOrderStatus(order.status);
    setEditOrderUrl(order.publishProofUrl || '');
    setShowOrderModal(true);
  };

  const handleSaveOrderStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: editOrderStatus,
          publishProofUrl: editOrderUrl
        })
      });
      if (res.ok) {
        setShowOrderModal(false);
        setSuccessAlert(`Status Order #${selectedOrder.id.slice(0, 8)} sukses diupdate ke ${editOrderStatus}!`);
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } else {
        alert('Gagal memperbarui status order.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Media CRUD handlers
  const handleOpenMediaAdd = () => {
    setSelectedMedia(null);
    setMediaName('');
    setMediaDomain('');
    setMediaCategoryId(categories[0]?.id || '');
    setMediaDa('20');
    setMediaDr('20');
    setMediaTraffic('50000');
    setMediaPrice('');
    setMediaStatus('ACTIVE');
    setMediaNotes('');
    setMediaLogo('');
    setShowMediaModal(true);
  };

  const handleOpenMediaEdit = (media: any) => {
    setSelectedMedia(media);
    setMediaName(media.name);
    setMediaDomain(media.domain);
    setMediaCategoryId(media.categoryId);
    setMediaDa(String(media.da));
    setMediaDr(String(media.dr));
    setMediaTraffic(String(media.traffic));
    setMediaPrice(String(media.price));
    setMediaStatus(media.status);
    setMediaNotes(media.notes || '');
    setMediaLogo(media.logo || '');
    setShowMediaModal(true);
  };

  const handleSaveMedia = async () => {
    if (!mediaName || !mediaDomain || !mediaCategoryId || !mediaPrice) {
      alert('Mohon lengkapi semua kolom wajib.');
      return;
    }

    try {
      const payload = {
        id: selectedMedia?.id,
        name: mediaName,
        domain: mediaDomain,
        categoryId: mediaCategoryId,
        da: parseInt(mediaDa) || 20,
        dr: parseInt(mediaDr) || 20,
        traffic: parseInt(mediaTraffic) || 10000,
        price: parseFloat(mediaPrice),
        status: mediaStatus,
        notes: mediaNotes,
        logo: mediaLogo
      };

      const res = await fetch('/api/admin/media', {
        method: selectedMedia ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowMediaModal(false);
        setSuccessAlert(selectedMedia ? 'Mitra media berhasil diperbarui!' : 'Mitra media baru berhasil ditambahkan!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan media.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus media ini?')) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessAlert('Media berhasil dihapus!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 3000);
      } else {
        alert('Gagal menghapus media.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Backlink CRUD handlers
  const handleOpenBacklinkAdd = () => {
    setSelectedBacklink(null);
    setBacklinkName('');
    setBacklinkDomain('');
    setBacklinkDa('20');
    setBacklinkDr('20');
    setBacklinkTraffic('50000');
    setBacklinkPrice('');
    setBacklinkStatus('ACTIVE');
    setBacklinkNotes('');
    setBacklinkLogo('');
    setShowBacklinkModal(true);
  };

  const handleOpenBacklinkEdit = (bl: any) => {
    setSelectedBacklink(bl);
    setBacklinkName(bl.name);
    setBacklinkDomain(bl.domain);
    setBacklinkDa(String(bl.da));
    setBacklinkDr(String(bl.dr));
    setBacklinkTraffic(String(bl.traffic));
    setBacklinkPrice(String(bl.price));
    setBacklinkStatus(bl.status);
    setBacklinkNotes(bl.notes || '');
    setBacklinkLogo(bl.logo || '');
    setShowBacklinkModal(true);
  };

  const handleSaveBacklink = async () => {
    if (!backlinkName || !backlinkDomain || !backlinkPrice) {
      alert('Mohon lengkapi semua kolom wajib.');
      return;
    }

    try {
      const payload = {
        id: selectedBacklink?.id,
        name: backlinkName,
        domain: backlinkDomain,
        da: parseInt(backlinkDa) || 20,
        dr: parseInt(backlinkDr) || 20,
        traffic: parseInt(backlinkTraffic) || 10000,
        price: parseFloat(backlinkPrice),
        status: backlinkStatus,
        notes: backlinkNotes,
        logo: backlinkLogo
      };

      const res = await fetch('/api/admin/backlinks', {
        method: selectedBacklink ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowBacklinkModal(false);
        setSuccessAlert(selectedBacklink ? 'Backlink berhasil diperbarui!' : 'Backlink baru berhasil ditambahkan!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan backlink.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBacklink = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus backlink ini?')) return;
    try {
      const res = await fetch(`/api/admin/backlinks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessAlert('Backlink berhasil dihapus!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 3000);
      } else {
        alert('Gagal menghapus backlink.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkBacklinkPriceUpdate = async () => {
    const percent = parseFloat(bulkBacklinkPercentage);
    if (isNaN(percent) || percent <= 0) {
      alert('Mohon masukkan persentase yang valid (lebih besar dari 0).');
      return;
    }

    try {
      const res = await fetch('/api/admin/backlinks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: bulkBacklinkType, percentage: percent })
      });
      if (res.ok) {
        setBulkBacklinkSuccess(`Berhasil ${bulkBacklinkType === 'increase' ? 'menaikkan' : 'menurunkan'} harga semua backlink sebesar ${percent}%!`);
        setBulkBacklinkPercentage('');
        fetchAllData();
        setTimeout(() => setBulkBacklinkSuccess(''), 4000);
      } else {
        alert('Gagal memperbarui harga massal backlink.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Import Backlinks from Excel
  const handleImportBacklinkExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        let importedCount = 0;
        for (const row of (data as any[])) {
          const name = row.Nama || row.name || 'Unnamed Backlink';
          const domain = row.Domain || row.domain || 'example.com';
          const da = parseInt(row.DA || row.da || '20');
          const dr = parseInt(row.DR || row.dr || '20');
          const traffic = parseInt(row.Traffic || row.traffic || '50000');
          const price = parseFloat(row.Harga || row.price || '1500000');
          const notes = row.Catatan || row.notes || '';

          // Create in DB
          await fetch('/api/admin/backlinks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name, domain, da, dr, traffic, price, notes
            })
          });
          importedCount++;
        }

        setSuccessAlert(`Sukses mengimpor ${importedCount} backlink dari Excel!`);
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } catch (err) {
        alert('Gagal mengimpor file Excel. Pastikan format kolom sesuai.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Testimonials CRUD handlers
  const handleOpenTestimonialAdd = () => {
    setSelectedTestimonial(null);
    setTestName('');
    setTestCompany('');
    setTestAvatar('');
    setTestContent('');
    setTestRating('5');
    setShowTestimonialModal(true);
  };

  const handleOpenTestimonialEdit = (t: any) => {
    setSelectedTestimonial(t);
    setTestName(t.name);
    setTestCompany(t.company);
    setTestAvatar(t.avatar || '');
    setTestContent(t.content);
    setTestRating(String(t.rating));
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonial = async () => {
    if (!testName || !testCompany || !testContent) {
      alert('Mohon isi nama, nama perusahaan/jabatan, dan konten testimoni.');
      return;
    }

    try {
      const payload = {
        id: selectedTestimonial?.id,
        name: testName,
        company: testCompany,
        avatar: testAvatar,
        content: testContent,
        rating: parseInt(testRating) || 5,
      };

      const res = await fetch('/api/admin/testimonials', {
        method: selectedTestimonial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowTestimonialModal(false);
        setSuccessAlert(selectedTestimonial ? 'Testimoni berhasil diperbarui!' : 'Testimoni baru berhasil ditambahkan!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan testimoni.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessAlert('Testimoni berhasil dihapus!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 3000);
      } else {
        alert('Gagal menghapus testimoni.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Packages CRUD handlers
  const handleOpenPackageAdd = () => {
    setSelectedPackage(null);
    setPkgName('');
    setPkgDesc('');
    setPkgPrice('');
    setPkgDiscount('0');
    setPkgStatus('ACTIVE');
    setPkgMediaIds([]);
    setShowPackageModal(true);
  };

  const handleSavePackage = async () => {
    if (!pkgName || !pkgDesc || !pkgPrice || pkgMediaIds.length === 0) {
      alert('Mohon isi nama, deskripsi, harga, dan pilih minimal 1 media.');
      return;
    }

    try {
      const payload = {
        id: selectedPackage?.id,
        name: pkgName,
        description: pkgDesc,
        price: parseFloat(pkgPrice),
        discount: parseFloat(pkgDiscount) || 0,
        status: pkgStatus,
        mediaIds: pkgMediaIds
      };

      const res = await fetch('/api/admin/packages', {
        method: selectedPackage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowPackageModal(false);
        setSuccessAlert(selectedPackage ? 'Paket hemat berhasil diperbarui!' : 'Paket hemat baru berhasil ditambahkan!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } else {
        alert('Gagal menyimpan paket hemat.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessAlert('Paket berhasil dihapus!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 3000);
      } else {
        alert('Gagal menghapus paket.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Vouchers CRUD handlers
  const handleOpenVoucherAdd = () => {
    setSelectedVoucher(null);
    setVouchCode('');
    setVouchType('PERCENT');
    setVouchValue('');
    setVouchMinSpend('0');
    setVouchExpiredAt('');
    setVouchStatus('ACTIVE');
    setShowVoucherModal(true);
  };

  const handleSaveVoucher = async () => {
    if (!vouchCode || !vouchValue || !vouchExpiredAt) {
      alert('Mohon lengkapi kode, nilai potongan, dan tanggal kedaluwarsa.');
      return;
    }

    try {
      const payload = {
        id: selectedVoucher?.id,
        code: vouchCode,
        type: vouchType,
        value: parseFloat(vouchValue),
        minSpend: parseFloat(vouchMinSpend) || 0,
        expiredAt: vouchExpiredAt,
        status: vouchStatus
      };

      const res = await fetch('/api/admin/vouchers', {
        method: selectedVoucher ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowVoucherModal(false);
        setSuccessAlert(selectedVoucher ? 'Voucher berhasil diperbarui!' : 'Voucher baru berhasil ditambahkan!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } else {
        alert('Gagal menyimpan voucher.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voucher ini?')) return;
    try {
      const res = await fetch(`/api/admin/vouchers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessAlert('Voucher berhasil dihapus!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 3000);
      } else {
        alert('Gagal menghapus voucher.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Blogs CRUD handlers
  const handleOpenBlogAdd = () => {
    setSelectedBlog(null);
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
    setBlogCategory('Tips & Panduan');
    setBlogThumbnail('');
    setBlogSlug('');
    setBlogSeoTitle('');
    setBlogSeoDesc('');
    setShowBlogModal(true);
  };

  const handleOpenBlogEdit = (post: any) => {
    setSelectedBlog(post);
    setBlogTitle(post.title);
    setBlogSummary(post.summary);
    setBlogContent(post.content);
    setBlogCategory(post.category);
    setBlogThumbnail(post.thumbnail || '');
    setBlogSlug(post.slug);
    setBlogSeoTitle(post.seoTitle || '');
    setBlogSeoDesc(post.seoDesc || '');
    setShowBlogModal(true);
  };

  const handleSaveBlog = async () => {
    if (!blogTitle || !blogSummary || !blogContent || !blogCategory) {
      alert('Mohon isi judul, ringkasan, konten, dan kategori artikel.');
      return;
    }

    try {
      const payload = {
        id: selectedBlog?.id,
        title: blogTitle,
        summary: blogSummary,
        content: blogContent,
        category: blogCategory,
        thumbnail: blogThumbnail,
        slug: blogSlug,
        seoTitle: blogSeoTitle,
        seoDesc: blogSeoDesc
      };

      const res = await fetch('/api/admin/blogs', {
        method: selectedBlog ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowBlogModal(false);
        setSuccessAlert(selectedBlog ? 'Artikel berhasil diperbarui!' : 'Artikel blog baru berhasil diposting!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 4000);
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan artikel blog.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel blog ini?')) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessAlert('Artikel blog berhasil dihapus!');
        fetchAllData();
        setTimeout(() => setSuccessAlert(''), 3000);
      } else {
        alert('Gagal menghapus artikel.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Formatters
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  if (status === 'loading' || (status === 'authenticated' && isLoadingData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Memuat data panel admin...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Notification Alert Banner */}
          {successAlert && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-2xl text-emerald-700 font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>{successAlert}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Admin Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menu Admin</h2>
                  <span className="text-[9px] font-extrabold uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                    {(session.user as any).role} Panel
                  </span>
                </div>

                <nav className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {[
                    { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
                    { id: 'media', name: 'Mitra Media', icon: <Globe className="h-4.5 w-4.5" /> },
                    { id: 'packages', name: 'Paket Hemat', icon: <Briefcase className="h-4.5 w-4.5" /> },
                    { id: 'orders', name: 'Order Masuk', icon: <ShoppingCart className="h-4.5 w-4.5" /> },
                    { id: 'customers', name: 'Customer Stats', icon: <Users className="h-4.5 w-4.5" /> },
                    { id: 'vouchers', name: 'Kupon Diskon', icon: <Ticket className="h-4.5 w-4.5" /> },
                    { id: 'blogs', name: 'Kelola Blog', icon: <FileText className="h-4.5 w-4.5" /> },
                    { id: 'backlinks', name: 'Kelola Backlink', icon: <Link2 className="h-4.5 w-4.5" /> },
                    { id: 'testimonials', name: 'Testimoni Klien', icon: <MessageSquare className="h-4.5 w-4.5" /> },
                    { id: 'settings', name: 'Pengaturan Web', icon: <Settings className="h-4.5 w-4.5" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-850/50'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Admin Dynamic Content */}
            <div className="flex-1 space-y-6">
              
              {/* OVERVIEW PANEL */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Total Pendapatan</p>
                      <p className="text-sm sm:text-lg font-black text-slate-800 dark:text-white truncate">
                        {formatRupiah(overviewStats.totalIncome)}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Jumlah Order</p>
                      <p className="text-sm sm:text-lg font-black text-slate-800 dark:text-white">{overviewStats.totalOrders} Order</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Media PR</p>
                      <p className="text-sm sm:text-lg font-black text-slate-800 dark:text-white">{overviewStats.totalMedia} Portal</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Media Backlink</p>
                      <p className="text-sm sm:text-lg font-black text-slate-800 dark:text-white">{overviewStats.totalBacklinks || 0} Blog</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1 col-span-2 sm:col-span-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Total Customer</p>
                      <p className="text-sm sm:text-lg font-black text-slate-800 dark:text-white">{overviewStats.totalCustomers} Orang</p>
                    </div>
                  </div>

                  {/* Sales Chart */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-850 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-6">
                      Grafik Penjualan Bulanan (Rp)
                    </h3>
                    <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-800">
                      {chartData.map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatRupiah(bar.val)}
                          </span>
                          <div 
                            style={{ height: `${Math.max(10, (bar.val / Math.max(...chartData.map(d=>d.val || 1))) * 100)}%` }}
                            className="w-full bg-blue-600 group-hover:bg-blue-700 rounded-t-lg transition-all duration-300" 
                          />
                          <span className="text-[10px] font-bold text-slate-500">{bar.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MITRA MEDIA TAB (CRUD + Import/Export + Bulk) */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Bulk edit prices card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Percent className="h-4.5 w-4.5 text-blue-500" />
                      Manajemen Harga Otomatis (Bulk Edit)
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <select
                        value={bulkType}
                        onChange={(e) => setBulkType(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none dark:bg-slate-800 dark:text-white"
                      >
                        <option value="increase">Naikkan Harga Semua Media (%)</option>
                        <option value="decrease">Turunkan Harga Semua Media (%)</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Persentase (cth: 20)"
                        value={bulkPercentage}
                        onChange={(e) => setBulkPercentage(e.target.value)}
                        className="bg-slate-50 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs w-full sm:w-40 focus:outline-none dark:bg-slate-800 dark:text-white"
                      />
                      <button
                        onClick={handleBulkPriceUpdate}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Terapkan Kenaikan/Penurunan
                      </button>
                    </div>
                    {bulkSuccess && <p className="text-[11px] font-bold text-emerald-500">{bulkSuccess}</p>}
                  </div>

                  {/* Actions row: Add, Import, Export */}
                  <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleOpenMediaAdd}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Media
                      </button>

                      {/* Excel Import button */}
                      <div className="relative overflow-hidden inline-flex items-center gap-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-4 py-2.5 cursor-pointer">
                        <Upload className="h-4 w-4 text-slate-400" />
                        <span>Import Excel</span>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleImportExcel}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        />
                      </div>
                    </div>

                    {/* Export dropdowns */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleExport('excel')}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-350"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        Excel
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-350"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                        CSV
                      </button>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-350"
                      >
                        <FileDown className="h-4 w-4 text-red-500" />
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* Media Table */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[600px]">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                          <th className="pb-3">Nama Media</th>
                          <th className="pb-3">Domain</th>
                          <th className="pb-3">DA</th>
                          <th className="pb-3">DR</th>
                          <th className="pb-3">Trafik</th>
                          <th className="pb-3">Harga</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {mediaList.map((media) => (
                          <tr key={media.id} className="text-slate-700 dark:text-slate-300">
                            <td className="py-3 font-semibold">{media.name}</td>
                            <td className="py-3 text-blue-500">{media.domain}</td>
                            <td className="py-3 font-bold">{media.da}</td>
                            <td className="py-3 font-bold">{media.dr}</td>
                            <td className="py-3">{new Intl.NumberFormat('id-ID').format(media.traffic)}</td>
                            <td className="py-3 font-extrabold text-slate-800 dark:text-white">{formatRupiah(media.price)}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${media.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-slate-100 text-slate-500'}`}>
                                {media.status}
                              </span>
                            </td>
                            <td className="py-3 text-right flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => handleOpenMediaEdit(media)}
                                className="p-1.5 text-slate-400 hover:text-blue-500 cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteMedia(media.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PACKAGES PANEL */}
              {activeTab === 'packages' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base text-slate-850 dark:text-white">
                      Daftar Paket Distribusi
                    </h3>
                    <button
                      onClick={handleOpenPackageAdd}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Paket
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packagesList.map(pkg => (
                      <div key={pkg.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 bg-slate-50/20 dark:bg-slate-900">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-slate-850 dark:text-white">{pkg.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{pkg.description}</p>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">
                            Diskon {pkg.discount}%
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <p className="text-slate-400 font-bold uppercase text-[9px]">Media Termasuk:</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {pkg.media?.map((m: any) => (
                              <span key={m.id} className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-[10px]">
                                {m.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-400">Total Harga Paket</span>
                            <p className="text-base font-extrabold text-blue-600 dark:text-blue-400">{formatRupiah(pkg.price)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPackage(pkg);
                                setPkgName(pkg.name);
                                setPkgDesc(pkg.description);
                                setPkgPrice(String(pkg.price));
                                setPkgDiscount(String(pkg.discount));
                                setPkgStatus(pkg.status || 'ACTIVE');
                                setPkgMediaIds(pkg.media?.map((m: any) => m.id) || []);
                                setShowPackageModal(true);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ORDERS MANAGEMENT PANEL */}
              {activeTab === 'orders' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-base text-slate-850 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Manajemen Order Pelanggan
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Pelanggan</th>
                          <th className="pb-3">Brand</th>
                          <th className="pb-3">WhatsApp</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {ordersList.map((order) => (
                          <tr key={order.id} className="text-slate-700 dark:text-slate-300">
                            <td className="py-3 font-bold">#{order.id.slice(0, 8)}</td>
                            <td className="py-3 font-semibold">{order.customer?.name || 'Customer'}</td>
                            <td className="py-3">{order.brandName}</td>
                            <td className="py-3 text-blue-500">{order.customer?.whatsapp || order.whatsapp || '-'}</td>
                            <td className="py-3 font-extrabold">{formatRupiah(order.total)}</td>
                            <td className="py-3">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.status === 'PUBLISHED' || order.status === 'COMPLETED'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                                  : order.status === 'PENDING'
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                                  : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleOpenOrderEdit(order)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                Edit Status
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CUSTOMERS STATS PANEL */}
              {activeTab === 'customers' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-base text-slate-850 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Statistik Pelanggan
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                          <th className="pb-3">Nama</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3">WhatsApp</th>
                          <th className="pb-3">Total Order</th>
                          <th className="pb-3 text-right">Total Transaksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {customersList.map((cust, idx) => (
                          <tr key={idx} className="text-slate-700 dark:text-slate-300">
                            <td className="py-3 font-bold">{cust.name}</td>
                            <td className="py-3">{cust.email}</td>
                            <td className="py-3 text-blue-500 font-semibold">{cust.whatsapp}</td>
                            <td className="py-3 font-semibold">{cust.totalOrders} Order</td>
                            <td className="py-3 text-right font-extrabold text-slate-800 dark:text-white">
                              {formatRupiah(cust.totalSpend)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VOUCHER PANEL */}
              {activeTab === 'vouchers' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base text-slate-850 dark:text-white">
                      Kupon & Voucher Diskon
                    </h3>
                    <button
                      onClick={handleOpenVoucherAdd}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Voucher
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vouchersList.map(voucher => (
                      <div key={voucher.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 bg-slate-50/20 dark:bg-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black tracking-wider text-slate-850 dark:text-white">{voucher.code}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${voucher.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {voucher.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {voucher.type === 'PERCENT' ? `Diskon ${voucher.value}%` : `Diskon ${formatRupiah(voucher.value)}`} dengan minimal belanja {formatRupiah(voucher.minSpend)}
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] text-slate-400">
                            Berlaku sampai: {new Date(voucher.expiredAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedVoucher(voucher);
                                setVouchCode(voucher.code);
                                setVouchType(voucher.type);
                                setVouchValue(String(voucher.value));
                                setVouchMinSpend(String(voucher.minSpend));
                                setVouchExpiredAt(voucher.expiredAt.split('T')[0]);
                                setVouchStatus(voucher.status);
                                setShowVoucherModal(true);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVoucher(voucher.id)}
                              className="text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BLOG PANEL */}
              {activeTab === 'blogs' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base text-slate-850 dark:text-white">
                      Manajemen Artikel Blog
                    </h3>
                    <button
                      onClick={handleOpenBlogAdd}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Artikel
                    </button>
                  </div>

                  <div className="divide-y divide-slate-150 dark:divide-slate-850">
                    {blogsList.map(post => (
                      <div key={post.id} className="py-4 flex justify-between items-center gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">{post.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Kategori: {post.category} • Slug: {post.slug}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenBlogEdit(post)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SETTINGS PANEL */}
              {activeTab === 'settings' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6">
                  <h3 className="font-bold text-base text-slate-850 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Pengaturan Konfigurasi Website
                  </h3>

                  <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Website</label>
                      <input
                        type="text"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No. WhatsApp Admin</label>
                      <input
                        type="text"
                        value={whatsappAdmin}
                        onChange={(e) => setWhatsappAdmin(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Rekening BCA</label>
                      <input
                        type="text"
                        value={bankNo}
                        onChange={(e) => setBankNo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Rekening BCA</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta SEO Deskripsi</label>
                      <textarea
                        rows={2}
                        value={metaDesc}
                        onChange={(e) => setMetaDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Banner Hero</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Kontak Admin</label>
                      <input
                        type="email"
                        value={emailAdmin}
                        onChange={(e) => setEmailAdmin(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-850 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Kontak Kantor</label>
                      <input
                        type="text"
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-850 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi Singkat Footer</label>
                      <textarea
                        rows={2}
                        value={footerDesc}
                        onChange={(e) => setFooterDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:border-slate-850 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4">
                      {settingsSuccess && <span className="text-xs font-bold text-emerald-500">{settingsSuccess}</span>}
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 ml-auto cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        Simpan Pengaturan
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* BACKLINK PANEL */}
              {activeTab === 'backlinks' && (
                <div className="space-y-6">
                  {/* Bulk edit prices card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Percent className="h-4.5 w-4.5 text-indigo-500" />
                      Manajemen Harga Otomatis Jasa Backlink (Bulk Edit)
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <select
                        value={bulkBacklinkType}
                        onChange={(e) => setBulkBacklinkType(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none dark:bg-slate-800 dark:text-white"
                      >
                        <option value="increase">Naikkan Harga Semua Backlink (%)</option>
                        <option value="decrease">Turunkan Harga Semua Backlink (%)</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Persentase (cth: 20)"
                        value={bulkBacklinkPercentage}
                        onChange={(e) => setBulkBacklinkPercentage(e.target.value)}
                        className="bg-slate-50 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs w-full sm:w-40 focus:outline-none dark:bg-slate-800 dark:text-white"
                      />
                      <button
                        onClick={handleBulkBacklinkPriceUpdate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Terapkan Kenaikan/Penurunan
                      </button>
                    </div>
                    {bulkBacklinkSuccess && <p className="text-[11px] font-bold text-emerald-500">{bulkBacklinkSuccess}</p>}
                  </div>

                  {/* Actions row: Add, Import, Export */}
                  <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleOpenBacklinkAdd}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 shadow-md shadow-indigo-500/10 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Backlink
                      </button>

                      {/* Excel Import button */}
                      <div className="relative overflow-hidden inline-flex items-center gap-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-4 py-2.5 cursor-pointer">
                        <Upload className="h-4 w-4 text-slate-400" />
                        <span>Import Excel</span>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleImportBacklinkExcel}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        />
                      </div>
                    </div>

                    {/* Export dropdowns */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleExportBacklinks('excel')}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-350"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        Excel
                      </button>
                      <button
                        onClick={() => handleExportBacklinks('csv')}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-350"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                        CSV
                      </button>
                      <button
                        onClick={() => handleExportBacklinks('pdf')}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 cursor-pointer text-slate-700 dark:text-slate-350"
                      >
                        <FileDown className="h-4 w-4 text-red-500" />
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama blog atau domain..."
                      value={backlinkSearch}
                      onChange={(e) => setBacklinkSearch(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Backlink Table */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[600px]">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                          <th className="pb-3">Nama Media/Blog</th>
                          <th className="pb-3">Domain</th>
                          <th className="pb-3">DA</th>
                          <th className="pb-3">DR</th>
                          <th className="pb-3">Trafik</th>
                          <th className="pb-3">Harga</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {backlinksList
                          .filter(bl => 
                            bl.name.toLowerCase().includes(backlinkSearch.toLowerCase()) || 
                            bl.domain.toLowerCase().includes(backlinkSearch.toLowerCase())
                          )
                          .map((bl) => (
                            <tr key={bl.id} className="text-slate-700 dark:text-slate-300">
                              <td className="py-3 font-semibold">{bl.name}</td>
                              <td className="py-3 text-indigo-500 font-bold">{bl.domain}</td>
                              <td className="py-3 font-bold">{bl.da}</td>
                              <td className="py-3 font-bold">{bl.dr}</td>
                              <td className="py-3">{new Intl.NumberFormat('id-ID').format(bl.traffic)}</td>
                              <td className="py-3 font-extrabold text-slate-800 dark:text-white">{formatRupiah(bl.price)}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${bl.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-slate-100 text-slate-500'}`}>
                                  {bl.status}
                                </span>
                              </td>
                              <td className="py-3 text-right flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => handleOpenBacklinkEdit(bl)}
                                  className="p-1.5 text-slate-400 hover:text-blue-500 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteBacklink(bl.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TESTIMONIAL PANEL */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  {/* Actions row: Add */}
                  <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleOpenTestimonialAdd}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Testimoni
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama klien, rating, atau isi testimoni..."
                      value={testimonialSearch}
                      onChange={(e) => setTestimonialSearch(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Testimonial Table */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[650px]">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
                          <th className="pb-3">Klien</th>
                          <th className="pb-3">Perusahaan / Jabatan</th>
                          <th className="pb-3">Rating</th>
                          <th className="pb-3">Isi Testimoni</th>
                          <th className="pb-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {testimonialsList
                          .filter(t => 
                            t.name.toLowerCase().includes(testimonialSearch.toLowerCase()) || 
                            t.company.toLowerCase().includes(testimonialSearch.toLowerCase()) ||
                            t.content.toLowerCase().includes(testimonialSearch.toLowerCase())
                          )
                          .map((t) => (
                            <tr key={t.id} className="text-slate-700 dark:text-slate-300">
                              <td className="py-3 font-semibold flex items-center gap-2">
                                <img src={t.avatar} alt={t.name} className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                                <span>{t.name}</span>
                              </td>
                              <td className="py-3 font-medium">{t.company}</td>
                              <td className="py-3 text-amber-500 font-bold">★ {t.rating}</td>
                              <td className="py-3 max-w-xs truncate">{t.content}</td>
                              <td className="py-3 text-right flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => handleOpenTestimonialEdit(t)}
                                  className="p-1.5 text-slate-400 hover:text-blue-500 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTestimonial(t.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Media Add/Edit Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowMediaModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedMedia ? 'Edit Mitra Media' : 'Tambah Mitra Media'}</h3>
              <p className="text-xs text-slate-400 mt-1">Lengkapi informasi portal media mitra untuk publikasi.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Media *</label>
                <input 
                  type="text" 
                  value={mediaName} 
                  onChange={(e) => setMediaName(e.target.value)} 
                  placeholder="Detik.com" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domain *</label>
                <input 
                  type="text" 
                  value={mediaDomain} 
                  onChange={(e) => setMediaDomain(e.target.value)} 
                  placeholder="detik.com" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori *</label>
                <select
                  value={mediaCategoryId}
                  onChange={(e) => setMediaCategoryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Publish (Rp) *</label>
                <input 
                  type="number" 
                  value={mediaPrice} 
                  onChange={(e) => setMediaPrice(e.target.value)} 
                  placeholder="3000000" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domain Authority (DA)</label>
                <input 
                  type="number" 
                  value={mediaDa} 
                  onChange={(e) => setMediaDa(e.target.value)} 
                  placeholder="80" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Authority (DR)</label>
                <input 
                  type="number" 
                  value={mediaDr} 
                  onChange={(e) => setMediaDr(e.target.value)} 
                  placeholder="80" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Traffic Bulanan</label>
                <input 
                  type="number" 
                  value={mediaTraffic} 
                  onChange={(e) => setMediaTraffic(e.target.value)} 
                  placeholder="1000000" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  value={mediaStatus}
                  onChange={(e) => setMediaStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">URL Logo Media</label>
                <input 
                  type="text" 
                  value={mediaLogo} 
                  onChange={(e) => setMediaLogo(e.target.value)} 
                  placeholder="https://..." 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catatan Tambahan</label>
                <textarea 
                  value={mediaNotes} 
                  onChange={(e) => setMediaNotes(e.target.value)} 
                  rows={2} 
                  placeholder="Catatan backlink dofollow/nofollow..." 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button 
                onClick={() => setShowMediaModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveMedia}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Add/Edit Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowPackageModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-880 dark:text-white">{selectedPackage ? 'Edit Paket Hemat' : 'Tambah Paket Hemat'}</h3>
              <p className="text-xs text-slate-400 mt-1">Konfigurasikan bundel media untuk paket hemat.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Paket *</label>
                <input 
                  type="text" 
                  value={pkgName} 
                  onChange={(e) => setPkgName(e.target.value)} 
                  placeholder="Starter Package" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi Paket *</label>
                <textarea 
                  value={pkgDesc} 
                  onChange={(e) => setPkgDesc(e.target.value)} 
                  rows={2} 
                  placeholder="Deskripsi penawaran paket..." 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Paket (Rp) *</label>
                  <input 
                    type="number" 
                    value={pkgPrice} 
                    onChange={(e) => setPkgPrice(e.target.value)} 
                    placeholder="4500000" 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Persentase Diskon (%)</label>
                  <input 
                    type="number" 
                    value={pkgDiscount} 
                    onChange={(e) => setPkgDiscount(e.target.value)} 
                    placeholder="10" 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  value={pkgStatus}
                  onChange={(e) => setPkgStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Media yang Termasuk (Centang) *</label>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5 bg-slate-50/20 dark:bg-slate-900">
                  {mediaList.map((m) => (
                    <label key={m.id} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={pkgMediaIds.includes(m.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPkgMediaIds(prev => [...prev, m.id]);
                          } else {
                            setPkgMediaIds(prev => prev.filter(id => id !== m.id));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{m.name} ({m.domain})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button 
                onClick={() => setShowPackageModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleSavePackage}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Add/Edit Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowVoucherModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedVoucher ? 'Edit Voucher' : 'Tambah Voucher'}</h3>
              <p className="text-xs text-slate-400 mt-1">Kelola kode kupon diskon untuk kampanye promo.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kode Voucher *</label>
                <input 
                  type="text" 
                  value={vouchCode} 
                  onChange={(e) => setVouchCode(e.target.value)} 
                  placeholder="PRPROMO20" 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipe Potongan *</label>
                  <select
                    value={vouchType}
                    onChange={(e) => setVouchType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white"
                  >
                    <option value="PERCENT">Persentase (%)</option>
                    <option value="NOMINAL">Nominal Rupiah (Rp)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nilai Potongan *</label>
                  <input 
                    type="number" 
                    value={vouchValue} 
                    onChange={(e) => setVouchValue(e.target.value)} 
                    placeholder="10 atau 250000" 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minimal Belanja (Rp)</label>
                  <input 
                    type="number" 
                    value={vouchMinSpend} 
                    onChange={(e) => setVouchMinSpend(e.target.value)} 
                    placeholder="2000000" 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Kedaluwarsa *</label>
                  <input 
                    type="date" 
                    value={vouchExpiredAt} 
                    onChange={(e) => setVouchExpiredAt(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  value={vouchStatus}
                  onChange={(e) => setVouchStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveVoucher}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Add/Edit Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowBlogModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedBlog ? 'Edit Artikel Blog' : 'Tambah Artikel Blog'}</h3>
              <p className="text-xs text-slate-400 mt-1">Publikasikan konten panduan atau berita untuk meningkatkan SEO site.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Artikel *</label>
                  <input 
                    type="text" 
                    value={blogTitle} 
                    onChange={(e) => setBlogTitle(e.target.value)} 
                    placeholder="Cara Menulis Press Release yang Menarik" 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori *</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white"
                  >
                    <option value="Tips & Panduan">Tips & Panduan</option>
                    <option value="Public Relations">Public Relations</option>
                    <option value="SEO & Marketing">SEO & Marketing</option>
                    <option value="Berita Nasional">Berita Nasional</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Slug (Opsional)</label>
                  <input 
                    type="text" 
                    value={blogSlug} 
                    onChange={(e) => setBlogSlug(e.target.value)} 
                    placeholder="cara-menulis-press-release" 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ringkasan Singkat *</label>
                <textarea 
                  value={blogSummary} 
                  onChange={(e) => setBlogSummary(e.target.value)} 
                  rows={2} 
                  placeholder="Tuliskan 1-2 kalimat ringkasan artikel..." 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konten Artikel (Markdown/HTML) *</label>
                <textarea 
                  value={blogContent} 
                  onChange={(e) => setBlogContent(e.target.value)} 
                  rows={6} 
                  placeholder="Tulis isi artikel lengkap disini..." 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">URL Thumbnail Gambar</label>
                <input 
                  type="text" 
                  value={blogThumbnail} 
                  onChange={(e) => setBlogThumbnail(e.target.value)} 
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Meta Title</label>
                  <input 
                    type="text" 
                    value={blogSeoTitle} 
                    onChange={(e) => setBlogSeoTitle(e.target.value)} 
                    placeholder="Judul SEO..." 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Meta Description</label>
                  <input 
                    type="text" 
                    value={blogSeoDesc} 
                    onChange={(e) => setBlogSeoDesc(e.target.value)} 
                    placeholder="Deskripsi SEO..." 
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:text-white" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button 
                onClick={() => setShowBlogModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveBlog}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Posting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Editor Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowOrderModal(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Status Order #{selectedOrder.id.slice(0, 8)}</h3>
              <p className="text-xs text-slate-400 mt-1">Ubah status tayang press release dan upload tautan publikasi.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Order</label>
                <select
                  value={editOrderStatus}
                  onChange={(e) => setEditOrderStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                >
                  <option value="PENDING">Pending (Menunggu Pembayaran)</option>
                  <option value="PAID">Paid (Pembayaran Diterima / Diproses)</option>
                  <option value="PROCESSING">Processing (Sedang Publish)</option>
                  <option value="PUBLISHED">Published (Sedang Publish - Tayang)</option>
                  <option value="COMPLETED">Completed (Selesai)</option>
                  <option value="CANCELLED">Cancelled (Dibatalkan)</option>
                </select>
              </div>

              {(editOrderStatus === 'PUBLISHED' || editOrderStatus === 'COMPLETED') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">URL Hasil Publikasi</label>
                  <input
                    type="url"
                    value={editOrderUrl}
                    onChange={(e) => setEditOrderUrl(e.target.value)}
                    placeholder="https://kapanlagi.com/gaya-hidup/..."
                    className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button 
                onClick={() => setShowOrderModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveOrderStatus}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Simpan Status
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Backlink Add/Edit Modal */}
      {showBacklinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowBacklinkModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedBacklink ? 'Edit Jasa Backlink' : 'Tambah Jasa Backlink'}</h3>
              <p className="text-xs text-slate-400 mt-1">Lengkapi rincian blog/website penyedia layanan backlink.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Blog / Media *</label>
                <input
                  type="text"
                  value={backlinkName}
                  onChange={(e) => setBacklinkName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="cth: Axiom Tech Blog"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domain *</label>
                <input
                  type="text"
                  value={backlinkDomain}
                  onChange={(e) => setBacklinkDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="cth: axiomtech.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domain Authority (DA) *</label>
                <input
                  type="number"
                  value={backlinkDa}
                  onChange={(e) => setBacklinkDa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domain Rating (DR) *</label>
                <input
                  type="number"
                  value={backlinkDr}
                  onChange={(e) => setBacklinkDr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Trafik *</label>
                <input
                  type="number"
                  value={backlinkTraffic}
                  onChange={(e) => setBacklinkTraffic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Publish (Rp) *</label>
                <input
                  type="number"
                  value={backlinkPrice}
                  onChange={(e) => setBacklinkPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="cth: 350000"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">URL Logo Website (Opsional)</label>
                <input
                  type="text"
                  value={backlinkLogo}
                  onChange={(e) => setBacklinkLogo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catatan / Detail Tambahan</label>
                <textarea
                  rows={2}
                  value={backlinkNotes}
                  onChange={(e) => setBacklinkNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="Informasi tipe backlink, syarat konten dll."
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Mitra</label>
                <select
                  value={backlinkStatus}
                  onChange={(e) => setBacklinkStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-850 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowBacklinkModal(false)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveBacklink}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
              >
                Simpan Backlink
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Testimonial Add/Edit Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowTestimonialModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
              <p className="text-xs text-slate-400 mt-1">Lengkapi data testimoni dari klien Anda.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap Klien *</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="cth: Budi Santoso"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perusahaan / Jabatan Klien *</label>
                <input
                  type="text"
                  value={testCompany}
                  onChange={(e) => setTestCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="cth: CEO HijabModern / Founder UKM"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating Nilai (1 - 5) *</label>
                <select
                  value={testRating}
                  onChange={(e) => setTestRating(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-850 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="5">★★★★★ (5 Bintang)</option>
                  <option value="4">★★★★☆ (4 Bintang)</option>
                  <option value="3">★★★☆☆ (3 Bintang)</option>
                  <option value="2">★★☆☆☆ (2 Bintang)</option>
                  <option value="1">★☆☆☆☆ (1 Bintang)</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">URL Foto Profil / Avatar (Opsional)</label>
                <input
                  type="text"
                  value={testAvatar}
                  onChange={(e) => setTestAvatar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Isi Testimoni *</label>
                <textarea
                  rows={4}
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  placeholder="Tulis ulasan klien di sini..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowTestimonialModal(false)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveTestimonial}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                Simpan Testimoni
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
