import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Find orders matching this user email
      const orders = await db.order.findMany({
        where: {
          customer: {
            email: session.user.email!
          }
        },
        include: {
          items: {
            include: {
              media: true,
              package: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return NextResponse.json({ orders });
    } catch (e) {
      // Fallback empty list if database is initializing or offline
      return NextResponse.json({ orders: [] });
    }

  } catch (err: any) {
    return NextResponse.json({ message: 'Internal server error', error: err.message }, { status: 500 });
  }
}
