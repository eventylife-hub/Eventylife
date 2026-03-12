import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { extractErrorMessage } from '@/lib/api-error';

interface InviteFormProps {
  groupId: string;
  onSuccess?: () => void;
}

/**
 * Formulaire d'invitation de membres au groupe
 */
export function InviteForm({ groupId, onSuccess }: InviteFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Email requis');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
        credentials: 'include',
});

      if (!res.ok) {
        const data = (await res.json() as unknown) as unknown;
        throw new Error(data.message || 'Erreur');
      }

      setSuccess(`Invitation envoyée à ${email}`);
      setEmail('');
      setMessage('');
      onSuccess?.();
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Erreur lors de l\'envoi de l\'invitation'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form aria-label="Formulaire d'invitation" onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email du membre</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
          placeholder="membre@example.com"
          disabled={loading}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (optionnel)</label>
        <textarea
          id="message"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage((e.target as HTMLTextAreaElement).value)}
          placeholder="Bienvenue dans notre groupe..."
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 min-h-[44px] font-medium">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
            Envoi...
          </>
        ) : (
          'Envoyer invitation'
        )}
      </button>
    </form>
  );
}
