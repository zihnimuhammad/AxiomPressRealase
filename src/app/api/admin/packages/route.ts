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

// GET all packages
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const packages = await db.package.findMany({
      include: {
        media: {
          select: {
            id: true,
            name: true,
            domain: true,
            price: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ packages });
  } catch (error: any) {
    console.error('Admin Packages GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// POST create package
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { name, description, price, discount, mediaIds } = body;

    if (!name || !description || price === undefined || !mediaIds || !Array.isArray(mediaIds)) {
      return NextResponse.json({ message: 'Name, description, price, and mediaIds are required' }, { status: 400 });
    }

    const newPackage = await db.package.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        status: body.status || 'ACTIVE',
        media: {
          connect: mediaIds.map((id: string) => ({ id })),
        },
      },
      include: { media: true },
    });

    return NextResponse.json({ message: 'Package created successfully', package: newPackage });
  } catch (error: any) {
    console.error('Admin Packages POST error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PUT update package
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, name, description, price, discount, status, mediaIds } = body;

    if (!id || !name || !description || price === undefined || !mediaIds || !Array.isArray(mediaIds)) {
      return NextResponse.json({ message: 'ID, name, description, price, and mediaIds are required' }, { status: 400 });
    }

    const updatedPackage = await db.package.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        status: status || 'ACTIVE',
        media: {
          set: mediaIds.map((id: string) => ({ id })),
        },
      },
      include: { media: true },
    });

    return NextResponse.json({ message: 'Package updated successfully', package: updatedPackage });
  } catch (error: any) {
    console.error('Admin Packages PUT error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// DELETE package
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

    await db.package.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (error: any) {
    console.error('Admin Packages DELETE error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
