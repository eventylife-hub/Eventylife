'use client';

import Link from 'next/link';
import { useState } from 'react';

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

const faqs = [
  {
    question: 'Quel est le d\u00e9lai de r\u00e9ponse ?',
    answer:
      'Nous r\u00e9pondons \u00e0 toutes les demandes dans les 24 heures ouvr\u00e9es. Pour les demandes urgentes, appelez-nous directement.',
  },
  {
    question: 'Puis-je modifier ma r\u00e9servation apr\u00e8s confirmation ?',
    answer:
      'Oui, les modifications sont possibles jusqu\u0027\u00e0 30 jours avant la date du voyage, selon nos conditions g\u00e9n\u00e9rales.',
  },
  {
    question: 'Comment devenir partenaire Eventy Life ?',
    answer:
      'Nous accueillons les partenaires passionn\u00e9s. S\u00e9lectionnez "Partenariat" dans le formulaire et donnez-nous plus de d\u00e9tails.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: 'generale',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: 'generale',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      console.error('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      {/* Navigation */}
      <nav
        style={{
          backgroundColor: C.navy,
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: C.gold,
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          EVENTY LIFE
        </Link>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link
            href="/"
            style={{
              color: C.white,
              textDecoration: 'none',
              fontSize: '0.95rem',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.color = C.gold;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.color = C.white;
            }}
          >
            Accueil
          </Link>
          <Link
            href="/about"
            style={{
              color: C.white,
              textDecoration: 'none',
              fontSize: '0.95rem',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.color = C.gold;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.color = C.white;
            }}
          >
            &#192; Propos
          </Link>
          <Link
            href="/contact"
            style={{
              color: C.gold,
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '600',
            }}
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          backgroundColor: C.navy,
          color: C.white,
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            letterSpacing: '0.02em',
          }}
        >
          Contactez-nous
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: C.gold,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}
        >
          Notre \u00e9quipe est \u00e0 votre \u00e9coute pour r\u00e9pondre \u00e0 vos questions et vos demandes.
        </p>
      </section>

      {/* Main Content */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 2rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Contact Form */}
          <div style={{ order: 1 }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: C.navy,
                marginBottom: '1.5rem',
              }}
            >
              Envoyez-nous un message
            </h2>

            {submitted && (
              <div
                style={{
                  backgroundColor: C.greenBg,
                  border: `2px solid ${C.green}`,
                  color: C.green,
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}
              >
                &#10003; Merci ! Votre message a \u00e9t\u00e9 envoy\u00e9 avec succ\u00e8s. Nous vous r\u00e9pondrons sous peu.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Nom */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="nom"
                  style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: C.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Nom complet *
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition:
                      'border-color 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: C.white,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(199, 91, 57, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: C.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition:
                      'border-color 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: C.white,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(199, 91, 57, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* T\u00e9l\u00e9phone */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="telephone"
                  style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: C.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  T\u00e9l\u00e9phone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition:
                      'border-color 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: C.white,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(199, 91, 57, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Sujet */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="sujet"
                  style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: C.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Sujet *
                </label>
                <select
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition:
                      'border-color 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: C.white,
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(199, 91, 57, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="generale">Question g\u00e9n\u00e9rale</option>
                  <option value="reservation">R\u00e9servation</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="reclamation">R\u00e9clamation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="message"
                  style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: C.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition:
                      'border-color 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: C.white,
                    resize: 'vertical',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(199, 91, 57, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  backgroundColor: C.terra,
                  color: C.white,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(199, 91, 57, 0.25)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      '#A64830';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 8px 20px rgba(199, 91, 57, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    C.terra;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 4px 12px rgba(199, 91, 57, 0.25)';
                }}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer votre message'}
              </button>

              <p
                style={{
                  fontSize: '0.85rem',
                  color: C.muted,
                  marginTop: '1rem',
                  textAlign: 'center',
                }}
              >
                * Champs obligatoires
              </p>
            </form>
          </div>

          {/* Contact Info Panel */}
          <div style={{ order: 2 }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: C.navy,
                marginBottom: '2rem',
              }}
            >
              Nos coordonn\u00e9es
            </h2>

            {/* Contact Item - T\u00e9l\u00e9phone */}
            <div
              style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: C.white,
                borderRadius: '12px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                &#128222;
              </div>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: C.navy,
                  marginBottom: '0.5rem',
                }}
              >
                T\u00e9l\u00e9phone
              </h3>
              <p
                style={{
                  fontSize: '1.125rem',
                  color: C.terra,
                  fontWeight: '500',
                  margin: 0,
                }}
              >
                01 23 45 67 89
              </p>
            </div>

            {/* Contact Item - Email */}
            <div
              style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: C.white,
                borderRadius: '12px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                &#128231;
              </div>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: C.navy,
                  marginBottom: '0.5rem',
                }}
              >
                Email
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: C.terra,
                  fontWeight: '500',
                  margin: 0,
                  wordBreak: 'break-word',
                }}
              >
                contact@eventylife.fr
              </p>
            </div>

            {/* Contact Item - Adresse */}
            <div
              style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: C.white,
                borderRadius: '12px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                &#128205;
              </div>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: C.navy,
                  marginBottom: '0.5rem',
                }}
              >
                Adresse
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: C.terra,
                  fontWeight: '500',
                  margin: 0,
                }}
              >
                Paris, France
              </p>
            </div>

            {/* Contact Item - Horaires */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: C.white,
                borderRadius: '12px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                &#128339;
              </div>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: C.navy,
                  marginBottom: '0.5rem',
                }}
              >
                Horaires d'ouverture
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: C.muted,
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Lundi-Vendredi: 9h-18h
                <br />
                Samedi: 10h-16h
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        style={{
          backgroundColor: C.white,
          padding: '4rem 2rem',
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: C.navy,
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}
          >
            Questions fr\u00e9quentes
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: C.muted,
              textAlign: 'center',
              marginBottom: '3rem',
            }}
          >
            Trouvez les r\u00e9ponses aux questions les plus souvent pos\u00e9es
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  padding: '2rem',
                  backgroundColor: C.cream,
                  borderRadius: '12px',
                  border: `1px solid ${C.border}`,
                }}
              >
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    color: C.terra,
                    marginBottom: '1rem',
                    lineHeight: '1.5',
                  }}
                >
                  {faq.question}
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: C.muted,
                    margin: 0,
                    lineHeight: '1.6',
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: C.navy,
          color: C.white,
          padding: '3rem 2rem',
          textAlign: 'center',
          borderTop: `3px solid ${C.terra}`,
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
          &copy; 2026 Eventy Life. Tous droits r\u00e9serv\u00e9s.
        </p>
        <p style={{ margin: 0, fontSize: '0.85rem', color: C.muted }}>
          Plate-forme de voyages de groupe premium
        </p>
      </footer>
    </div>
  );
}
