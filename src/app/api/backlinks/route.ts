import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const backlinks = await db.backlink.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { price: 'asc' },
    });
    return NextResponse.json({ backlinks });
  } catch (error: any) {
    console.error('Public Backlinks GET error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
