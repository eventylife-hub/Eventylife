'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';
import { apiClient } from '@/lib/api-client';
import { RegisterResponse } from '@/types/api';
import { registerSchema, zodErrorsToRecord } from '@/lib/validations/auth';

/**
 * Page d'inscription
 * Formulaire complet: prénom, nom, email, téléphone, mot de passe
 * Choix du type: Client ou Pro
 * Acceptation CGV + RGPD
 */
export default function InscriptionPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'CLIENT',
    acceptCGV: false,
    acceptRGPD: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    try {
      // Validate with Zod schema
      registerSchema.parse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Validate CGV and RGPD
      if (!formData.acceptCGV) {
        setError('Vous devez accepter les CGV');
        return;
      }
      if (!formData.acceptRGPD) {
        setError('Vous devez accepter la politique de confidentialité');
        return;
      }

      setLoading(true);

      await apiClient.post<RegisterResponse>('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        role: formData.userType,
      });

      // Rediriger vers connexion
      router.push('/connexion');
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
      } else if (err instanceof Error) {
        setError(err.message || 'Erreur lors de l\'inscription');
      } else {
        setError('Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900">Eventy Life</h1>
        </div>

        {/* Titre */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Créer un compte</h2>
        <p className="text-gray-600 text-sm mb-6">Bienvenue chez Eventy Life!</p>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
              Type de compte
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            >
              <option value="CLIENT">Client</option>
              <option value="PRO">Professionnel</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmez le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 py-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptCGV"
                checked={formData.acceptCGV}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">
                J'accepte les{' '}
                <Link href="/cgv" className="text-blue-600 hover:text-blue-700">
                  conditions générales de vente
                </Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptRGPD"
                checked={formData.acceptRGPD}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">
                J'accepte la{' '}
                <Link href="/politique-confidentialite" className="text-blue-600 hover:text-blue-700">
                  politique de confidentialité
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        {/* Lien connexion */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà inscrit?{' '}
          <Link href="/connexion" className="text-blue-600 hover:text-blue-700 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
