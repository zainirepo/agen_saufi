import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import OrderDetailForm from "./order-detail-form";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-lg font-semibold text-gray-900">Detail Order</h1>
      <OrderDetailForm order={order} />
    </div>
  );
}
