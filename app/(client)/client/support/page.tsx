/**
 * Page Support Client — Création et suivi de tickets
 * Endpoints : GET /api/support/tickets, POST /api/support/tickets
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/utils';

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

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING_CLIENT: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
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
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // État erreur
  if (state === 'error') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          {error}
          <Button variant="outline" className="ml-4" onClick={fetchTickets}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
          <p className="text-gray-600">
            Besoin d'aide ? Créez un ticket et notre équipe vous répondra rapidement.
          </p>
        </div>
        {!showForm && (
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            Nouveau ticket
          </Button>
        )}
      </div>

      {/* Message de succès/erreur */}
      {submitMessage && (
        <div
          className={`p-4 rounded-lg text-sm ${
            submitMessage.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Formulaire de création */}
      {showForm && (
        <Card elevated>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Créer un ticket</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet *
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Décrivez brièvement votre problème"
                  required
                  minLength={5}
                  maxLength={200}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/5000 caractères
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Envoi en cours...' : 'Créer le ticket'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {[
          { key: 'all', label: 'Tous', count: tickets.length },
          { key: 'open', label: 'Ouverts', count: tickets.filter((t) => !['RESOLVED', 'CLOSED'].includes(t.status)).length },
          { key: 'closed', label: 'Résolus', count: tickets.filter((t) => ['RESOLVED', 'CLOSED'].includes(t.status)).length },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Liste des tickets */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filter === 'all' ? 'Aucun ticket' : filter === 'open' ? 'Aucun ticket ouvert' : 'Aucun ticket résolu'}
          </h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Vous n\'avez pas encore créé de ticket'
              : 'Aucun ticket dans cette catégorie'}
          </p>
          {filter === 'all' && (
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Créer votre premier ticket
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} elevated>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {ticket.subject}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
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
                    {ticket.priority === 'URGENT' && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        Urgent
                      </Badge>
                    )}
                    {ticket.priority === 'HIGH' && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                        Haute
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={statusColors[ticket.status] || 'bg-gray-100 text-gray-800'}
                    >
                      {statusLabels[ticket.status] || ticket.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info d'aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Besoin d'aide urgente ?</h3>
        <p className="text-sm text-blue-800">
          Pour les urgences liées à un voyage en cours, contactez-nous directement au{' '}
          <strong>01 23 45 67 89</strong> (disponible 7j/7 pendant les voyages).
          Notre équipe support répond habituellement aux tickets sous 24h ouvrées.
        </p>
      </div>
    </div>
  );
}
