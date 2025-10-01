import { sql } from '@/lib/db';

export default async function DashboardPage() {
  const [orders, paid, products] = await Promise.all([
    sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM orders;`,
    sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM orders WHERE status='paid';`,
    sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM products;`,
  ]);

  return (
    <main className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Total de órdenes: {orders.rows[0].count}</p>
      <p>Órdenes pagadas: {paid.rows[0].count}</p>
      <p>Productos: {products.rows[0].count}</p>
    </main>
  );
}
