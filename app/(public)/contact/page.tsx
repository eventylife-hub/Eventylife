'use client';

/**
 * Page Contact
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/stores/ui-store';
const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
};

export default function ContactPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message envoyé avec succès!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: unknown) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-fade-up mb-12">
        <p style={{ color: C.gold, fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }} className="mb-3">
          Nous sommes à votre écoute
        </p>
        <h1 style={{ color: C.navy, fontFamily: 'Playfair, serif', fontSize: '2.25rem', fontWeight: '700' }} className="mb-8">
          Contactez-nous
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up">
        <div className="lg:col-span-2">
          <div style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1.5px solid ${C.border}` }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: C.navy }}>Envoyez-nous un message</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label style={{ color: C.navy, fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.375rem', display: 'block' }}>
                    Nom complet
                  </label>
                  <Input
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: (e.target as HTMLInputElement).value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ color: C.navy, fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.375rem', display: 'block' }}>
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ color: C.navy, fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.375rem', display: 'block' }}>
                    Sujet
                  </label>
                  <Input
                    placeholder="Sujet de votre message"
                    value={formData.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subject: (e.target as HTMLInputElement).value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ color: C.navy, fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.375rem', display: 'block' }}>
                    Message
                  </label>
                  <textarea
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, message: (e.target as HTMLInputElement).value })}
                    rows={6}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${C.border}`, outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = C.terra; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(199, 91, 57, 0.1)`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', backgroundColor: C.terra, color: 'white', padding: '0.75rem 1rem', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1 }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = C.terraLight; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = C.terra; }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div>
          <div style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1.5px solid ${C.border}` }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: C.navy }}>Coordonnées</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 style={{ fontWeight: '700', color: C.navy, marginBottom: '0.5rem' }}>Adresse</h3>
                <p style={{ color: C.muted }}>
                  123 Avenue des Champs<br />
                  75008 Paris<br />
                  France
                </p>
              </div>

              <div>
                <h3 style={{ fontWeight: '700', color: C.navy, marginBottom: '0.5rem' }}>Téléphone</h3>
                <p style={{ color: C.muted }}>
                  +33 (0)1 XX XX XX XX<br />
                  Lun-Ven: 9h-18h
                </p>
              </div>

              <div>
                <h3 style={{ fontWeight: '700', color: C.navy, marginBottom: '0.5rem' }}>Email</h3>
                <p style={{ color: C.muted }}>
                  contact@eventy.life<br />
                  support@eventy.life
                </p>
              </div>

              <div>
                <h3 style={{ fontWeight: '700', color: C.navy, marginBottom: '0.5rem' }}>Horaires</h3>
                <p style={{ color: C.muted }}>
                  Lundi - Vendredi<br />
                  9h00 - 18h00<br />
                  Samedi: 10h-16h<br />
                  Dimanche: Fermé
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
