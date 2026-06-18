import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { del } from "@vercel/blob";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { namaPemesan, noHp, statusBayar, catatan, fileUrl, fileName, fileSize } = body;

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(namaPemesan !== undefined && { namaPemesan }),
      ...(noHp !== undefined && { noHp }),
      ...(statusBayar !== undefined && { statusBayar }),
      ...(catatan !== undefined && { catatan }),
      ...(fileUrl !== undefined && { fileUrl }),
      ...(fileName !== undefined && { fileName }),
      ...(fileSize !== undefined && { fileSize }),
    },
  });

  return NextResponse.json(order);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (order.fileUrl) {
    try {
      await del(order.fileUrl);
    } catch {
      // file mungkin sudah terhapus di blob, lanjut hapus record
    }
  }

  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
