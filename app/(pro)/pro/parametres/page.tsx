'use client';

import { useState, useEffect } from 'react';
import { sanitizeImageUrl } from '@/lib/security/url-validation';

interface ProProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  siret: string;
  businessName: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  website?: string;
  description?: string;
  logo?: string;
}

/**
 * Page Paramètres Pro - Informations générales de l'agence
 *
 * Affiche:
 * - Informations de l'agence
 * - Coordonnées
 * - Données juridiques (SIRET)
 * - Logo et description
 *
 * États UI:
 * - Loading: Skeleton
 * - Error: Données démo affichées
 * - Data: Formulaire de profil
 */
export default function ParametresPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pro/profile', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement du profil');

        const data = await res.json() as ProProfile;
        setProfile(data);
      } catch {
        console.warn('API profil indisponible — données démo');
        setProfile({
          id: 'pro_001',
          name: 'Agence Voyages Méditerranée',
          email: 'contact@agence-voyages.fr',
          phone: '+33 1 23 45 67 89',
          siret: '12345678901234',
          businessName: 'Agence Voyages Méditerranée SARL',
          address: '123 Rue de la Paix',
          zipCode: '75001',
          city: 'Paris',
          country: 'France',
          website: 'https://www.agence-voyages.fr',
          description: 'Spécialiste en voyages de groupe pour particuliers et entreprises',
          logo: '/logos/demo-agency.png',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 384, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 className="pro-page-title">Paramètres généraux</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>Gérez les informations de votre agence</p>
        </div>

        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="pro-panel-title">Informations de l&apos;agence</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Données principales de votre compte</p>
            </div>
            <button
              type="button"
              onClick={() => setEditable(!editable)}
              className={editable ? 'pro-btn-outline' : 'pro-btn-sun'}
            >
              {editable ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Logo */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Logo</label>
              {profile?.logo && (
                <div style={{ width: '120px', height: '120px', backgroundColor: '#F5F5F5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  {/* SECURITY: URL validated against XSS injection via sanitizeImageUrl */}
                  <img src={sanitizeImageUrl(profile.logo)} alt="Logo agence" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </div>
              )}
              {editable && (
                <input
                  type="file"
                  accept="image/*"
                  disabled={!editable}
                  style={{ fontSize: '14px' }}
                />
              )}
            </div>

            {/* Nom */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Nom de l&apos;agence</label>
              <input
                type="text"
                value={profile?.name || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* Nom entreprise */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Raison sociale</label>
              <input
                type="text"
                value={profile?.businessName || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* Téléphone */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Téléphone</label>
              <input
                type="tel"
                value={profile?.phone || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* SIRET */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>SIRET</label>
              <input
                type="text"
                value={profile?.siret || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* Adresse */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Adresse</label>
              <input
                type="text"
                value={profile?.address || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* Localité */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Code postal</label>
                <input
                  type="text"
                  value={profile?.zipCode || ''}
                  disabled={!editable}
                  className="pro-input"
                  readOnly={!editable}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Ville</label>
                <input
                  type="text"
                  value={profile?.city || ''}
                  disabled={!editable}
                  className="pro-input"
                  readOnly={!editable}
                />
              </div>
            </div>

            {/* Pays */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Pays</label>
              <input
                type="text"
                value={profile?.country || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* Site web */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Site web</label>
              <input
                type="url"
                value={profile?.website || ''}
                disabled={!editable}
                className="pro-input"
                readOnly={!editable}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Description</label>
              <textarea
                value={profile?.description || ''}
                disabled={!editable}
                readOnly={!editable}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  minHeight: '120px',
                  backgroundColor: editable ? '#FFFFFF' : '#F9FAFB',
                  cursor: editable ? 'text' : 'default',
                }}
              />
            </div>

            {editable && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="pro-btn-outline" onClick={() => setEditable(false)}>
                  Annuler
                </button>
                <button type="button" className="pro-btn-sun">
                  Enregistrer les modifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
