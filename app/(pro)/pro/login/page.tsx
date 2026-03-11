/**
 * Page de connexion Pro
 */
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertCircle, Loader } from 'lucide-react'
export default function ProLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la connexion')
      }

      router.push('/pro')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '448px' }}>
        <div className="pro-panel" style={{ padding: '32px' }}>
          <h1 className="pro-page-title" style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>Espace Pro</h1>
          <p style={{ textAlign: 'center', color: '#8896A6', marginBottom: '32px' }}>Connexion organisateurs</p>

          {error && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--pro-coral)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                Email professionnel
              </label>
              <input
                type="email"
                autoComplete="email"
                id="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="pro@eventylife.fr"
                className="pro-input"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                Mot de passe
              </label>
              <input
                type="password"
                autoComplete="current-password"
                id="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="••••••••"
                className="pro-input"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pro-btn-sun"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link href="/pro/forgot-password" style={{ fontSize: '14px', color: 'var(--pro-ocean)', textDecoration: 'none', fontWeight: 500 }}>
              Mot de passe oublié?
            </Link>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #E0E0E0', paddingTop: '24px' }}>
            <p style={{ color: '#8896A6' }}>
              Devenir partenaire?{' '}
              <Link href="/" style={{ color: 'var(--pro-ocean)', textDecoration: 'none', fontWeight: 500 }}>
                Nous contacter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
