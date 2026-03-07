'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Inscription() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmerMotDePasse: '',
  });

  const [accepteTermes, setAccepteTermes] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le pr\u00e9nom est requis';
    }
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le t\u00e9l\u00e9phone est requis';
    }
    if (!formData.motDePasse.trim()) {
      newErrors.motDePasse = 'Le mot de passe est requis';
    } else if (formData.motDePasse.length < 8) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 8 caract\u00e8res';
    }
    if (formData.confirmerMotDePasse !== formData.motDePasse) {
      newErrors.confirmerMotDePasse = 'Les mots de passe ne correspondent pas';
    }
    if (!accepteTermes) {
      newErrors.termes = 'Vous devez accepter les CGV';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          motDePasse: formData.motDePasse,
        }),
      });

      if (response.ok) {
        window.location.href = '/connexion';
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Une erreur est survenue' });
      }
    } catch (error) {
      setErrors({ submit: 'Une erreur est survenue lors de l\'inscription' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAF7F2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <Link href="/">
          <div
            style={{
              textAlign: 'center',
              marginBottom: '40px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1A1A2E',
                margin: '0',
                letterSpacing: '-0.5px',
              }}
            >
              Eventy Life
            </h1>
          </div>
        </Link>

        <h2
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1A1A2E',
            textAlign: 'center',
            marginBottom: '32px',
            margin: '0 0 32px 0',
          }}
        >
          Cr\u00e9er un compte
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1A1A2E',
                marginBottom: '6px',
              }}
            >
              Pr\u00e9nom
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1px solid ${errors.prenom ? '#EF4444' : '#E8E4DE'}`,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#1A1A2E',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.prenom) {
                  e.currentTarget.style.borderColor = '#C75B39';
                }
              }}
              onBlur={(e) => {
                if (!errors.prenom) {
                  e.currentTarget.style.borderColor = '#E8E4DE';
                }
              }}
            />
            {errors.prenom && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.prenom}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1A1A2E',
                marginBottom: '6px',
              }}
            >
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1px solid ${errors.nom ? '#EF4444' : '#E8E4DE'}`,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#1A1A2E',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.nom) {
                  e.currentTarget.style.borderColor = '#C75B39';
                }
              }}
              onBlur={(e) => {
                if (!errors.nom) {
                  e.currentTarget.style.borderColor = '#E8E4DE';
                }
              }}
            />
            {errors.nom && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.nom}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1A1A2E',
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1px solid ${errors.email ? '#EF4444' : '#E8E4DE'}`,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#1A1A2E',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = '#C75B39';
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = '#E8E4DE';
                }
              }}
            />
            {errors.email && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1A1A2E',
                marginBottom: '6px',
              }}
            >
              T\u00e9l\u00e9phone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1px solid ${errors.telephone ? '#EF4444' : '#E8E4DE'}`,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#1A1A2E',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.telephone) {
                  e.currentTarget.style.borderColor = '#C75B39';
                }
              }}
              onBlur={(e) => {
                if (!errors.telephone) {
                  e.currentTarget.style.borderColor = '#E8E4DE';
                }
              }}
            />
            {errors.telephone && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.telephone}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1A1A2E',
                marginBottom: '6px',
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1px solid ${errors.motDePasse ? '#EF4444' : '#E8E4DE'}`,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#1A1A2E',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.motDePasse) {
                  e.currentTarget.style.borderColor = '#C75B39';
                }
              }}
              onBlur={(e) => {
                if (!errors.motDePasse) {
                  e.currentTarget.style.borderColor = '#E8E4DE';
                }
              }}
            />
            {errors.motDePasse && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.motDePasse}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1A1A2E',
                marginBottom: '6px',
              }}
            >
              Confirmer mot de passe
            </label>
            <input
              type="password"
              name="confirmerMotDePasse"
              value={formData.confirmerMotDePasse}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '14px',
                border: `1px solid ${errors.confirmerMotDePasse ? '#EF4444' : '#E8E4DE'}`,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#1A1A2E',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.confirmerMotDePasse) {
                  e.currentTarget.style.borderColor = '#C75B39';
                }
              }}
              onBlur={(e) => {
                if (!errors.confirmerMotDePasse) {
                  e.currentTarget.style.borderColor = '#E8E4DE';
                }
              }}
            />
            {errors.confirmerMotDePasse && (
              <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                {errors.confirmerMotDePasse}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input
              type="checkbox"
              id="accepteTermes"
              checked={accepteTermes}
              onChange={(e) => {
                setAccepteTermes(e.target.checked);
                if (errors.termes) {
                  setErrors((prev) => ({
                    ...prev,
                    termes: '',
                  }));
                }
              }}
              style={{
                marginTop: '3px',
                cursor: 'pointer',
                accentColor: '#C75B39',
                width: '18px',
                height: '18px',
                minWidth: '18px',
              }}
            />
            <label htmlFor="accepteTermes" style={{ fontSize: '13px', color: '#6B7280', cursor: 'pointer' }}>
              J'accepte les{' '}
              <Link href="/cgv" style={{ color: '#C75B39', textDecoration: 'none', fontWeight: '500' }}>
                CGV
              </Link>
            </label>
          </div>
          {errors.termes && (
            <span style={{ fontSize: '12px', color: '#EF4444', marginBottom: '16px', display: 'block' }}>
              {errors.termes}
            </span>
          )}

          {errors.submit && (
            <div
              style={{
                padding: '12px',
                backgroundColor: '#FEE2E2',
                borderRadius: '6px',
                color: '#EF4444',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              fontWeight: '600',
              backgroundColor: '#C75B39',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s, transform 0.15s',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '16px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#B84D2F';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#C75B39';
              }
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
              }
            }}
            onMouseUp={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }
            }}
          >
            {isLoading ? 'Inscription en cours...' : "S'inscrire"}
          </button>

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
            D\u00e9j\u00e0 un compte ?{' '}
            <Link
              href="/connexion"
              style={{
                color: '#C75B39',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
