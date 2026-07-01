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

// GET all backlinks
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const backlinks = await db.backlink.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ backlinks });
  } catch (error: any) {
    console.error('Admin Backlinks GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// POST create backlink
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { name, domain, da, dr, traffic, price, notes, logo } = body;

    if (!name || !domain || price === undefined) {
      return NextResponse.json({ message: 'Name, domain, and price are required' }, { status: 400 });
    }

    const defaultLogo = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&auto=format&fit=crop&q=60';

    const newBacklink = await db.backlink.create({
      data: {
        name,
        domain,
        da: parseInt(da) || 20,
        dr: parseInt(dr) || 20,
        traffic: parseInt(traffic) || 10000,
        price: parseFloat(price),
        status: body.status || 'ACTIVE',
        notes: notes || '',
        logo: logo || defaultLogo,
      },
    });

    return NextResponse.json({ message: 'Backlink created successfully', backlink: newBacklink });
  } catch (error: any) {
    console.error('Admin Backlinks POST error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PUT update backlink
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, name, domain, da, dr, traffic, price, status, notes, logo } = body;

    if (!id || !name || !domain || price === undefined) {
      return NextResponse.json({ message: 'ID, name, domain, and price are required' }, { status: 400 });
    }

    const updatedBacklink = await db.backlink.update({
      where: { id },
      data: {
        name,
        domain,
        da: parseInt(da) || 20,
        dr: parseInt(dr) || 20,
        traffic: parseInt(traffic) || 10000,
        price: parseFloat(price),
        status: status || 'ACTIVE',
        notes: notes || '',
        logo: logo || undefined,
      },
    });

    return NextResponse.json({ message: 'Backlink updated successfully', backlink: updatedBacklink });
  } catch (error: any) {
    console.error('Admin Backlinks PUT error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// DELETE backlink
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

    await db.backlink.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Backlink deleted successfully' });
  } catch (error: any) {
    console.error('Admin Backlinks DELETE error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PATCH for bulk price update
export async function PATCH(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { percentage, action } = body; // action is 'increase' or 'decrease'

    if (percentage === undefined || !action) {
      return NextResponse.json({ message: 'Percentage and action are required' }, { status: 400 });
    }

    const pct = parseFloat(percentage) / 100;
    const backlinks = await db.backlink.findMany();

    const updates = backlinks.map((bl) => {
      let newPrice = bl.price;
      if (action === 'increase') {
        newPrice = Math.round(bl.price * (1 + pct));
      } else if (action === 'decrease') {
        newPrice = Math.round(bl.price * (1 - pct));
      }

      return db.backlink.update({
        where: { id: bl.id },
        data: { price: newPrice },
      });
    });

    await db.$transaction(updates);

    return NextResponse.json({ message: `Bulk price update successful. Updated ${backlinks.length} items.` });
  } catch (error: any) {
    console.error('Admin Backlinks PATCH error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
