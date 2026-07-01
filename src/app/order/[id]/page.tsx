import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderById, getSettings } from '@/lib/data';
import OrderTracker from '@/components/OrderTracker';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Status Order #${resolvedParams.id.slice(0, 8)} | Axiom Press Release`,
    description: 'Pantau perkembangan penerbitan artikel press release Anda secara real-time.',
  };
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  const order = await getOrderById(orderId);
  const settings = await getSettings();

  if (!order) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderTracker order={order} settings={settings} />
        </div>
      </main>
      <Footer />
    </>
  );
}
