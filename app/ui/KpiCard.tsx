export function KpiCard({
    title, value
}: {
    title: string; 
    value: string | number
}) {

    return ( 
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-4 border border-gray-100 dark:border-white/10">
            <h3 className="text-sm text-gray-500">
                {title}
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {value}
            </p>
        </div>
    )
}