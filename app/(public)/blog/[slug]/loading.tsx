/**
 * Skeleton Loading — Page article blog
 * Design Sun/Ocean V4
 */
export default function BlogArticleLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      {/* Breadcrumb skeleton */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex gap-2 items-center">
          <div
            className="h-4 w-16 rounded animate-pulse"
            style={{ background: 'rgba(26,26,46,0.08)' }}
          />
          <div
            className="h-4 w-4 rounded animate-pulse"
            style={{ background: 'rgba(26,26,46,0.06)' }}
          />
          <div
            className="h-4 w-12 rounded animate-pulse"
            style={{ background: 'rgba(26,26,46,0.08)' }}
          />
          <div
            className="h-4 w-4 rounded animate-pulse"
            style={{ background: 'rgba(26,26,46,0.06)' }}
          />
          <div
            className="h-4 w-40 rounded animate-pulse"
            style={{ background: 'rgba(26,26,46,0.08)' }}
          />
        </div>
      </div>

      {/* Article header skeleton */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6">
        {/* Category badge */}
        <div
          className="h-6 w-24 rounded-full animate-pulse mb-4"
          style={{ background: 'rgba(199,91,57,0.12)' }}
        />
        {/* Title */}
        <div
          className="h-10 w-3/4 rounded-lg animate-pulse mb-3"
          style={{ background: 'rgba(26,26,46,0.1)' }}
        />
        <div
          className="h-10 w-1/2 rounded-lg animate-pulse mb-6"
          style={{ background: 'rgba(26,26,46,0.08)' }}
        />
        {/* Meta row */}
        <div className="flex gap-4 items-center">
          <div
            className="h-10 w-10 rounded-full animate-pulse"
            style={{ background: 'rgba(26,26,46,0.1)' }}
          />
          <div className="flex flex-col gap-1.5">
            <div
              className="h-4 w-32 rounded animate-pulse"
              style={{ background: 'rgba(26,26,46,0.08)' }}
            />
            <div
              className="h-3 w-48 rounded animate-pulse"
              style={{ background: 'rgba(26,26,46,0.06)' }}
            />
          </div>
        </div>
      </div>

      {/* Cover image skeleton */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div
          className="w-full rounded-2xl animate-pulse"
          style={{
            background: 'rgba(26,26,46,0.08)',
            height: '400px',
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        {[...Array(4)].map((_, blockIdx) => (
          <div key={blockIdx} className="mb-8">
            {/* Heading */}
            <div
              className="h-7 w-2/5 rounded-lg animate-pulse mb-4"
              style={{ background: 'rgba(26,26,46,0.1)' }}
            />
            {/* Paragraphs */}
            {[...Array(3)].map((_, lineIdx) => (
              <div
                key={lineIdx}
                className="h-4 rounded animate-pulse mb-2.5"
                style={{
                  background: 'rgba(26,26,46,0.06)',
                  width: lineIdx === 2 ? '75%' : '100%',
                }}
              />
            ))}
          </div>
        ))}

        {/* Tags skeleton */}
        <div className="flex gap-2 mt-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-full animate-pulse"
              style={{ background: 'rgba(26,26,46,0.06)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
