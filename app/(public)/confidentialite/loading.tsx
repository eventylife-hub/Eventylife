export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="animate-pulse rounded-xl h-10 w-80" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="animate-pulse rounded-xl h-4 w-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="animate-pulse rounded-xl h-4 w-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="animate-pulse rounded-xl h-4 w-3/4" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="animate-pulse rounded-xl h-8 w-64 mt-8" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="animate-pulse rounded-xl h-4 w-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="animate-pulse rounded-xl h-4 w-5/6" style={{ background: 'rgba(0,0,0,0.06)' }} />
    </div>
  );
}
