'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Add authentication logic here
      console.log('Login attempt:', { email, password });
    } catch (err) {
      setError('Erreur de connexion. Veuillez r\u00e9essayer.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FAF7F2',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center' as const,
    },
    logo: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1A1A2E',
      marginBottom: '10px',
      letterSpacing: '-0.5px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#1A1A2E',
      margin: '0 0 30px 0',
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: '#FFFFFF',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(26, 26, 46, 0.08)',
      border: '1px solid #E8E4DE',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1A1A2E',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      fontSize: '14px',
      border: '1px solid #E8E4DE',
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      color: '#1A1A2E',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    inputFocus: {
      borderColor: '#C75B39',
      boxShadow: '0 0 0 3px rgba(199, 91, 57, 0.1)',
      outline: 'none',
    },
    passwordWrapper: {
      position: 'relative' as const,
    },
    togglePassword: {
      position: 'absolute' as const,
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6B7280',
      fontSize: '16px',
      padding: '4px',
    },
    forgotLink: {
      fontSize: '14px',
      color: '#C75B39',
      textDecoration: 'none',
      marginTop: '12px',
      display: 'inline-block',
      transition: 'opacity 0.2s',
    },
    submitButton: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: '#C75B39',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, opacity 0.2s',
      marginTop: '28px',
    },
    submitButtonHover: {
      backgroundColor: '#B3491D',
    },
    submitButtonDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '28px 0',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#E8E4DE',
    },
    dividerText: {
      margin: '0 12px',
      fontSize: '13px',
      color: '#6B7280',
    },
    signupLink: {
      textAlign: 'center' as const,
      fontSize: '14px',
      color: '#6B7280',
      marginTop: '20px',
    },
    signupLinkA: {
      color: '#C75B39',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'opacity 0.2s',
    },
    errorMessage: {
      padding: '12px',
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
      borderRadius: '6px',
      fontSize: '13px',
      marginBottom: '20px',
      border: '1px solid #FECACA',
    },
    backLink: {
      marginTop: '24px',
      fontSize: '13px',
    },
    backLinkA: {
      color: '#6B7280',
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>Eventy Life</div>
        <h1 style={styles.title}>Connexion</h1>
      </div>

      <div style={styles.formContainer}>
        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="votre@email.com"
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Mot de passe
            </label>
            <div style={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  ...styles.input,
                  paddingRight: '40px',
                }}
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                disabled={loading}
              />
              <button
                type="button"
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '&#128994;' : '&#128065;'}
              </button>
            </div>
            <Link href="/motdepasse-oublie" style={styles.forgotLink}>
              Mot de passe oubli&#233; ?
            </Link>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {}),
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C75B39';
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>ou</span>
          <div style={styles.dividerLine}></div>
        </div>

        <div style={styles.signupLink}>
          Pas encore de compte ?{' '}
          <Link href="/inscription" style={styles.signupLinkA}>
            Cr&#233;er un compte
          </Link>
        </div>
      </div>

      <div style={styles.backLink}>
        <Link href="/" style={styles.backLinkA}>
          Retour &#224; l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
