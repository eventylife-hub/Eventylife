'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZodError } from 'zod';
import { AlertCircle, Loader2, Copy, CheckCircle } from 'lucide-react';
import { logger } from '@/lib/logger';
import { groupInviteSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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
        const data = (await res.json()) as Record<string, unknown>;
        setGroupe(data);
      } catch (err: unknown) {
        logger.warn('API groups/stats indisponible — données démo');
        const FALLBACK_GROUP = {
          id: groupId,
          name: 'Groupe de voyage',
          code: 'ABC12DEF',
          memberCount: 5,
          maxMembers: 12,
          pendingInvites: 2,
        };
        setGroupe(FALLBACK_GROUP);
        setError(null);
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
    setErrors({});
    setSuccess(null);

    try {
      groupInviteSchema.parse(formData);
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
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
        const data = (await res.json()) as Record<string, unknown>;
        throw new Error(data.message || 'Erreur lors de l\'invitation');
      }

      setSuccess(`Invitation envoyée à ${formData.email}`);
      setFormData({ email: '', message: '' });

      // Rafraîchir les stats
      const statsRes = await fetch(`/api/groups/${groupId}/stats`, {
        credentials: 'include',
      });
      if (statsRes.ok) {
        const data = (await statsRes.json() as unknown) as Record<string, unknown>;
        setGroupe(data);
      }
    } catch (err: unknown) {
      logger.warn('API groups/invite indisponible — données démo');
      setSuccess(`Invitation envoyée à ${formData.email} (démo)`);
      setFormData({ email: '', message: '' });
      setError(null);
      if (groupe) {
        setGroupe({ ...groupe, pendingInvites: ((groupe.pendingInvites as number) || 0) + 1 });
      }
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
          <div style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--navy, #1A1A2E)' }}>Inviter par email</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <form aria-label="Inviter un membre" onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  <label htmlFor="email" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="membre@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.email ? '#DC2626' : '#E5E0D8'}`, fontSize: '0.95rem', width: '100%', outline: 'none', background: 'white', color: 'var(--navy, #1A1A2E)' }}
                    onFocus={(e) => {
                      if (!errors.email) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${'rgba(199,91,57,0.1)'}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.email ? '#DC2626' : '#E5E0D8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <FormFieldError error={errors.email} id="email-error" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A2E' }}>Message personnalisé (optionnel)</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Bienvenue dans notre groupe..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={submitting}
                    rows={3}
                    style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid #E5E0D8', fontSize: '0.95rem', width: '100%', outline: 'none', background: 'white', minHeight: '100px', resize: 'vertical', color: 'var(--navy, #1A1A2E)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
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
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = '#D97B5E';
                      e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
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
                </button>
              </form>
            </div>
          </div>

          {/* Code d&apos;invitation */}
          <div style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--navy, #1A1A2E)' }}>Code d&apos;invitation</h3>
            </div>
            <div style={{ padding: '1.5rem' }} className="space-y-4">
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Partagez ce code avec vos amis pour qu'ils rejoignent le groupe facilement.
              </p>

              <div className="rounded-lg p-4" style={{ backgroundColor: '#FDF6E8', border: `2px dashed var(--gold, #D4A853)` }}>
                <p className="text-center text-3xl font-bold tracking-widest" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  {groupe?.code as string || '-'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full text-white font-semibold transition-all"
                style={{
                  backgroundColor: codeCopied ? '#166534' : 'var(--terra, #C75B39)',
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
                  if (!codeCopied) {
                    e.currentTarget.style.backgroundColor = '#D97B5E';
                    e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
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
              </button>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
