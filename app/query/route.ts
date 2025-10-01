import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CountRow = { count: number };

export async function GET() {
  try {
    const { rows: p } = await sql<CountRow>`SELECT COUNT(*)::int AS count FROM products;`;
    const { rows: c } = await sql<CountRow>`SELECT COUNT(*)::int AS count FROM customers;`;
    const { rows: o } = await sql<CountRow>`SELECT COUNT(*)::int AS count FROM orders;`;
    const { rows: oi } = await sql<CountRow>`SELECT COUNT(*)::int AS count FROM order_items;`;

    return NextResponse.json({
      products: p[0]?.count ?? 0,
      customers: c[0]?.count ?? 0,
      orders: o[0]?.count ?? 0,
      order_items: oi[0]?.count ?? 0,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Query error:', err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
