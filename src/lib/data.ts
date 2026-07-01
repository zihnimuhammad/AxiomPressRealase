import { db } from './db';

// Static fallbacks in case DB is offline/initializing
const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Nasional & Berita', slug: 'nasional-berita' },
  { id: '2', name: 'Teknologi & Gadget', slug: 'teknologi-gadget' },
  { id: '3', name: 'Bisnis & Keuangan', slug: 'bisnis-keuangan' },
  { id: '4', name: 'Hiburan & Gaya Hidup', slug: 'hiburan-gaya-hidup' },
];

const FALLBACK_MEDIA = [
  { id: 'm1', name: 'Detik.com', domain: 'detik.com', categoryId: '1', da: 89, dr: 86, traffic: 12000000, price: 3500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm2', name: 'Kompas.com', domain: 'kompas.com', categoryId: '1', da: 91, dr: 88, traffic: 15000000, price: 4000000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm3', name: 'CNN Indonesia', domain: 'cnnindonesia.com', categoryId: '1', da: 86, dr: 83, traffic: 8000000, price: 4500000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm4', name: 'Liputan6.com', domain: 'liputan6.com', categoryId: '1', da: 85, dr: 82, traffic: 7000000, price: 3000000, logo: 'https://images.unsplash.com/photo-1618005106198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm5', name: 'Tribunnews', domain: 'tribunnews.com', categoryId: '1', da: 88, dr: 85, traffic: 20000000, price: 2500000, logo: 'https://images.unsplash.com/photo-1618005156198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm6', name: 'Tech in Asia ID', domain: 'id.techinasia.com', categoryId: '2', da: 78, dr: 76, traffic: 1500000, price: 2800000, logo: 'https://images.unsplash.com/photo-1618005128143-e5283b519a7f?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm7', name: 'DailySocial', domain: 'dailysocial.id', categoryId: '2', da: 72, dr: 70, traffic: 800000, price: 1800000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm8', name: 'InfoKomputer', domain: 'infokomputer.grid.id', categoryId: '2', da: 65, dr: 63, traffic: 300000, price: 1200000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm9', name: 'Kontan.co.id', domain: 'kontan.co.id', categoryId: '3', da: 81, dr: 79, traffic: 4000000, price: 3200000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
  { id: 'm10', name: 'Bisnis.com', domain: 'bisnis.com', categoryId: '3', da: 83, dr: 81, traffic: 5000000, price: 3500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60', status: 'ACTIVE', notes: '' },
];

const FALLBACK_PACKAGES = [
  {
    id: 'p1',
    name: 'Starter Package',
    description: 'Cocok untuk startup dan bisnis baru yang ingin mulai membangun branding dan reputasi di media digital.',
    price: 5000000,
    discount: 10,
    status: 'ACTIVE',
    media: [
      { id: 'm5', name: 'Tribunnews', domain: 'tribunnews.com', price: 2500000 },
      { id: 'm6', name: 'Tech in Asia ID', domain: 'id.techinasia.com', price: 2800000 },
      { id: 'm7', name: 'DailySocial', domain: 'dailysocial.id', price: 1800000 },
    ],
  },
  {
    id: 'p2',
    name: 'Professional Package',
    description: 'Publikasi luas di portal berita nasional terkemuka dan media teknologi untuk eksposur bisnis maksimal.',
    price: 12000000,
    discount: 15,
    status: 'ACTIVE',
    media: [
      { id: 'm1', name: 'Detik.com', domain: 'detik.com', price: 3500000 },
      { id: 'm2', name: 'Kompas.com', domain: 'kompas.com', price: 4000000 },
      { id: 'm3', name: 'CNN Indonesia', domain: 'cnnindonesia.com', price: 4500000 },
      { id: 'm4', name: 'Liputan6.com', domain: 'liputan6.com', price: 3000000 },
    ],
  },
  {
    id: 'p3',
    name: 'Enterprise Package',
    description: 'Solusi terlengkap untuk korporasi dengan sebaran media nasional, bisnis, keuangan, dan gaya hidup terbesar.',
    price: 22000000,
    discount: 20,
    status: 'ACTIVE',
    media: [
      { id: 'm1', name: 'Detik.com', domain: 'detik.com', price: 3500000 },
      { id: 'm2', name: 'Kompas.com', domain: 'kompas.com', price: 4000000 },
      { id: 'm3', name: 'CNN Indonesia', domain: 'cnnindonesia.com', price: 4500000 },
      { id: 'm4', name: 'Liputan6.com', domain: 'liputan6.com', price: 3000000 },
      { id: 'm5', name: 'Tribunnews', domain: 'tribunnews.com', price: 2500000 },
      { id: 'm9', name: 'Kontan.co.id', domain: 'kontan.co.id', price: 3200000 },
      { id: 'm10', name: 'Bisnis.com', domain: 'bisnis.com', price: 3500000 },
    ],
  },
];

const FALLBACK_FAQS = [
  { id: 'f1', question: 'Berapa lama waktu pengerjaan publikasi?', answer: 'Waktu pengerjaan berkisar antara 1 hingga 3 hari kerja setelah materi artikel disetujui dan pembayaran dikonfirmasi.' },
  { id: 'f2', question: 'Apakah artikel yang diterbitkan bersifat permanen?', answer: 'Ya, seluruh artikel press release yang diterbitkan di media mitra kami bersifat permanen dan tidak akan dihapus.' },
  { id: 'f3', question: 'Apakah saya bisa mengirimkan artikel yang sudah jadi?', answer: 'Tentu saja. Anda bisa mengunggah draf artikel Anda saat melakukan checkout. Tim kami akan melakukan review singkat sebelum dikirimkan ke redaksi media.' },
  { id: 'f4', question: 'Bagaimana jika artikel ditolak oleh pihak media?', answer: 'Jika ada penolakan dari pihak media (karena melanggar kebijakan konten mereka), kami akan menawarkan media pengganti yang setara atau melakukan refund 100% untuk media tersebut.' },
];

const FALLBACK_TESTIMONIALS = [
  { id: 't1', name: 'Diana Lestari', company: 'CEO StartupGo', content: 'Layanan press release yang sangat luar biasa. Artikel bisnis kami tayang di Detik dan Kompas dalam 2 hari saja. Traffic website kami naik drastis!', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
  { id: 't2', name: 'Rian Hidayat', company: 'Digital Marketing Manager FinTech ID', content: 'Harga transparan dan proses checkout yang sangat mudah. Kami bisa memilih media secara satuan sesuai target segmen kami. Rekomended sekali!', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
  { id: 't3', name: 'Siti Aminah', company: 'PR Specialist HijabStyle', content: 'Sangat terbantu dengan pengerjaannya yang cepat. Laporan link hasil tayang di-upload lengkap di dashboard admin. Proses revisi anchor text juga dilayani dengan baik.', rating: 4, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
];

const FALLBACK_BLOGS = [
  {
    id: 'b1',
    title: 'Pentingnya Press Release untuk Meningkatkan Kredibilitas Bisnis Baru',
    slug: 'pentingnya-press-release-bisnis-baru',
    summary: 'Ketahui bagaimana publikasi press release di media online nasional dapat membantu meningkatkan kepercayaan konsumen dan investor secara instan.',
    content: 'Bagi sebuah bisnis baru atau startup, mendapatkan kepercayaan (trust) dari audiens adalah tantangan terbesar. Di sinilah press release memainkan peran kunci. Ketika brand Anda disebutkan di media ternama seperti Detik atau Kompas, publik akan langsung mempercayai bisnis Anda.\n\n### Keunggulan Press Release:\n1. **Social Proof Instan**: Menampilkan logo media di website Anda ("As Seen On").\n2. **Meningkatkan SEO**: Tautan (backlink) berkualitas tinggi dari situs berita dengan otoritas domain tinggi.\n3. **Mendapatkan Peliputan Organik**: Menarik perhatian jurnalis lain untuk menulis tentang bisnis Anda.',
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60',
    category: 'Public Relations',
    seoTitle: 'Pentingnya Press Release untuk Kredibilitas Bisnis | Axiom Press Release',
    seoDesc: 'Pelajari bagaimana publikasi media online nasional membantu startup membangun kredibilitas instan.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    title: 'Panduan Menulis Press Release yang Menarik Minat Redaksi Media',
    slug: 'panduan-menulis-press-release-menarik-media',
    summary: 'Menulis berita press release tidak bisa asal-asalan. Simak struktur penulisan 5W+1H standar jurnalistik agar mudah disetujui redaksi.',
    content: '## Struktur Standard Press Release\n\nUntuk memastikan press release Anda diterbitkan oleh redaksi media, Anda harus menuliskannya menggunakan gaya penulisan jurnalistik. Berikut adalah strukturnya:\n\n1. **Judul Utama (Headline)**: Harus kuat, menarik, dan merangkum poin berita utama.\n2. **Teras Berita (Lead)**: Paragraf pertama berisi ringkasan 5W+1H (Who, What, Where, When, Why, How).\n3. **Tubuh Berita (Body)**: Penjelasan lebih detail mengenai berita, dilengkapi kutipan dari direksi atau juru bicara.\n4. **Boilerplate**: Profil singkat mengenai perusahaan Anda.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60',
    category: 'Tips & Panduan',
    seoTitle: 'Cara Menulis Press Release Standar Jurnalistik | Axiom Press Release',
    seoDesc: 'Panduan lengkap menulis press release agar dilirik redaksi media. Menggunakan formula 5W+1H dan kutipan yang bernilai berita tinggi.',
    createdAt: new Date().toISOString(),
  },
];

const FALLBACK_SETTINGS: Record<string, string> = {
  site_title: 'Axiom Press Release - Jasa Distribusi Press Release Premium',
  meta_description: 'Publikasikan artikel bisnis Anda ke 1000+ media online nasional dan lokal terbaik untuk meningkatkan kredibilitas, brand awareness, dan SEO secara cepat.',
  whatsapp_admin: '6281234567890',
  email_admin: 'support@axiompr.com',
  bank_name: 'Bank Central Asia (BCA)',
  bank_account_no: '8830912345',
  bank_account_name: 'PT Media Distribusi Indonesia',
  qris_image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=300&auto=format&fit=crop&q=60',
  hero_title: 'Publikasikan Press Release Bisnis Anda ke Media Nasional Terkemuka',
  hero_subtitle: 'Tingkatkan kredibilitas brand, dominasi mesin pencari, dan raih jutaan pembaca melalui jaringan 1000+ media online berkualitas tinggi dengan harga terbaik.',
  footer_description: 'Jasa Distribusi Press Release premium terpercaya di Indonesia. Dapatkan jaminan tayang permanen di media online nasional utama.',
  contact_address: 'Sudirman Central Business District (SCBD), Jakarta Selatan',
};

export async function getCategories() {
  try {
    const list = await db.category.findMany({ orderBy: { name: 'asc' } });
    return list.length > 0 ? list : FALLBACK_CATEGORIES;
  } catch (e) {
    return FALLBACK_CATEGORIES;
  }
}

export async function getMedia() {
  try {
    const list = await db.media.findMany({ include: { category: true } });
    return list.length > 0 ? list : FALLBACK_MEDIA.map(m => ({
      ...m,
      category: FALLBACK_CATEGORIES.find(c => c.id === m.categoryId)
    }));
  } catch (e) {
    return FALLBACK_MEDIA.map(m => ({
      ...m,
      category: FALLBACK_CATEGORIES.find(c => c.id === m.categoryId)
    }));
  }
}

export async function getPackages() {
  try {
    const list = await db.package.findMany({ include: { media: true } });
    return list.length > 0 ? list : FALLBACK_PACKAGES;
  } catch (e) {
    return FALLBACK_PACKAGES;
  }
}

export async function getFaqs() {
  try {
    const list = await db.faq.findMany({ orderBy: { createdAt: 'asc' } });
    return list.length > 0 ? list : FALLBACK_FAQS;
  } catch (e) {
    return FALLBACK_FAQS;
  }
}

export async function getTestimonials() {
  try {
    const list = await db.testimonial.findMany({ orderBy: { createdAt: 'asc' } });
    return list.length > 0 ? list : FALLBACK_TESTIMONIALS;
  } catch (e) {
    return FALLBACK_TESTIMONIALS;
  }
}

export async function getBlogs() {
  try {
    const list = await db.blog.findMany({ orderBy: { createdAt: 'desc' } });
    return list.length > 0 ? list : FALLBACK_BLOGS;
  } catch (e) {
    return FALLBACK_BLOGS;
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const post = await db.blog.findUnique({ where: { slug } });
    if (post) return post;
    return FALLBACK_BLOGS.find(b => b.slug === slug) || null;
  } catch (e) {
    return FALLBACK_BLOGS.find(b => b.slug === slug) || null;
  }
}

export async function getSettings() {
  try {
    const list = await db.setting.findMany();
    if (list.length === 0) return FALLBACK_SETTINGS;
    
    const settingsObj: Record<string, string> = {};
    list.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    return { ...FALLBACK_SETTINGS, ...settingsObj };
  } catch (e) {
    return FALLBACK_SETTINGS;
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            media: true,
            package: true,
            backlink: true,
          },
        },
      },
    });
    if (order) return order;
  } catch (e) {
    // Graceful fallback below
  }

  // Fallback order for testing if offline or missing
  return {
    id,
    customerId: 'fallback-cust-id',
    brandName: 'HijabModern',
    anchorText: 'Toko Hijab Murah',
    url: 'https://hijabmodern.com',
    notes: 'Kategori Gaya Hidup',
    status: 'PENDING',
    paymentMethod: id.includes('offline-qris') ? 'QRIS' : 'BANK_TRANSFER',
    subtotal: 5000000,
    discount: 500000,
    total: 4500000,
    proofPath: null,
    publishProofUrl: null,
    publishProofPdf: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: {
      id: 'fallback-cust-id',
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      whatsapp: '628999999999',
      totalOrders: 1,
      totalSpend: 4500000,
    },
    items: [
      {
        id: 'fallback-item-1',
        price: 5000000,
        media: null,
        package: {
          name: 'Starter Package',
          description: 'Paket Hemat Media',
        },
        backlink: null,
      },
    ],
  };
}

export async function getBacklinks() {
  try {
    const backlinks = await db.backlink.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { price: 'asc' },
    });
    return backlinks;
  } catch (e) {
    return [
      { id: 'bl1', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&auto=format&fit=crop&q=60', name: 'Axiom Tech Blog', domain: 'axiomtech.com', da: 45, dr: 42, traffic: 25000, price: 450000, status: 'ACTIVE', notes: 'Cocok untuk niche teknologi, startup, IT, dan gadgets.' },
      { id: 'bl2', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=80&auto=format&fit=crop&q=60', name: 'Finance & Bisnis Journal', domain: 'financejournal.id', da: 38, dr: 35, traffic: 18000, price: 350000, status: 'ACTIVE', notes: 'Sangat baik untuk backlink fintech, investasi, bisnis, dan UKM.' },
      { id: 'bl3', logo: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=80&auto=format&fit=crop&q=60', name: 'Lifestyle & Gaya Hidup', domain: 'indolifestyle.co.id', da: 35, dr: 30, traffic: 30000, price: 250000, status: 'ACTIVE', notes: 'Niche fashion, kuliner, pariwisata, kecantikan, dan parenting.' },
    ];
  }
}

