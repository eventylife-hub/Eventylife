export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="animate-pulse rounded h-4 w-48 mb-8" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="text-center mb-12 space-y-3">
        <div className="animate-pulse rounded h-3 w-32 mx-auto" style={{ background: 'rgba(0,0,0,0.06)' }} />
        <div className="animate-pulse rounded-xl h-10 w-80 mx-auto" style={{ background: 'rgba(0,0,0,0.06)' }} />
        <div className="animate-pulse rounded h-4 w-96 mx-auto" style={{ background: 'rgba(0,0,0,0.06)' }} />
      </div>
      <div className="animate-pulse rounded-xl h-12 w-80 mx-auto mb-10" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl h-16" style={{ background: 'rgba(0,0,0,0.06)' }} />
        ))}
      </div>
    </div>
  );
}
