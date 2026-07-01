export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBlogs } from '@/lib/data';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog & Media Insights | Axiom Press Release',
  description: 'Artikel terbaru seputar tips penulisan press release, strategi hubungan masyarakat (PR), dan optimasi SEO untuk brand Anda.',
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
              PR & SEO Insights
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Blog & Artikel Terbaru</h1>
            <p className="max-w-2xl mx-auto text-slate-500">
              Pelajari tips meningkatkan eksposur media, menulis draf press release yang bernilai berita, dan mengoptimalkan SEO secara organik.
            </p>
          </div>

          {/* Cards Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 rounded-3xl">
              <p className="text-slate-400">Belum ada artikel blog yang diterbitkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail */}
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden h-48 bg-slate-100 dark:bg-slate-800 relative">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-[10px] font-semibold text-slate-400 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          Tim Redaksi
                        </span>
                      </div>
                      
                      <h2 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
