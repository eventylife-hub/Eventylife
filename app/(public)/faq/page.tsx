/**
 * Page FAQ Publique
 * Page statique avec FAQ accordéon en français
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Données FAQ
const faqData = {
  reservation: {
    title: 'Réservation',
    items: [
      {
        id: 'res-1',
        q: 'Comment puis-je réserver un voyage ?',
        a: 'Pour réserver un voyage, sélectionnez le voyage souhaité sur notre site, cliquez sur "Réserver", remplissez vos informations personnelles et procédez au paiement. Vous recevrez une confirmation par email.'
      },
      {
        id: 'res-2',
        q: 'Puis-je modifier ma réservation après la confirmation ?',
        a: 'Oui, vous pouvez modifier votre réservation jusqu\'à 14 jours avant le voyage. Connectez-vous à votre compte client et accédez à vos réservations pour les modifier.'
      },
      {
        id: 'res-3',
        q: 'Quelle est la capacité minimale pour confirmer un voyage ?',
        a: 'La capacité minimale varie selon les voyages. Elle est indiquée lors de la réservation. Généralement, nous avons besoin d\'au minimum 10 personnes confirmées.'
      },
      {
        id: 'res-4',
        q: 'Puis-je ajouter des participants après la réservation ?',
        a: 'Oui, vous pouvez ajouter des participants jusqu\'à 7 jours avant le départ du voyage. Veuillez nous contacter pour les ajouts.'
      }
    ]
  },
  payment: {
    title: 'Paiement',
    items: [
      {
        id: 'pay-1',
        q: 'Quels modes de paiement acceptez-vous ?',
        a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), les virements bancaires, et les chèques pour les paiements échelonnés.'
      },
      {
        id: 'pay-2',
        q: 'Y a-t-il un acompte à verser ?',
        a: 'Oui, un acompte de 30 % est généralement demandé lors de la réservation. Le solde est dû 30 jours avant le départ.'
      },
      {
        id: 'pay-3',
        q: 'Puis-je payer en plusieurs fois ?',
        a: 'Oui, nous proposons un paiement échelonné sur 3 mois maximum sans frais additionnels. Contactez-nous pour mettre en place un plan de paiement.'
      },
      {
        id: 'pay-4',
        q: 'Mon paiement a échoué, que faire ?',
        a: 'Vérifiez les coordonnées de votre carte. Si l\'erreur persiste, essayez un autre mode de paiement ou contactez notre support client.'
      }
    ]
  },
  transport: {
    title: 'Transport',
    items: [
      {
        id: 'trans-1',
        q: 'Le transport est-il inclus dans le prix ?',
        a: 'Oui, le transport en autocar de qualité est inclus dans le prix du voyage. Les trajets internationaux peuvent être effectués par train ou avion selon la destination.'
      },
      {
        id: 'trans-2',
        q: 'Quels sont les points de départ et d\'arrivée ?',
        a: 'Les points de départ et d\'arrivée dépendent du voyage sélectionné et sont clairement indiqués sur la page du voyage. Des ramassages intermédiaires peuvent être proposés.'
      },
      {
        id: 'trans-3',
        q: 'Y a-t-il des toilettes dans l\'autocar ?',
        a: 'Oui, tous nos autocars sont équipés de toilettes et de climatisation pour votre confort pendant les trajets.'
      },
      {
        id: 'trans-4',
        q: 'Puis-je amener des bagages ?',
        a: 'Oui, chaque passager peut emporter jusqu\'à 2 bagages : 1 en soute et 1 bagage à main. Les bagages volumineux doivent être signalés à l\'avance.'
      }
    ]
  },
  cancellation: {
    title: 'Annulation',
    items: [
      {
        id: 'cancel-1',
        q: 'Quelle est votre politique d\'annulation ?',
        a: 'Les annulations jusqu\'à 30 jours avant le départ sont remboursées à 100 %. Entre 30 et 14 jours : 50 % de remboursement. Moins de 14 jours : pas de remboursement (mais crédit utilisable).'
      },
      {
        id: 'cancel-2',
        q: 'Comment annuler ma réservation ?',
        a: 'Connectez-vous à votre compte client, allez dans "Mes réservations" et cliquez sur "Annuler". Vous recevrez un email de confirmation et un remboursement selon la politique en vigueur.'
      },
      {
        id: 'cancel-3',
        q: 'Qu\'est-ce qu\'un crédit de voyage ?',
        a: 'Un crédit de voyage est une compensation pouvant être utilisée pour réserver un autre voyage auprès de nous. Il n\'est pas remboursable en cas de non-utilisation.'
      },
      {
        id: 'cancel-4',
        q: 'Qu\'advient-il si le voyage est annulé par Eventy Life ?',
        a: 'Si nous annulons un voyage, vous êtes remboursé intégralement ou pouvez changer pour un autre voyage sans frais supplémentaires.'
      }
    ]
  },
  groups: {
    title: 'Groupes',
    items: [
      {
        id: 'group-1',
        q: 'À partir de combien de personnes parlez-vous de groupe ?',
        a: 'À partir de 10 personnes, des tarifs de groupe préférentiel s\'appliquent automatiquement à la réservation.'
      },
      {
        id: 'group-2',
        q: 'Pouvons-nous personnaliser un voyage pour notre groupe ?',
        a: 'Oui, pour les groupes de plus de 20 personnes, nous proposons des voyages sur mesure. Contactez notre équipe pour discuter de vos souhaits.'
      },
      {
        id: 'group-3',
        q: 'Un accompagnateur groupe bénéficie-t-il d\'une gratuité ?',
        a: 'Oui, pour les groupes de 15 personnes ou plus, 1 accompagnateur bénéficie d\'une gratuité. Pour 30 personnes ou plus, 2 accompagnateurs sont gratuits.'
      },
      {
        id: 'group-4',
        q: 'Comment gérer les paiements pour un groupe ?',
        a: 'Vous pouvez désigner un responsable de groupe qui consolidera les paiements. Nous proposons également un système de paiement collectif flexible.'
      }
    ]
  },
  creator: {
    title: 'Pro/Créateur',
    items: [
      {
        id: 'creator-1',
        q: 'Comment devenir un Pro Eventy Life ?',
        a: 'Créez un compte pro sur notre plateforme, complétez votre profil avec vos documents (SIRET, assurance...), et commencez à créer et partager vos voyages.'
      },
      {
        id: 'creator-2',
        q: 'Quelles sont les commissions Eventy Life ?',
        a: 'Nous prenons une commission de 15 % sur chaque réservation effectuée via notre plateforme. Le reste vous est versé dans les 7 jours suivant le voyage.'
      },
      {
        id: 'creator-3',
        q: 'Comment promouvoir mon profil Pro ?',
        a: 'Vous disposez d\'un lien unique et d\'un QR code pour promouvoir vos voyages. Vous pouvez partager ces éléments sur les réseaux sociaux, par email, etc.'
      },
      {
        id: 'creator-4',
        q: 'Qui est responsable de l\'assurance voyage ?',
        a: 'Le Pro doit disposer d\'une assurance responsabilité civile professionnelle valide. Une assurance voyage pour les participants est optionnelle mais recommandée.'
      }
    ]
  }
};

type FaqEntry = {
  title: string;
  items: Array<{ id: string; q: string; a: string }>;
};

type FaqDataType = Record<string, FaqEntry>;

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtrer les FAQs selon la recherche
  const getFilteredFaqs = (): FaqDataType => {
    const query = searchQuery.toLowerCase();
    if (!query) return faqData;

    const filtered: FaqDataType = {};
    Object.entries(faqData).forEach(([key, category]) => {
      const filteredItems = category.items.filter(
        item => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
      );
      if (filteredItems.length > 0) {
        filtered[key] = { ...category, items: filteredItems };
      }
    });
    return filtered;
  };

  const filteredFaqs = getFilteredFaqs();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Foire aux questions
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Trouvez les réponses à vos questions sur Eventy Life
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <Input
            type="search"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base"
          />
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {Object.entries(filteredFaqs).map(([key, category]) => (
          <section key={key} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pb-3 border-b-2 border-blue-500">
              {category.title}
            </h2>

            <div className="space-y-3">
              {category.items.map((item) => {
                const isOpen = openItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full text-left px-6 py-4 bg-white hover:bg-gray-50 flex items-center justify-between font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span className="text-lg">{item.q}</span>
                      <span className={`text-2xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* No Results */}
      {Object.keys(filteredFaqs).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">
            Aucune question ne correspond à votre recherche.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 hover:underline font-medium"
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}

      {/* CTA Section */}
      <section className="mt-16 bg-blue-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Vous n'avez pas trouvé votre réponse ?
        </h2>
        <p className="text-gray-600 mb-6">
          Notre équipe de support est disponible pour répondre à toutes vos questions.
        </p>
        <Link href="/contact">
          <Button variant="primary" size="lg">
            Nous contacter
          </Button>
        </Link>
      </section>
    </div>
  );
}
