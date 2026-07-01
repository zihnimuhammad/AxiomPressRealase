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

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// GET all blogs
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const blogs = await db.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ blogs });
  } catch (error: any) {
    console.error('Admin Blogs GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// POST create blog
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { title, summary, content, category, thumbnail, slug, seoTitle, seoDesc } = body;

    if (!title || !summary || !content || !category) {
      return NextResponse.json({ message: 'Title, summary, content, and category are required' }, { status: 400 });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);
    const defaultThumbnail = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60';

    const newBlog = await db.blog.create({
      data: {
        title,
        slug: finalSlug,
        summary,
        content,
        category,
        thumbnail: thumbnail || defaultThumbnail,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || summary,
      },
    });

    return NextResponse.json({ message: 'Blog post created successfully', blog: newBlog });
  } catch (error: any) {
    console.error('Admin Blogs POST error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Slug already exists. Please choose a different title or slug.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PUT update blog
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, title, summary, content, category, thumbnail, slug, seoTitle, seoDesc } = body;

    if (!id || !title || !summary || !content || !category) {
      return NextResponse.json({ message: 'ID, title, summary, content, and category are required' }, { status: 400 });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);

    const updatedBlog = await db.blog.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        summary,
        content,
        category,
        thumbnail: thumbnail || undefined,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || summary,
      },
    });

    return NextResponse.json({ message: 'Blog post updated successfully', blog: updatedBlog });
  } catch (error: any) {
    console.error('Admin Blogs PUT error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Slug already exists. Please choose a different title or slug.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// DELETE blog
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

    await db.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    console.error('Admin Blogs DELETE error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
