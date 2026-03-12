'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Paperclip, AlertCircle, RefreshCw, Loader } from 'lucide-react';
import { ZodError } from 'zod';
import { logger } from '@/lib/logger';
import { messageSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';

const OCEAN = 'var(--pro-ocean)';
const SUN = 'var(--pro-sun)';
const SAND = '#FEFCF3';
const DARK = '#0A1628';
const MUTED = '#64748B';
const CORAL = 'var(--pro-coral)';
const MINT = 'var(--pro-mint)';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'self' | 'other';
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    url: string;
  };
}

interface Conversation {
  id: string;
  participantName: string;
  participantType: 'eventy' | 'partner';
  messages: Message[];
}

export default function MessagerieDetail() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const demoConversations: Record<string, Conversation> = {
    '1': {
      id: '1',
      participantName: 'Support Eventy',
      participantType: 'eventy',
      messages: [
        {
          id: 'msg1',
          senderId: 'support@eventy.com',
          senderName: 'Support Eventy',
          senderType: 'other',
          content: 'Bienvenue dans votre espace professionnel ! 👋 Nous sommes heureux de vous compter parmi nos partenaires. Si vous avez des questions, n\'hésitez pas à nous contacter.',
          timestamp: '2026-03-09T09:00:00Z',
        },
        {
          id: 'msg2',
          senderId: 'user123',
          senderName: 'Vous',
          senderType: 'self',
          content: 'Merci ! Comment créer ma première annonce de voyage ?',
          timestamp: '2026-03-09T10:15:00Z',
        },
        {
          id: 'msg3',
          senderId: 'support@eventy.com',
          senderName: 'Support Eventy',
          senderType: 'other',
          content: 'Excellente question ! Vous pouvez accéder au formulaire de création via le menu principal. Voici les étapes : 1) Cliquez sur "Créer un voyage", 2) Remplissez les informations de base, 3) Ajoutez photos et descriptions, 4) Définissez tarifs et disponibilités.',
          timestamp: '2026-03-09T11:30:00Z',
        },
        {
          id: 'msg4',
          senderId: 'user123',
          senderName: 'Vous',
          senderType: 'self',
          content: 'D\'accord, je vais commencer ! Un dernier point : quelle commission Eventy prélève-t-elle ?',
          timestamp: '2026-03-09T14:00:00Z',
        },
        {
          id: 'msg5',
          senderId: 'support@eventy.com',
          senderName: 'Support Eventy',
          senderType: 'other',
          content: 'Nous prélevons une commission de 12 % sur chaque réservation, directement au moment du paiement. Cela inclut les frais de transaction. Vous pouvez consulter le détail dans votre tableau de bord financier.',
          timestamp: '2026-03-10T09:45:00Z',
        },
        {
          id: 'msg6',
          senderId: 'user123',
          senderName: 'Vous',
          senderType: 'self',
          content: 'Merci pour ces infos ! Je vais me lancer rapidement. À bientôt !',
          timestamp: '2026-03-10T10:20:00Z',
        },
        {
          id: 'msg7',
          senderId: 'support@eventy.com',
          senderName: 'Support Eventy',
          senderType: 'other',
          content: 'Votre compte a été approuvé ! Vous pouvez maintenant créer vos premiers voyages.',
          timestamp: '2026-03-11T10:30:00Z',
        },
      ],
    },
    '2': {
      id: '2',
      participantName: 'Marie Dupont - Hôtels Premium',
      participantType: 'partner',
      messages: [
        {
          id: 'msg1',
          senderId: 'marie@hotelspremium.com',
          senderName: 'Marie Dupont',
          senderType: 'other',
          content: 'Bonjour ! Je suis intéressée par un partenariat avec Eventy pour nos hôtels 4 et 5 étoiles.',
          timestamp: '2026-03-08T14:00:00Z',
        },
        {
          id: 'msg2',
          senderId: 'user123',
          senderName: 'Vous',
          senderType: 'self',
          content: 'Parfait ! Nous travaillons avec plusieurs chaînes hôtelières. Quels sont vos établissements ?',
          timestamp: '2026-03-08T15:30:00Z',
        },
        {
          id: 'msg3',
          senderId: 'marie@hotelspremium.com',
          senderName: 'Marie Dupont',
          senderType: 'other',
          content: 'Nous avons des hôtels à Marrakech, Fès, Essaouira et Agadir. Nous offrons des tarifs de groupe intéressants pour les voyagistes.',
          timestamp: '2026-03-08T16:45:00Z',
        },
        {
          id: 'msg4',
          senderId: 'user123',
          senderName: 'Vous',
          senderType: 'self',
          content: 'Très bien ! Pouvez-vous me partager un tarif pour un séjour de 4 nuits pour 20 personnes à Marrakech ?',
          timestamp: '2026-03-09T09:00:00Z',
        },
        {
          id: 'msg5',
          senderId: 'marie@hotelspremium.com',
          senderName: 'Marie Dupont',
          senderType: 'other',
          content: 'Concernant les tarifs pour le mois d\'avril, j\'ai des réductions intéressantes...',
          timestamp: '2026-03-11T08:15:00Z',
        },
      ],
    },
  };

  const fetchConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/pro/messagerie/${conversationId}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Conversation non trouvée');
      }
      const data = (await res.json()) as Conversation;
      setConversation(data);
      setMessages(data.messages);
    } catch (err: unknown) {
      logger.warn('API indisponible, utilisation des données de démonstration');
      const demoConv = demoConversations[conversationId];
      if (!demoConv) {
        setError('Conversation non trouvée');
        return;
      }
      setConversation(demoConv);
      setMessages(demoConv.messages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setError(null);
    setErrors({});

    try {
      messageSchema.parse({ content: newMessage });
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    try {
      setSending(true);
      const res = await fetch(`/api/pro/messagerie/${conversationId}/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const newMsg = (await res.json()) as Message;
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    } catch (err: unknown) {
      logger.warn('API indisponible, ajout du message en local');
      const optimisticMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'user123',
        senderName: 'Vous',
        senderType: 'self',
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    return date.toLocaleDateString('fr-FR', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const shouldShowDateSeparator = (currentMsg: Message, prevMsg: Message | undefined) => {
    if (!prevMsg) return true;
    return formatDate(currentMsg.timestamp) !== formatDate(prevMsg.timestamp);
  };

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: SAND, padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header Loading */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="pro-btn-outline"
              style={{ padding: '8px' }}
              aria-label="Retour"
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </button>
            <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>

          {/* Messages Area Loading */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                <div style={{ borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: SAND, padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="pro-btn-outline"
            style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
            Retour
          </button>

          <div className="pro-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <AlertCircle style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: CORAL }} />
            <h2 className="pro-section-title" style={{ marginBottom: '8px' }}>
              {error || 'Conversation non trouvée'}
            </h2>
            <p style={{ color: MUTED, marginBottom: '24px', fontSize: '14px' }}>
              Veuillez vérifier votre connexion et réessayer.
            </p>
            <button
              type="button"
              onClick={() => router.back()}
              className="pro-btn-ocean"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Retour à la messagerie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: SAND, padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: `1px solid #E5E7EB` }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="pro-btn-outline"
            style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Retour"
          >
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 className="pro-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)', margin: 0, fontSize: '24px' }}>
              {conversation.participantName}
            </h1>
            {conversation.participantType === 'eventy' && (
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: MUTED }}>Support Eventy</p>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
            paddingRight: '8px',
          }}
        >
          {messages.map((msg, index) => {
            const prevMsg = index > 0 ? messages[index - 1] : undefined;
            const showDateSeparator = shouldShowDateSeparator(msg, prevMsg);

            return (
              <div key={msg.id}>
                {showDateSeparator && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0 16px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                    <span style={{ fontSize: '12px', color: MUTED, whiteSpace: 'nowrap' }}>
                      {formatDate(msg.timestamp)}
                    </span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: msg.senderType === 'self' ? 'flex-end' : 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      backgroundColor: msg.senderType === 'self' ? OCEAN : 'white',
                      color: msg.senderType === 'self' ? 'white' : DARK,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      border: msg.senderType === 'self' ? 'none' : `1px solid #E5E7EB`,
                    }}
                  >
                    {msg.content}
                    {msg.attachment && (
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: msg.senderType === 'self' ? '1px solid rgba(255, 255, 255, 0.3)' : `1px solid #E5E7EB` }}>
                        <a
                          href={msg.attachment.url}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            color: msg.senderType === 'self' ? '#ffffff' : OCEAN,
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          <Paperclip style={{ width: '14px', height: '14px' }} />
                          {msg.attachment.name}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: msg.senderType === 'self' ? 'flex-end' : 'flex-start',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                  }}
                >
                  <span style={{ fontSize: '12px', color: MUTED }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="pro-panel" style={{ padding: '16px' }}>
          <form aria-label="Envoyer un message" onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <button
              type="button"
              className="pro-btn-outline"
              style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title="Ajouter une pièce jointe"
              aria-label="Ajouter une pièce jointe"
            >
              <Paperclip style={{ width: '20px', height: '20px' }} />
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '8px', padding: '8px 12px', border: `1px solid ${errors.content ? '#DC2626' : '#E5E7EB'}` }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Votre message..."
                  aria-invalid={!!errors.content}
                  aria-describedby={errors.content ? 'message-content-error' : undefined}
                  style={{
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    fontSize: '14px',
                    color: DARK,
                  }}
                  disabled={sending}
                />
              </div>
              <FormFieldError error={errors.content} id="message-content-error" />
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="pro-btn-ocean"
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: !newMessage.trim() || sending ? 0.5 : 1,
                cursor: !newMessage.trim() || sending ? 'not-allowed' : 'pointer',
                flexShrink: 0,
              }}
            >
              {sending ? (
                <Loader style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Send style={{ width: '18px', height: '18px' }} />
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
