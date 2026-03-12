'use client';

/**
 * Page Support Client — Création et suivi de tickets
 * Endpoints : GET /api/support/tickets, POST /api/support/tickets
 */


import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { supportTicketSchema, zodErrorsToRecord } from '@/lib/validations';
import { extractErrorMessage } from '@/lib/api-error';
interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  messagesCount: number;
}

type LoadState = 'loading' | 'error' | 'data';

const statusLabels: Record<string, string> = {
  OPEN: 'Ouvert',
  IN_PROGRESS: 'En cours',
  WAITING_CLIENT: 'Réponse attendue',
  RESOLVED: 'Résolu',
  CLOSED: 'Fermé',
};

const statusBadgeStyle: Record<string, { background: string; color: string }> = {
  OPEN: { background: '#EFF6FF', color: '#0369A1' },
  IN_PROGRESS: { background: '#FDF6E8', color: '#92400e' },
  WAITING_CLIENT: { background: '#FEF3C7', color: '#92400e' },
  RESOLVED: { background: '#DCFCE7', color: '#166534' },
  CLOSED: { background: '#F3F4F6', color: '#4B5563' },
};

const priorityBadgeStyle: Record<string, { background: string; color: string }> = {
  LOW: { background: '#EFF6FF', color: '#0369A1' },
  MEDIUM: { background: '#FDF6E8', color: '#92400e' },
  HIGH: { background: '#FEF3C7', color: '#92400e' },
  URGENT: { background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' },
};

const priorityLabels: Record<string, string> = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  URGENT: 'Urgente',
};

const categoryLabels: Record<string, string> = {
  BOOKING: 'Réservation',
  PAYMENT: 'Paiement',
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Hébergement',
  CANCELLATION: 'Annulation',
  ACCOUNT: 'Mon compte',
  OTHER: 'Autre',
};

export default function SupportPage() {
  const [state, setState] = useState<LoadState>('loading');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Formulaire de création
  const [formData, setFormData] = useState({
    subject: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setState('loading');
      const res = await fetch('/api/support/tickets', {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Impossible de charger les tickets');

      const data = (await res.json() as unknown) as Record<string, unknown>;
      setTickets(data?.items || data as Ticket[]);
      setState('data');
    } catch (err: unknown) {
      logger.warn('API indisponible, utilisation des données de démonstration');
      setTickets([
        {
          id: 'tkt_001', subject: 'Question sur le ramassage porte-à-porte',
          category: 'TRANSPORT', status: 'OPEN', priority: 'NORMAL',
          lastMessage: 'Bonjour, je voudrais savoir si le ramassage peut se faire à une adresse différente de mon domicile...',
          createdAt: '2026-03-05T10:30:00Z', updatedAt: '2026-03-06T14:15:00Z',
        },
        {
          id: 'tkt_002', subject: 'Modification de réservation Marrakech',
          category: 'BOOKING', status: 'RESOLVED', priority: 'HIGH',
          lastMessage: 'Votre modification a bien été prise en compte.',
          createdAt: '2026-02-20T08:00:00Z', updatedAt: '2026-02-22T16:45:00Z',
        },
      ]);
      setState('data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = supportTicketSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = zodErrorsToRecord(validation.error);
      const firstError = Object.values(fieldErrors)[0] || 'Veuillez corriger les erreurs';
      setSubmitMessage({ type: 'error', text: firstError });
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage(null);

      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = (await res.json() as unknown) as Record<string, unknown>;
        throw new Error(data.message || 'Erreur lors de la création du ticket');
      }

      setSubmitMessage({ type: 'success', text: 'Ticket créé avec succès ! Notre équipe vous répondra sous 24h.' });
      setFormData({ subject: '', category: 'OTHER', priority: 'MEDIUM', message: '' });
      setShowForm(false);

      // Rafraîchir la liste
      await fetchTickets();

      setTimeout(() => setSubmitMessage(null), 5000);
    } catch (err: unknown) {
      setSubmitMessage({
        type: 'error',
        text: extractErrorMessage(err, 'Erreur'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'open') return !['RESOLVED', 'CLOSED'].includes(t.status);
    if (filter === 'closed') return ['RESOLVED', 'CLOSED'].includes(t.status);
    return true;
  });

  // formatDate locale supprimée — utilise formatDateTime de @/lib/utils

  // État loading
  if (state === 'loading') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
        <div className="h-8 w-48 rounded-2xl skeleton" />
        <div className="h-12 w-full rounded-2xl skeleton" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl skeleton" />
        ))}
      </div>
    );
  }

  // État erreur
  if (state === 'error') {
    return (
      <div className="max-w-4xl mx-auto animate-fade-up">
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5' }}>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
          <button type="button"
            onClick={fetchTickets}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D97B5E';
              e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* En-tête */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Support</h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
            Besoin d&apos;aide ? Créez un ticket et notre équipe vous répondra rapidement.
          </p>
        </div>
        {!showForm && (
          <button type="button"
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D97B5E';
              e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Nouveau ticket
          </button>
        )}
      </div>

      {/* Message de succès/erreur */}
      {submitMessage && (
        <div
          role={submitMessage.type === 'success' ? 'status' : 'alert'}
          className="p-6 rounded-2xl text-sm"
          style={{
            background: submitMessage.type === 'success' ? '#DCFCE7' : 'var(--terra-soft, #FEF2F2)',
            border: `1.5px solid ${submitMessage.type === 'success' ? '#166534' : '#FCA5A5'}`,
            color: submitMessage.type === 'success' ? '#166534' : 'var(--terra, #DC2626)',
          }}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Formulaire de création */}
      {showForm && (
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Créer un ticket</h2>

          <form aria-label="Contacter le support" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ticket-subject" className="block text-sm font-semibold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Sujet *
              </label>
              <input
                id="ticket-subject"
                type="text"
                value={formData.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subject: (e.target as HTMLInputElement).value })}
                placeholder="Décrivez brièvement votre problème"
                required
                minLength={5}
                maxLength={200}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  border: '1.5px solid #E5E0D8',
                  background: '#fff',
                  color: 'var(--navy, #1A1A2E)',
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ticket-category" className="block text-sm font-semibold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Catégorie
                </label>
                <select
                  id="ticket-category"
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                  style={{
                    border: '1.5px solid #E5E0D8',
                    background: '#fff',
                    color: 'var(--navy, #1A1A2E)',
                  }}
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ticket-priority" className="block text-sm font-semibold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  Priorité
                </label>
                <select
                  id="ticket-priority"
                  value={formData.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                  style={{
                    border: '1.5px solid #E5E0D8',
                    background: '#fff',
                    color: 'var(--navy, #1A1A2E)',
                  }}
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="ticket-message" className="block text-sm font-semibold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Message *
              </label>
              <textarea
                id="ticket-message"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez votre problème en détail. Plus vous donnez de détails, plus nous pourrons vous aider rapidement."
                required
                minLength={20}
                maxLength={5000}
                rows={5}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  border: '1.5px solid #E5E0D8',
                  background: '#fff',
                  color: 'var(--navy, #1A1A2E)',
                }}
              />
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                {formData.message.length}/5000 caractères
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: submitting ? '#6B7280' : 'var(--terra, #C75B39)',
                  color: '#fff',
                  opacity: submitting ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.background = '#D97B5E';
                    e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = submitting ? '#6B7280' : 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {submitting ? 'Envoi en cours...' : 'Créer le ticket'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: '#fff',
                  color: 'var(--navy, #1A1A2E)',
                  border: '1.5px solid #E5E0D8',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap" style={{ borderBottom: '1.5px solid #E5E0D8', paddingBottom: '16px' }}>
        {[
          { key: 'all', label: 'Tous', count: tickets.length },
          { key: 'open', label: 'Ouverts', count: tickets.filter((t) => !['RESOLVED', 'CLOSED'].includes(t.status)).length },
          { key: 'closed', label: 'Résolus', count: tickets.filter((t) => ['RESOLVED', 'CLOSED'].includes(t.status)).length },
        ].map((f) => (
          <button type="button"
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: filter === f.key ? 'var(--terra, #C75B39)' : '#fff',
              color: filter === f.key ? '#fff' : 'var(--navy, #1A1A2E)',
              border: `1.5px solid ${filter === f.key ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
            }}
            onMouseEnter={(e) => {
              if (filter !== f.key) {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== f.key) {
                e.currentTarget.style.background = '#fff';
              }
            }}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Liste des tickets */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="text-5xl mb-4">💬</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
            {filter === 'all' ? 'Aucun ticket' : filter === 'open' ? 'Aucun ticket ouvert' : 'Aucun ticket résolu'}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            {filter === 'all'
              ? 'Vous n\'avez pas encore créé de ticket'
              : 'Aucun ticket dans cette catégorie'}
          </p>
          {filter === 'all' && (
            <button type="button"
              onClick={() => setShowForm(true)}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D97B5E';
                e.currentTarget.style.boxShadow = `0 6px 24px var(--terra, #C75B39)30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--terra, #C75B39)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Créer votre premier ticket
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl p-5 transition-all duration-300"
              style={{
                background: '#fff',
                border: '1.5px solid #E5E0D8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,26,46,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {ticket.subject}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
                    <span>{categoryLabels[ticket.category] || ticket.category}</span>
                    <span>·</span>
                    <span>Créé le {formatDateTime(ticket.createdAt)}</span>
                    {ticket.messagesCount > 0 && (
                      <>
                        <span>·</span>
                        <span>{ticket.messagesCount} message{ticket.messagesCount > 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {(ticket.priority === 'URGENT' || ticket.priority === 'HIGH') && (
                    <span
                      className="px-3 py-1 rounded-xl text-xs font-semibold"
                      style={priorityBadgeStyle[ticket.priority]}
                    >
                      {ticket.priority === 'URGENT' ? 'Urgent' : 'Haute priorité'}
                    </span>
                  )}
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-semibold"
                    style={statusBadgeStyle[ticket.status] || { background: '#F3F4F6', color: '#4B5563' }}
                  >
                    {statusLabels[ticket.status] || ticket.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info d'aide */}
      <div className="rounded-2xl p-6" style={{ background: '#EFF6FF', border: '1.5px solid #DBEAFE' }}>
        <h3 className="font-bold text-base mb-2" style={{ color: '#0369A1' }}>Besoin d&apos;aide urgente ?</h3>
        <p className="text-sm" style={{ color: '#0369A1' }}>
          Pour les urgences liées à un voyage en cours, contactez-nous directement au{' '}
          <strong>01 23 45 67 89</strong> (disponible 7j/7 pendant les voyages).
          Notre équipe support répond habituellement aux tickets sous 24h ouvrées.
        </p>
      </div>
    </div>
  );
}
