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
        const data = (await res.json() as unknown) as unknown;
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
        const data = (await res.json() as unknown) as unknown;
        throw new Error(data.message || 'Erreur lors de l\'invitation');
      }

      setSuccess(`Invitation envoyée à ${formData.email}`);
      setFormData({ email: '', message: '' });

      // Rafraîchir les stats
      const statsRes = await fetch(`/api/groups/${groupId}/stats`, {
        credentials: 'include',
      });
      if (statsRes.ok) {
        const data = (await statsRes.json() as unknown) as unknown;
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
      <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="mx-auto max-w-2xl">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--terra, #C75B39)' }} />
        </div>
      </div>
    );
  }

  if (!groupe) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="mx-auto max-w-2xl">
          <p style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Groupe non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href={`/client/groupes/${groupId}`} className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: 'var(--terra, #C75B39)' }}>
          ← Retour au groupe
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>Inviter des membres</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulaire d'invitation */}
          <Card style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--navy, #1A1A2E)' }}>Inviter par email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--terra, #DC2626)' }} />
                    <p className="text-sm" style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: '#DCFCE7', border: `1.5px solid ${'#166534'}` }}>
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#166534' }} />
                    <p className="text-sm" style={{ color: '#166534' }}>{success}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: 'var(--navy, #1A1A2E)' }}>Email</Label>
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
                      border: '1.5px solid #E5E0D8',
                      borderRadius: '10px',
                      color: 'var(--navy, #1A1A2E)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${'var(--terra, #C75B39)'Soft}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E0D8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" style={{ color: 'var(--navy, #1A1A2E)' }}>Message personnalisé (optionnel)</Label>
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
                      border: '1.5px solid #E5E0D8',
                      borderRadius: '10px',
                      color: 'var(--navy, #1A1A2E)',
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-white font-semibold transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--terra, #C75B39)',
                    borderRadius: '10px',
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'Light;
                      e.currentTarget.style.boxShadow = `0 8px 16px ${'var(--terra, #C75B39)'Soft}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
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
          <Card style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--navy, #1A1A2E)' }}>Code d&apos;invitation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Partagez ce code avec vos amis pour qu'ils rejoignent le groupe facilement.
              </p>

              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--gold, #D4A853)'Soft, border: `2px dashed var(--gold, #D4A853)` }}>
                <p className="text-center text-3xl font-bold tracking-widest" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  {groupe?.code as string || '-'}
                </p>
              </div>

              <Button
                onClick={handleCopyCode}
                className="w-full text-white font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: codeCopied ? '#166534' : 'var(--terra, #C75B39)',
                  borderRadius: '10px',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!codeCopied) {
                    e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)'Light;
                    e.currentTarget.style.boxShadow = `0 8px 16px ${'var(--terra, #C75B39)'Soft}`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!codeCopied) {
                    e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
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

              <div className="pt-4" style={{ borderTop: '1px solid #E5E0D8' }}>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Invitations en attente</h3>
                {(groupe?.pendingInvites as number) > 0 ? (
                  <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                    {groupe?.pendingInvites as number} invitation{(groupe?.pendingInvites as number) > 1 ? 's' : ''} en cours
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: '#6B7280' }}>Aucune invitation en attente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
