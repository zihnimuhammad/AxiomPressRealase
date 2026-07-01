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

// GET all media and categories
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const media = await db.media.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ media, categories });
  } catch (error: any) {
    console.error('Admin Media GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// POST create media
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { name, domain, categoryId, da, dr, traffic, price, notes, logo } = body;

    if (!name || !domain || !categoryId || price === undefined) {
      return NextResponse.json({ message: 'Name, domain, category, and price are required' }, { status: 400 });
    }

    const defaultLogo = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60';

    const newMedia = await db.media.create({
      data: {
        name,
        domain,
        categoryId,
        da: parseInt(da) || 20,
        dr: parseInt(dr) || 20,
        traffic: parseInt(traffic) || 10000,
        price: parseFloat(price),
        status: body.status || 'ACTIVE',
        notes: notes || '',
        logo: logo || defaultLogo,
      },
      include: { category: true },
    });

    return NextResponse.json({ message: 'Media created successfully', media: newMedia });
  } catch (error: any) {
    console.error('Admin Media POST error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PUT update media
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, name, domain, categoryId, da, dr, traffic, price, status, notes, logo } = body;

    if (!id || !name || !domain || !categoryId || price === undefined) {
      return NextResponse.json({ message: 'ID, name, domain, category, and price are required' }, { status: 400 });
    }

    const updatedMedia = await db.media.update({
      where: { id },
      data: {
        name,
        domain,
        categoryId,
        da: parseInt(da) || 20,
        dr: parseInt(dr) || 20,
        traffic: parseInt(traffic) || 10000,
        price: parseFloat(price),
        status: status || 'ACTIVE',
        notes: notes || '',
        logo: logo || undefined,
      },
      include: { category: true },
    });

    return NextResponse.json({ message: 'Media updated successfully', media: updatedMedia });
  } catch (error: any) {
    console.error('Admin Media PUT error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// DELETE media
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

    await db.media.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('Admin Media DELETE error:', error);
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
    const { type, percentage } = body; // type: 'increase' | 'decrease', percentage: number

    if (!type || percentage === undefined || isNaN(percentage)) {
      return NextResponse.json({ message: 'Type and percentage are required' }, { status: 400 });
    }

    const modifier = type === 'increase' ? (1 + percentage / 100) : (1 - percentage / 100);

    // Retrieve all media items
    const allMedia = await db.media.findMany();

    // Update prices one by one (or bulk in Prisma if using raw queries, but standard transactions are safe)
    const updatePromises = allMedia.map(m => {
      const newPrice = Math.round(m.price * modifier);
      return db.media.update({
        where: { id: m.id },
        data: { price: newPrice }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Bulk price update completed successfully' });
  } catch (error: any) {
    console.error('Admin Media PATCH error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
