/**
 * Loading skeleton — Inscription
 */
export default function InscriptionLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FEFCF3 50%, #FFF1E6 100%)' }}>
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Titre */}
          <div className="flex justify-center mb-6">
            <div className="h-8 w-48 bg-gray-100 rounded-lg" />
          </div>
          <div className="flex justify-center mb-8">
            <div className="h-4 w-60 bg-gray-50 rounded" />
          </div>

          {/* Champs */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-3.5 w-16 bg-gray-50 rounded mb-2" />
                <div className="h-11 w-full bg-gray-100 rounded-lg" />
              </div>
              <div>
                <div className="h-3.5 w-14 bg-gray-50 rounded mb-2" />
                <div className="h-11 w-full bg-gray-100 rounded-lg" />
              </div>
            </div>
            <div>
              <div className="h-3.5 w-24 bg-gray-50 rounded mb-2" />
              <div className="h-11 w-full bg-gray-100 rounded-lg" />
            </div>
            <div>
              <div className="h-3.5 w-28 bg-gray-50 rounded mb-2" />
              <div className="h-11 w-full bg-gray-100 rounded-lg" />
            </div>
            <div>
              <div className="h-3.5 w-24 bg-gray-50 rounded mb-2" />
              <div className="h-11 w-full bg-gray-100 rounded-lg" />
            </div>

            {/* Type selector */}
            <div className="flex gap-3">
              <div className="h-11 flex-1 bg-gray-100 rounded-lg" />
              <div className="h-11 flex-1 bg-gray-100 rounded-lg" />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 mt-2">
              <div className="h-4 w-60 bg-gray-50 rounded" />
              <div className="h-4 w-52 bg-gray-50 rounded" />
            </div>

            <div className="h-11 w-full bg-gray-100 rounded-lg mt-2" />
          </div>

          <div className="mt-6 pt-6 border-t flex justify-center">
            <div className="h-4 w-52 bg-gray-50 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
