import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "CEO") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, profilePicUrl: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "CEO") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, email, password, role: newRole, profilePicUrl } = body;

  if (!name || !email || !password || !newRole) {
    return NextResponse.json({ error: "name, email, password, role wajib diisi" }, { status: 400 });
  }
  if (newRole !== "CEO" && newRole !== "ADMIN") {
    return NextResponse.json({ error: "role tidak valid" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: newRole, profilePicUrl: profilePicUrl || null },
    select: { id: true, name: true, email: true, role: true, profilePicUrl: true, createdAt: true },
  });

  return NextResponse.json(user, { status: 201 });
}
