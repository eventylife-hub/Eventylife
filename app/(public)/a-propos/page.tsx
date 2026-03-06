/**
 * Page À propos
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">À propos d'Eventy Life</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Qui sommes-nous?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Eventy Life est une plateforme française spécialisée dans l'organisation de voyages de groupe 
            avec accompagnement humain. Depuis plusieurs années, nous offrons à nos clients des expériences 
            de voyage inoubliables, organisées de A à Z.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Notre mission est de rendre accessible les voyages de qualité à tous, en proposant une 
            alternative sûre et conviviale aux voyages en solitaire.
          </p>
        </div>
        <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center text-9xl">
          ✈️
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '❤️',
              title: 'Humain',
              description: 'L\'accompagnement humain est au cœur de notre démarche'
            },
            {
              icon: '🎯',
              title: 'Qualité',
              description: 'Nous ne faisons jamais de compromis sur la qualité des expériences'
            },
            {
              icon: '🌍',
              title: 'Durabilité',
              description: 'Nous favorisons le tourisme responsable et durable'
            }
          ].map((value, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card elevated className="bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Prêt à rejoindre notre communauté?</h2>
          <p className="mb-6 opacity-90">
            Découvrez nos voyages et vivez une expérience unique avec Eventy Life
          </p>
          <Link href={ROUTES.VOYAGES}>
            <Button variant="primary" size="lg">
              Découvrir nos voyages
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
