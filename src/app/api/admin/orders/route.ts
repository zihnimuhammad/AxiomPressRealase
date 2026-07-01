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

// GET all orders
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const orders = await db.order.findMany({
      include: {
        customer: true,
        payment: true,
        items: {
          include: {
            media: true,
            package: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Admin Orders GET error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}

// PUT update order status & proof
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, status, publishProofUrl } = body;

    if (!id || !status) {
      return NextResponse.json({ message: 'ID and Status are required' }, { status: 400 });
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status,
        publishProofUrl: status === 'PUBLISHED' || status === 'COMPLETED' ? publishProofUrl : null,
      },
      include: { customer: true },
    });

    // Automatically update payment record based on order status change
    if (status === 'PAID' || status === 'PROCESSING' || status === 'PUBLISHED' || status === 'COMPLETED') {
      await db.payment.updateMany({
        where: { orderId: id },
        data: {
          status: 'APPROVED',
          paidAt: new Date(),
        },
      });

      // Update customer total spends
      if (updatedOrder.customer) {
        const customerOrders = await db.order.findMany({
          where: { customerId: updatedOrder.customerId, NOT: { status: 'CANCELLED' } }
        });
        const totalSpend = customerOrders.reduce((sum, o) => sum + o.total, 0);
        await db.customer.update({
          where: { id: updatedOrder.customerId },
          data: {
            totalOrders: customerOrders.length,
            totalSpend: totalSpend,
          }
        });
      }

    } else if (status === 'CANCELLED') {
      await db.payment.updateMany({
        where: { orderId: id },
        data: {
          status: 'REJECTED',
        },
      });
    }

    // Add notification
    await db.notification.create({
      data: {
        title: 'Status Pesanan Diperbarui',
        message: `Order #${id.slice(0, 8)} telah diubah statusnya menjadi ${status}.`,
      }
    });

    return NextResponse.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error: any) {
    console.error('Admin Orders PUT error:', error);
    return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
  }
}
