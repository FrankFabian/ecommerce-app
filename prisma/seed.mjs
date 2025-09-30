import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'

const prisma = new PrismaClient()
const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', name), 'utf-8'))

async function main() {
  const products = read('products.json')
  const customers = read('customers.json')
  const orders = read('orders.json')
  const items = read('order_items.json')

  // Products
  await prisma.product.createMany({
    data: products.map(p => ({
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock
    })),
    skipDuplicates: true
  })

  // Customers
  await prisma.customer.createMany({
    data: customers.map(c => ({
      fullName: c.full_name,
      email: c.email,
      district: c.district,
      createdAt: c.created_at ? new Date(c.created_at) : new Date()
    })),
    skipDuplicates: true
  })

  // Orders
  for (const o of orders) {
    await prisma.order.create({
      data: {
        customerId: o.customer_id,
        orderDate: new Date(o.order_date),
        status: o.status
      }
    })
  }

  // Items
  for (const it of items) {
    await prisma.orderItem.create({
      data: {
        orderId: it.order_id,
        productId: it.product_id,
        unitPrice: it.unit_price,
        quantity: it.quantity
      }
    })
  }

  console.log('Seed complete')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
