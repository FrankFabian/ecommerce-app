'use client';

import { DailyPoint } from "@/lib/definitions";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function SalesBarChart({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        barCategoryGap="40%" 
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} />
        <YAxis tickFormatter={(v) => Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN'}).format(Number(v))} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17,17,17,0.8)',
            border: 'none',
            borderRadius: '8px',
            color: '#f0f0f0',
          }}
          formatter={(v) => [`S/ ${Number(v).toFixed(2)}`, 'Ingresos'] as [string, string]}
          labelFormatter={(l) => `Fecha: ${l}`}
          cursor={false}
        />
        <Bar 
          dataKey="revenue" 
          fill="#3b82f6" 
          radius={[6, 6, 0, 0]} 
          activeBar={{ fill: '#60a5fa' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}