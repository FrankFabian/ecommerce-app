import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows: p } = await sql`SELECT COUNT(*)::int AS count FROM products;`;
    const { rows: c } = await sql`SELECT COUNT(*)::int AS count FROM customers;`;
    const { rows: o } = await sql`SELECT COUNT(*)::int AS count FROM orders;`;
    const { rows: oi } = await sql`SELECT COUNT(*)::int AS count FROM order_items;`;

    return NextResponse.json({
      products: p[0].count,
      customers: c[0].count,
      orders: o[0].count,
      order_items: oi[0].count,
    });
  } catch (err: any) {
    console.error('Query error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
