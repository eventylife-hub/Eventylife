'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ZodError } from 'zod';
import { apiClient } from '@/lib/api-client';
import { loginSchema, zodErrorsToRecord } from '@/lib/validations/auth';

/**
 * Page de connexion
 * Formulaire email + mot de passe
 * Récupération de mot de passe
 * Lien vers inscription
 */
export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/client/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setLoading(true);

    try {
      // Validate with Zod schema
      loginSchema.parse(formData);

      interface LoginResponse {
        user: {
          id: string;
          email: string;
          role: 'ADMIN' | 'PRO' | 'CLIENT';
        };
      }

      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Les tokens sont désormais gérés via httpOnly cookies par le serveur
      // Pas besoin de les stocker côté client

      // Rediriger vers le dashboard selon le rôle
      const user = response.user;
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (user?.role === 'PRO') {
        router.push('/pro');
      } else {
        router.push(redirect);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
      } else if (err instanceof Error) {
        setError(err.message || 'Erreur de connexion');
      } else {
        setError('Erreur de connexion');
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connexion</h2>
        <p className="text-gray-600 text-sm mb-6">Bienvenue! Connectez-vous à votre compte</p>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="votre@email.com"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <Link href="/mot-de-passe-oublie" className="text-xs text-blue-600 hover:text-blue-700">
                Oublié?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Nouveau client?</span>
          </div>
        </div>

        {/* Lien inscription */}
        <Link
          href="/inscription"
          className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-center block"
        >
          Créer un compte
        </Link>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          En vous connectant, vous acceptez nos{' '}
          <Link href="/cgv" className="text-blue-600 hover:text-blue-700">
            CGV
          </Link>{' '}
          et notre{' '}
          <Link href="/politique-confidentialite" className="text-blue-600 hover:text-blue-700">
            politique de confidentialité
          </Link>
        </p>
      </div>
    </div>
  );
}
