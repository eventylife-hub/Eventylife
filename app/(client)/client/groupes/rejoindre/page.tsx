'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Link href="/client/groupes" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Retour aux groupes
        </Link>

        <h1 className="text-3xl font-bold mb-6">Rejoindre un groupe</h1>

        <Card>
          <CardHeader>
            <CardTitle>Code d&apos;invitation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="code">Code d&apos;invitation</Label>
                <Input
                  id="code"
                  placeholder="Ex: ABC12DEF"
                  value={code}
                  onChange={handleCodeChange}
                  disabled={loading || joining}
                  maxLength={12}
                  className="uppercase text-center text-lg tracking-widest"
                  required
                />
                <p className="text-xs text-gray-500">
                  Demandez le code au leader du groupe
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || joining || !code.trim()}
                className="w-full"
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
              <div className="pt-4 border-t space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Groupe trouvé!</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Groupe</label>
                  <p className="text-lg font-semibold">{(groupePreview?.name as string) || 'Groupe'}</p>
                </div>

                {(groupePreview?.leaderUser as any) && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">Leader</label>
                    <p className="text-sm">
                      {(groupePreview?.leaderUser as any)?.firstName} {(groupePreview?.leaderUser as any)?.lastName}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Membres</label>
                  <p className="text-sm">
                    {(groupePreview?.memberCount as number) || 0} membre{((groupePreview?.memberCount as number) || 0) > 1 ? 's' : ''}
                    {(groupePreview?.maxRooms as number) && ` / ${((groupePreview?.maxRooms as number) * 2)}`}
                  </p>
                </div>

                <Button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full"
                  variant="default"
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
