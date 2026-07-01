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

// GET all testimonials
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error('Admin Testimonials GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// POST create testimonial
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { name, company, avatar, content, rating } = body;

    if (!name || !company || !content) {
      return NextResponse.json({ message: 'Name, company, and content are required' }, { status: 400 });
    }

    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60';

    const newTestimonial = await db.testimonial.create({
      data: {
        name,
        company,
        content,
        rating: rating !== undefined ? parseInt(rating) : 5,
        avatar: avatar || defaultAvatar,
      },
    });

    return NextResponse.json({ message: 'Testimonial created successfully', testimonial: newTestimonial });
  } catch (error: any) {
    console.error('Admin Testimonials POST error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PUT update testimonial
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, name, company, avatar, content, rating } = body;

    if (!id || !name || !company || !content) {
      return NextResponse.json({ message: 'ID, name, company, and content are required' }, { status: 400 });
    }

    const updatedTestimonial = await db.testimonial.update({
      where: { id },
      data: {
        name,
        company,
        content,
        rating: rating !== undefined ? parseInt(rating) : 5,
        avatar: avatar || undefined,
      },
    });

    return NextResponse.json({ message: 'Testimonial updated successfully', testimonial: updatedTestimonial });
  } catch (error: any) {
    console.error('Admin Testimonials PUT error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// DELETE testimonial
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

    await db.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    console.error('Admin Testimonials DELETE error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
