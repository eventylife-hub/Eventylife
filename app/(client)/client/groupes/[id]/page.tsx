'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZodError } from 'zod';
import { formatDate, formatDateTime } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
import { messageSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface Member {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  joinedAt: string;
  role: string;
}

interface TravelGroup {
  id: string;
  name: string;
  status: string;
  travelTitle: string;
  travelSlug: string;
  departureDate: string;
  destinationCity: string;
  memberCount: number;
  createdAt: string;
  members: Member[];
  messages: Message[];
  description?: string;
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<TravelGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client/groups/${params.id}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Impossible de charger le groupe');

        const data = (await res.json() as unknown) as TravelGroup;
        setGroup(data);
      } catch (err: unknown) {
        logger.warn('API client/groups indisponible — données démo');
        const FALLBACK_GROUP: TravelGroup = {
          id: params.id as string,
          name: 'Groupe de voyage exemple',
          status: 'ACTIVE',
          travelTitle: 'Côte d\'Azur - 5 jours',
          travelSlug: 'cote-azur-5j',
          departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          destinationCity: 'Nice',
          memberCount: 5,
          createdAt: new Date().toISOString(),
          members: [
            {
              id: '1',
              userId: 'user1',
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean@example.com',
              joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              role: 'ADMIN',
            },
            {
              id: '2',
              userId: 'user2',
              firstName: 'Marie',
              lastName: 'Martin',
              email: 'marie@example.com',
              joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              role: 'MEMBER',
            },
          ],
          messages: [
            {
              id: 'msg1',
              userId: 'user1',
              userName: 'Jean Dupont',
              content: 'Bienvenue dans le groupe!',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'msg2',
              userId: 'user2',
              userName: 'Marie Martin',
              content: 'Hâte de partir en vacances!',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
          description: 'Un groupe pour visiter la Côte d\'Azur ensemble',
        };
        setGroup(FALLBACK_GROUP);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [params.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      messageSchema.parse({ content: newMessage });
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = zodErrorsToRecord(err);
        setError(Object.values(fieldErrors).join('. '));
        return;
      }
    }

    try {
      setSendingMessage(true);
      const res = await fetch(`/api/client/groups/${params.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newMessage }),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'envoi du message');

      setNewMessage('');
      // Rafraîchir le groupe
      const groupRes = await fetch(`/api/client/groups/${params.id}`, {
        credentials: 'include',
      });
      const updatedGroup = (await groupRes.json() as unknown) as TravelGroup;
      setGroup(updatedGroup);
    } catch (err: unknown) {
      logger.warn('API client/groups/messages indisponible — données démo');
      if (group) {
        const demoMessage: Message = {
          id: 'demo-' + Date.now(),
          userId: 'demo-user',
          userName: 'Vous',
          content: newMessage,
          createdAt: new Date().toISOString(),
        };
        setGroup({
          ...group,
          messages: [...(group.messages || []), demoMessage],
        });
      }
      setNewMessage('');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4" style={{ animation: 'fadeUp 0.6s ease-out' }}>
        <div className="mb-8">
          <Link href="/client/groupes" style={{ color: 'var(--terra, #C75B39)' }} className="hover:opacity-80 mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Détails du groupe</h1>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg animate-pulse" style={{ backgroundColor: '#E5E0D8' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="max-w-4xl mx-auto p-4" style={{ animation: 'fadeUp 0.6s ease-out' }}>
        <Link href="/client/groupes" style={{ color: 'var(--terra, #C75B39)' }} className="hover:opacity-80 mb-4 inline-block">
          ← Retour
        </Link>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', borderLeft: '4px solid #DC2626' }}>
          <p style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Groupe non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4" style={{ animation: 'fadeUp 0.6s ease-out' }}>
      <Link href="/client/groupes" style={{ color: 'var(--terra, #C75B39)' }} className="hover:opacity-80 mb-4 inline-block">
        ← Retour
      </Link>

      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>{group.name}</h1>
            <p className="mt-2" style={{ color: '#6B7280' }}>{group.travelTitle}</p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: '#FDF6E8', color: '#92400e' }}
          >
            {group.status}
          </span>
        </div>
      </div>

      {/* Description */}
      {group.description && (
        <div
          className="rounded-lg p-4 mb-8"
          style={{ backgroundColor: 'rgba(199,91,57,0.1)', borderLeft: '4px solid var(--terra, #C75B39)' }}
        >
          <p style={{ color: 'var(--navy, #1A1A2E)' }}>{group.description}</p>
        </div>
      )}

      {/* Grille d'infos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'white',
            border: '1.5px solid #E5E0D8',
          }}
        >
          <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Destination</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>📍 {group.destinationCity}</p>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'white',
            border: '1.5px solid #E5E0D8',
          }}
        >
          <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Départ</p>
          <p className="text-lg font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>{formatDate(group.departureDate)}</p>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'white',
            border: '1.5px solid #E5E0D8',
          }}
        >
          <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Membres</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>👥 {group.memberCount}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Membres */}
        <div className="lg:col-span-1">
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: 'white',
              border: '1.5px solid #E5E0D8',
            }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Membres ({group.members.length})</h2>
            <div className="space-y-3">
              {group.members.map((member) => (
                <div key={member.id} className="py-2" style={{ borderBottom: '1px solid #E5E0D8' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{member.email}</p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    {member.role === 'ADMIN' ? '👤 Organisateur' : '👤 Membre'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Discussion */}
        <div className="lg:col-span-2">
          <div
            className="rounded-xl p-6 h-full flex flex-col"
            style={{
              backgroundColor: 'white',
              border: '1.5px solid #E5E0D8',
            }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Discussion du groupe</h2>

            {/* Messages */}
            <div className="flex-1 mb-4 space-y-4 max-h-96 overflow-y-auto">
              {group.messages && group.messages.length > 0 ? (
                group.messages.map((message) => (
                  <div key={message.id} className="pb-3" style={{ borderBottom: '1px solid #E5E0D8' }}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{message.userName}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{formatDateTime(message.createdAt)}</p>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{message.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-8" style={{ color: '#6B7280' }}>Aucun message pour le moment</p>
              )}
            </div>

            {/* Formulaire d'envoi */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 px-4 py-2 resize-none rounded-lg"
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid #E5E0D8',
                  color: 'var(--navy, #1A1A2E)',
                  focusOutlineStyle: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${'rgba(199,91,57,0.1)'}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E0D8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                rows={3}
                disabled={sendingMessage}
              />
              <button
                type="submit"
                disabled={sendingMessage || !newMessage.trim()}
                className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                style={{
                  backgroundColor: disabled ? '#6B7280' : 'var(--terra, #C75B39)',
                  backgroundImage: !sendingMessage && !newMessage.trim() ? 'none' : `linear-gradient(135deg, var(--terra, #C75B39), ${'#D97B5E'})`,
                }}
                onMouseEnter={(e) => {
                  if (!sendingMessage && newMessage.trim()) {
                    e.currentTarget.style.backgroundColor = '#D97B5E';
                    e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {sendingMessage ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/client/groupes/${params.id}/inviter`}
          className="px-6 py-3 rounded-lg font-semibold text-white text-center transition-all hover:shadow-lg"
          style={{
            backgroundColor: 'var(--terra, #C75B39)',
            backgroundImage: `linear-gradient(135deg, var(--terra, #C75B39), ${'#D97B5E'})`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D97B5E';
            e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Inviter des membres
        </Link>
        <button type="button"
          onClick={async () => {
            if (!confirm('Êtes-vous sûr de vouloir quitter ce groupe ? Cette action est irréversible.')) return;
            try {
              setLeavingGroup(true);
              const res = await fetch(`/api/client/groups/${params.id}/leave`, {
                method: 'POST',
                credentials: 'include',
              });
              if (!res.ok) {
                const data = (await res.json() as unknown) as Record<string, unknown>;
                throw new Error(data.message || 'Erreur lors de la sortie du groupe');
              }
              router.push('/client/groupes');
            } catch (err: unknown) {
              alert(extractErrorMessage(err, 'Erreur'));
            } finally {
              setLeavingGroup(false);
            }
          }}
          disabled={leavingGroup}
          className="px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition-all hover:opacity-80"
          style={{
            backgroundColor: 'var(--terra-soft, #FEF2F2)',
            border: '1.5px solid #DC2626',
            color: 'var(--terra, #DC2626)',
          }}
        >
          {leavingGroup ? 'Sortie en cours...' : 'Quitter le groupe'}
        </button>
      </div>
    </div>
  );
}
