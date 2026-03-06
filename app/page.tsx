'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Vivez des voyages
              <span className="block text-blue-600">inoubliables en groupe</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              DÃ©couvrez notre plateforme de voyages organisÃ©s avec accompagnement humain porte-Ã -porte.
              Des circuits en bus et avion conÃ§us pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/voyages" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                DÃ©couvrir les voyages
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Nous contacter
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full h-96 bg-gradient-to-br from-blue-200 to-green-200 rounded-2xl shadow-lg flex items-center justify-center text-8xl">
              âï¸
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Pourquoi choisir Eventy Life ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'ð', title: 'Transport confortable', desc: 'Autocars modernes et climatisÃ©s' },
              { icon: 'ð¥', title: 'Accompagnement humain', desc: 'Guides expÃ©rimentÃ©s Ã  vos cÃ´tÃ©s' },
              { icon: 'ð¨', title: 'HÃ©bergements de qualitÃ©', desc: 'Partenaires sÃ©lectionnÃ©s' },
              { icon: 'ð°', title: 'Tarifs compÃ©titifs', desc: 'Meilleurs prix garantis' },
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">TÃ©moignages de voyageurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Marie D.', text: "Un voyage magnifique ! L'accompagnement Ã©tait impeccable.", avatar: 'ð©', rating: 5 },
              { name: 'Pierre M.', text: 'Excellente expÃ©rience. Groupe convivial et guide compÃ©tent.', avatar: 'ð¨', rating: 5 },
              { name: 'Sophie L.', text: 'TrÃ¨s bon rapport qualitÃ©-prix. Tout Ã©tait bien organisÃ©.', avatar: 'ð©', rating: 4 },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{t.name}</h3>
                    <div className="text-sm">{'â­'.repeat(t.rating)}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">PrÃªt Ã  partir Ã  l'aventure ?</h2>
          <p className="text-lg mb-8 opacity-90">DÃ©couvrez nos voyages et trouvez votre destination idÃ©ale</p>
          <Link href="/voyages" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg">
            Explorer nos voyages
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Eventy Life</h3>
            <p className="text-sm">Votre partenaire pour des voyages en groupe inoubliables.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/voyages" className="hover:text-white transition-colors">Nos voyages</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors">CGV</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <p className="text-sm">Email: contact@eventylife.fr</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>Â© 2026 Eventy Life. Tous droits rÃ©servÃ©s.</p>
        </div>
      </footer>
    </main>
  );
}
