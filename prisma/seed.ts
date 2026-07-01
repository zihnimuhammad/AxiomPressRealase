import { PrismaClient } from '@prisma/client';

// Note: To avoid dependency issues on typescript running, we'll implement simple hashing or a standard bcrypt package.
// If bcrypt is not fully installed, we'll use a simple hash. But since we want it to be secure, let's use standard bcrypt.
// Wait, we can use a helper or crypto.createHash for simple password hashing in NextAuth/seeding so that we don't depend on native bcrypt compile issues.
// Let's use SHA-256 for passwords in the seed and the NextAuth provider. It avoids compiled native bcrypt node_modules compilation errors on Windows!
// Let's implement SHA-256 password hashing.
import { createHash } from 'crypto';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.backlink.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.package.deleteMany();
  await prisma.media.deleteMany();
  await prisma.category.deleteMany();

  console.log('Cleared existing tables.');

  // 2. Create Users
  const superAdminPassword = hashPassword('admin123');
  const staffPassword = hashPassword('staff123');
  const userPassword = hashPassword('user123');

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@axiompr.com',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: 'Staff PR',
      email: 'staff@prdist.com',
      password: staffPassword,
      role: 'STAFF',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('Created Users:', { superAdmin: superAdmin.email, staff: staff.email, user: user.email });

  // 3. Create Categories
  const catNews = await prisma.category.create({ data: { name: 'Nasional & Berita', slug: 'nasional-berita' } });
  const catTech = await prisma.category.create({ data: { name: 'Teknologi & Gadget', slug: 'teknologi-gadget' } });
  const catBiz = await prisma.category.create({ data: { name: 'Bisnis & Keuangan', slug: 'bisnis-keuangan' } });
  const catEnt = await prisma.category.create({ data: { name: 'Hiburan & Gaya Hidup', slug: 'hiburan-gaya-hidup' } });

  console.log('Created Categories');

  // 4. Create Media
  const mediaItems = [
    { name: 'Detik.com', domain: 'detik.com', categoryId: catNews.id, da: 89, dr: 86, traffic: 12000000, price: 3500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
    { name: 'Kompas.com', domain: 'kompas.com', categoryId: catNews.id, da: 91, dr: 88, traffic: 15000000, price: 4000000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'CNN Indonesia', domain: 'cnnindonesia.com', categoryId: catNews.id, da: 86, dr: 83, traffic: 8000000, price: 4500000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60' },
    { name: 'Liputan6.com', domain: 'liputan6.com', categoryId: catNews.id, da: 85, dr: 82, traffic: 7000000, price: 3000000, logo: 'https://images.unsplash.com/photo-1618005106198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60' },
    { name: 'Tribunnews', domain: 'tribunnews.com', categoryId: catNews.id, da: 88, dr: 85, traffic: 20000000, price: 2500000, logo: 'https://images.unsplash.com/photo-1618005156198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60' },
    
    { name: 'Tech in Asia ID', domain: 'id.techinasia.com', categoryId: catTech.id, da: 78, dr: 76, traffic: 1500000, price: 2800000, logo: 'https://images.unsplash.com/photo-1618005128143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'DailySocial', domain: 'dailysocial.id', categoryId: catTech.id, da: 72, dr: 70, traffic: 800000, price: 1800000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
    { name: 'InfoKomputer', domain: 'infokomputer.grid.id', categoryId: catTech.id, da: 65, dr: 63, traffic: 300000, price: 1200000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60' },
    
    { name: 'Kontan.co.id', domain: 'kontan.co.id', categoryId: catBiz.id, da: 81, dr: 79, traffic: 4000000, price: 3200000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'Bisnis.com', domain: 'bisnis.com', categoryId: catBiz.id, da: 83, dr: 81, traffic: 5000000, price: 3500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
    { name: 'Sindonews', domain: 'sindonews.com', categoryId: catBiz.id, da: 84, dr: 82, traffic: 6000000, price: 2200000, logo: 'https://images.unsplash.com/photo-1618005131379-67d0f918e95d?w=80&auto=format&fit=crop&q=60' },

    { name: 'KapanLagi.com', domain: 'kapanlagi.com', categoryId: catEnt.id, da: 82, dr: 80, traffic: 9000000, price: 2600000, logo: 'https://images.unsplash.com/photo-1618005156198-d10103e0cd5e?w=80&auto=format&fit=crop&q=60' },
    { name: 'Fimela.com', domain: 'fimela.com', categoryId: catEnt.id, da: 79, dr: 77, traffic: 3500000, price: 2400000, logo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&auto=format&fit=crop&q=60' },
    { name: 'Volix Media', domain: 'volix.co', categoryId: catEnt.id, da: 45, dr: 40, traffic: 150000, price: 1500000, logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60' },
  ];

  const dbMedia = [];
  for (const m of mediaItems) {
    const item = await prisma.media.create({
      data: m,
    });
    dbMedia.push(item);
  }

  console.log(`Created ${dbMedia.length} Media items.`);

  // 5. Create Packages
  // Starter Package: 3 media
  const starterMedia = dbMedia.slice(4, 7);
  const starterPrice = 5000000;
  await prisma.package.create({
    data: {
      name: 'Starter Package',
      description: 'Cocok untuk startup dan bisnis baru yang ingin mulai membangun branding dan reputasi di media digital.',
      price: starterPrice,
      discount: 10, // 10%
      status: 'ACTIVE',
      media: {
        connect: starterMedia.map((m) => ({ id: m.id })),
      },
    },
  });

  // Professional Package: 6 media
  const proMedia = dbMedia.slice(0, 6);
  const proPrice = 12000000;
  await prisma.package.create({
    data: {
      name: 'Professional Package',
      description: 'Publikasi luas di portal berita nasional terkemuka dan media teknologi untuk eksposur bisnis maksimal.',
      price: proPrice,
      discount: 15,
      status: 'ACTIVE',
      media: {
        connect: proMedia.map((m) => ({ id: m.id })),
      },
    },
  });

  // Enterprise Package: 10 media
  const enterpriseMedia = dbMedia.slice(0, 10);
  const entPrice = 22000000;
  await prisma.package.create({
    data: {
      name: 'Enterprise Package',
      description: 'Solusi terlengkap untuk korporasi dengan sebaran media nasional, bisnis, keuangan, dan gaya hidup terbesar.',
      price: entPrice,
      discount: 20,
      status: 'ACTIVE',
      media: {
        connect: enterpriseMedia.map((m) => ({ id: m.id })),
      },
    },
  });

  console.log('Created Packages');

  // 6. Create Vouchers
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);
  await prisma.voucher.create({
    data: {
      code: 'PRLAUNCH',
      type: 'PERCENT',
      value: 10,
      minSpend: 2000000,
      expiredAt: tomorrow,
      status: 'ACTIVE',
    },
  });

  await prisma.voucher.create({
    data: {
      code: 'PRCASHBACK',
      type: 'NOMINAL',
      value: 250000,
      minSpend: 5000000,
      expiredAt: tomorrow,
      status: 'ACTIVE',
    },
  });

  console.log('Created Vouchers');

  // 7. Create Testimonials
  const testimonials = [
    { name: 'Diana Lestari', company: 'CEO StartupGo', content: 'Layanan press release yang sangat luar biasa. Artikel bisnis kami tayang di Detik dan Kompas dalam 2 hari saja. Traffic website kami naik drastis!', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
    { name: 'Rian Hidayat', company: 'Digital Marketing Manager FinTech ID', content: 'Harga transparan dan proses checkout yang sangat mudah. Kami bisa memilih media secara satuan sesuai target segmen kami. Rekomended sekali!', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
    { name: 'Siti Aminah', company: 'PR Specialist HijabStyle', content: 'Sangat terbantu dengan pengerjaannya yang cepat. Laporan link hasil tayang di-upload lengkap di dashboard admin. Proses revisi anchor text juga dilayani dengan baik.', rating: 4, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Created Testimonials');

  // 8. Create FAQs
  const faqs = [
    { question: 'Berapa lama waktu pengerjaan publikasi?', answer: 'Waktu pengerjaan berkisar antara 1 hingga 3 hari kerja setelah materi artikel disetujui dan pembayaran dikonfirmasi.' },
    { question: 'Apakah artikel yang diterbitkan bersifat permanen?', answer: 'Ya, seluruh artikel press release yang diterbitkan di media mitra kami bersifat permanen dan tidak akan dihapus.' },
    { question: 'Apakah saya bisa mengirimkan artikel yang sudah jadi?', answer: 'Tentu saja. Anda bisa mengunggah draf artikel Anda saat melakukan checkout. Tim kami akan melakukan review singkat sebelum dikirimkan ke redaksi media.' },
    { question: 'Bagaimana jika artikel ditolak oleh pihak media?', answer: 'Jika ada penolakan dari pihak media (karena melanggar kebijakan konten mereka), kami akan menawarkan media pengganti yang setara atau melakukan refund 100% untuk media tersebut.' },
    { question: 'Apakah ada jaminan artikel terindeks Google?', answer: 'Hampir seluruh media nasional mitra kami memiliki kredibilitas tinggi, sehingga artikel Anda dijamin cepat terindeks di halaman pencarian Google.' },
  ];

  for (const f of faqs) {
    await prisma.faq.create({ data: f });
  }

  console.log('Created FAQs');

  // 9. Create Settings
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
    await prisma.setting.create({ data: { key: s.key, value: s.value } });
  }

  console.log('Created Settings');

  // 10. Create Blog Posts
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
    await prisma.blog.create({ data: b });
  }

  console.log('Created Blog Posts');

  // 11. Create a Seed Order for Budi
  const customerBudi = await prisma.customer.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      whatsapp: '628999999999',
      totalOrders: 1,
      totalSpend: 3000000,
    },
  });

  const orderBudi = await prisma.order.create({
    data: {
      customerId: customerBudi.id,
      userId: user.id,
      brandName: 'HijabModern',
      anchorText: 'Hijab Modern Murah',
      url: 'https://hijabmodern.com',
      notes: 'Harap publish di kategori gaya hidup/lifestyle.',
      status: 'PUBLISHED',
      paymentMethod: 'QRIS',
      subtotal: 3000000,
      discount: 0,
      total: 3000000,
      proofPath: '/uploads/proofs/sample-proof.png',
      publishProofUrl: 'https://kapanlagi.com/gaya-hidup/tren-hijab-modern-2026',
      items: {
        create: [
          {
            mediaId: dbMedia.find((m) => m.domain === 'kapanlagi.com')?.id,
            price: 3000000,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      orderId: orderBudi.id,
      amount: 3000000,
      method: 'QRIS',
      proofPath: '/uploads/proofs/sample-proof.png',
      status: 'APPROVED',
      paidAt: new Date(),
    },
  });

  console.log('Created Sample Order for Budi');

  // 12. Create Backlinks
  const backlinks = [
    {
      logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&auto=format&fit=crop&q=60',
      name: 'Axiom Tech Blog',
      domain: 'axiomtech.com',
      da: 45,
      dr: 42,
      traffic: 25000,
      price: 450000,
      notes: 'Cocok untuk niche teknologi, startup, IT, dan gadgets.',
    },
    {
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=80&auto=format&fit=crop&q=60',
      name: 'Finance & Bisnis Journal',
      domain: 'financejournal.id',
      da: 38,
      dr: 35,
      traffic: 18000,
      price: 350000,
      notes: 'Sangat baik untuk backlink fintech, investasi, bisnis, dan UKM.',
    },
    {
      logo: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=80&auto=format&fit=crop&q=60',
      name: 'Lifestyle & Gaya Hidup',
      domain: 'indolifestyle.co.id',
      da: 35,
      dr: 30,
      traffic: 30000,
      price: 250000,
      notes: 'Niche fashion, kuliner, pariwisata, kecantikan, dan parenting.',
    },
  ];

  for (const bl of backlinks) {
    await prisma.backlink.create({ data: bl });
  }
  console.log('Created Backlinks');

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
