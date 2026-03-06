export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-green-400 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Vivez des voyages<br />
              <span className="text-yellow-300">inoubliables en groupe</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-lg">
              La plateforme de voyages de groupe avec accompagnement humain porte-a-porte.
              Des circuits en bus et avion penses pour vous.
            </p>
            <div className="flex gap-4">
              <a href="/voyages" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition">
                Voir les voyages
              </a>
              <a href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition">
                Nous contacter
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <span className="text-8xl">&#x2708;</span>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir Eventy Life ?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '\ud83d\ude8c', title: 'Transport confortable', desc: 'Bus premium et vols directs pour un confort optimal.' },
              { icon: '\ud83e\udd1d', title: 'Accompagnement humain', desc: 'Un accompagnateur du depart au retour.' },
              { icon: '\ud83c\udfe8', title: 'Hotels de qualite', desc: 'Hebergements selectionnes avec soin, 3 a 5 etoiles.' },
              { icon: '\ud83d\udcb0', title: 'Tarifs competitifs', desc: 'Les meilleurs prix grace a nos volumes groupe.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temoignages */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ce que disent nos voyageurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Marie L.', text: 'Un voyage magnifique ! Organisation au top, je recommande.', stars: 5 },
              { name: 'Pierre D.', text: 'Accompagnement impeccable du debut a la fin. Merci Eventy !', stars: 5 },
              { name: 'Sophie M.', text: 'Rapport qualite-prix imbattable. Deja mon 3e voyage avec eux.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="text-yellow-400 mb-3">{'\u2605'.repeat(t.stars)}</div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pret pour l&apos;aventure ?</h2>
          <p className="text-lg text-blue-100 mb-8">Rejoignez des milliers de voyageurs satisfaits.</p>
          <a href="/voyages" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition">
            Explorer les voyages
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Eventy Life</h3>
            <p className="text-sm">Votre partenaire pour des voyages de groupe inoubliables.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Liens utiles</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/voyages" className="hover:text-white transition">Nos voyages</a></li>
              <li><a href="/about" className="hover:text-white transition">A propos</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email : contact@eventylife.fr</li>
              <li>Tel : 01 23 45 67 89</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          &copy; 2026 Eventy Life. Tous droits reserves.
        </div>
      </footer>
    </main>
  )
}
