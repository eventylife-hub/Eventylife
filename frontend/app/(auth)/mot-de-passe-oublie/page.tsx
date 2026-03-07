'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ZodError } from 'zod';
import { apiClient } from '@/lib/api-client';
import { forgotPasswordSchema, zodErrorsToRecord } from '@/lib/validations/auth';

/**
 * Page de réinitialisation de mot de passe
 * Demande d'email
 * Message de confirmation
 */
export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setLoading(true);

    try {
      // Validate with Zod schema
      forgotPasswordSchema.parse({ email });

      await apiClient.post('/auth/forgot-password', { email });
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de la demande');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900">Eventy Life</h1>
        </div>

        {/* Titre */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Mot de passe oublié</h2>
        <p className="text-gray-600 text-sm mb-6">
          Entrez votre email pour recevoir les instructions de réinitialisation
        </p>

        {/* Message de confirmation */}
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            <p className="font-medium">Email envoyé!</p>
            <p className="mt-1">Vérifiez votre boîte mail pour les instructions de réinitialisation.</p>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Formulaire */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer les instructions'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setError(null);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Envoyer à nouveau
            </button>
          </div>
        )}

        {/* Lien retour */}
        <div className="text-center mt-6">
          <Link href="/connexion" className="text-blue-600 hover:text-blue-700 text-sm">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
