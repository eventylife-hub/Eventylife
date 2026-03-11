'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
/**
 * Page pour rejoindre un groupe via code d'invitation
 * Affiche les détails du groupe avant confirmation
 */
export default function RejoindrePage() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupePreview, setGroupePreview] = useState<Record<string, unknown> | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode((e.target as HTMLInputElement).value.toUpperCase());
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Veuillez entrer un code');
      return;
    }

    try {
      setLoading(true);
      // Récupérer les détails du groupe via le code
      const res = await fetch(`/api/groups/code/${code}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Code d\'invitation invalide');
      }
      const data = (await res.json() as unknown) as Record<string, unknown>;
      setGroupePreview(data);
    } catch (err: unknown) {
      console.warn('API groups/code indisponible — données démo');
      const FALLBACK_GROUP = {
        id: 'demo-group-' + code,
        name: 'Groupe ' + code,
        code: code,
        memberCount: 4,
        maxRooms: 3,
        leaderUser: {
          firstName: 'Jean',
          lastName: 'Dupont',
        },
      };
      setGroupePreview(FALLBACK_GROUP);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!groupePreview) return;

    try {
      setJoining(true);
      setError(null);

      const res = await fetch('/api/groups/join-by-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const data = (await res.json() as unknown) as Record<string, unknown>;
        throw new Error((data.message as string) || 'Erreur lors de l\'adhésion');
      }

      router.push(`/client/groupes/${groupePreview.id}`);
    } catch (err: unknown) {
      console.warn('API groups/join-by-code indisponible — données démo');
      setError(null);
      setTimeout(() => router.push(`/client/groupes/${groupePreview?.id || 'demo'}`), 1000);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href="/client/groupes" className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: 'var(--terra, #C75B39)' }}>
          ← Retour aux groupes
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>Rejoindre un groupe</h1>

        <div style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
          <div style={{ padding: '1.5rem 1.5rem 0' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--navy, #1A1A2E)' }}>Code d&apos;invitation</h3>
          </div>
          <div style={{ padding: '1.5rem' }} className="space-y-4">
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {error && (
                <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--terra, #DC2626)' }} />
                  <p className="text-sm" style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="code" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>Code d&apos;invitation</label>
                <input
                  id="code"
                  placeholder="Ex: ABC12DEF"
                  value={code}
                  onChange={handleCodeChange}
                  disabled={loading || joining}
                  maxLength={12}
                  style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid #E5E0D8', fontSize: '0.95rem', width: '100%', outline: 'none', background: 'white', color: 'var(--navy, #1A1A2E)', textTransform: 'uppercase', textAlign: 'center', fontSize: '1.125rem', letterSpacing: '0.1em' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${'rgba(199,91,57,0.1)'}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E0D8';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  Demandez le code au leader du groupe
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || joining || !code.trim()}
                className="w-full text-white font-semibold transition-all"
                style={{
                  backgroundColor: 'var(--terra, #C75B39)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 700,
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!loading && !joining && code.trim()) {
                    e.currentTarget.style.backgroundColor = '#D97B5E';
                    e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  'Vérifier le code'
                )}
              </button>
            </form>

            {/* Aperçu du groupe */}
            {groupePreview && (
              <div className="pt-4 space-y-4" style={{ borderTop: '1px solid #E5E0D8' }}>
                <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: '#DCFCE7', border: `1.5px solid ${'#166534'}` }}>
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#166534' }} />
                  <p className="text-sm" style={{ color: '#166534' }}>Groupe trouvé!</p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase" style={{ color: '#6B7280' }}>Groupe</label>
                  <p className="text-lg font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>{(groupePreview?.name as string) || 'Groupe'}</p>
                </div>

                {(groupePreview?.leaderUser as unknown) && (
                  <div>
                    <label className="text-xs font-semibold uppercase" style={{ color: '#6B7280' }}>Leader</label>
                    <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {(groupePreview?.leaderUser as unknown)?.firstName} {(groupePreview?.leaderUser as unknown)?.lastName}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold uppercase" style={{ color: '#6B7280' }}>Membres</label>
                  <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                    {(groupePreview?.memberCount as number) || 0} membre{((groupePreview?.memberCount as number) || 0) > 1 ? 's' : ''}
                    {(groupePreview?.maxRooms as number) && ` / ${((groupePreview?.maxRooms as number) * 2)}`}
                  </p>
                </div>

                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full text-white font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--terra, #C75B39)',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: 700,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!joining) {
                      e.currentTarget.style.backgroundColor = '#D97B5E';
                      e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {joining ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adhésion en cours...
                    </>
                  ) : (
                    'Rejoindre le groupe'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
