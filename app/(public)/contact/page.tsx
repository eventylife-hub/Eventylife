'use client';

/**
 * Page Contact — Design Sun/Ocean V4
 * Formulaire avec validation client-side, select sujet, téléphone optionnel,
 * compteur caractères, consentement RGPD, coordonnées + hero navy cohérent
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/lib/stores/ui-store';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { contactSchema, zodErrorsToRecord } from '@/lib/validations';
import { API_URL } from '@/lib/config';
import { logger } from '@/lib/logger';

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
    lines: ['contact@eventylife.fr', 'support@eventylife.fr'],
  },
  {
    icon: '🕐',
    title: 'Horaires',
    lines: ['Lun-Ven : 9h00-18h00', 'Sam : 10h-16h', 'Dim : Fermé'],
  },
];

const subjectOptions = [
  { value: '', label: 'Choisir un sujet...' },
  { value: 'reservation', label: 'Question sur une réservation' },
  { value: 'voyage', label: 'Renseignement sur un voyage' },
  { value: 'group', label: 'Organiser un voyage de groupe' },
  { value: 'partenariat', label: 'Devenir partenaire' },
  { value: 'reclamation', label: 'Réclamation' },
  { value: 'presse', label: 'Contact presse' },
  { value: 'autre', label: 'Autre' },
];

const MESSAGE_MAX = 2000;
const MESSAGE_MIN = 20;

const inputBaseStyle: React.CSSProperties = {
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

const errorInputStyle: React.CSSProperties = {
  ...inputBaseStyle,
  borderColor: '#EF4444',
};

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

export default function ContactPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const validate = useCallback((): FormErrors => {
    const result = contactSchema.safeParse({ ...formData, consent });
    if (result.success) return {};
    return zodErrorsToRecord(result.error) as FormErrors;
  }, [formData, consent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    // Mark all as touched
    setTouched({ name: true, email: true, phone: true, subject: true, message: true, consent: true });

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || undefined,
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch((err) => {
          logger.error('[ContactForm] Erreur parsing réponse JSON:', err);
          return null;
        });
        throw new Error(errorData?.message || `Erreur serveur (${response.status})`);
      }

      toast.success('Message envoyé avec succès ! Nous vous répondrons sous 24h.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setConsent(false);
      setTouched({});
      setErrors({});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'envoi du message.";
      toast.error(`${msg} Réessayez plus tard.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#C75B39';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199,91,57,0.1)';
  };

  const handleBlur = (field: string) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
    if (!validationErrors[field as keyof FormErrors]) {
      e.currentTarget.style.borderColor = '#E5E0D8';
    } else {
      e.currentTarget.style.borderColor = '#EF4444';
    }
    e.currentTarget.style.boxShadow = 'none';
  };

  const getFieldStyle = (field: keyof FormErrors): React.CSSProperties =>
    touched[field] && errors[field] ? errorInputStyle : inputBaseStyle;

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

              <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
                {/* Nom + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      Nom complet <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      placeholder="Votre nom"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      style={getFieldStyle('name')}
                      onFocus={handleFocus}
                      onBlur={handleBlur('name')}
                    />
                    {touched.name && errors.name && (
                      <p id="name-error" className="text-xs mt-1" style={{ color: '#EF4444' }} role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      Email <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="votre@email.com"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      style={getFieldStyle('email')}
                      onFocus={handleFocus}
                      onBlur={handleBlur('email')}
                    />
                    {touched.email && errors.email && (
                      <p id="email-error" className="text-xs mt-1" style={{ color: '#EF4444' }} role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Téléphone + Sujet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      Téléphone <span className="text-xs font-normal" style={{ color: '#6B7280' }}>(optionnel)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+33 6 XX XX XX XX"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      aria-invalid={touched.phone && !!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      style={getFieldStyle('phone')}
                      onFocus={handleFocus}
                      onBlur={handleBlur('phone')}
                    />
                    {touched.phone && errors.phone && (
                      <p id="phone-error" className="text-xs mt-1" style={{ color: '#EF4444' }} role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      Sujet <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      id="contact-subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      aria-invalid={touched.subject && !!errors.subject}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      style={{
                        ...getFieldStyle('subject'),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '20px',
                        paddingRight: '40px',
                      }}
                      onFocus={handleFocus as React.FocusEventHandler<HTMLSelectElement>}
                      onBlur={handleBlur('subject') as React.FocusEventHandler<HTMLSelectElement>}
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {touched.subject && errors.subject && (
                      <p id="subject-error" className="text-xs mt-1" style={{ color: '#EF4444' }} role="alert">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-sm font-semibold"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      Message <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <span
                      className="text-xs"
                      style={{
                        color: formData.message.length > MESSAGE_MAX ? '#EF4444' : '#6B7280',
                      }}
                    >
                      {formData.message.length}/{MESSAGE_MAX}
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    placeholder="Décrivez votre demande en détail..."
                    required
                    value={formData.message}
                    onChange={(e) => {
                      if (e.target.value.length <= MESSAGE_MAX + 50) {
                        setFormData({ ...formData, message: e.target.value });
                      }
                    }}
                    rows={6}
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    style={getFieldStyle('message')}
                    onFocus={handleFocus}
                    onBlur={handleBlur('message') as React.FocusEventHandler<HTMLTextAreaElement>}
                  />
                  {touched.message && errors.message && (
                    <p id="message-error" className="text-xs mt-1" style={{ color: '#EF4444' }} role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Consentement RGPD */}
                <div className="flex items-start gap-3">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 flex-shrink-0"
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: 'var(--terra, #C75B39)',
                      cursor: 'pointer',
                    }}
                    aria-invalid={touched.consent && !!errors.consent}
                    aria-describedby={errors.consent ? 'consent-error' : undefined}
                  />
                  <label htmlFor="contact-consent" className="text-xs" style={{ color: '#64748B', lineHeight: '1.5', cursor: 'pointer' }}>
                    J&apos;accepte que mes données soient traitées pour répondre à ma demande, conformément à la{' '}
                    <a href="/confidentialite" style={{ color: 'var(--terra, #C75B39)', textDecoration: 'underline' }}>
                      politique de confidentialité
                    </a>.
                    <span style={{ color: '#EF4444' }}> *</span>
                  </label>
                </div>
                {touched.consent && errors.consent && (
                  <p id="consent-error" className="text-xs -mt-3" style={{ color: '#EF4444', paddingLeft: '30px' }} role="alert">
                    {errors.consent}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--terra, #C75B39)',
                    color: 'white',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(199,91,57,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(199,91,57,0.35)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(199,91,57,0.25)';
                  }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>

                <p className="text-xs text-center" style={{ color: '#6B7280' }}>
                  Les champs marqués <span style={{ color: '#EF4444' }}>*</span> sont obligatoires
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar coordonnées */}
          <div className="space-y-4">
            {/* Temps de réponse */}
            <div
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(199,91,57,0.06), rgba(212,168,83,0.06))',
                border: '1px solid rgba(199,91,57,0.12)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--terra, #C75B39)', color: '#fff', fontSize: '1.1rem' }}
              >
                ⚡
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Réponse sous 24h
                </p>
                <p className="text-xs" style={{ color: '#64748B' }}>
                  Du lundi au vendredi
                </p>
              </div>
            </div>

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
                        style={{ color: '#64748B' }}
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
              <p className="text-2xl mb-2" aria-hidden="true">💡</p>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: 'var(--navy, #1A1A2E)' }}
              >
                Consultez notre FAQ
              </p>
              <p className="text-xs mb-3" style={{ color: '#64748B' }}>
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
