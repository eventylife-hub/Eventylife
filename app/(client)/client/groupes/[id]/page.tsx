'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatDateTime } from '@/lib/utils';

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

        const data = await res.json();
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [params.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

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
      const updatedGroup = await groupRes.json();
      setGroup(updatedGroup);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSendingMessage(false);
    }
  };

  // formatDate et formatDateTime locales supprimées — utilise @/lib/utils

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/client/groupes" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Détails du groupe</h1>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href="/client/groupes" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Retour
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          {error || 'Groupe non trouvé'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/client/groupes" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Retour
      </Link>

      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{group.name}</h1>
            <p className="text-slate-600 mt-2">{group.travelTitle}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {group.status}
          </span>
        </div>
      </div>

      {/* Description */}
      {group.description && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-slate-700">
          {group.description}
        </div>
      )}

      {/* Grille d'infos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600 mb-2">Destination</p>
          <p className="text-2xl font-bold text-slate-900">📍 {group.destinationCity}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600 mb-2">Départ</p>
          <p className="text-lg font-bold text-slate-900">{formatDate(group.departureDate)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-600 mb-2">Membres</p>
          <p className="text-2xl font-bold text-slate-900">👥 {group.memberCount}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Membres */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Membres ({group.members.length})</h2>
            <div className="space-y-3">
              {group.members.map((member) => (
                <div key={member.id} className="py-2 border-b border-slate-100 last:border-0">
                  <p className="font-semibold text-slate-900 text-sm">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-slate-600">{member.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {member.role === 'ADMIN' ? '👤 Organisateur' : '👤 Membre'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Discussion */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Discussion du groupe</h2>

            {/* Messages */}
            <div className="flex-1 mb-4 space-y-4 max-h-96 overflow-y-auto">
              {group.messages && group.messages.length > 0 ? (
                group.messages.map((message) => (
                  <div key={message.id} className="border-b border-slate-100 pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-slate-900 text-sm">{message.userName}</p>
                      <p className="text-xs text-slate-500">{formatDateTime(message.createdAt)}</p>
                    </div>
                    <p className="text-slate-700 text-sm">{message.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">Aucun message pour le moment</p>
              )}
            </div>

            {/* Formulaire d'envoi */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={sendingMessage}
              />
              <button
                type="submit"
                disabled={sendingMessage || !newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 h-auto"
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
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-center"
        >
          Inviter des membres
        </Link>
        <button
          onClick={async () => {
            if (!confirm('Êtes-vous sûr de vouloir quitter ce groupe ? Cette action est irréversible.')) return;
            try {
              setLeavingGroup(true);
              const res = await fetch(`/api/client/groups/${params.id}/leave`, {
                method: 'POST',
                credentials: 'include',
              });
              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Erreur lors de la sortie du groupe');
              }
              router.push('/client/groupes');
            } catch (err) {
              alert(err instanceof Error ? err.message : 'Erreur');
            } finally {
              setLeavingGroup(false);
            }
          }}
          disabled={leavingGroup}
          className="px-6 py-3 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50"
        >
          {leavingGroup ? 'Sortie en cours...' : 'Quitter le groupe'}
        </button>
      </div>
    </div>
  );
}
