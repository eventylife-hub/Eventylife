'use client';

/**
 * Page Contact — Design Sun/Ocean V4
 * Formulaire + coordonnées + hero navy cohérent
 */

import { useState } from 'react';
import { useToast } from '@/lib/stores/ui-store';
import { Breadcrumb } from '@/components/seo/breadcrumb';

const contactInfo = [
  {
    icon: '📍',
    title: 'Adresse',
    lines: ['123 Avenue des Champs', '75008 Paris, France'],
  },
  {
    icon: '📞',
    title: 'Téléphone',
    lines: ['+33 (0)1 XX XX XX XX', 'Lun-Ven : 9h-18h'],
  },
  {
    icon: '✉️',
    title: 'Email',
    lines: ['contact@eventy.life', 'support@eventy.life'],
  },
  {
    icon: '🕐',
    title: 'Horaires',
    lines: ['Lun-Ven : 9h00-18h00', 'Sam : 10h-16h', 'Dim : Fermé'],
  },
];

const inputBaseStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1.5px solid #E5E0D8',
  background: '#fff',
  color: '#1A1A2E',
  fontSize: '0.9375rem',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function ContactPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#C75B39';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199,91,57,0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#E5E0D8';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '5rem 1rem 4rem',
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <p
            className="mb-4"
            style={{
              color: 'var(--gold, #D4A853)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Nous sommes à votre écoute
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Contactez-
            <span style={{ color: 'var(--terra, #C75B39)' }}>nous</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '36rem',
            }}
          >
            Une question, une demande spéciale ? Notre équipe vous répond sous
            24h.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Contact', href: '/contact' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  borderBottom: '1px solid rgba(26,26,46,0.06)',
                }}
              >
                <h2
                  className="text-xl font-bold"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  Envoyez-nous un message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      Nom complet
                    </label>
                    <input
                      id="contact-name"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      style={inputBaseStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      style={inputBaseStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: 'var(--navy, #1A1A2E)' }}
                  >
                    Sujet
                  </label>
                  <input
                    id="contact-subject"
                    placeholder="Sujet de votre message"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    style={inputBaseStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: 'var(--navy, #1A1A2E)' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={6}
                    required
                    style={inputBaseStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-base transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--terra, #C75B39)',
                    color: 'white',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(199,91,57,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar coordonnées */}
          <div className="space-y-4">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                  boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(199,91,57,0.06)' }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-sm mb-1"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      {info.title}
                    </h3>
                    {info.lines.map((line, j) => (
                      <p
                        key={j}
                        className="text-sm"
                        style={{ color: '#718096' }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Carte CTA FAQ */}
            <div
              className="p-5 rounded-2xl text-center"
              style={{
                background: 'var(--gold-soft, #FDF6E8)',
                border: '1px solid rgba(212,168,83,0.2)',
              }}
            >
              <p className="text-2xl mb-2">💡</p>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: 'var(--navy, #1A1A2E)' }}
              >
                Consultez notre FAQ
              </p>
              <p className="text-xs mb-3" style={{ color: '#718096' }}>
                Vous y trouverez peut-être votre réponse
              </p>
              <a
                href="/faq"
                className="inline-block text-sm font-bold transition-colors"
                style={{ color: 'var(--terra, #C75B39)' }}
              >
                Voir la FAQ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
