'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  RotateCcw,
  User,
} from 'lucide-react';
import { ZodError } from 'zod';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
import { messageSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';

interface Message {
  id: string;
  author: 'pro' | 'support';
  authorName: string;
  content: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
  }>;
}

interface TicketDetail {
  id: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_REPLY' | 'RESOLVED' | 'CLOSED';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  messages: Message[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  OPEN: {
    label: 'Ouvert',
    color: 'var(--pro-ocean)',
    bgColor: '#E6F2FF',
  },
  IN_PROGRESS: {
    label: 'En cours',
    color: 'var(--pro-sun)',
    bgColor: '#FFF4E6',
  },
  WAITING_REPLY: {
    label: 'En attente',
    color: 'var(--pro-mint)',
    bgColor: '#E6F9F5',
  },
  RESOLVED: {
    label: 'Résolu',
    color: '#22c55e',
    bgColor: '#E6F9E6',
  },
  CLOSED: {
    label: 'Fermé',
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

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetchTicket(controller.signal);
    return () => controller.abort();
  }, [ticketId]);

  const fetchTicket = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      // Tentative de récupération API
      const response = await fetch(`/api/support/tickets/${ticketId}`, { credentials: 'include', signal });
      if (response.status === 404) { notFound(); return; }
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du ticket');
      }
      const data = await response.json();
      setTicket(data);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      logger.warn(`API support/tickets/${ticketId} indisponible — données démo`);
      // Données démo basées sur l'ID
      const demoTickets: Record<string, TicketDetail> = {
        ticket_001: {
          id: 'ticket_001',
          subject: 'Intégration calendrier partenaire - bug affichage dates',
          status: 'IN_PROGRESS',
          priority: 'P1',
          category: 'Technique',
          description: 'Le calendrier de disponibilité ne s\'affiche pas correctement pour les partenaires utilisant l\'intégration Google Calendar. Les dates passées ne sont pas filtrées et les heures affichées ne correspondent pas au fuseau horaire configuré.',
          createdAt: '2026-03-05T10:30:00Z',
          updatedAt: '2026-03-10T14:20:00Z',
          createdBy: 'Jean Dupont',
          messages: [
            {
              id: 'msg_001',
              author: 'pro',
              authorName: 'Jean Dupont',
              content: 'Bonjour, nous avons un problème avec l\'affichage du calendrier de disponibilité. Les dates passées ne sont pas filtrées correctement et les heures semblent décalées de quelques heures.',
              createdAt: '2026-03-05T10:30:00Z',
            },
            {
              id: 'msg_002',
              author: 'support',
              authorName: 'Support Eventy',
              content: 'Bonjour Jean, merci de nous avoir contactés. Nous avons bien reçu votre demande et avons commencé à investiguer. Pouvez-vous nous donner plus de détails sur votre configuration (fuseau horaire, navigateur utilisé) ?',
              createdAt: '2026-03-05T11:45:00Z',
            },
            {
              id: 'msg_003',
              author: 'pro',
              authorName: 'Jean Dupont',
              content: 'Nous sommes en fuseau horaire Paris (Europe/Paris). Le problème se produit sur Chrome et Firefox. Voir screenshot en annexe.',
              createdAt: '2026-03-06T09:20:00Z',
              attachments: [
                {
                  id: 'attach_001',
                  name: 'screenshot_calendrier.png',
                  size: 245000,
                },
              ],
            },
            {
              id: 'msg_004',
              author: 'support',
              authorName: 'Support Eventy',
              content: 'Merci pour les détails. Nous avons identifié le problème : un bug dans la conversion des fuseaux horaires lors de la récupération des événements Google Calendar. Nous sommes actuellement en train de déployer un correctif qui devrait être en production ce jeudi.',
              createdAt: '2026-03-10T14:20:00Z',
            },
          ],
        },
        ticket_002: {
          id: 'ticket_002',
          subject: 'Question facturation - Paiement refusé',
          status: 'WAITING_REPLY',
          priority: 'P2',
          category: 'Facturation',
          description: 'Nous avons une erreur lors du traitement du paiement. Le message d\'erreur est très vague. Pouvez-vous nous aider à identifier le problème avec notre carte bancaire ?',
          createdAt: '2026-03-08T09:15:00Z',
          updatedAt: '2026-03-09T16:45:00Z',
          createdBy: 'Marie Martin',
          messages: [
            {
              id: 'msg_005',
              author: 'pro',
              authorName: 'Marie Martin',
              content: 'Bonjour, nous essayons de effectuer un paiement mais celui-ci est refusé à chaque tentative. Le message indique juste "Paiement refusé".',
              createdAt: '2026-03-08T09:15:00Z',
            },
            {
              id: 'msg_006',
              author: 'support',
              authorName: 'Support Eventy',
              content: 'Bonjour Marie, nous avons besoin de quelques informations pour vous aider. Pouvez-vous nous confirmer : 1) Quel est le montant que vous essayez de payer ? 2) Avez-vous reçu un code d\'erreur spécifique de votre banque ? 3) Est-ce votre première tentative avec cette carte ?',
              createdAt: '2026-03-08T10:30:00Z',
            },
            {
              id: 'msg_007',
              author: 'pro',
              authorName: 'Marie Martin',
              content: 'Le montant est 2 500€. Non, c\'est la première tentative. Pas de code d\'erreur détaillé de ma banque, juste le refus dans Eventy.',
              createdAt: '2026-03-09T16:45:00Z',
            },
          ],
        },
        ticket_003: {
          id: 'ticket_003',
          subject: 'Demande d\'accès administrateur pour nouvelle agence',
          status: 'OPEN',
          priority: 'P2',
          category: 'Compte',
          description: 'Nous avons ouvert une nouvelle agence et nous aurions besoin de créer des comptes utilisateur avec des droits d\'administration pour gérer les groupes de cette agence indépendamment.',
          createdAt: '2026-03-11T08:00:00Z',
          updatedAt: '2026-03-11T08:00:00Z',
          createdBy: 'Pierre Bernard',
          messages: [
            {
              id: 'msg_008',
              author: 'pro',
              authorName: 'Pierre Bernard',
              content: 'Nous avons une nouvelle agence qui vient de se lancer. Nous aurions besoin de configurer les droits d\'accès pour que les gestionnaires locaux puissent gérer indépendamment leurs groupes sans voir les autres agences.',
              createdAt: '2026-03-11T08:00:00Z',
            },
          ],
        },
        ticket_004: {
          id: 'ticket_004',
          subject: 'Changement de formule tarifaire',
          status: 'RESOLVED',
          priority: 'P3',
          category: 'Commercial',
          description: 'Nous aimerions passer de la formule "Starter" à la formule "Pro" pour bénéficier de plus de fonctionnalités.',
          createdAt: '2026-02-28T11:20:00Z',
          updatedAt: '2026-03-02T10:15:00Z',
          createdBy: 'Sophie Leclerc',
          messages: [
            {
              id: 'msg_009',
              author: 'pro',
              authorName: 'Sophie Leclerc',
              content: 'Bonjour, je souhaiterais passer à la formule "Pro" pour utiliser les fonctionnalités avancées. Quel est le processus ?',
              createdAt: '2026-02-28T11:20:00Z',
            },
            {
              id: 'msg_010',
              author: 'support',
              authorName: 'Support Eventy',
              content: 'Bonjour Sophie, vous pouvez effectuer ce changement directement depuis votre espace "Paramètres" > "Forfait". Si vous avez besoin d\'une configuration personnalisée, nous pouvons discuter de cela. Le changement prend effet immédiatement.',
              createdAt: '2026-02-28T14:00:00Z',
            },
            {
              id: 'msg_011',
              author: 'pro',
              authorName: 'Sophie Leclerc',
              content: 'Parfait, merci ! C\'est déjà fait, tout fonctionne correctement.',
              createdAt: '2026-03-02T10:15:00Z',
            },
          ],
        },
        ticket_005: {
          id: 'ticket_005',
          subject: 'API OAuth - Synchronisation groupes bloquée',
          status: 'CLOSED',
          priority: 'P0',
          category: 'Intégration',
          description: 'Notre intégration OAuth ne fonctionne plus. Les groupes ne se synchronisent pas et nous recevons une erreur 401 à chaque tentative.',
          createdAt: '2026-02-15T14:30:00Z',
          updatedAt: '2026-02-20T12:00:00Z',
          createdBy: 'Alex Rousseau',
          messages: [
            {
              id: 'msg_012',
              author: 'pro',
              authorName: 'Alex Rousseau',
              content: 'URGENT : Notre intégration OAuth s\'est cassée d\'un coup. Les groupes ne se synchronisent plus et nous avons une erreur 401. Cela affecte tous nos clients !',
              createdAt: '2026-02-15T14:30:00Z',
            },
            {
              id: 'msg_013',
              author: 'support',
              authorName: 'Support Eventy',
              content: 'Alerte reçue. Nous escaladons immédiatement. Nous allons investiguer sur nos serveurs en priorité.',
              createdAt: '2026-02-15T14:45:00Z',
            },
            {
              id: 'msg_014',
              author: 'support',
              authorName: 'Support Eventy',
              content: 'Nous avons identifié le problème : notre certificat OAuth a expiré. Nous l\'avons renouvelé et déployé le correctif. La synchronisation devrait fonctionner à nouveau maintenant.',
              createdAt: '2026-02-16T09:30:00Z',
            },
            {
              id: 'msg_015',
              author: 'pro',
              authorName: 'Alex Rousseau',
              content: 'Confirmé ! Tout fonctionne à nouveau. Merci beaucoup pour la rapidité !',
              createdAt: '2026-02-20T12:00:00Z',
            },
          ],
        },
      };

      const demoTicket = demoTickets[ticketId] || demoTickets.ticket_001;
      setTicket(demoTicket);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    try {
      messageSchema.parse({ content: replyText });
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    try {
      setSubmittingReply(true);
      // Tentative d'envoi API
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: replyText }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la réponse');
      }

      // Recharger le ticket
      await fetchTicket();
      setReplyText('');
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Erreur inconnue');
      setError(message);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', paddingTop: '48px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pro-ocean)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <div className="pro-panel" style={{ marginBottom: '24px', paddingBottom: '24px' }}>
            <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="pro-panel" style={{ padding: '16px' }}>
                <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', paddingTop: '48px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pro-ocean)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="pro-panel" style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
            <AlertCircle className="w-12 h-12" style={{ color: '#64748B', margin: '0 auto 16px' }} />
            <p style={{ color: '#0A1628', fontSize: '16px', fontWeight: 500 }}>
              Ticket non trouvé
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[ticket.status];

  return (
    <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        {/* Bouton retour */}
        <button
          type="button"
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pro-ocean)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux tickets
        </button>

        {/* En-tête du ticket */}
        <div className="pro-panel" style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 className="pro-page-title" style={{ marginBottom: '16px' }}>
              {ticket.subject}
            </h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              Ticket #{ticket.id} · Créé le {formatDate(ticket.createdAt)} par {ticket.createdBy}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', borderTop: '1px solid #E6EAEF', paddingTop: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>État</p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: statusConfig.bgColor,
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: statusConfig.color }}>
                  {statusConfig.label}
                </span>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>Priorité</p>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: PRIORITY_CONFIG[ticket.priority].color,
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {PRIORITY_CONFIG[ticket.priority].label}
              </div>
            </div>

            <div>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>Catégorie</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628' }}>
                {ticket.category}
              </p>
            </div>

            <div>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>Dernière mise à jour</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628' }}>
                {formatDate(ticket.updatedAt)}
              </p>
            </div>
          </div>

          {ticket.description && (
            <div style={{ borderTop: '1px solid #E6EAEF', paddingTop: '20px', marginTop: '20px' }}>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px', fontWeight: 600 }}>
                Description
              </p>
              <p style={{ fontSize: '14px', color: '#0A1628', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {ticket.description}
              </p>
            </div>
          )}
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
                  fetchTicket();
                }}
                className="pro-btn-outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {ticket.messages.length === 0 ? (
            <div className="pro-panel" style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <MessageSquare className="w-8 h-8" style={{ color: '#64748B', margin: '0 auto 12px' }} />
              <p style={{ color: '#0A1628' }}>
                Aucun message pour le moment
              </p>
            </div>
          ) : (
            ticket.messages.map((message) => {
              const isSupport = message.author === 'support';
              return (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: isSupport ? 'flex-start' : 'flex-end',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    className="pro-panel"
                    style={{
                      maxWidth: '85%',
                      backgroundColor: isSupport ? '#FFFFFF' : 'var(--pro-ocean)',
                      borderColor: isSupport ? '#E6EAEF' : 'var(--pro-ocean)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: isSupport ? '#E6F2FF' : 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User className="w-4 h-4" style={{ color: isSupport ? 'var(--pro-ocean)' : '#FFFFFF' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: isSupport ? '#0A1628' : '#FFFFFF',
                            margin: 0,
                          }}
                        >
                          {message.authorName}
                        </p>
                        <p
                          style={{
                            fontSize: '12px',
                            color: isSupport ? '#64748B' : 'rgba(255,255,255,0.7)',
                            margin: '2px 0 0 0',
                          }}
                        >
                          {new Date(message.createdAt).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '14px',
                        color: isSupport ? '#0A1628' : '#FFFFFF',
                        margin: '12px 0 0 0',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                      }}
                    >
                      {message.content}
                    </p>

                    {message.attachments && message.attachments.length > 0 && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${isSupport ? '#E6EAEF' : 'rgba(255,255,255,0.2)'}` }}>
                        {message.attachments.map((att) => (
                          <div
                            key={att.id}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: isSupport ? '#F5F5F5' : 'rgba(255,255,255,0.1)',
                              fontSize: '12px',
                              color: isSupport ? '#0A1628' : '#FFFFFF',
                              marginTop: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>📎 {att.name}</span>
                            <span style={{ fontSize: '11px', opacity: 0.7 }}>
                              {(att.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Formulaire de réponse */}
        {ticket.status !== 'CLOSED' && (
          <div className="pro-panel">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628', marginBottom: '16px' }}>
              Ajouter une réponse
            </h3>

            <form aria-label="Répondre au ticket" onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} noValidate>
              <textarea
                placeholder="Écrivez votre message ici..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="pro-input"
                aria-label="Réponse au ticket"
                aria-invalid={!!errors.content}
                aria-describedby={errors.content ? 'reply-content-error' : undefined}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  ...(errors.content ? { borderColor: '#DC2626' } : {}),
                }}
              />
              <FormFieldError error={errors.content} id="reply-content-error" />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={!replyText.trim() || submittingReply}
                  className="pro-btn-sun"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send className="w-4 h-4" />
                  {submittingReply ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {ticket.status === 'CLOSED' && (
          <div className="pro-panel" style={{ textAlign: 'center', backgroundColor: '#E6F9E6', borderColor: '#22c55e' }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: '#22c55e', margin: '0 auto 12px' }} />
            <p style={{ color: '#166534', fontSize: '14px', fontWeight: 500 }}>
              Ce ticket est fermé. Vous ne pouvez plus ajouter de réponses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
