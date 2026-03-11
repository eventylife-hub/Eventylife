'use client';

import { useEffect, useState } from 'react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Mon Profil | Eventy Life',
  description: 'Gérez votre profil et vos préférences',
};

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
}

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
}

interface PreferencesState {
  emailNotifications: boolean;
  promotionUpdates: boolean;
  shareDataWithPartners: boolean;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sécurité
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 2FA
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [twoFAQrUrl, setTwoFAQrUrl] = useState<string | null>(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);

  // Préférences
  const [preferences, setPreferences] = useState<PreferencesState>({
    emailNotifications: true,
    promotionUpdates: true,
    shareDataWithPartners: false,
  });
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/client/profile', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Impossible de charger le profil');

        const data = (await res.json() as unknown) as unknown;
        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
        });

        // Charger préférences
        if (data.preferences) {
          setPreferences({
            emailNotifications: data.preferences.emailNotifications ?? true,
            promotionUpdates: data.preferences.promotionUpdates ?? true,
            shareDataWithPartners: data.preferences.shareDataWithPartners ?? false,
          });
        }

        // Charger état 2FA
        if (data.twoFactorEnabled) {
          setTwoFAEnabled(true);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const res = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      const updated = (await res.json() as unknown) as unknown;
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  // --- Changement mot de passe ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setChangingPassword(true);
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const data = (await res.json() as unknown) as unknown;
        throw new Error(data.message || 'Mot de passe actuel incorrect');
      }

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setChangingPassword(false);
    }
  };

  // --- 2FA Setup ---
  const handleInit2FA = async () => {
    try {
      setEnabling2FA(true);
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors de la configuration 2FA');

      const data = (await res.json() as unknown) as unknown;
      setTwoFASecret(data.secret);
      setTwoFAQrUrl(data.qrCodeUrl);
      setShow2FAModal(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setEnabling2FA(true);
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: twoFACode }),
      });

      if (!res.ok) {
        const data = (await res.json() as unknown) as unknown;
        throw new Error(data.message || 'Code invalide');
      }

      setTwoFAEnabled(true);
      setShow2FAModal(false);
      setTwoFACode('');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ?')) return;
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur');
      setTwoFAEnabled(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  // --- Préférences ---
  const handlePreferenceChange = async (key: keyof PreferencesState, value: boolean) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);

    try {
      setSavingPreferences(true);
      const res = await fetch('/api/client/profile/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Erreur de sauvegarde');
    } catch (err: unknown) {
      // Rollback
      setPreferences(preferences);
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingPreferences(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
        <div className="h-8 rounded-xl skeleton" style={{ width: '40%' }} />
        <div className="space-y-4">
          {[...Array(3)].map((_: unknown, i: number) => (
            <div key={i} className="h-10 rounded-xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center font-medium" style={{ color: 'var(--terra, #DC2626)' }}>Profil non disponible</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
      {/* En-tête */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Mon Profil</h1>
        <p className="text-sm mt-2" style={{ color: C.muted }}>Gérez vos informations personnelles</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #FCA5A5` }}>
          <p className="text-sm font-medium" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
        </div>
      )}
      {success && (
        <div className="p-6 rounded-2xl" style={{ background: C.forestBg, border: `1.5px solid ${C.forest}` }}>
          <p className="text-sm font-medium" style={{ color: C.forest }}>✓ Profil mis à jour avec succès!</p>
        </div>
      )}

      {/* Formulaire principal */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        <h2 className="font-bold text-base mb-6" style={{ color: C.navy }}>Informations personnelles</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (lecture seule) */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>
              Adresse email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: C.cream, border: `1.5px solid ${C.border}`, color: C.muted }}
            />
            <p className="text-xs mt-2" style={{ color: C.muted }}>
              Votre email ne peut pas être modifié
            </p>
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>
              Prénom
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, firstName: (e.target as HTMLInputElement).value })}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.navy }}
              placeholder="Votre prénom"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.terra;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>
              Nom
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, lastName: (e.target as HTMLInputElement).value })}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.navy }}
              placeholder="Votre nom"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.terra;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: (e.target as HTMLInputElement).value })}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.navy }}
              placeholder="+33 6 XX XX XX XX"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.terra;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: C.terra, color: '#fff', opacity: saving ? 0.6 : 1 }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.background = C.terraLight;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${C.terra}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.background = C.terra;
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (profile) {
                  setForm({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    phone: profile.phone || '',
                  });
                }
              }}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.terraSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      {/* Section sécurité */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>Sécurité</h2>

        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left"
            style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraSoft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            Changer mon mot de passe
          </button>
          <button
            onClick={twoFAEnabled ? handleDisable2FA : handleInit2FA}
            disabled={enabling2FA}
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left"
            style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}`, opacity: enabling2FA ? 0.6 : 1 }}
            onMouseEnter={(e) => {
              if (!enabling2FA) {
                e.currentTarget.style.background = C.terraSoft;
              }
            }}
            onMouseLeave={(e) => {
              if (!enabling2FA) {
                e.currentTarget.style.background = '#fff';
              }
            }}
          >
            {enabling2FA
              ? 'Chargement...'
              : twoFAEnabled
                ? 'Désactiver l\'authentification à deux facteurs'
                : 'Activer l\'authentification à deux facteurs'}
          </button>
          {twoFAEnabled && (
            <p className="text-xs font-medium" style={{ color: C.forest }}>✓ 2FA activé</p>
          )}
        </div>
      </div>

      {/* Modal changement mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: '#fff' }}>
            <h3 className="font-bold text-base mb-4" style={{ color: C.navy }}>Changer mon mot de passe</h3>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl text-xs" style={{ background: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #FCA5A5`, color: 'var(--terra, #DC2626)' }}>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl text-xs" style={{ background: C.forestBg, border: `1.5px solid ${C.forest}`, color: C.forest }}>
                Mot de passe modifié avec succès !
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, currentPassword: (e.target as HTMLInputElement).value })}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.navy }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, newPassword: (e.target as HTMLInputElement).value })}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.navy }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                  }}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, confirmPassword: (e.target as HTMLInputElement).value })}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.navy }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                  }}
                  required
                  minLength={8}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: C.terra, color: '#fff', opacity: changingPassword ? 0.6 : 1 }}
                  onMouseEnter={(e) => {
                    if (!changingPassword) {
                      e.currentTarget.style.background = C.terraLight;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!changingPassword) {
                      e.currentTarget.style.background = C.terra;
                    }
                  }}
                >
                  {changingPassword ? 'Modification...' : 'Modifier'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError(null);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.terraSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2FA setup */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: '#fff' }}>
            <h3 className="font-bold text-base mb-4" style={{ color: C.navy }}>Configurer la double authentification</h3>

            <div className="space-y-4">
              <p className="text-xs" style={{ color: C.muted }}>
                Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)
              </p>

              {twoFAQrUrl && (
                <div className="flex justify-center p-4 rounded-xl" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
                  <img src={twoFAQrUrl} alt="QR Code 2FA" className="w-48 h-48" />
                </div>
              )}

              {twoFASecret && (
                <div className="p-3 rounded-xl" style={{ background: C.cream }}>
                  <p className="text-xs mb-1" style={{ color: C.muted }}>Clé secrète (saisie manuelle) :</p>
                  <p className="text-xs font-mono font-bold" style={{ color: C.navy, wordBreak: 'break-all' }}>{twoFASecret}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.navy }}>Code de vérification</label>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwoFACode((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl text-sm text-center transition-all"
                  style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.navy, letterSpacing: '0.1em', fontSize: '1.125rem' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.terra;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                  }}
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleVerify2FA}
                  disabled={enabling2FA || twoFACode.length !== 6}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: C.terra, color: '#fff', opacity: enabling2FA || twoFACode.length !== 6 ? 0.6 : 1 }}
                  onMouseEnter={(e) => {
                    if (!enabling2FA && twoFACode.length === 6) {
                      e.currentTarget.style.background = C.terraLight;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!enabling2FA && twoFACode.length === 6) {
                      e.currentTarget.style.background = C.terra;
                    }
                  }}
                >
                  {enabling2FA ? 'Vérification...' : 'Activer'}
                </button>
                <button
                  onClick={() => {
                    setShow2FAModal(false);
                    setTwoFACode('');
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.terraSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section préférences */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>
          Préférences
          {savingPreferences && (
            <span className="ml-2 text-xs font-normal" style={{ color: C.muted }}>Sauvegarde...</span>
          )}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: C.cream }}>
            <label className="font-semibold text-sm" style={{ color: C.navy }}>
              Notifications par email
            </label>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('emailNotifications', (e.target as HTMLInputElement).checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: C.terra }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: C.cream }}>
            <label className="font-semibold text-sm" style={{ color: C.navy }}>
              Mises à jour sur les promotions
            </label>
            <input
              type="checkbox"
              checked={preferences.promotionUpdates}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('promotionUpdates', (e.target as HTMLInputElement).checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: C.terra }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: C.cream }}>
            <label className="font-semibold text-sm" style={{ color: C.navy }}>
              Partager mes données avec les partenaires
            </label>
            <input
              type="checkbox"
              checked={preferences.shareDataWithPartners}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('shareDataWithPartners', (e.target as HTMLInputElement).checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: C.terra }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
