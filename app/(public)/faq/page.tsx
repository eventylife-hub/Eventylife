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
    category: 'R\u00e9servation',
    items: [
      {
        question: 'Comment r\u00e9server un voyage ?',
        answer: 'Choisissez votre destination, s\u00e9lectionnez vos dates et le nombre de participants, puis proc\u00e9dez au paiement s\u00e9curis\u00e9.',
      },
      {
        question: 'Puis-je r\u00e9server pour un groupe ?',
        answer: 'Oui ! Eventy est sp\u00e9cialis\u00e9 dans le voyage de groupe. Vous pouvez r\u00e9server pour 2 \u00e0 50 personnes.',
      },
      {
        question: 'Comment fonctionne le paiement ?',
        answer: 'Paiement s\u00e9curis\u00e9 par carte bancaire via Stripe. Possibilit\u00e9 de paiement en plusieurs fois.',
      },
      {
        question: 'Puis-je annuler ma r\u00e9servation ?',
        answer: 'Annulation gratuite jusqu\u00e0 30 jours avant le d\u00e9part. Conditions d\u00e9taill\u00e9es dans nos CGV.',
      },
    ],
  },
  {
    category: 'Transport',
    items: [
      {
        question: 'Comment fonctionne le ramassage ?',
        answer: 'Nous venons vous chercher pr\u00e8s de chez vous en bus grand tourisme. Points de ramassage communiqu\u00e9s 7 jours avant.',
      },
      {
        question: 'Quels types de transport ?',
        answer: 'Bus grand tourisme et avion selon les destinations. Tous nos v\u00e9hicules sont climatis&#233;s et confortables.',
      },
      {
        question: 'Puis-je rejoindre le groupe en cours de route ?',
        answer: 'Oui, des points de ralliement interm\u00e9diaires sont possibles. Contactez-nous pour organiser.',
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
        answer: 'De 8% \u00e0 15% selon le volume. Un partenaire actif peut gagner 3000-8000\u20ac/an.',
      },
      {
        question: 'Faut-il un dipl\u00f4me ?',
        answer: 'Non, aucun dipl\u00f4me requis. Eventy est une agence immatricul\u00e9e, vous \u00eates apporteur d\'affaires.',
      },
    ],
  },
  {
    category: 'Pratique',
    items: [
      {
        question: 'Les voyages sont-ils assur\u00e9s ?',
        answer: 'Oui, assurance RC Pro et garantie financi\u00e8re APST. Vous voyagez en toute s\u00e9r\u00e9nit\u00e9.',
      },
      {
        question: 'Y a-t-il un accompagnateur ?',
        answer: 'Oui, chaque voyage est accompagn\u00e9 par un professionnel Eventy du d\u00e9but \u00e0 la fin.',
      },
      {
        question: 'Comment contacter le support ?',
        answer: 'Par email contact@eventylife.fr, par t\u00e9l\u00e9phone 01 23 45 67 89, ou via le formulaire de contact.',
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
