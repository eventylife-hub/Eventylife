'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

/**
 * Page de vérification d'email
 * Traite le token depuis les params d'URL
 * Affiche succès ou erreur
 */
export default function VerificationEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification en cours...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant');
      return;
    }

    const verify = async () => {
      try {
        await apiClient.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage('Email vérifié avec succès!');
        // Rediriger après 3 secondes
        setTimeout(() => {
          router.push('/connexion');
        }, 3000);
      } catch (error) {
        setStatus('error');
        if (error instanceof Error) {
          setMessage(error.message || 'Erreur lors de la vérification');
        } else {
          setMessage('Erreur lors de la vérification');
        }
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="inline-block w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Eventy Life</h1>

        {/* Contenu selon le statut */}
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="text-5xl">✓</div>
            <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
            <p className="text-gray-600 text-sm">Redirection vers connexion...</p>
            <Link href="/connexion" className="inline-block text-blue-600 hover:text-blue-700 font-medium">
              Cliquez ici si vous n'êtes pas redirigé
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="text-5xl">✗</div>
            <h2 className="text-xl font-semibold text-red-600">Erreur</h2>
            <p className="text-gray-600 text-sm">{message}</p>
            <Link
              href="/connexion"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
