import { fetchDailyRevenue, fetchKpis } from "@/lib/data";
import { NextResponse } from "next/server";
import { features } from "node:process";

export async function GET() {
  const data = await fetchDailyRevenue();
//   console.log("KPIS desde /test:", kpis);
  return NextResponse.json({ ok: true, data });
}
