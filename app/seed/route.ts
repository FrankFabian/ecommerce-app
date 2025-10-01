import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function readJson<T>(name: string): T {
  const p = path.join(process.cwd(), 'public', 'data', name);
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
}

type Product = { id: number; sku: string; name: string; category: string; price: number; stock: number };
type Customer = { id: number; full_name: string; email: string; district: string; created_at?: string };
type Order = { id: number; customer_id: number; order_date: string; status: 'paid' | 'pending' | 'cancelled' };
type OrderItem = { order_id: number; product_id: number; unit_price: number; quantity: number };

export async function GET() {
  try {
    // 1) Tablas
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id         INT PRIMARY KEY,
        sku        TEXT UNIQUE NOT NULL,
        name       TEXT NOT NULL,
        category   TEXT NOT NULL,
        price      NUMERIC(10,2) NOT NULL,
        stock      INT NOT NULL
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id          INT PRIMARY KEY,
        full_name   TEXT NOT NULL,
        email       TEXT UNIQUE NOT NULL,
        district    TEXT NOT NULL,
        created_at  TIMESTAMPTZ DEFAULT now()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id           INT PRIMARY KEY,
        customer_id  INT NOT NULL REFERENCES customers(id),
        order_date   DATE NOT NULL,
        status       TEXT NOT NULL CHECK (status IN ('paid','pending','cancelled'))
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        order_id   INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT NOT NULL REFERENCES products(id),
        unit_price NUMERIC(10,2) NOT NULL,
        quantity   INT NOT NULL,
        PRIMARY KEY (order_id, product_id)
      );
    `;

    // 2) Datos (idempotente)
    const products = readJson<Product[]>('products.json');
    const customers = readJson<Customer[]>('customers.json');
    const orders = readJson<Order[]>('orders.json');
    const items = readJson<OrderItem[]>('order_items.json');

    for (const p of products) {
      await sql`
        INSERT INTO products (id, sku, name, category, price, stock)
        VALUES (${p.id}, ${p.sku}, ${p.name}, ${p.category}, ${p.price}, ${p.stock})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    for (const c of customers) {
      await sql`
        INSERT INTO customers (id, full_name, email, district, created_at)
        VALUES (${c.id}, ${c.full_name}, ${c.email}, ${c.district}, COALESCE(${c.created_at}::timestamptz, now()))
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    for (const o of orders) {
      await sql`
        INSERT INTO orders (id, customer_id, order_date, status)
        VALUES (${o.id}, ${o.customer_id}, ${o.order_date}, ${o.status})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    for (const it of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, unit_price, quantity)
        VALUES (${it.order_id}, ${it.product_id}, ${it.unit_price}, ${it.quantity})
        ON CONFLICT (order_id, product_id) DO NOTHING;
      `;
    }

    return NextResponse.json({ ok: true, message: 'Database seeded successfully (idempotent)' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Seed error:', err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
