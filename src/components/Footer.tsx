'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<any>({
    email_admin: 'support@axiompr.com',
    whatsapp_admin: '6281234567890',
    contact_address: 'Sudirman Central Business District (SCBD), Jakarta Selatan',
    footer_description: 'Jasa Distribusi Press Release premium terpercaya di Indonesia. Dapatkan jaminan tayang permanen di media online nasional utama.'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (err) {
        console.error('Error fetching settings in footer:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo/Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Axiom PR
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.footer_description}
            </p>
          </div>

          {/* Jasa kami */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Layanan</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/media" className="text-sm hover:text-white transition-colors">
                  Daftar Media Satuan
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-sm hover:text-white transition-colors">
                  Paket Hemat Media
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-white transition-colors">
                  Blog & Insight PR
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Informasi</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm">Syarat & Ketentuan</span>
              </li>
              <li>
                <span className="text-sm">Kebijakan Privasi</span>
              </li>
              <li>
                <span className="text-sm">Cara Order Press Release</span>
              </li>
            </ul>
          </div>

          {/* Kontak Admin */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                WhatsApp: <a href={`https://wa.me/${settings.whatsapp_admin}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+{settings.whatsapp_admin}</a>
              </li>
              <li>
                Email: <span className="hover:text-white transition-colors">{settings.email_admin}</span>
              </li>
              <li>
                Alamat: <span className="hover:text-slate-200 transition-colors">{settings.contact_address}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {currentYear} Axiom Press Release (PT Media Distribusi Indonesia). Hak Cipta Dilindungi.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Clean & Secure</span>
            <span>256-Bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
