'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Search, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const OCEAN = 'var(--pro-ocean)';
const SUN = 'var(--pro-sun)';
const SAND = '#FEFCF3';
const DARK = '#0A1628';
const MUTED = '#8896A6';
const CORAL = 'var(--pro-coral)';

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantType: 'eventy' | 'partner';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messageCount: number;
}

type FilterType = 'tous' | 'non-lus' | 'eventy' | 'partenaires';

export default function MessagerieInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('tous');
  const [searchQuery, setSearchQuery] = useState('');

  const demoConversations: Conversation[] = [
    {
      id: '1',
      participantName: 'Support Eventy',
      participantType: 'eventy',
      lastMessage: 'Votre compte a été approuvé ! Vous pouvez maintenant créer vos premiers voyages.',
      lastMessageTime: '2026-03-11T10:30:00Z',
      unreadCount: 1,
      messageCount: 8,
    },
    {
      id: '2',
      participantName: 'Marie Dupont - Hôtels Premium',
      participantType: 'partner',
      lastMessage: 'Concernant les tarifs pour le mois d\'avril, j\'ai des réductions intéressantes...',
      lastMessageTime: '2026-03-11T08:15:00Z',
      unreadCount: 2,
      messageCount: 12,
    },
    {
      id: '3',
      participantName: 'Équipe Juridique Eventy',
      participantType: 'eventy',
      lastMessage: 'Votre contrat a été mis à jour. Veuillez consulter les modifications.',
      lastMessageTime: '2026-03-10T16:45:00Z',
      unreadCount: 0,
      messageCount: 5,
    },
    {
      id: '4',
      participantName: 'Jean Martin - Transport Excellence',
      participantType: 'partner',
      lastMessage: 'Les prix des transport ont augmenté, on en parle cette semaine ?',
      lastMessageTime: '2026-03-10T14:20:00Z',
      unreadCount: 0,
      messageCount: 7,
    },
    {
      id: '5',
      participantName: 'Support Facturation Eventy',
      participantType: 'eventy',
      lastMessage: 'Vous trouverez votre facture du mois en pièce jointe.',
      lastMessageTime: '2026-03-09T11:00:00Z',
      unreadCount: 0,
      messageCount: 3,
    },
  ];

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/pro/messagerie/conversations', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }
      const data = (await res.json()) as unknown;
      setConversations(data as Conversation[]);
    } catch (err: unknown) {
      console.warn('API indisponible, utilisation des données de démonstration');
      setConversations(demoConversations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    let matchesFilter = true;
    if (filter === 'non-lus') {
      matchesFilter = conv.unreadCount > 0;
    } else if (filter === 'eventy') {
      matchesFilter = conv.participantType === 'eventy';
    } else if (filter === 'partenaires') {
      matchesFilter = conv.participantType === 'partner';
    }

    const matchesSearch =
      searchQuery === '' ||
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;

    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  const getAvatarColor = (type: string) => {
    return type === 'eventy' ? OCEAN : SUN;
  };

  return (
    <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: SAND, padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="pro-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)', marginBottom: '8px' }}>
            Messagerie
          </h1>
          <p style={{ color: MUTED, fontSize: '14px' }}>
            {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
            {filter !== 'tous' && ` - Filtre: ${filter}`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fee2e2', border: `1px solid ${CORAL}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: CORAL, flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 500, color: CORAL }}>{error}</p>
                <p style={{ fontSize: '14px', color: CORAL, marginTop: '4px', opacity: 0.8 }}>Vérifiez votre connexion et réessayez.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchConversations}
              className="pro-btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px', flexShrink: 0 }}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              Réessayer
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
          {/* Sidebar - Filters & Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search */}
            <div className="pro-panel" style={{ padding: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: MUTED }} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pro-input"
                  style={{ paddingLeft: '40px', width: '100%' }}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="pro-panel" style={{ padding: '8px' }}>
              {['tous', 'non-lus', 'eventy', 'partenaires'].map((filterOption) => (
                <button
                  key={filterOption}
                  type="button"
                  onClick={() => setFilter(filterOption as FilterType)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: filterOption !== 'partenaires' ? '8px' : '0',
                    backgroundColor: filter === filterOption ? OCEAN : 'transparent',
                    color: filter === filterOption ? 'white' : DARK,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== filterOption) {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== filterOption) {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {filterOption === 'tous' && 'Tous les messages'}
                  {filterOption === 'non-lus' && 'Non lus'}
                  {filterOption === 'eventy' && 'Eventy'}
                  {filterOption === 'partenaires' && 'Partenaires'}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div>
            {loading ? (
              /* Loading State */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pro-panel" style={{ padding: '16px', height: '100px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Skeleton style={{ width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Skeleton style={{ height: '16px', width: '40%' }} />
                        <Skeleton style={{ height: '14px', width: '60%' }} />
                        <Skeleton style={{ height: '12px', width: '30%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              /* Empty State */
              <div className="pro-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <MessageSquare style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: MUTED }} />
                <h3 className="pro-section-title" style={{ marginBottom: '8px' }}>
                  Aucune conversation
                </h3>
                <p style={{ color: MUTED, marginBottom: '24px', fontSize: '14px' }}>
                  {searchQuery ? 'Aucune conversation ne correspond à votre recherche.' : 'Vous n\'avez pas encore de messages. Contactez vos partenaires pour commencer !'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="pro-btn-sun"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Effacer la recherche
                  </button>
                )}
              </div>
            ) : (
              /* Conversations List */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/pro/messagerie/${conv.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      className="pro-panel"
                      style={{
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: conv.unreadCount > 0 ? `2px solid ${OCEAN}` : '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'white';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          backgroundColor: getAvatarColor(conv.participantType),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {conv.participantName.charAt(0).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {conv.participantName}
                          </h3>
                          {conv.participantType === 'eventy' && (
                            <span className="pro-badge-ocean" style={{ whiteSpace: 'nowrap' }}>
                              Support Eventy
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.lastMessage}
                        </p>
                      </div>

                      {/* Right Section */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', color: MUTED, whiteSpace: 'nowrap' }}>
                          {formatTime(conv.lastMessageTime)}
                        </span>
                        {conv.unreadCount > 0 && (
                          <div
                            style={{
                              backgroundColor: SUN,
                              color: 'white',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
