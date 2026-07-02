'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Loader2, ShieldAlert, KeyRound } from 'lucide-react';

function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      const userRole = (session?.user as any)?.role;
      if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('Gagal menyambung ke server autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper login shortcut for testing
  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Selamat Datang Kembali</h1>
        <p className="text-xs text-slate-400">Masuk ke akun Anda untuk memantau order & publikasi.</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-3.5 rounded-xl text-red-600 text-xs font-semibold">
          <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Utama</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none"
              placeholder="budi@gmail.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <span className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer">Lupa Password?</span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none"
              placeholder="Masukkan password..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Memproses Masuk...</span>
            </>
          ) : (
            <span>Masuk Sekarang</span>
          )}
        </button>
      </form>

      {process.env.NODE_ENV !== 'production' && (
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
          <KeyRound className="h-3 w-3 text-blue-500" />
          Akun Demo Pengujian (Akses Cepat)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickLogin('admin@axiompr.com', 'admin123')}
            className="py-2.5 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20 dark:hover:border-blue-900/40 transition-all flex flex-col justify-center items-center gap-0.5"
          >
            <span>Super Admin</span>
            <span className="text-[9px] text-blue-500 font-normal">Role: SUPER_ADMIN</span>
          </button>
          <button
            onClick={() => handleQuickLogin('budi@gmail.com', 'user123')}
            className="py-2.5 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20 dark:hover:border-blue-900/40 transition-all flex flex-col justify-center items-center gap-0.5"
          >
            <span>Budi Santoso</span>
            <span className="text-[9px] text-blue-500 font-normal">Role: CUSTOMER</span>
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Brand logo */}
      <Link href="/" className="mb-6 flex items-center space-x-2 text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
        Axiom PR
      </Link>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-400">Loading Form Masuk...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
