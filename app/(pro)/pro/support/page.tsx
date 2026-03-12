'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { supportTicketSchema, zodErrorsToRecord } from '@/lib/validations';
import { FocusTrap } from '@/components/a11y/focus-trap';
import { extractErrorMessage } from '@/lib/api-error';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_REPLY' | 'RESOLVED' | 'CLOSED';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  category: string;
  createdAt: string;
  updatedAt: string;
  unreadMessages?: number;
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; bgColor: string }> = {
  OPEN: {
    label: 'Ouvert',
    icon: AlertCircle,
    color: 'var(--pro-ocean)',
    bgColor: '#E6F2FF',
  },
  IN_PROGRESS: {
    label: 'En cours',
    icon: Clock,
    color: 'var(--pro-sun)',
    bgColor: '#FFF4E6',
  },
  WAITING_REPLY: {
    label: 'En attente',
    icon: MessageSquare,
    color: 'var(--pro-mint)',
    bgColor: '#E6F9F5',
  },
  RESOLVED: {
    label: 'Résolu',
    icon: CheckCircle2,
    color: '#22c55e',
    bgColor: '#E6F9E6',
  },
  CLOSED: {
    label: 'Fermé',
    icon: CheckCircle2,
    color: '#64748B',
    bgColor: '#F0F4F9',
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  P0: { label: 'Critique', color: '#dc2626' },
  P1: { label: 'Haute', color: 'var(--pro-coral)' },
  P2: { label: 'Normale', color: 'var(--pro-sun)' },
  P3: { label: 'Basse', color: '#64748B' },
};

export default function ProSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    category: '',
    description: '',
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      // Tentative de récupération API
      const response = await fetch('/api/support/tickets', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch {
      logger.warn('API support/tickets indisponible — données démo');
      setTickets([
        {
          id: 'ticket_001',
          subject: 'Intégration calendrier partenaire - bug affichage dates',
          status: 'IN_PROGRESS',
          priority: 'P1',
          category: 'Technique',
          createdAt: '2026-03-05T10:30:00Z',
          updatedAt: '2026-03-10T14:20:00Z',
          unreadMessages: 0,
        },
        {
          id: 'ticket_002',
          subject: 'Question facturation - Paiement refusé',
          status: 'WAITING_REPLY',
          priority: 'P2',
          category: 'Facturation',
          createdAt: '2026-03-08T09:15:00Z',
          updatedAt: '2026-03-09T16:45:00Z',
          unreadMessages: 1,
        },
        {
          id: 'ticket_003',
          subject: 'Demande d\'accès administrateur pour nouvelle agence',
          status: 'OPEN',
          priority: 'P2',
          category: 'Compte',
          createdAt: '2026-03-11T08:00:00Z',
          updatedAt: '2026-03-11T08:00:00Z',
          unreadMessages: 0,
        },
        {
          id: 'ticket_004',
          subject: 'Changement de formule tarifaire',
          status: 'RESOLVED',
          priority: 'P3',
          category: 'Commercial',
          createdAt: '2026-02-28T11:20:00Z',
          updatedAt: '2026-03-02T10:15:00Z',
          unreadMessages: 0,
        },
        {
          id: 'ticket_005',
          subject: 'API OAuth - Synchronisation groupes bloquée',
          status: 'CLOSED',
          priority: 'P0',
          category: 'Intégration',
          createdAt: '2026-02-15T14:30:00Z',
          updatedAt: '2026-02-20T12:00:00Z',
          unreadMessages: 0,
        },
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = activeFilter === 'ALL'
    ? tickets
    : tickets.filter((t) => t.status === activeFilter);

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.OPEN;
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = supportTicketSchema.safeParse({
      ...newTicketData,
      message: newTicketData.description || '',
      priority: 'MEDIUM',
    });
    if (!validation.success) {
      const fieldErrors = zodErrorsToRecord(validation.error);
      setError(Object.values(fieldErrors)[0] || 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setSubmittingTicket(true);
      // Tentative de création API
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newTicketData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du ticket');
      }

      // Recharger les tickets
      await fetchTickets();
      setShowNewTicketModal(false);
      setNewTicketData({ subject: '', category: '', description: '' });
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Erreur inconnue');
      setError(message);
    } finally {
      setSubmittingTicket(false);
    }
  };

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_REPLY', 'RESOLVED', 'CLOSED'];

  const statusLabels: Record<string, string> = {
    ALL: 'Tous les tickets',
    OPEN: 'Ouverts',
    IN_PROGRESS: 'En cours',
    WAITING_REPLY: 'En attente',
    RESOLVED: 'Résolu',
    CLOSED: 'Fermé',
  };

  const categories = [
    { id: 'Technique', label: 'Technique' },
    { id: 'Facturation', label: 'Facturation' },
    { id: 'Compte', label: 'Compte' },
    { id: 'Commercial', label: 'Commercial' },
    { id: 'Intégration', label: 'Intégration' },
    { id: 'Autre', label: 'Autre' },
  ];

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        {/* En-tête */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="pro-page-title" style={{ marginBottom: '8px' }}>
              Support
            </h1>
            <p style={{ color: '#64748B' }}>
              Gérez vos demandes de support et trouvez des solutions
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewTicketModal(true)}
            className="pro-btn-sun"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
          >
            <Plus className="h-5 w-5" />
            Nouveau ticket
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ border: '1px solid #FFE0E3', backgroundColor: '#FFE0E3', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>
                {error}
              </p>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  fetchTickets();
                }}
                className="pro-btn-outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div style={{ marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', minWidth: 'min-content' }}>
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '24px',
                  border: 'none',
                  backgroundColor: activeFilter === status ? 'var(--pro-ocean)' : '#E6F2FF',
                  color: activeFilter === status ? '#FEFCF3' : 'var(--pro-ocean)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {statusLabels[status] || status}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="pro-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
                <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="pro-panel" style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
            <HelpCircle className="w-12 h-12" style={{ color: '#64748B', margin: '0 auto 16px' }} />
            <p style={{ color: '#0A1628', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
              Aucun ticket trouvé
            </p>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>
              Vous n'avez pas de demande de support dans cette catégorie
            </p>
            <button
              type="button"
              onClick={() => setShowNewTicketModal(true)}
              className="pro-btn-sun"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus className="h-4 w-4" />
              Créer un ticket
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);
              const StatusIcon = statusConfig.icon;
              return (
                <Link
                  key={ticket.id}
                  href={`/pro/support/${ticket.id}`}
                  className="pro-panel"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5F5';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.subject}
                      </h3>
                      {ticket.unreadMessages && ticket.unreadMessages > 0 && (
                        <span className="pro-badge-sun" style={{ fontSize: '12px', fontWeight: 500, minWidth: '20px', textAlign: 'center' }}>
                          {ticket.unreadMessages}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#64748B' }}>
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>Créé le {formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: PRIORITY_CONFIG[ticket.priority].color,
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}
                      >
                        {PRIORITY_CONFIG[ticket.priority].label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '12px' }}>
                      <StatusIcon className="w-4 h-4" style={{ color: statusConfig.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', fontWeight: 500, color: statusConfig.color }}>
                        {statusConfig.label}
                      </span>
                    </div>

                    <ChevronRight className="w-5 h-5" style={{ color: '#64748B', flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal nouveau ticket */}
      {showNewTicketModal && (
        <FocusTrap
          onEscape={() => setShowNewTicketModal(false)}
          role="dialog"
          aria-modal={true}
          aria-labelledby="new-ticket-title"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}
        >
          <div className="pro-panel" style={{ maxWidth: '512px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 id="new-ticket-title" className="pro-section-title" style={{ marginBottom: '24px' }}>
              Créer un nouveau ticket
            </h2>

            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Sujet
                </label>
                <input
                  type="text"
                  placeholder="Décrivez brièvement votre problème"
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  className="pro-input"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Catégorie
                </label>
                <select
                  value={newTicketData.category}
                  onChange={(e) => setNewTicketData({ ...newTicketData, category: e.target.value })}
                  className="pro-input"
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea
                  placeholder="Décrivez votre problème en détail..."
                  value={newTicketData.description}
                  onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                  className="pro-input"
                  style={{ width: '100%', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewTicketModal(false);
                    setNewTicketData({ subject: '', category: '', description: '' });
                    setError(null);
                  }}
                  disabled={submittingTicket}
                  className="pro-btn-outline"
                  style={{ flex: 1 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="pro-btn-sun"
                  style={{ flex: 1 }}
                >
                  {submittingTicket ? 'Création...' : 'Créer le ticket'}
                </button>
              </div>
            </form>
          </div>
        </FocusTrap>
      )}
    </div>
  );
}
