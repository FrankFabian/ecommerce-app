import { KpiCard } from '@/app/ui/KpiCard';
import SalesBarChart from '@/app/ui/SalesBarChart';
import { fetchDailyRevenue, fetchKpis } from '@/lib/data';

export default async function DashboardPage() {
  const {  
    totalRevenue,
    cancelRate,
    numberOfPaidOrders
  } = await fetchKpis();;

  const dailyPoints = await fetchDailyRevenue();

  console.log(dailyPoints[0]);

  return (
    <main >
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-3">
        <KpiCard 
          title='Ingreso Total'
          value={Intl.NumberFormat('es-PE', {style:'currency',currency:'PEN'}).format(totalRevenue)}
        />
        <KpiCard 
          title='Tasa de cancelacion'
          value={`${cancelRate.toFixed(1)}%`}
        />
        <KpiCard 
          title='Numero de pedidos pagados'
          value={numberOfPaidOrders}
        />
      </div>
      <div className="mt-6 w-full h-80 bg-white dark:bg-neutral-900 rounded-xl shadow-md p-4">
        <SalesBarChart data={dailyPoints}/>
      </div>
    </main>
  );
}
