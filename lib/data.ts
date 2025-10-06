import { sql } from '@/lib/db';
import { toYMD } from './utils';
import { DailyPoint } from './definitions';


export async function fetchKpis() {
    try {        
        const revenuePromise = sql<{revenue: string}>`
            SELECT COALESCE(SUM(products.price * order_items.quantity), 0) as "revenue"
            FROM orders 
            INNER JOIN order_items ON orders.id = order_items.order_id
            INNER JOIN products ON products.id = order_items.product_id
            WHERE orders.status = 'paid'
        `;
        
        const orderStatusPromise = sql<{
            cancelled: string,
            paid: string,
            count: string
        }>`
            SELECT SUM(CASE WHEN orders.status = 'cancelled' THEN 1 ELSE 0 END) as "cancelled"
                , SUM(CASE WHEN orders.status = 'paid' THEN 1 ELSE 0 END) as "paid"
                , COUNT(*)
            FROM orders
        `

        const data = await Promise.all([
            revenuePromise,
            orderStatusPromise
        ]);
    
        const totalRevenue = Number(data[0].rows[0].revenue ?? '0');
        const numberOfCancelledOrders = Number(data[1].rows[0].cancelled ?? '0');
        const numberOfPaidOrders = Number(data[1].rows[0].paid ?? '0');
        const numberOfTotalOrders = Number(data[1].rows[0].count ?? '0');
        const cancelRate = numberOfTotalOrders ? numberOfCancelledOrders/numberOfTotalOrders * 100 : 0;

        return {
            totalRevenue,
            cancelRate,
            numberOfPaidOrders
        };

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch kpis');
    }
}

export async function fetchDailyRevenue(
    dateFrom?: Date, dateTo?: Date
) {
    try {
        const from = toYMD(dateFrom);  // p.ej. "2024-01-01" o null
        const to   = toYMD(dateTo); 
        
        const { rows } = await sql<{
            date: string;        
            revenue: number;
        }>`
            SELECT
                to_char(o.order_date::date, 'YYYY-MM-DD') AS date, 
                COALESCE(SUM(oi.unit_price * oi.quantity), 0)::double precision AS revenue
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            WHERE o.status = 'paid'
            AND ( ${from}::date IS NULL OR o.order_date::date >= ${from}::date )
            AND ( ${to}::date   IS NULL OR o.order_date::date <= ${to}::date )
            GROUP BY o.order_date::date
            ORDER BY o.order_date::date ASC
        `;

        return rows.map(r => ({ date: r.date, revenue: r.revenue ?? 0 }));
    }
    catch (error){
        console.error('Database Error:', error);
        throw new Error('Failes to fetch daily revenue')
    }
}