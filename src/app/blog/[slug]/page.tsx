export const dynamic = 'force-dynamic';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBlogBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogBySlug(resolvedParams.slug);
  if (!post) return { title: 'Artikel Tidak Ditemukan' };

  return {
    title: `${post.seoTitle || post.title} | Axiom Press Release`,
    description: post.seoDesc || post.summary,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Basic content line breaker formatter since we are not using a markdown parsing package
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-slate-800 dark:text-white mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={index} className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 pl-4 my-4">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[0-9.-]+\s+/, '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Kembali ke Blog
          </Link>

          {/* Article Container */}
          <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 sm:p-10 space-y-8 overflow-hidden">
            
            {/* Meta */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center text-xs text-slate-400 space-x-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1.5" />
                  Ditulis oleh Tim Redaksi
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
              <img 
                src={post.thumbnail} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="prose dark:prose-invert max-w-none">
              {renderContent(post.content)}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
