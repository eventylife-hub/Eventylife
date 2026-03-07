'use client';

import { useState } from 'react';
import Link from 'next/link';

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  gold: '#D4A853',
  white: '#FFFFFF',
  muted: '#6B7280',
  border: '#E8E4DE',
  green: '#059669',
  greenBg: '#ECFDF5',
};

const faqData = [
  {
    category: 'Réservation',
    items: [
      {
        question: 'Comment réserver un voyage ?',
        answer: 'Choisissez votre destination, sélectionnez vos dates et le nombre de participants, puis procédez au paiement sécurisé.',
      },
      {
        question: 'Puis-je réserver pour un groupe ?',
        answer: 'Oui ! Eventy est spécialisé dans le voyage de groupe. Vous pouvez réserver pour 2 à 50 personnes.',
      },
      {
        question: 'Comment fonctionne le paiement ?',
        answer: 'Paiement sécurisé par carte bancaire via Stripe. Possibilité de paiement en plusieurs fois.',
      },
      {
        question: 'Puis-je annuler ma réservation ?',
        answer: 'Annulation gratuite jusquà 30 jours avant le départ. Conditions détaillées dans nos CGV.',
      },
    ],
  },
  {
    category: 'Transport',
    items: [
      {
        question: 'Comment fonctionne le ramassage ?',
        answer: 'Nous venons vous chercher près de chez vous en bus grand tourisme. Points de ramassage communiqués 7 jours avant.',
      },
      {
        question: 'Quels types de transport ?',
        answer: 'Bus grand tourisme et avion selon les destinations. Tous nos véhicules sont climatis&#233;s et confortables.',
      },
      {
        question: 'Puis-je rejoindre le groupe en cours de route ?',
        answer: 'Oui, des points de ralliement intermédiaires sont possibles. Contactez-nous pour organiser.',
      },
    ],
  },
  {
    category: 'Partenariat',
    items: [
      {
        question: 'Comment devenir partenaire ?',
        answer: 'Inscrivez-vous sur notre plateforme, validation sous 48h, formation gratuite de 2h.',
      },
      {
        question: 'Quelles sont les commissions ?',
        answer: 'De 8% à 15% selon le volume. Un partenaire actif peut gagner 3000-8000\u20ac/an.',
      },
      {
        question: 'Faut-il un diplôme ?',
        answer: 'Non, aucun diplôme requis. Eventy est une agence immatriculée, vous êtes apporteur d\'affaires.',
      },
    ],
  },
  {
    category: 'Pratique',
    items: [
      {
        question: 'Les voyages sont-ils assurés ?',
        answer: 'Oui, assurance RC Pro et garantie financière APST. Vous voyagez en toute sérénité.',
      },
      {
        question: 'Y a-t-il un accompagnateur ?',
        answer: 'Oui, chaque voyage est accompagné par un professionnel Eventy du début à la fin.',
      },
      {
        question: 'Comment contacter le support ?',
        answer: 'Par email contact@eventylife.fr, par téléphone 01 23 45 67 89, ou via le formulaire de contact.',
      },
    ],
  },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, Set<number>>>({});

  const toggleItem = (category: string, index: number) => {
    setExpandedItems((prev) => {
      const categorySet = prev[category] || new Set();
      const newSet = new Set(categorySet);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return { ...prev, [category]: newSet };
    });
  };

  const filteredData = faqData
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.cream, color: C.navy, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: C.navy,
        color: C.white,
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0 0 16px 0',
          letterSpacing: '-1px',
        }}>
          Questions fr&#233;quentes
        </h1>
        <p style={{
          fontSize: '18px',
          margin: '0',
          color: '#D1D5DB',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Tout ce que vous devez savoir sur Eventy Life
        </p>
      </section>

      {/* Search Bar */}
      <div style={{
        padding: '40px 20px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <input
          type="text"
          placeholder="Rechercher une question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '16px',
            border: `2px solid ${C.border}`,
            borderRadius: '8px',
            boxSizing: 'border-box',
            backgroundColor: C.white,
            color: C.navy,
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = C.terra;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = C.border;
          }}
        />
      </div>

      {/* FAQ Categories */}
      <div style={{
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0 20px 60px 20px',
      }}>
        {filteredData.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: C.muted,
          }}>
            <p style={{ fontSize: '18px', margin: '0' }}>
              Aucune r&#233;ponse trouv&#233;e pour votre recherche.
            </p>
          </div>
        ) : (
          filteredData.map((category) => (
            <div key={category.category} style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: C.terra,
                marginBottom: '24px',
                marginTop: '0',
                paddingBottom: '12px',
                borderBottom: `3px solid ${C.gold}`,
              }}>
                {category.category}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {category.items.map((item, index) => {
                  const isExpanded = (expandedItems[category.category] || new Set()).has(index);

                  return (
                    <div
                      key={index}
                      style={{
                        border: `1px solid ${C.border}`,
                        borderRadius: '8px',
                        backgroundColor: C.white,
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        boxShadow: isExpanded ? `0 4px 12px rgba(0, 0, 0, 0.05)` : 'none',
                      }}
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => toggleItem(category.category, index)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          textAlign: 'left',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: C.navy,
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9F5F0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ flex: 1, paddingRight: '16px' }}>
                          {item.question}
                        </span>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          backgroundColor: C.terra,
                          color: C.white,
                          borderRadius: '50%',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          flexShrink: 0,
                          transition: 'transform 0.2s',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}>
                          {isExpanded ? '\u2212' : '+'}
                        </span>
                      </button>

                      {/* Answer */}
                      {isExpanded && (
                        <div style={{
                          padding: '0 20px 16px 20px',
                          backgroundColor: C.greenBg,
                          borderTop: `1px solid ${C.border}`,
                          color: C.navy,
                          lineHeight: '1.6',
                          fontSize: '16px',
                        }}>
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CTA Section */}
      <section style={{
        backgroundColor: C.navy,
        color: C.white,
        padding: '60px 20px',
        textAlign: 'center',
        marginTop: '40px',
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 0 20px 0',
        }}>
          Vous n\'avez pas trouv&#233; votre r&#233;ponse ?
        </h2>
        <p style={{
          fontSize: '18px',
          margin: '0 0 30px 0',
          color: '#D1D5DB',
        }}>
          Notre &#233;quipe est l&#224; pour vous aider.
        </p>
        <Link href="/contact">
          <a style={{
            display: 'inline-block',
            padding: '14px 32px',
            backgroundColor: C.terra,
            color: C.white,
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B84A2F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = C.terra;
          }}>
            Nous contacter
          </a>
        </Link>
      </section>

      {/* Footer Spacing */}
      <div style={{ height: '40px' }} />
    </div>
  );
}
