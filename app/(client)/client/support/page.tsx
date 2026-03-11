'use client';

/**
 * Page Support Client — Création et suivi de tickets
 * Endpoints : GET /api/support/tickets, POST /api/support/tickets
 */

'use client';

import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/utils';

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
  forest: '#166534',
  forestBg: '#DCFCE7',
};

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
  IN_PROGRESS: { background: C.goldSoft, color: '#92400e' },
  WAITING_CLIENT: { background: '#FEF3C7', color: '#92400e' },
  RESOLVED: { background: C.forestBg, color: C.forest },
  CLOSED: { background: '#F3F4F6', color: '#4B5563' },
};

const priorityBadgeStyle: Record<string, { background: string; color: string }> = {
  LOW: { background: '#EFF6FF', color: '#0369A1' },
  MEDIUM: { background: C.goldSoft, color: '#92400e' },
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

      const data = await res.json();
      setTickets(data.items || data);
      setState('data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setState('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) return;

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
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la création du ticket');
      }

      setSubmitMessage({ type: 'success', text: 'Ticket créé avec succès ! Notre équipe vous répondra sous 24h.' });
      setFormData({ subject: '', category: 'OTHER', priority: 'MEDIUM', message: '' });
      setShowForm(false);

      // Rafraîchir la liste
      await fetchTickets();

      setTimeout(() => setSubmitMessage(null), 5000);
    } catch (err) {
      setSubmitMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erreur',
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
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #FCA5A5` }}>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
          <button
            onClick={fetchTickets}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: C.terra, color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraLight;
              e.currentTarget.style.boxShadow = `0 4px 12px ${C.terra}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.terra;
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Support</h1>
          <p className="text-sm mt-2" style={{ color: C.muted }}>
            Besoin d&apos;aide ? Créez un ticket et notre équipe vous répondra rapidement.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: C.terra, color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraLight;
              e.currentTarget.style.boxShadow = `0 4px 12px ${C.terra}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.terra;
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
          className="p-6 rounded-2xl text-sm"
          style={{
            background: submitMessage.type === 'success' ? C.forestBg : 'var(--terra-soft, #FEF2F2)',
            border: `1.5px solid ${submitMessage.type === 'success' ? C.forest : '#FCA5A5'}`,
            color: submitMessage.type === 'success' ? C.forest : 'var(--terra, #DC2626)',
          }}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Formulaire de création */}
      {showForm && (
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>Créer un ticket</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: C.navy }}>
                Sujet *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Décrivez brièvement votre problème"
                required
                minLength={5}
                maxLength={200}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  border: `1.5px solid ${C.border}`,
                  background: '#fff',
                  color: C.navy,
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: C.navy }}>
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                  style={{
                    border: `1.5px solid ${C.border}`,
                    background: '#fff',
                    color: C.navy,
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
                <label className="block text-sm font-semibold mb-1" style={{ color: C.navy }}>
                  Priorité
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                  style={{
                    border: `1.5px solid ${C.border}`,
                    background: '#fff',
                    color: C.navy,
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
              <label className="block text-sm font-semibold mb-1" style={{ color: C.navy }}>
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez votre problème en détail. Plus vous donnez de détails, plus nous pourrons vous aider rapidement."
                required
                minLength={20}
                maxLength={5000}
                rows={5}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  border: `1.5px solid ${C.border}`,
                  background: '#fff',
                  color: C.navy,
                }}
              />
              <p className="text-xs mt-1" style={{ color: C.muted }}>
                {formData.message.length}/5000 caractères
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: submitting ? C.muted : C.terra,
                  color: '#fff',
                  opacity: submitting ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.background = C.terraLight;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${C.terra}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = submitting ? C.muted : C.terra;
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
                  color: C.navy,
                  border: `1.5px solid ${C.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.terraSoft;
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
      <div className="flex gap-2 flex-wrap" style={{ borderBottom: `1.5px solid ${C.border}`, paddingBottom: '16px' }}>
        {[
          { key: 'all', label: 'Tous', count: tickets.length },
          { key: 'open', label: 'Ouverts', count: tickets.filter((t) => !['RESOLVED', 'CLOSED'].includes(t.status)).length },
          { key: 'closed', label: 'Résolus', count: tickets.filter((t) => ['RESOLVED', 'CLOSED'].includes(t.status)).length },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: filter === f.key ? C.terra : '#fff',
              color: filter === f.key ? '#fff' : C.navy,
              border: `1.5px solid ${filter === f.key ? C.terra : C.border}`,
            }}
            onMouseEnter={(e) => {
              if (filter !== f.key) {
                e.currentTarget.style.background = C.terraSoft;
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
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <div className="text-5xl mb-4">💬</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: C.navy }}>
            {filter === 'all' ? 'Aucun ticket' : filter === 'open' ? 'Aucun ticket ouvert' : 'Aucun ticket résolu'}
          </h2>
          <p className="text-sm mb-6" style={{ color: C.muted }}>
            {filter === 'all'
              ? 'Vous n\'avez pas encore créé de ticket'
              : 'Aucun ticket dans cette catégorie'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: C.terra, color: '#fff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.terraLight;
                e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.terra;
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
                border: `1.5px solid ${C.border}`,
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
                    <h3 className="font-semibold truncate" style={{ color: C.navy }}>
                      {ticket.subject}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: C.muted }}>
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
      <div className="rounded-2xl p-6" style={{ background: '#EFF6FF', border: `1.5px solid #DBEAFE` }}>
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
