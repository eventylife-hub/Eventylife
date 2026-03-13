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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [submitButtonHover, setSubmitButtonHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  /** Validation individuelle d'un champ au blur */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldErrors: Record<string, string> = {};

    switch (name) {
      case 'firstName':
        if (!value.trim()) fieldErrors.firstName = 'Le prénom est requis';
        else if (value.trim().length < 2) fieldErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
        break;
      case 'lastName':
        if (!value.trim()) fieldErrors.lastName = 'Le nom est requis';
        else if (value.trim().length < 2) fieldErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
        break;
      case 'email':
        if (!value.trim()) fieldErrors.email = 'L\'email est requis';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fieldErrors.email = 'Format d\'email invalide';
        break;
      case 'password':
        if (!value) fieldErrors.password = 'Le mot de passe est requis';
        else if (value.length < 8) fieldErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        break;
      case 'confirmPassword':
        if (!value) fieldErrors.confirmPassword = 'La confirmation est requise';
        else if (value !== formData.password) fieldErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        break;
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (fieldErrors[name]) {
        next[name] = fieldErrors[name];
      } else {
        delete next[name];
      }
      return next;
    });
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (password: string) => {
    const strength = calculatePasswordStrength(password);
    if (strength <= 1) return { label: 'Faible', color: '#DC2626' };
    if (strength === 2 || strength === 3) return { label: 'Moyen', color: '#F59E0B' };
    return { label: 'Fort', color: '#10B981' };
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
    } catch (err: unknown) {
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
        backgroundColor: 'var(--cream, #FAF7F2)',
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
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E5E0D8',
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
            <span style={{ color: 'var(--navy, #1A1A2E)' }}>Eventy</span>
            <span style={{ color: 'var(--gold, #D4A853)' }}>.</span>
            <span style={{ color: 'var(--navy, #1A1A2E)' }}>Life</span>
          </h1>
        </div>

        {/* Titre */}
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--navy, #1A1A2E)',
            marginBottom: '0.5rem',
          }}
        >
          Créer un compte
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            marginBottom: '1.5rem',
          }}
        >
          Bienvenue chez Eventy Life !
        </p>

        {/* Message d'erreur */}
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#FEF2F2',
              border: `1px solid ${'#DC2626'}`,
              color: '#DC2626',
              fontSize: '0.875rem',
              borderRadius: '8px',
            }}
          >
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form aria-label="Inscription client" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
          {/* Prénom et Nom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label
                htmlFor="firstName"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--navy, #1A1A2E)',
                  marginBottom: '0.25rem',
                }}
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${errors.firstName ? '#DC2626' : '#E5E0D8'}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  color: 'var(--navy, #1A1A2E)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                onFocus={(e) => {
                  if (!errors.firstName) {
                    e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.firstName ? '#DC2626' : '#E5E0D8';
                }}
              />
              {errors.firstName && (
                <p id="firstName-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
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
                  color: 'var(--navy, #1A1A2E)',
                  marginBottom: '0.25rem',
                }}
              >
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${errors.lastName ? '#DC2626' : '#E5E0D8'}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  color: 'var(--navy, #1A1A2E)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                onFocus={(e) => {
                  if (!errors.lastName) {
                    e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.lastName ? '#DC2626' : '#E5E0D8';
                }}
              />
              {errors.lastName && (
                <p id="lastName-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
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
                color: 'var(--navy, #1A1A2E)',
                marginBottom: '0.25rem',
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
                autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#FFFFFF',
                border: `1.5px solid ${errors.email ? '#DC2626' : '#E5E0D8'}`,
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: 'var(--navy, #1A1A2E)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              onFocus={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.email ? '#DC2626' : '#E5E0D8';
              }}
            />
            {errors.email && (
              <p id="email-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
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
                color: 'var(--navy, #1A1A2E)',
                marginBottom: '0.25rem',
              }}
            >
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
                autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E5E0D8',
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: 'var(--navy, #1A1A2E)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E0D8';
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
                color: 'var(--navy, #1A1A2E)',
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
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E5E0D8',
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: 'var(--navy, #1A1A2E)',
                outline: 'none',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E0D8';
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
                color: 'var(--navy, #1A1A2E)',
                marginBottom: '0.25rem',
              }}
            >
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                  autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${errors.password ? '#DC2626' : '#E5E0D8'}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  color: 'var(--navy, #1A1A2E)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.password ? '#DC2626' : '#E5E0D8';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {formData.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      height: '4px',
                      flex: 1,
                      backgroundColor: getPasswordStrengthLabel(formData.password).color,
                      borderRadius: '2px',
                      opacity: 0.7,
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: getPasswordStrengthLabel(formData.password).color, fontWeight: '500' }}>
                    {getPasswordStrengthLabel(formData.password).label}
                  </span>
                </div>
              </div>
            )}
            {errors.password && (
              <p id="password-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
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
                color: 'var(--navy, #1A1A2E)',
                marginBottom: '0.25rem',
              }}
            >
              Confirmez le mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                  autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${errors.confirmPassword ? '#DC2626' : '#E5E0D8'}`,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  color: 'var(--navy, #1A1A2E)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                onFocus={(e) => {
                  if (!errors.confirmPassword) {
                    e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.confirmPassword ? '#DC2626' : '#E5E0D8';
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
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
                  accentColor: 'var(--terra, #C75B39)',
                }}
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--navy, #1A1A2E)', lineHeight: '1.5' }}>
                J'accepte les{' '}
                <Link
                  href="/cgv"
                  style={{
                    color: 'var(--terra, #C75B39)',
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
                  accentColor: 'var(--terra, #C75B39)',
                }}
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--navy, #1A1A2E)', lineHeight: '1.5' }}>
                J'accepte la{' '}
                <Link
                  href="/politique-confidentialite"
                  style={{
                    color: 'var(--terra, #C75B39)',
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
              backgroundColor: submitButtonHover && !loading ? '#D97B5E' : 'var(--terra, #C75B39)',
              color: '#FFFFFF',
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
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1.5rem' }}>
          Déjà inscrit ?{' '}
          <Link
            href="/connexion"
            style={{
              color: 'var(--terra, #C75B39)',
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
