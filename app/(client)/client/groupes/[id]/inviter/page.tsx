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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-2xl">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!groupe) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-2xl">
          <p className="text-red-600">{error || 'Groupe non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Link href={`/client/groupes/${groupId}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Retour au groupe
        </Link>

        <h1 className="text-3xl font-bold mb-6">Inviter des membres</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulaire d'invitation */}
          <Card>
            <CardHeader>
              <CardTitle>Inviter par email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="membre@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message personnalisé (optionnel)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Bienvenue dans notre groupe..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={submitting}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full"
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

          {/* Code d'invitation */}
          <Card>
            <CardHeader>
              <CardTitle>Code d'invitation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Partagez ce code avec vos amis pour qu'ils rejoignent le groupe facilement.
              </p>

              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4">
                <p className="text-center text-3xl font-bold tracking-widest text-gray-800">
                  {groupe?.code as string || '-'}
                </p>
              </div>

              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="w-full"
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

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-sm mb-2">Invitations en attente</h3>
                {(groupe?.pendingInvites as number) > 0 ? (
                  <p className="text-sm">
                    {groupe?.pendingInvites as number} invitation{(groupe?.pendingInvites as number) > 1 ? 's' : ''} en cours
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Aucune invitation en attente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
