import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import UserDetailForm from "./user-detail-form";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "CEO") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, profilePicUrl: true },
  });
  if (!user) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-lg font-semibold text-gray-900">Edit User</h1>
      <UserDetailForm user={user} isSelf={user.id === session.user.id} />
    </div>
  );
}
