'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

/**
 * Landing page Eventy Life
 * - Hero section
 * - Comment ça marche
 * - Voyages populaires
 * - Pourquoi Eventy
 * - Témoignages
 * - Newsletter
 */
export default function HomePage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Découvrez le monde avec Eventy Life
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Des voyages en groupe, pensés pour vous. Accompagnement, prix justes, qualité garantie.
          </p>
          <Link
            href="/voyages"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            Découvrir nos voyages
          </Link>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Comment ça marche</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choisir',
                description: 'Parcourez nos voyages en groupe et sélectionnez celui qui vous plaît.',
              },
              {
                step: '2',
                title: 'Réserver',
                description: 'Réservez facilement et payez en plusieurs fois si vous le souhaitez.',
              },
              {
                step: '3',
                title: 'Partir',
                description: 'Profitez d\'un voyage inoubliable avec notre accompagnement complet.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voyages populaires */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Voyages populaires</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Maroc - 8 jours',
                destination: 'Marrakech & Désert',
                price: '890 €',
                image: 'bg-gradient-to-br from-orange-300 to-orange-500',
              },
              {
                title: 'Grèce - 10 jours',
                destination: 'Athènes & Îles',
                price: '1290 €',
                image: 'bg-gradient-to-br from-blue-300 to-blue-500',
              },
              {
                title: 'Italie - 7 jours',
                destination: 'Rome & Côte Amalfitaine',
                price: '1090 €',
                image: 'bg-gradient-to-br from-red-300 to-red-500',
              },
            ].map((travel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
              >
                <div className={`h-48 ${travel.image}`}></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{travel.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{travel.destination}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{travel.price}</span>
                    <Link href="/voyages" className="text-blue-600 hover:text-blue-700 font-medium">
                      Voir →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Eventy */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Pourquoi Eventy Life</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '👥', title: 'Groupes', desc: 'Voyagez en bonne compagnie' },
              { icon: '💰', title: 'Prix justes', desc: 'Meilleures tarifs garantis' },
              { icon: '✓', title: 'Qualité', desc: 'Services premium partout' },
              { icon: '🎯', title: 'Accompagnement', desc: 'Avant, pendant, après' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-lg hover:bg-gray-50 transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos clients témoignent</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marie D.',
                text: 'Un voyage merveilleux! Équipe au top, pas stressée une seconde.',
                rating: 5,
              },
              {
                name: 'Jean P.',
                text: 'Prix honnête et service exceptionnel. Je réserve ma prochaine destination!',
                rating: 5,
              },
              {
                name: 'Sophie L.',
                text: 'Voyage en petit groupe, vraiment sympathique. À recommander!',
                rating: 5,
              },
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{review.text}"</p>
                <p className="font-semibold text-gray-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Recevez nos dernières offres</h2>
          <p className="mb-8">Inscrivez-vous à notre newsletter pour découvrir nos meilleures destinations.</p>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition"
            >
              S'inscrire
            </button>
          </form>

          {subscribed && (
            <p className="mt-4 text-green-100">Merci! Vérifiez votre boîte mail.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
