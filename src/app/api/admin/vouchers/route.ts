import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { error: 'Unauthorized', status: 401 };
  }
  const role = (session.user as any).role;
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'STAFF') {
    return { error: 'Forbidden', status: 403 };
  }
  return { authorized: true };
}

// GET all vouchers
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const vouchers = await db.voucher.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ vouchers });
  } catch (error: any) {
    console.error('Admin Vouchers GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// POST create voucher
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { code, type, value, minSpend, expiredAt } = body;

    if (!code || !type || value === undefined || !expiredAt) {
      return NextResponse.json({ message: 'Code, type, value, and expiredAt are required' }, { status: 400 });
    }

    const newVoucher = await db.voucher.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        value: parseFloat(value),
        minSpend: parseFloat(minSpend) || 0,
        expiredAt: new Date(expiredAt),
        status: body.status || 'ACTIVE',
      },
    });

    return NextResponse.json({ message: 'Voucher created successfully', voucher: newVoucher });
  } catch (error: any) {
    console.error('Admin Vouchers POST error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PUT update voucher
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, code, type, value, minSpend, expiredAt, status } = body;

    if (!id || !code || !type || value === undefined || !expiredAt) {
      return NextResponse.json({ message: 'ID, code, type, value, and expiredAt are required' }, { status: 400 });
    }

    const updatedVoucher = await db.voucher.update({
      where: { id },
      data: {
        code: code.toUpperCase().trim(),
        type,
        value: parseFloat(value),
        minSpend: parseFloat(minSpend) || 0,
        expiredAt: new Date(expiredAt),
        status: status || 'ACTIVE',
      },
    });

    return NextResponse.json({ message: 'Voucher updated successfully', voucher: updatedVoucher });
  } catch (error: any) {
    console.error('Admin Vouchers PUT error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// DELETE voucher
export async function DELETE(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    await db.voucher.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Voucher deleted successfully' });
  } catch (error: any) {
    console.error('Admin Vouchers DELETE error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
