'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { resetPasswordSchema, zodErrorsToRecord } from '@/lib/validations/auth';
import { ZodError } from 'zod';

/**
 * Page de réinitialisation du mot de passe
 * Le token est passé via les paramètres d'URL
 */
export default function ReinitialiserMotDePassePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-block w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Eventy Life</h1>
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Lien invalide</h2>
          <p className="text-gray-600 text-sm mb-6">
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link
            href="/mot-de-passe-oublie"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Validation Zod
    try {
      resetPasswordSchema.parse({ password, passwordConfirm });
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    setStatus('loading');

    try {
      await apiClient.post('/auth/reset-password', { token, password });
      setStatus('success');
      setTimeout(() => {
        router.push('/connexion');
      }, 3000);
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setServerError(error.message || 'Erreur lors de la réinitialisation');
      } else {
        setServerError('Erreur lors de la réinitialisation. Veuillez réessayer.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-block w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Eventy Life</h1>
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Mot de passe modifié!</h2>
          <p className="text-gray-600 text-sm mb-4">
            Votre mot de passe a été réinitialisé avec succès.
          </p>
          <p className="text-gray-500 text-sm mb-4">Redirection vers la connexion...</p>
          <Link
            href="/connexion"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Cliquez ici si vous n'êtes pas redirigé
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-block w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
          <p className="text-gray-600 text-sm mt-2">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        {/* Erreur serveur */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Min. 8 caractères"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirmation */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              id="passwordConfirm"
              type={showPassword ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.passwordConfirm
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Retapez votre mot de passe"
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            {status === 'loading' ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/connexion" className="text-blue-600 hover:text-blue-700 font-medium">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
