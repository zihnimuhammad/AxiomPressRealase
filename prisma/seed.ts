import { PrismaClient } from '@prisma/client';
// App auth (src/lib/auth.ts) verifies with bcrypt — seed must hash the same way.
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database (idempotent upserts)...');

  // 1. Users — credentials overridable via env for deploys (defaults are demo).
  const users = [
    {
      email: process.env.SEED_SUPERADMIN_EMAIL ?? 'admin@axiompr.com',
      name: 'Super Admin',
      password: await bcrypt.hash(process.env.SEED_SUPERADMIN_PASSWORD ?? 'admin123', 10),
      role: 'SUPER_ADMIN' as const,
    },
    {
      email: process.env.SEED_STAFF_EMAIL ?? 'staff@prdist.com',
      name: 'Staff PR',
      password: await bcrypt.hash(process.env.SEED_STAFF_PASSWORD ?? 'staff123', 10),
      role: 'STAFF' as const,
    },
    {
      email: process.env.SEED_USER_EMAIL ?? 'budi@gmail.com',
      name: 'Budi Santoso',
      password: await bcrypt.hash(process.env.SEED_USER_PASSWORD ?? 'user123', 10),
      role: 'USER' as const,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, password: u.password, role: u.role },
      create: u,
    });
  }
  const user = await prisma.user.findUniqueOrThrow({ where: { email: users[2].email } });
  console.log('Upserted Users:', users.map((u) => u.email).join(', '));

  // 2. Categories (unique: slug)
  const categories = [
    { slug: 'nasional-berita', name: 'Nasional & Berita' },
    { slug: 'teknologi-gadget', name: 'Teknologi & Gadget' },
    { slug: 'bisnis-keuangan', name: 'Bisnis & Keuangan' },
    { slug: 'hiburan-gaya-hidup', name: 'Hiburan & Gaya Hidup' },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
  }
  const catBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );
  console.log('Upserted Categories');

  // 3. Media (no natural unique key — use domain as deterministic id)
  const mediaItems = [
    { name: 'Detik.com', domain: 'detik.com', categorySlug: 'nasional-berita', da: 89, dr: 86, traffic: 12000000, price: 3500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
    { name: 'Kompas.com', domain: 'kompas.com', categorySlug: 'nasional-berita', da: 91, dr: 88, traffic: 15000000, price: 4000000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'CNN Indonesia', domain: 'cnnindonesia.com', categorySlug: 'nasional-berita', da: 86, dr: 83, traffic: 8000000, price: 4500000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60' },
    { name: 'Liputan6.com', domain: 'liputan6.com', categorySlug: 'nasional-berita', da: 85, dr: 82, traffic: 7000000, price: 3000000, logo: 'https://images.unsplash.com/photo-1618005106198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60' },
    { name: 'Tribunnews', domain: 'tribunnews.com', categorySlug: 'nasional-berita', da: 88, dr: 85, traffic: 20000000, price: 2500000, logo: 'https://images.unsplash.com/photo-1618005156198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60' },
    { name: 'Tech in Asia ID', domain: 'id.techinasia.com', categorySlug: 'teknologi-gadget', da: 78, dr: 76, traffic: 1500000, price: 2800000, logo: 'https://images.unsplash.com/photo-1618005128143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'DailySocial', domain: 'dailysocial.id', categorySlug: 'teknologi-gadget', da: 72, dr: 70, traffic: 800000, price: 1800000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
    { name: 'InfoKomputer', domain: 'infokomputer.grid.id', categorySlug: 'teknologi-gadget', da: 65, dr: 63, traffic: 300000, price: 1200000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60' },
    { name: 'Kontan.co.id', domain: 'kontan.co.id', categorySlug: 'bisnis-keuangan', da: 81, dr: 79, traffic: 4000000, price: 3200000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'Bisnis.com', domain: 'bisnis.com', categorySlug: 'bisnis-keuangan', da: 83, dr: 81, traffic: 5000000, price: 3500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
    { name: 'Sindonews', domain: 'sindonews.com', categorySlug: 'bisnis-keuangan', da: 84, dr: 82, traffic: 6000000, price: 2200000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60' },
    { name: 'KapanLagi.com', domain: 'kapanlagi.com', categorySlug: 'hiburan-gaya-hidup', da: 82, dr: 80, traffic: 9000000, price: 2600000, logo: 'https://images.unsplash.com/photo-1618005156198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60' },
    { name: 'Fimela.com', domain: 'fimela.com', categorySlug: 'hiburan-gaya-hidup', da: 79, dr: 77, traffic: 3500000, price: 2400000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'Volix Media', domain: 'volix.co', categorySlug: 'hiburan-gaya-hidup', da: 45, dr: 40, traffic: 150000, price: 1500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
  ];

  for (const m of mediaItems) {
    const data = {
      logo: m.logo, name: m.name, domain: m.domain, categoryId: catBySlug[m.categorySlug],
      da: m.da, dr: m.dr, traffic: m.traffic, price: m.price,
    };
    await prisma.media.upsert({ where: { id: m.domain }, update: data, create: { id: m.domain, ...data } });
  }
  console.log(`Upserted ${mediaItems.length} Media items.`);

  // 4. Packages (no natural unique key — use deterministic id)
  const packages = [
    {
      id: 'pkg-starter', name: 'Starter Package',
      description: 'Cocok untuk startup dan bisnis baru yang ingin mulai membangun branding dan reputasi di media digital.',
      price: 5000000, discount: 10, mediaDomains: mediaItems.slice(4, 7).map((m) => m.domain),
    },
    {
      id: 'pkg-professional', name: 'Professional Package',
      description: 'Publikasi luas di portal berita nasional terkemuka dan media teknologi untuk eksposur bisnis maksimal.',
      price: 12000000, discount: 15, mediaDomains: mediaItems.slice(0, 6).map((m) => m.domain),
    },
    {
      id: 'pkg-enterprise', name: 'Enterprise Package',
      description: 'Solusi terlengkap untuk korporasi dengan sebaran media nasional, bisnis, keuangan, dan gaya hidup terbesar.',
      price: 22000000, discount: 20, mediaDomains: mediaItems.slice(0, 10).map((m) => m.domain),
    },
  ];
  for (const p of packages) {
    const connect = p.mediaDomains.map((id) => ({ id }));
    await prisma.package.upsert({
      where: { id: p.id },
      update: {
        name: p.name, description: p.description, price: p.price, discount: p.discount,
        status: 'ACTIVE', media: { set: connect },
      },
      create: {
        id: p.id, name: p.name, description: p.description, price: p.price, discount: p.discount,
        status: 'ACTIVE', media: { connect },
      },
    });
  }
  console.log('Upserted Packages');

  // 5. Vouchers (unique: code)
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const vouchers = [
    { code: 'PRLAUNCH', type: 'PERCENT', value: 10, minSpend: 2000000, expiredAt: in30Days, status: 'ACTIVE' },
    { code: 'PRCASHBACK', type: 'NOMINAL', value: 250000, minSpend: 5000000, expiredAt: in30Days, status: 'ACTIVE' },
  ];
  for (const v of vouchers) {
    await prisma.voucher.upsert({ where: { code: v.code }, update: v, create: v });
  }
  console.log('Upserted Vouchers');

  // 6. Testimonials (no natural unique key — deterministic id)
  const testimonials = [
    { id: 'tst-diana', name: 'Diana Lestari', company: 'CEO StartupGo', content: 'Layanan press release yang sangat luar biasa. Artikel bisnis kami tayang di Detik dan Kompas dalam 2 hari saja. Traffic website kami naik drastis!', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
    { id: 'tst-rian', name: 'Rian Hidayat', company: 'Digital Marketing Manager FinTech ID', content: 'Harga transparan dan proses checkout yang sangat mudah. Kami bisa memilih media secara satuan sesuai target segmen kami. Rekomended sekali!', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
    { id: 'tst-siti', name: 'Siti Aminah', company: 'PR Specialist HijabStyle', content: 'Sangat terbantu dengan pengerjaannya yang cepat. Laporan link hasil tayang di-upload lengkap di dashboard admin. Proses revisi anchor text juga dilayani dengan baik.', rating: 4, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
  ];
  for (const t of testimonials) {
    const { id, ...rest } = t;
    await prisma.testimonial.upsert({ where: { id }, update: rest, create: t });
  }
  console.log('Upserted Testimonials');

  // 7. FAQs (no natural unique key — deterministic id)
  const faqs = [
    { id: 'faq-durasi', question: 'Berapa lama waktu pengerjaan publikasi?', answer: 'Waktu pengerjaan berkisar antara 1 hingga 3 hari kerja setelah materi artikel disetujui dan pembayaran dikonfirmasi.' },
    { id: 'faq-permanen', question: 'Apakah artikel yang diterbitkan bersifat permanen?', answer: 'Ya, seluruh artikel press release yang diterbitkan di media mitra kami bersifat permanen dan tidak akan dihapus.' },
    { id: 'faq-kirim-artikel', question: 'Apakah saya bisa mengirimkan artikel yang sudah jadi?', answer: 'Tentu saja. Anda bisa mengunggah draf artikel Anda saat melakukan checkout. Tim kami akan melakukan review singkat sebelum dikirimkan ke redaksi media.' },
    { id: 'faq-ditolak', question: 'Bagaimana jika artikel ditolak oleh pihak media?', answer: 'Jika ada penolakan dari pihak media (karena melanggar kebijakan konten mereka), kami akan menawarkan media pengganti yang setara atau melakukan refund 100% untuk media tersebut.' },
    { id: 'faq-indeks', question: 'Apakah ada jaminan artikel terindeks Google?', answer: 'Hampir seluruh media nasional mitra kami memiliki kredibilitas tinggi, sehingga artikel Anda dijamin cepat terindeks di halaman pencarian Google.' },
  ];
  for (const f of faqs) {
    const { id, ...rest } = f;
    await prisma.faq.upsert({ where: { id }, update: rest, create: f });
  }
  console.log('Upserted FAQs');

  // 8. Settings (unique: key)
  const settings = [
    { key: 'site_title', value: 'Axiom Press Release - Jasa Distribusi Press Release Premium' },
    { key: 'meta_description', value: 'Publikasikan artikel bisnis Anda ke 1000+ media online nasional dan lokal terbaik untuk meningkatkan kredibilitas, brand awareness, dan SEO secara cepat.' },
    { key: 'whatsapp_admin', value: '6281234567890' },
    { key: 'email_admin', value: 'support@axiompr.com' },
    { key: 'bank_name', value: 'Bank Central Asia (BCA)' },
    { key: 'bank_account_no', value: '8830912345' },
    { key: 'bank_account_name', value: 'PT Media Distribusi Indonesia' },
    { key: 'qris_image', value: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=300&auto=format&fit=crop&q=60' },
    { key: 'google_analytics_id', value: 'UA-123456789-1' },
    { key: 'facebook_pixel_id', value: '123456789012345' },
    { key: 'hero_title', value: 'Publikasikan Press Release Bisnis Anda ke Media Nasional Terkemuka' },
    { key: 'hero_subtitle', value: 'Tingkatkan kredibilitas brand, dominasi mesin pencari, dan raih jutaan pembaca melalui jaringan 1000+ media online berkualitas tinggi dengan harga terbaik.' },
    { key: 'footer_description', value: 'Jasa Distribusi Press Release premium terpercaya di Indonesia. Dapatkan jaminan tayang permanen di media online nasional utama.' },
    { key: 'contact_address', value: 'Sudirman Central Business District (SCBD), Jakarta Selatan' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }
  console.log('Upserted Settings');

  // 9. Blog posts (unique: slug)
  const blogs = [
    {
      title: 'Pentingnya Press Release untuk Meningkatkan Kredibilitas Bisnis Baru',
      slug: 'pentingnya-press-release-bisnis-baru',
      summary: 'Ketahui bagaimana publikasi press release di media online nasional dapat membantu meningkatkan kepercayaan konsumen dan investor secara instan.',
      content: '## Mengapa Press Release Penting untuk Startup?\n\nBagi sebuah bisnis baru atau startup, mendapatkan kepercayaan (trust) dari audiens adalah tantangan terbesar. Di sinilah press release memainkan peran kunci. Ketika brand Anda disebutkan di media ternama seperti Detik atau Kompas, publik akan langsung mempercayai bisnis Anda.\n\n### Keunggulan Press Release:\n1. **Social Proof Instan**: Menampilkan logo media di website Anda ("As Seen On").\n2. **Meningkatkan SEO**: Tautan (backlink) berkualitas tinggi dari situs berita dengan otoritas domain tinggi.\n3. **Mendapatkan Peliputan Organik**: Menarik perhatian jurnalis lain untuk menulis tentang bisnis Anda.',
      thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60',
      category: 'Public Relations',
      seoTitle: 'Pentingnya Press Release untuk Kredibilitas Bisnis | PRDist',
      seoDesc: 'Pelajari bagaimana publikasi media online nasional membantu startup membangun kredibilitas instan dan meningkatkan ranking SEO melalui press release.',
    },
    {
      title: 'Panduan Menulis Press Release yang Menarik Minat Redaksi Media',
      slug: 'panduan-menulis-press-release-menarik-media',
      summary: 'Menulis berita press release tidak bisa asal-asalan. Simak struktur penulisan 5W+1H standar jurnalistik agar mudah disetujui redaksi.',
      content: '## Struktur Standard Press Release\n\nUntuk memastikan press release Anda diterbitkan oleh redaksi media, Anda harus menuliskannya menggunakan gaya penulisan jurnalistik. Berikut adalah strukturnya:\n\n1. **Judul Utama (Headline)**: Harus kuat, menarik, dan merangkum poin berita utama.\n2. **Teras Berita (Lead)**: Paragraf pertama berisi ringkasan 5W+1H (Who, What, Where, When, Why, How).\n3. **Tubuh Berita (Body)**: Penjelasan lebih detail mengenai berita, dilengkapi kutipan dari direksi atau juru bicara.\n4. **Boilerplate**: Profil singkat mengenai perusahaan Anda.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60',
      category: 'Tips & Panduan',
      seoTitle: 'Cara Menulis Press Release Standar Jurnalistik | PRDist',
      seoDesc: 'Panduan lengkap menulis press release agar dilirik redaksi media. Menggunakan formula 5W+1H dan kutipan yang bernilai berita tinggi.',
    },
  ];
  for (const b of blogs) {
    await prisma.blog.upsert({ where: { slug: b.slug }, update: b, create: b });
  }
  console.log('Upserted Blog Posts');

  // 10. Backlinks (no natural unique key — use domain as deterministic id)
  const backlinks = [
    { domain: 'axiomtech.com', name: 'Axiom Tech Blog', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&auto=format&fit=crop&q=60', da: 45, dr: 42, traffic: 25000, price: 450000, notes: 'Cocok untuk niche teknologi, startup, IT, dan gadgets.' },
    { domain: 'financejournal.id', name: 'Finance & Bisnis Journal', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=80&auto=format&fit=crop&q=60', da: 38, dr: 35, traffic: 18000, price: 350000, notes: 'Sangat baik untuk backlink fintech, investasi, bisnis, dan UKM.' },
    { domain: 'indolifestyle.co.id', name: 'Lifestyle & Gaya Hidup', logo: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=80&auto=format&fit=crop&q=60', da: 35, dr: 30, traffic: 30000, price: 250000, notes: 'Niche fashion, kuliner, pariwisata, kecantikan, dan parenting.' },
  ];
  for (const bl of backlinks) {
    await prisma.backlink.upsert({ where: { id: bl.domain }, update: bl, create: { id: bl.domain, ...bl } });
  }
  console.log('Upserted Backlinks');

  // 11. Sample order for Budi (deterministic ids so re-seeding is idempotent)
  const customerBudi = await prisma.customer.upsert({
    where: { email: 'budi@gmail.com' },
    update: { name: 'Budi Santoso', whatsapp: '628999999999', totalOrders: 1, totalSpend: 3000000 },
    create: { name: 'Budi Santoso', email: 'budi@gmail.com', whatsapp: '628999999999', totalOrders: 1, totalSpend: 3000000 },
  });

  const orderData = {
    customerId: customerBudi.id, userId: user.id, brandName: 'HijabModern',
    anchorText: 'Hijab Modern Murah', url: 'https://hijabmodern.com',
    notes: 'Harap publish di kategori gaya hidup/lifestyle.', status: 'PUBLISHED',
    paymentMethod: 'QRIS', subtotal: 3000000, discount: 0, total: 3000000,
    proofPath: '/uploads/proofs/sample-proof.png',
    publishProofUrl: 'https://kapanlagi.com/gaya-hidup/tren-hijab-modern-2026',
  };
  await prisma.order.upsert({ where: { id: 'order-budi-sample' }, update: orderData, create: { id: 'order-budi-sample', ...orderData } });

  await prisma.orderItem.upsert({
    where: { id: 'item-budi-kapanlagi' },
    update: { orderId: 'order-budi-sample', mediaId: 'kapanlagi.com', price: 3000000 },
    create: { id: 'item-budi-kapanlagi', orderId: 'order-budi-sample', mediaId: 'kapanlagi.com', price: 3000000 },
  });

  await prisma.payment.upsert({
    where: { orderId: 'order-budi-sample' },
    update: { amount: 3000000, method: 'QRIS', proofPath: '/uploads/proofs/sample-proof.png', status: 'APPROVED', paidAt: new Date() },
    create: { orderId: 'order-budi-sample', amount: 3000000, method: 'QRIS', proofPath: '/uploads/proofs/sample-proof.png', status: 'APPROVED', paidAt: new Date() },
  });
  console.log('Upserted Sample Order for Budi');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
