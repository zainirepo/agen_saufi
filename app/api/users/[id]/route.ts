import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireCeo() {
  const session = await auth();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (session.user.role !== "CEO") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { session };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireCeo();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { name, email, password, role, profilePicUrl } = body;

  if (role !== undefined && role !== "CEO" && role !== "ADMIN") {
    return NextResponse.json({ error: "role tidak valid" }, { status: 400 });
  }

  const data: Record<string, unknown> = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(role !== undefined && { role }),
    ...(profilePicUrl !== undefined && { profilePicUrl: profilePicUrl || null }),
  };

  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, profilePicUrl: true, createdAt: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireCeo();
  if (error) return error;

  const { id } = await params;

  if (session!.user.id === id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
