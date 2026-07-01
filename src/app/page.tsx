export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getFaqs, getTestimonials, getSettings } from '@/lib/data';
import { 
  Award, Clock, CheckCircle2, ShieldCheck, 
  HelpCircle, ArrowRight, Star, Quote 
} from 'lucide-react';
import FaqSection from '@/components/FaqSection';

export default async function HomePage() {
  const [faqs, testimonials, settings] = await Promise.all([
    getFaqs(),
    getTestimonials(),
    getSettings(),
  ]);

  const benefits = [
    {
      icon: <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "1000+ Media Online",
      description: "Jejaring luas portal berita nasional, regional, teknologi, gaya hidup, hingga bisnis terkemuka di Indonesia."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Harga Transparan",
      description: "Tidak ada biaya tersembunyi. Anda membayar persis sesuai harga satuan media atau paket hemat yang tertera."
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Pengerjaan Cepat",
      description: "Rata-rata artikel press release Anda tayang dalam 24-72 jam kerja setelah materi disetujui."
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Artikel Permanen",
      description: "Semua berita yang diterbitkan dijamin permanen nempel selamanya di media bersangkutan untuk reputasi jangka panjang."
    }
  ];

  const steps = [
    { num: "01", title: "Pilih Media", desc: "Pilih portal berita favorit Anda secara eceran/satuan atau pilih paket bundel yang tersedia." },
    { num: "02", title: "Upload Artikel & Brief", desc: "Unggah draf artikel Anda, isi keyword jangkar (anchor text), link tujuan, dan instruksi penulisan." },
    { num: "03", title: "Lakukan Pembayaran", desc: "Bayar pesanan secara instan dan aman menggunakan QRIS, Transfer Bank, atau e-Wallet." },
    { num: "04", title: "Artikel Tayang", desc: "Tim kami mengirimkan ke redaksi media, artikel diterbitkan, dan link publikasi dilaporkan di dashboard." }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950">
          {/* Subtle mesh background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <span>🌟 Jasa Press Release Distribusi #1</span>
            </div>

            <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
              {settings.hero_title}
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/packages"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Pesan Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/media"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                Lihat Daftar Media
              </Link>
            </div>
          </div>
        </section>

        {/* Keunggulan Section */}
        <section className="py-20 bg-white dark:bg-slate-950 border-t border-b border-slate-100 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mengapa Memilih Axiom Press Release?</h2>
              <p className="text-slate-500">Kami menawarkan layanan publikasi media dengan standar premium dan kualitas terjamin untuk bisnis Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 hover:border-blue-500/30 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none transition-all duration-300 group"
                >
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl inline-block border border-slate-100 dark:border-slate-800 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cara Kerja Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Cara Kerja Publikasi Press Release</h2>
              <p className="text-slate-500">Proses distribusi press release menjadi super mudah, cepat, dan transparan tanpa ribet.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="relative bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col items-start">
                  <span className="text-4xl font-extrabold text-blue-600/20 dark:text-blue-400/20 mb-4">{step.num}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jasa Backlink Promo Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between gap-12">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/60 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <span>🔗 SEO Link Building</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Tingkatkan Peringkat Google dengan Jasa Backlink Kontekstual Premium
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Dapatkan link penunjang SEO dari jaringan blog dan situs web berotoritas tinggi (DA/DR 30+). Link ditanam di dalam artikel yang relevan, terindex permanen, dan aman dari penalti algoritma mesin pencari.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">✓</div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Contextual Link Relevan</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">✓</div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">High DA & DR (Hingga 50+)</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">✓</div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Laporan Transparan & Cepat</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">✓</div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Jaminan Nempel Selamanya</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    href="/backlinks"
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-indigo-500/15"
                  >
                    Jelajahi Direktori Backlink
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 flex-1 grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 shadow-sm space-y-2 text-center flex flex-col justify-center">
                  <span className="text-3xl font-black text-indigo-600">45+</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average DA</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 shadow-sm space-y-2 text-center flex flex-col justify-center">
                  <span className="text-3xl font-black text-emerald-500">100%</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Indeks Google</p>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white space-y-2 shadow-md">
                  <h4 className="font-extrabold text-sm">Harga Mulai Rp 250K</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Lebih terjangkau dibanding press release media nasional besar, ideal untuk optimasi SEO tier-1 / tier-2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Apa Kata Klien Kami?</h2>
              <p className="text-slate-500">Ribuan brand, startup, dan UMKM telah menggunakan jasa distribusi press release kami.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div key={test.id} className="relative p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col justify-between hover:shadow-lg transition-all">
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/10 dark:text-blue-400/5" />
                  
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex text-amber-500">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                      "{test.content}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{test.name}</h4>
                      <p className="text-xs text-slate-500">{test.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection faqs={faqs} />
      </main>
      <Footer />
    </>
  );
}
