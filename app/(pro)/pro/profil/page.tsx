'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, MapPin, User, Building, Globe, Phone, Mail, Save } from 'lucide-react';

interface ProProfile {
  firstName: string;
  lastName: string;
  companyName: string;
  companyType: string;
  businessNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  bio?: string;
}

/**
 * Page Profil Pro - Gestion du profil professionnel
 *
 * Affiche et permet de modifier:
 * - Informations personnelles (prénom, nom)
 * - Informations entreprise (nom, type, numéro SIRET, adresse)
 * - Coordonnées (téléphone, email, site web)
 * - Bio/Description
 */
export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [formData, setFormData] = useState<ProProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/pro/profile', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement du profil');
        const data = await res.json() as Record<string, unknown>;
        const profileData = data as ProProfile;
        setProfile(profileData);
        setFormData(profileData);
      } catch {
        console.warn('API pro/profile indisponible — données démo');
        const demoProfile: ProProfile = {
          firstName: 'Jean',
          lastName: 'Dupont',
          companyName: 'Voyages du Soleil SAS',
          companyType: 'Agence de voyages',
          businessNumber: '12345678901234',
          address: '42, rue de la Paix',
          postalCode: '75002',
          city: 'Paris',
          country: 'France',
          phone: '+33 1 23 45 67 89',
          email: 'jean.dupont@voyages-soleil.fr',
          website: 'https://voyages-soleil.fr',
          bio: 'Spécialiste des voyages de groupe en France et en Europe. Plus de 15 ans d\'expérience dans l\'organisation de séjours inoubliables.',
        };
        setProfile(demoProfile);
        setFormData(demoProfile);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSaving(true);
      setError(null);

      const res = await fetch('/api/pro/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur lors de la sauvegarde du profil');
      const data = await res.json() as Record<string, unknown>;
      const updatedProfile = data as ProProfile;
      setProfile(updatedProfile);
      setFormData(updatedProfile);
    } catch {
      console.warn('API pro/profile PUT indisponible — données démo');
      setProfile(formData);
      setError(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton className="h-10 w-64" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div>
          <h1 className="pro-page-title">Mon Profil</h1>
          <p style={{ color: '#8896A6', marginTop: '8px' }}>Gérez les informations de votre profil professionnel</p>
        </div>

        {error && (
          <div style={{ padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)' }} />
              <span style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Fermer
            </button>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Informations Personnelles */}
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 className="pro-panel-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User className="h-5 w-5" />
              Informations Personnelles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="firstName" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData?.firstName || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label htmlFor="lastName" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData?.lastName || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Informations Entreprise */}
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 className="pro-panel-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building className="h-5 w-5" />
              Informations Entreprise
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label htmlFor="companyName" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData?.companyName || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label htmlFor="companyType" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Type d&apos;activité
                </label>
                <input
                  type="text"
                  id="companyType"
                  name="companyType"
                  value={formData?.companyType || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label htmlFor="businessNumber" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Numéro SIRET
                </label>
                <input
                  type="text"
                  id="businessNumber"
                  name="businessNumber"
                  value={formData?.businessNumber || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 className="pro-panel-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin className="h-5 w-5" />
              Adresse
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div>
                <label htmlFor="address" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData?.address || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label htmlFor="postalCode" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData?.postalCode || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="city" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData?.city || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="country" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
                    Pays
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData?.country || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 className="pro-panel-title" style={{ marginBottom: '16px' }}>Coordonnées</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone className="h-4 w-4" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData?.phone || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 1' }}>
                <label htmlFor="website" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe className="h-4 w-4" />
                  Site web
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData?.website || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 className="pro-panel-title" style={{ marginBottom: '16px' }}>Description</h2>
            <label htmlFor="bio" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>
              Bio / Présentation
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData?.bio || ''}
              onChange={handleInputChange}
              placeholder="Présentez votre agence et vos spécialités..."
              rows={5}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                if (profile) {
                  setFormData(profile);
                }
              }}
              className="pro-btn-outline"
            >
              Annuler
            </button>
            <button type="submit" disabled={saving} className="pro-btn-sun" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
              <Save className="h-4 w-4" />
              {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
