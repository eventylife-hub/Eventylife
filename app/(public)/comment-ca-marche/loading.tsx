export default function CommentCaMarcheLoading() {
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
      {/* Hero skeleton */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          padding: '5rem 1rem 4rem',
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <div
            className="mx-auto mb-4 h-4 w-40 rounded skeleton"
            style={{ opacity: 0.2 }}
          />
          <div
            className="mx-auto mb-4 h-10 w-80 rounded skeleton"
            style={{ opacity: 0.15 }}
          />
          <div
            className="mx-auto h-5 w-64 rounded skeleton"
            style={{ opacity: 0.1 }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-10">
          <div className="h-4 w-16 rounded skeleton" />
          <div className="h-4 w-4 rounded skeleton" />
          <div className="h-4 w-36 rounded skeleton" />
        </div>

        {/* 4 étapes skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col md:flex-row gap-8 mb-16 items-start">
            {/* Icône + numéro */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl skeleton" />
              <div className="mt-3 h-3 w-16 rounded skeleton" />
            </div>
            {/* Contenu */}
            <div
              className="flex-1 p-6 rounded-2xl"
              style={{
                background: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
              }}
            >
              <div className="h-6 w-48 rounded skeleton mb-3" />
              <div className="h-4 w-full rounded skeleton mb-2" />
              <div className="h-4 w-3/4 rounded skeleton mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-56 rounded skeleton" />
                <div className="h-3 w-48 rounded skeleton" />
                <div className="h-3 w-52 rounded skeleton" />
              </div>
            </div>
          </div>
        ))}

        {/* Garanties skeleton */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="mx-auto h-3 w-32 rounded skeleton mb-3" />
            <div className="mx-auto h-8 w-48 rounded skeleton" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="text-center p-5 rounded-2xl"
                style={{
                  background: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                }}
              >
                <div className="mx-auto w-10 h-10 rounded-full skeleton mb-3" />
                <div className="mx-auto h-4 w-28 rounded skeleton mb-2" />
                <div className="mx-auto h-3 w-36 rounded skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
