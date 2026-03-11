'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, Copy, CheckCircle } from 'lucide-react';

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
 * Page d'invitation des membres au groupe
 * Formulaire d'invitation et affichage des invitations en attente
 */
export default function InviterPage() {
  const params = useParams();
  const groupId = params.id as string;
  const router = useRouter();

  const [groupe, setGroupe] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });

  useEffect(() => {
    const fetchGroupe = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/groups/${groupId}/stats`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Groupe non trouvé');
        const data = await res.json();
        setGroupe(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupe();
  }, [groupId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.email.trim()) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de l\'invitation');
      }

      setSuccess(`Invitation envoyée à ${formData.email}`);
      setFormData({ email: '', message: '' });

      // Rafraîchir les stats
      const statsRes = await fetch(`/api/groups/${groupId}/stats`, {
        credentials: 'include',
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setGroupe(data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (groupe?.code) {
      navigator.clipboard.writeText(groupe.code as string);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: C.cream }}>
        <div className="mx-auto max-w-2xl">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: C.terra }} />
        </div>
      </div>
    );
  }

  if (!groupe) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: C.cream }}>
        <div className="mx-auto max-w-2xl">
          <p style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Groupe non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: C.cream, animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href={`/client/groupes/${groupId}`} className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: C.terra }}>
          ← Retour au groupe
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: C.navy }}>Inviter des membres</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulaire d'invitation */}
          <Card style={{ border: `1.5px solid ${C.border}`, borderRadius: '20px', backgroundColor: 'white' }}>
            <CardHeader>
              <CardTitle style={{ color: C.navy }}>Inviter par email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #DC2626` }}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--terra, #DC2626)' }} />
                    <p className="text-sm" style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: C.forestBg, border: `1.5px solid ${C.forest}` }}>
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: C.forest }} />
                    <p className="text-sm" style={{ color: C.forest }}>{success}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: C.navy }}>Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="membre@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                    style={{
                      backgroundColor: 'white',
                      border: `1.5px solid ${C.border}`,
                      borderRadius: '10px',
                      color: C.navy,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = C.terra;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${C.terraSoft}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" style={{ color: C.navy }}>Message personnalisé (optionnel)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Bienvenue dans notre groupe..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={submitting}
                    rows={3}
                    style={{
                      backgroundColor: 'white',
                      border: `1.5px solid ${C.border}`,
                      borderRadius: '10px',
                      color: C.navy,
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-white font-semibold transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: C.terra,
                    borderRadius: '10px',
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = C.terraLight;
                      e.currentTarget.style.boxShadow = `0 8px 16px ${C.terraSoft}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = C.terra;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    'Envoyer invitation'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Code d&apos;invitation */}
          <Card style={{ border: `1.5px solid ${C.border}`, borderRadius: '20px', backgroundColor: 'white' }}>
            <CardHeader>
              <CardTitle style={{ color: C.navy }}>Code d&apos;invitation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm" style={{ color: C.muted }}>
                Partagez ce code avec vos amis pour qu'ils rejoignent le groupe facilement.
              </p>

              <div className="rounded-lg p-4" style={{ backgroundColor: C.goldSoft, border: `2px dashed ${C.gold}` }}>
                <p className="text-center text-3xl font-bold tracking-widest" style={{ color: C.navy }}>
                  {groupe?.code as string || '-'}
                </p>
              </div>

              <Button
                onClick={handleCopyCode}
                className="w-full text-white font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: codeCopied ? C.forest : C.terra,
                  borderRadius: '10px',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!codeCopied) {
                    e.currentTarget.style.backgroundColor = C.terraLight;
                    e.currentTarget.style.boxShadow = `0 8px 16px ${C.terraSoft}`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!codeCopied) {
                    e.currentTarget.style.backgroundColor = C.terra;
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {codeCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copié!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier le code
                  </>
                )}
              </Button>

              <div className="pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <h3 className="font-semibold text-sm mb-2" style={{ color: C.navy }}>Invitations en attente</h3>
                {(groupe?.pendingInvites as number) > 0 ? (
                  <p className="text-sm" style={{ color: C.navy }}>
                    {groupe?.pendingInvites as number} invitation{(groupe?.pendingInvites as number) > 1 ? 's' : ''} en cours
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: C.muted }}>Aucune invitation en attente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
