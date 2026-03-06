'use client';

import { useEffect, useState } from 'react';

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

        const data = await res.json();
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
      } catch (err) {
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

      const updated = await res.json();
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
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
        const data = await res.json();
        throw new Error(data.message || 'Mot de passe actuel incorrect');
      }

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err) {
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

      const data = await res.json();
      setTwoFASecret(data.secret);
      setTwoFAQrUrl(data.qrCodeUrl);
      setShow2FAModal(true);
    } catch (err) {
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
        const data = await res.json();
        throw new Error(data.message || 'Code invalide');
      }

      setTwoFAEnabled(true);
      setShow2FAModal(false);
      setTwoFACode('');
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      // Rollback
      setPreferences(preferences);
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSavingPreferences(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-12 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center text-red-600">Profil non disponible</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon Profil</h1>
        <p className="text-slate-600">Gérez vos informations personnelles</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Profil mis à jour avec succès!
        </div>
      )}

      {/* Formulaire principal */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Informations personnelles</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (lecture seule) */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Adresse email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
            />
            <p className="text-xs text-slate-500 mt-1">
              Votre email ne peut pas être modifié
            </p>
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Votre prénom"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Votre nom"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="+33 6 XX XX XX XX"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      {/* Section sécurité */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Sécurité</h2>

        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-left font-semibold"
          >
            Changer mon mot de passe
          </button>
          <button
            onClick={twoFAEnabled ? handleDisable2FA : handleInit2FA}
            disabled={enabling2FA}
            className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-left font-semibold disabled:opacity-50"
          >
            {enabling2FA
              ? 'Chargement...'
              : twoFAEnabled
                ? 'Désactiver l\'authentification à deux facteurs'
                : 'Activer l\'authentification à deux facteurs'}
          </button>
          {twoFAEnabled && (
            <p className="text-sm text-green-700 font-medium ml-1">2FA activé</p>
          )}
        </div>
      </div>

      {/* Modal changement mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Changer mon mot de passe</h3>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                Mot de passe modifié avec succès !
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
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
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Configurer la double authentification</h3>

            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)
              </p>

              {twoFAQrUrl && (
                <div className="flex justify-center p-4 bg-white border border-slate-200 rounded-lg">
                  <img src={twoFAQrUrl} alt="QR Code 2FA" className="w-48 h-48" />
                </div>
              )}

              {twoFASecret && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Clé secrète (saisie manuelle) :</p>
                  <p className="text-sm font-mono font-bold text-slate-900 break-all">{twoFASecret}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Code de vérification</label>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleVerify2FA}
                  disabled={enabling2FA || twoFACode.length !== 6}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {enabling2FA ? 'Vérification...' : 'Activer'}
                </button>
                <button
                  onClick={() => {
                    setShow2FAModal(false);
                    setTwoFACode('');
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section préférences */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Préférences
          {savingPreferences && (
            <span className="ml-2 text-sm font-normal text-slate-500">Sauvegarde...</span>
          )}
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <label className="font-semibold text-slate-900">
              Notifications par email
            </label>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <label className="font-semibold text-slate-900">
              Mises à jour sur les promotions
            </label>
            <input
              type="checkbox"
              checked={preferences.promotionUpdates}
              onChange={(e) => handlePreferenceChange('promotionUpdates', e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <label className="font-semibold text-slate-900">
              Partager mes données avec les partenaires
            </label>
            <input
              type="checkbox"
              checked={preferences.shareDataWithPartners}
              onChange={(e) => handlePreferenceChange('shareDataWithPartners', e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
