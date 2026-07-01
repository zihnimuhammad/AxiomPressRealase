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

// GET settings (mapped to key-value object)
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const list = await db.setting.findMany();
    const settingsObj: Record<string, string> = {};
    list.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    return NextResponse.json({ settings: settingsObj });
  } catch (error: any) {
    console.error('Admin Settings GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// POST save settings
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json(); // expects key-value dictionary

    const promises = Object.entries(body).map(([key, value]) => {
      return db.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Admin Settings POST error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
