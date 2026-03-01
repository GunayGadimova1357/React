import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import 'react-loading-skeleton/dist/skeleton.css';

export function StatCard({
  title,
  value,
  loading
}: {
  title: string
  value: string | number
  loading?: boolean
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value));
  const isNumber = !isNaN(numericValue) && isFinite(numericValue);

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4">
      <div className="text-sm text-zinc-400">
        {loading ? (
          <Skeleton width={80} baseColor="#18181b" highlightColor="#27272a" />
        ) : (
          title
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100">
        {loading ? (
          <Skeleton width={100} baseColor="#18181b" highlightColor="#27272a" />
        ) : isNumber ? (
          <CountUp 
            end={value} 
            duration={2} 
            separator=" "
          />
        ) : (
          value 
        )}
      </div>
    </div>
  )
}
