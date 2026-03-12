/**
 * Loading skeleton — Conditions générales
 */
export default function ConditionsLoading() {
  return (
    <main className="min-h-screen bg-[#FEFCF3]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Titre */}
        <div className="h-10 w-72 bg-gray-100 rounded-lg mb-4" />
        <div className="h-4 w-48 bg-gray-50 rounded mb-12" />

        {/* Blocs de texte */}
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-6 w-64 bg-gray-100 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-50 rounded" />
                <div className="h-4 w-full bg-gray-50 rounded" />
                <div className="h-4 w-3/4 bg-gray-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
