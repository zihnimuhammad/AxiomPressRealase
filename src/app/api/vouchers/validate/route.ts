import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const FALLBACK_VOUCHERS = [
  { code: 'PRLAUNCH', type: 'PERCENT', value: 10, minSpend: 2000000 },
  { code: 'PRCASHBACK', type: 'NOMINAL', value: 250000, minSpend: 5000000 }
];

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'Kode kupon wajib diisi' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    let voucher = null;

    try {
      voucher = await db.voucher.findUnique({
        where: { code: cleanCode }
      });
    } catch (e) {
      // Graceful fallback if database is offline
      const found = FALLBACK_VOUCHERS.find(v => v.code === cleanCode);
      if (found) {
        voucher = {
          id: 'fallback-v-' + found.code,
          code: found.code,
          type: found.type,
          value: found.value,
          minSpend: found.minSpend,
          expiredAt: new Date(Date.now() + 86400000 * 30), // 30 days from now
          status: 'ACTIVE'
        };
      }
    }

    if (!voucher || voucher.status !== 'ACTIVE') {
      return NextResponse.json({ message: 'Kupon tidak terdaftar atau sudah tidak aktif' }, { status: 404 });
    }

    // Expiry check
    const expiredAt = new Date(voucher.expiredAt);
    if (expiredAt.getTime() < Date.now()) {
      return NextResponse.json({ message: 'Masa berlaku kupon telah habis' }, { status: 400 });
    }

    // Min spend check
    if (subtotal < voucher.minSpend) {
      return NextResponse.json({ 
        message: `Minimal belanja untuk menggunakan kupon ini adalah Rp ${new Intl.NumberFormat('id-ID').format(voucher.minSpend)}` 
      }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Kupon berhasil diverifikasi',
      voucher: {
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        minSpend: voucher.minSpend
      }
    });

  } catch (err) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
