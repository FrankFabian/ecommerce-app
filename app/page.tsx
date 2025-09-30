import Image from "next/image";
import styles from "./page.module.css";

import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  // Lecturas mínimas desde BD
  const [totalOrders, paidOrders, products] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.product.count(),
  ]);

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Total de órdenes: {totalOrders}</p>
      <p>Órdenes pagadas: {paidOrders}</p>
      <p>Productos: {products}</p>
    </main>
  );
}

