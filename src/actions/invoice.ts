'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function getInvoices() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  return prisma.invoice.findMany({
    where: { userId },
    include: { lineItems: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteInvoice(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (invoice?.userId !== userId) {
    throw new Error("Unauthorized or not found");
  }

  await prisma.invoice.delete({ where: { id } });
  revalidatePath('/dashboard');
}

export async function saveInvoiceToDb(payload: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const { id, invoiceNumber, date, dueDate, status, clientName, clientEmail, clientAddress, clientTaxId, currency, subtotal, taxRate, taxAmount, total, amountDue, notes, terms, lineItems } = payload;
  
  // Sanitize and explicitly select fields to prevent mass assignment
  const safeData = {
    invoiceNumber, date: date ? new Date(date) : new Date(), dueDate: dueDate ? new Date(dueDate) : null,
    status, clientName, clientEmail, clientAddress, clientTaxId, currency, 
    subtotal: Number(subtotal), taxRate: Number(taxRate), taxAmount: Number(taxAmount), 
    total: Number(total), amountDue: Number(amountDue), notes, terms
  };

  if (id) {
    // Verify ownership before updating
    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (existing && existing.userId !== userId) {
      throw new Error("Unauthorized to modify this invoice");
    }
  }
  
  await prisma.invoice.upsert({
    where: { id: id || 'new_record' },
    update: { 
      ...safeData, 
      lineItems: { deleteMany: {}, create: lineItems } 
    },
    create: { 
      ...safeData, 
      id: id || undefined,
      userId, 
      lineItems: { create: lineItems } 
    }
  });
  
  revalidatePath('/dashboard');
}

export async function updateInvoiceStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const userId = (session.user as any).id;

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (invoice?.userId !== userId) {
    throw new Error("Unauthorized or not found");
  }

  await prisma.invoice.update({
    where: { id },
    data: { status }
  });

  revalidatePath('/dashboard');
}
