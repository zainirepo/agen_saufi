import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { namaPemesan, noHp, statusBayar, catatan, fileUrl, fileName, fileSize } = body;

  if (!namaPemesan || !noHp) {
    return NextResponse.json({ error: "namaPemesan dan noHp wajib diisi" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      namaPemesan,
      noHp,
      statusBayar: statusBayar ?? "BELUM",
      catatan: catatan || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileSize: fileSize ?? null,
    },
  });

  return NextResponse.json(order, { status: 201 });
}
