'use client';

import { useEffect, useState } from 'react';
import { ZodError } from 'zod';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
import { profileSchema } from '@/lib/validations/profile';
import { changePasswordSchema, zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';
import { ToastNotification } from '@/components/ui/toast-notification';
import { FocusTrap } from '@/components/a11y/focus-trap';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 2FA
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [twoFAQrUrl, setTwoFAQrUrl] = useState<string | null>(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [showConfirmDisable2FA, setShowConfirmDisable2FA] = useState(false);

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

        const data = (await res.json() as unknown) as ProfileData;
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
        logger.warn('API indisponible, utilisation des données de démonstration');
        const fallback = {
          id: 'usr_client_001',
          email: 'client@eventylife.fr',
          firstName: 'Jean',
          lastName: 'Martin',
          phone: '+33 6 12 34 56 78',
          avatarUrl: '',
        } as ProfileData;
        setProfile(fallback);
        setForm({ firstName: fallback.firstName, lastName: fallback.lastName, phone: fallback.phone });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    setSuccess(false);

    try {
      profileSchema.parse(form);
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    try {
      setSaving(true);

      const res = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      const updated = (await res.json() as unknown) as ProfileData;
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --- Changement mot de passe ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordErrors({});
    setPasswordSuccess(false);

    try {
      changePasswordSchema.parse({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmPassword,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        setPasswordErrors(zodErrorsToRecord(err));
        return;
      }
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
        const data = (await res.json() as unknown) as Record<string, unknown>;
        throw new Error(data.message || 'Mot de passe actuel incorrect');
      }

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      setPasswordError(extractErrorMessage(err));
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

      const data = (await res.json() as unknown) as Record<string, unknown>;
      setTwoFASecret(data.secret as string);
      setTwoFAQrUrl(data.qrCodeUrl as string);
      setShow2FAModal(true);
    } catch (err: unknown) {
      setToast({ type: 'error', message: extractErrorMessage(err) });
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
        const data = (await res.json() as unknown) as Record<string, unknown>;
        throw new Error(data.message || 'Code invalide');
      }

      setTwoFAEnabled(true);
      setShow2FAModal(false);
      setTwoFACode('');
    } catch (err: unknown) {
      setToast({ type: 'error', message: extractErrorMessage(err) });
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur');
      setTwoFAEnabled(false);
      setShowConfirmDisable2FA(false);
    } catch (err: unknown) {
      setToast({ type: 'error', message: extractErrorMessage(err) });
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
      setToast({ type: 'error', message: extractErrorMessage(err) });
    } finally {
      setSavingPreferences(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream, #FAF7F2)', padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: 32, width: 240, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: 48, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              ))}
            </div>
            <div style={{ height: 120, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return <div className="text-center font-medium" style={{ color: 'var(--terra, #DC2626)' }}>Profil non disponible</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
      {/* En-tête */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mon Profil</h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Gérez vos informations personnelles</p>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--terra-soft, #FEF2F2)',
          border: '1.5px solid #E5E0D8',
          borderRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'var(--terra, #C75B39)', fontWeight: 500 }}>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            color: 'var(--terra, #C75B39)',
            border: '1px solid var(--terra, #C75B39)',
            borderRadius: '8px',
            background: 'transparent',
            cursor: 'pointer',
          }}>
            Fermer
          </button>
        </div>
      )}
      {success && (
        <div className="p-6 rounded-2xl" style={{ background: '#DCFCE7', border: `1.5px solid ${'#166534'}` }}>
          <p className="text-sm font-medium" style={{ color: '#166534' }}>✓ Profil mis à jour avec succès!</p>
        </div>
      )}

      {/* Formulaire principal */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        <h2 className="font-bold text-base mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>Informations personnelles</h2>

        <form aria-label="Modifier le profil" onSubmit={handleSubmit} className="space-y-6">
          {/* Email (lecture seule) */}
          <div>
            <label htmlFor="profile-email" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Adresse email
            </label>
            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: 'var(--cream, #FAF7F2)', border: '1.5px solid #E5E0D8', color: '#6B7280' }}
            />
            <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
              Votre email ne peut pas être modifié
            </p>
          </div>

          {/* Prénom */}
          <div>
            <label htmlFor="profile-firstName" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Prénom
            </label>
            <input
              id="profile-firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, firstName: (e.target as HTMLInputElement).value })}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: '#fff', border: `1.5px solid ${errors.firstName ? '#DC2626' : '#E5E0D8'}`, color: 'var(--navy, #1A1A2E)' }}
              placeholder="Votre prénom"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              onFocus={(e) => {
                if (!errors.firstName) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.firstName ? '#DC2626' : '#E5E0D8';
              }}
            />
            <FormFieldError error={errors.firstName} id="firstName-error" />
          </div>

          {/* Nom */}
          <div>
            <label htmlFor="profile-lastName" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Nom
            </label>
            <input
              id="profile-lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, lastName: (e.target as HTMLInputElement).value })}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: '#fff', border: `1.5px solid ${errors.lastName ? '#DC2626' : '#E5E0D8'}`, color: 'var(--navy, #1A1A2E)' }}
              placeholder="Votre nom"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              onFocus={(e) => {
                if (!errors.lastName) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.lastName ? '#DC2626' : '#E5E0D8';
              }}
            />
            <FormFieldError error={errors.lastName} id="lastName-error" />
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="profile-phone" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Téléphone
            </label>
            <input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: (e.target as HTMLInputElement).value })}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{ background: '#fff', border: `1.5px solid ${errors.phone ? '#DC2626' : '#E5E0D8'}`, color: 'var(--navy, #1A1A2E)' }}
              placeholder="+33 6 XX XX XX XX"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              onFocus={(e) => {
                if (!errors.phone) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.phone ? '#DC2626' : '#E5E0D8';
              }}
            />
            <FormFieldError error={errors.phone} id="phone-error" />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'var(--terra, #C75B39)', color: '#fff', opacity: saving ? 0.6 : 1 }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.background = '#D97B5E';
                  e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.background = 'var(--terra, #C75B39)';
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
              style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Sécurité</h2>

        <div className="space-y-3">
          <button type="button"
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left"
            style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            Changer mon mot de passe
          </button>
          <button type="button"
            onClick={twoFAEnabled ? () => setShowConfirmDisable2FA(true) : handleInit2FA}
            disabled={enabling2FA}
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left"
            style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8', opacity: enabling2FA ? 0.6 : 1 }}
            onMouseEnter={(e) => {
              if (!enabling2FA) {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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
            <p className="text-xs font-medium" style={{ color: '#166534' }}>✓ 2FA activé</p>
          )}
        </div>
      </div>

      {/* Modal changement mot de passe */}
      {showPasswordModal && (
        <FocusTrap
          onEscape={() => setShowPasswordModal(false)}
          role="dialog"
          aria-modal={true}
          aria-labelledby="password-modal-title"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: '#fff' }}>
            <h3 id="password-modal-title" className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Changer mon mot de passe</h3>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl text-xs" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5', color: 'var(--terra, #DC2626)' }}>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl text-xs" style={{ background: '#DCFCE7', border: `1.5px solid ${'#166534'}`, color: '#166534' }}>
                Mot de passe modifié avec succès !
              </div>
            )}

            <form aria-label="Changer le mot de passe" onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="profile-currentPassword" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Mot de passe actuel</label>
                <input
                  id="profile-currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, currentPassword: (e.target as HTMLInputElement).value })}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: '#fff', border: `1.5px solid ${passwordErrors.currentPassword ? '#DC2626' : '#E5E0D8'}`, color: 'var(--navy, #1A1A2E)' }}
                  aria-invalid={!!passwordErrors.currentPassword}
                  aria-describedby={passwordErrors.currentPassword ? 'currentPassword-error' : undefined}
                  onFocus={(e) => {
                    if (!passwordErrors.currentPassword) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = passwordErrors.currentPassword ? '#DC2626' : '#E5E0D8';
                  }}
                  required
                />
                <FormFieldError error={passwordErrors.currentPassword} id="currentPassword-error" />
              </div>
              <div>
                <label htmlFor="profile-newPassword" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Nouveau mot de passe</label>
                <input
                  id="profile-newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, newPassword: (e.target as HTMLInputElement).value })}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: '#fff', border: `1.5px solid ${passwordErrors.newPassword ? '#DC2626' : '#E5E0D8'}`, color: 'var(--navy, #1A1A2E)' }}
                  aria-invalid={!!passwordErrors.newPassword}
                  aria-describedby={passwordErrors.newPassword ? 'newPassword-error' : undefined}
                  onFocus={(e) => {
                    if (!passwordErrors.newPassword) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = passwordErrors.newPassword ? '#DC2626' : '#E5E0D8';
                  }}
                  required
                  minLength={8}
                />
                <FormFieldError error={passwordErrors.newPassword} id="newPassword-error" />
              </div>
              <div>
                <label htmlFor="profile-confirmPassword" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Confirmer le mot de passe</label>
                <input
                  id="profile-confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, confirmPassword: (e.target as HTMLInputElement).value })}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: '#fff', border: `1.5px solid ${passwordErrors.confirmNewPassword ? '#DC2626' : '#E5E0D8'}`, color: 'var(--navy, #1A1A2E)' }}
                  aria-invalid={!!passwordErrors.confirmNewPassword}
                  aria-describedby={passwordErrors.confirmNewPassword ? 'confirmNewPassword-error' : undefined}
                  onFocus={(e) => {
                    if (!passwordErrors.confirmNewPassword) e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = passwordErrors.confirmNewPassword ? '#DC2626' : '#E5E0D8';
                  }}
                  required
                  minLength={8}
                />
                <FormFieldError error={passwordErrors.confirmNewPassword} id="confirmNewPassword-error" />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: 'var(--terra, #C75B39)', color: '#fff', opacity: changingPassword ? 0.6 : 1 }}
                  onMouseEnter={(e) => {
                    if (!changingPassword) {
                      e.currentTarget.style.background = '#D97B5E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!changingPassword) {
                      e.currentTarget.style.background = 'var(--terra, #C75B39)';
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
                  style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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

      {/* Confirmation banner désactivation 2FA */}
      {showConfirmDisable2FA && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#FFF7ED',
          border: '1.5px solid #FB923C',
          borderRadius: '14px',
          marginBottom: '1rem',
        }}>
          <p style={{ fontWeight: 600, color: '#9A3412', marginBottom: '0.75rem' }}>
            Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={handleDisable2FA} style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: '#DC2626',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}>
              Confirmer
            </button>
            <button type="button" onClick={() => setShowConfirmDisable2FA(false)} style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: 'white',
              color: '#6B7280',
              borderRadius: '8px',
              fontWeight: 500,
              border: '1px solid #D1D5DB',
              cursor: 'pointer',
            }}>
              Annuler
            </button>
          </div>
        </FocusTrap>
      )}

      {/* Modal 2FA setup */}
      {show2FAModal && (
        <FocusTrap
          onEscape={() => setShow2FAModal(false)}
          role="dialog"
          aria-modal={true}
          aria-labelledby="2fa-modal-title"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: '#fff' }}>
            <h3 id="2fa-modal-title" className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Configurer la double authentification</h3>

            <div className="space-y-4">
              <p className="text-xs" style={{ color: '#6B7280' }}>
                Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)
              </p>

              {twoFAQrUrl && (
                <div className="flex justify-center p-4 rounded-xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- QR code is a data URL, next/image incompatible */}
                  <img src={twoFAQrUrl} alt="QR Code 2FA" className="w-48 h-48" />
                </div>
              )}

              {twoFASecret && (
                <div className="p-3 rounded-xl" style={{ background: 'var(--cream, #FAF7F2)' }}>
                  <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Clé secrète (saisie manuelle) :</p>
                  <p className="text-xs font-mono font-bold" style={{ color: 'var(--navy, #1A1A2E)', wordBreak: 'break-all' }}>{twoFASecret}</p>
                </div>
              )}

              <div>
                <label htmlFor="profile-2fa-code" className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Code de vérification</label>
                <input
                  id="profile-2fa-code"
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  value={twoFACode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwoFACode((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl text-sm text-center transition-all"
                  style={{ background: '#fff', border: '1.5px solid #E5E0D8', color: 'var(--navy, #1A1A2E)', letterSpacing: '0.1em', fontSize: '1.125rem' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E0D8';
                  }}
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2">
                <button type="button"
                  onClick={handleVerify2FA}
                  disabled={enabling2FA || twoFACode.length !== 6}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: 'var(--terra, #C75B39)', color: '#fff', opacity: enabling2FA || twoFACode.length !== 6 ? 0.6 : 1 }}
                  onMouseEnter={(e) => {
                    if (!enabling2FA && twoFACode.length === 6) {
                      e.currentTarget.style.background = '#D97B5E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!enabling2FA && twoFACode.length === 6) {
                      e.currentTarget.style.background = 'var(--terra, #C75B39)';
                    }
                  }}
                >
                  {enabling2FA ? 'Vérification...' : 'Activer'}
                </button>
                <button type="button"
                  onClick={() => {
                    setShow2FAModal(false);
                    setTwoFACode('');
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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
        </FocusTrap>
      )}

      {/* Section préférences */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
          Préférences
          {savingPreferences && (
            <span className="ml-2 text-xs font-normal" style={{ color: '#6B7280' }}>Sauvegarde...</span>
          )}
        </h2>

        <fieldset className="space-y-3" style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="sr-only">Préférences</legend>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--cream, #FAF7F2)' }}>
            <label htmlFor="pref-emailNotifications" className="font-semibold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Notifications par email
            </label>
            <input
              id="pref-emailNotifications"
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('emailNotifications', (e.target as HTMLInputElement).checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--terra, #C75B39)' }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--cream, #FAF7F2)' }}>
            <label htmlFor="pref-promotionUpdates" className="font-semibold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Mises à jour sur les promotions
            </label>
            <input
              id="pref-promotionUpdates"
              type="checkbox"
              checked={preferences.promotionUpdates}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('promotionUpdates', (e.target as HTMLInputElement).checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--terra, #C75B39)' }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--cream, #FAF7F2)' }}>
            <label htmlFor="pref-shareData" className="font-semibold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Partager mes données avec les partenaires
            </label>
            <input
              id="pref-shareData"
              type="checkbox"
              checked={preferences.shareDataWithPartners}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('shareDataWithPartners', (e.target as HTMLInputElement).checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{ accentColor: 'var(--terra, #C75B39)' }}
            />
          </div>
        </fieldset>
      </div>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
