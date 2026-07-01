import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    const formData = await req.formData();
    const proofFile = formData.get('proof') as File | null;

    if (!proofFile || proofFile.size === 0) {
      return NextResponse.json({ message: 'File bukti transfer wajib dilampirkan' }, { status: 400 });
    }

    let proofPath = `/uploads/proofs/${Date.now()}_proof.png`;

    try {
      const bytes = await proofFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'proofs');
      
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}_${proofFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      proofPath = `/uploads/proofs/${fileName}`;

      // Update Order and Payment records in the Database
      if (!orderId.startsWith('offline-')) {
        await db.order.update({
          where: { id: orderId },
          data: { 
            status: 'PAID',
            proofPath: proofPath
          },
        });

        // Update Payment table
        await db.payment.updateMany({
          where: { orderId: orderId },
          data: {
            status: 'APPROVED',
            proofPath: proofPath,
            paidAt: new Date(),
          },
        });

        // Create notification
        await db.notification.create({
          data: {
            title: 'Pembayaran Diterima',
            message: `Pembayaran untuk order #${orderId.slice(0, 8)} telah diunggah dan otomatis diverifikasi.`,
          },
        });
      }
    } catch (dbError) {
      console.warn('Database offline, running proof upload in fallback mode:', dbError);
    }

    return NextResponse.json({
      message: 'Bukti pembayaran berhasil dikirim',
      proofPath,
    });

  } catch (err: any) {
    console.error('Proof upload API error:', err);
    return NextResponse.json({ message: 'Terjadi kesalahan internal server', error: err.message }, { status: 500 });
  }
}
