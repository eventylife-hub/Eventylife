/**
 * Loading page — Wallet
 */
import { Skeleton } from '@/components/ui/skeleton';

export default function WalletLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-8 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-48" />
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_: unknown, i: number) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>

      {/* Voucher Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Transactions Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_: unknown, i: number) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_: unknown, i: number) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
