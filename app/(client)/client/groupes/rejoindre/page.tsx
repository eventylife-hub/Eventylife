'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

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
    setCode(e.target.value.toUpperCase());
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
      const data = await res.json();
      setGroupePreview(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setGroupePreview(null);
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
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de l\'adhésion');
      }

      router.push(`/client/groupes/${groupePreview.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: C.cream, animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href="/client/groupes" className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: C.terra }}>
          ← Retour aux groupes
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: C.navy }}>Rejoindre un groupe</h1>

        <Card style={{ border: `1.5px solid ${C.border}`, borderRadius: '20px', backgroundColor: 'white' }}>
          <CardHeader>
            <CardTitle style={{ color: C.navy }}>Code d&apos;invitation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {error && (
                <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #DC2626` }}>
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--terra, #DC2626)' }} />
                  <p className="text-sm" style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="code" style={{ color: C.navy }}>Code d&apos;invitation</Label>
                <Input
                  id="code"
                  placeholder="Ex: ABC12DEF"
                  value={code}
                  onChange={handleCodeChange}
                  disabled={loading || joining}
                  maxLength={12}
                  style={{
                    backgroundColor: 'white',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '10px',
                    color: C.navy,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    letterSpacing: '0.1em',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${C.terraSoft}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
                <p className="text-xs" style={{ color: C.muted }}>
                  Demandez le code au leader du groupe
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || joining || !code.trim()}
                className="w-full text-white font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: C.terra,
                  borderRadius: '10px',
                }}
                onMouseEnter={(e) => {
                  if (!loading && !joining && code.trim()) {
                    e.currentTarget.style.backgroundColor = C.terraLight;
                    e.currentTarget.style.boxShadow = `0 8px 16px ${C.terraSoft}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = C.terra;
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
              </Button>
            </form>

            {/* Aperçu du groupe */}
            {groupePreview && (
              <div className="pt-4 space-y-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: C.forestBg, border: `1.5px solid ${C.forest}` }}>
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: C.forest }} />
                  <p className="text-sm" style={{ color: C.forest }}>Groupe trouvé!</p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase" style={{ color: C.muted }}>Groupe</label>
                  <p className="text-lg font-semibold" style={{ color: C.navy }}>{(groupePreview?.name as string) || 'Groupe'}</p>
                </div>

                {(groupePreview?.leaderUser as any) && (
                  <div>
                    <label className="text-xs font-semibold uppercase" style={{ color: C.muted }}>Leader</label>
                    <p className="text-sm" style={{ color: C.navy }}>
                      {(groupePreview?.leaderUser as any)?.firstName} {(groupePreview?.leaderUser as any)?.lastName}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold uppercase" style={{ color: C.muted }}>Membres</label>
                  <p className="text-sm" style={{ color: C.navy }}>
                    {(groupePreview?.memberCount as number) || 0} membre{((groupePreview?.memberCount as number) || 0) > 1 ? 's' : ''}
                    {(groupePreview?.maxRooms as number) && ` / ${((groupePreview?.maxRooms as number) * 2)}`}
                  </p>
                </div>

                <Button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full text-white font-semibold transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: C.terra,
                    borderRadius: '10px',
                  }}
                  onMouseEnter={(e) => {
                    if (!joining) {
                      e.currentTarget.style.backgroundColor = C.terraLight;
                      e.currentTarget.style.boxShadow = `0 8px 16px ${C.terraSoft}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = C.terra;
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
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
