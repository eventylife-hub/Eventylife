'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';
import { apiClient } from '@/lib/api-client';
import { RegisterResponse } from '@/types/api';
import { registerSchema, zodErrorsToRecord } from '@/lib/validations/auth';

/**
 * Page d'inscription - Eventy v2 Design System
 * Formulaire complet: prénom, nom, email, téléphone, mot de passe
 * Choix du type: Client ou Pro
 * Acceptation CGV + RGPD
 */
export default function InscriptionPage() {
  const router = useRouter();

  // Eventy v2 Color System
  const C = {
    navy: '#1A1A2E',
    cream: '#FAF7F2',
    terra: '#C75B39',
    terraLight: '#D97B5E',
    gold: '#D4A853',
    border: '#E5E0D8',
    muted: '#6B7280',
    white: '#FFFFFF',
    error: 'var(--terra, #DC2626)',
    errorBg: 'var(--terra-soft, #FEF2F2)',
  };

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
  const [submitButtonHover, setSubmitButtonHover] = useState(false);

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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: C.cream,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="animate-fade-up"
        style={{
          width: '100%',
          maxWidth: '448px',
          backgroundColor: C.white,
          borderRadius: '20px',
          border: `1.5px solid ${C.border}`,
          boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
          padding: '2rem',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              marginBottom: '1rem',
              letterSpacing: '-0.5px',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            <span style={{ color: C.navy }}>Eventy</span>
            <span style={{ color: C.gold }}>.</span>
            <span style={{ color: C.navy }}>Life</span>
          </h1>
        </div>

        {/* Titre */}
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: C.navy,
            marginBottom: '0.5rem',
          }}
        >
          Créer un compte
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: C.muted,
            marginBottom: '1.5rem',
          }}
        >
          Bienvenue chez Eventy Life!
        </p>

        {/* Message d'erreur */}
        {error && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: C.errorBg,
              border: `1px solid ${C.error}`,
              color: C.error,
              fontSize: '0.875rem',
              borderRadius: '8px',
            }}
          >
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Prénom et Nom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label
                htmlFor="firstName"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: C.navy,
                  marginBottom: '0.25rem',
                }}
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: C.white,
                  border: `1.5px solid ${errors.firstName ? C.error : C.border}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  color: C.navy,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.firstName) {
                    e.currentTarget.style.borderColor = C.terra;
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.firstName ? C.error : C.border;
                }}
              />
              {errors.firstName && (
                <p style={{ color: C.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: C.navy,
                  marginBottom: '0.25rem',
                }}
              >
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: C.white,
                  border: `1.5px solid ${errors.lastName ? C.error : C.border}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  color: C.navy,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.lastName) {
                    e.currentTarget.style.borderColor = C.terra;
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.lastName ? C.error : C.border;
                }}
              />
              {errors.lastName && (
                <p style={{ color: C.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: C.navy,
                marginBottom: '0.25rem',
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: C.white,
                border: `1.5px solid ${errors.email ? C.error : C.border}`,
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: C.navy,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = C.terra;
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.email ? C.error : C.border;
              }}
            />
            {errors.email && (
              <p style={{ color: C.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label
              htmlFor="phone"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: C.navy,
                marginBottom: '0.25rem',
              }}
            >
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: C.white,
                border: `1.5px solid ${C.border}`,
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: C.navy,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.terra;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            />
          </div>

          {/* Type de compte */}
          <div>
            <label
              htmlFor="userType"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: C.navy,
                marginBottom: '0.25rem',
              }}
            >
              Type de compte
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: C.white,
                border: `1.5px solid ${C.border}`,
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: C.navy,
                outline: 'none',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.terra;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <option value="CLIENT">Client</option>
              <option value="PRO">Professionnel</option>
            </select>
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: C.navy,
                marginBottom: '0.25rem',
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: C.white,
                border: `1.5px solid ${errors.password ? C.error : C.border}`,
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: C.navy,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.currentTarget.style.borderColor = C.terra;
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.password ? C.error : C.border;
              }}
            />
            {errors.password && (
              <p style={{ color: C.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label
              htmlFor="confirmPassword"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: C.navy,
                marginBottom: '0.25rem',
              }}
            >
              Confirmez le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: C.white,
                border: `1.5px solid ${errors.confirmPassword ? C.error : C.border}`,
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: C.navy,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.confirmPassword) {
                  e.currentTarget.style.borderColor = C.terra;
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.confirmPassword ? C.error : C.border;
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: C.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="acceptCGV"
                checked={formData.acceptCGV}
                onChange={handleChange}
                style={{
                  marginTop: '0.25rem',
                  width: '1rem',
                  height: '1rem',
                  cursor: 'pointer',
                  accentColor: C.terra,
                }}
              />
              <span style={{ fontSize: '0.875rem', color: C.navy, lineHeight: '1.5' }}>
                J'accepte les{' '}
                <Link
                  href="/cgv"
                  style={{
                    color: C.terra,
                    textDecoration: 'underline',
                    fontWeight: '500',
                  }}
                >
                  conditions générales de vente
                </Link>
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="acceptRGPD"
                checked={formData.acceptRGPD}
                onChange={handleChange}
                style={{
                  marginTop: '0.25rem',
                  width: '1rem',
                  height: '1rem',
                  cursor: 'pointer',
                  accentColor: C.terra,
                }}
              />
              <span style={{ fontSize: '0.875rem', color: C.navy, lineHeight: '1.5' }}>
                J'accepte la{' '}
                <Link
                  href="/politique-confidentialite"
                  style={{
                    color: C.terra,
                    textDecoration: 'underline',
                    fontWeight: '500',
                  }}
                >
                  politique de confidentialité
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => !loading && setSubmitButtonHover(true)}
            onMouseLeave={() => setSubmitButtonHover(false)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              marginTop: '0.5rem',
              backgroundColor: submitButtonHover && !loading ? C.terraLight : C.terra,
              color: C.white,
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        {/* Lien connexion */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: C.muted, marginTop: '1.5rem' }}>
          Déjà inscrit?{' '}
          <Link
            href="/connexion"
            style={{
              color: C.terra,
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
