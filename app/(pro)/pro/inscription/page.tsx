'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building,
  Users,
} from 'lucide-react';

/**
 * Page: Pro Inscription (/pro/inscription)
 * 
 * Formulaire d'enregistrement pour utilisateurs Pro (5 types):
 * - Step 1: Choisir type pro (cards radio avec descriptions)
 * - Step 2: Infos personnelles (nom, email, téléphone, SIRET pour MAGASIN)
 * - Step 3: Détails professionnels (zone, compétences, description)
 * - Step 4: Accepter Charte Eventy + CGV Pro + RGPD
 * - Submit → redirect /pro/onboarding avec status PENDING_VALIDATION
 * 
 * API: POST /api/pro/register
 */

type ProType = 'CREATOR' | 'INDEPENDANT' | 'VENDEUR' | 'MAGASIN' | 'ASSOCIATION';

interface InscriptionForm {
  proType: ProType | null;
  name: string;
  email: string;
  phone: string;
  siret?: string;
  zone: string;
  skills: string[];
  description: string;
  acceptCharte: boolean;
  acceptCGV: boolean;
  acceptRGPD: boolean;
}

const PRO_TYPES = [
  {
    id: 'CREATOR' as ProType,
    label: 'Créateur',
    description: 'Créez et vendez vos propres voyages',
    icon: Briefcase,
  },
  {
    id: 'INDEPENDANT' as ProType,
    label: 'Indépendant',
    description: 'Travaillez en tant que partenaire indépendant',
    icon: User,
  },
  {
    id: 'VENDEUR' as ProType,
    label: 'Vendeur',
    description: 'Vendez les voyages d\'autres créateurs',
    icon: FileText,
  },
  {
    id: 'MAGASIN' as ProType,
    label: 'Magasin',
    description: 'Agence de voyage agréée',
    icon: Building,
  },
  {
    id: 'ASSOCIATION' as ProType,
    label: 'Association',
    description: 'Organisation à but non lucratif',
    icon: Users,
  },
];

const ZONES = ['Île-de-France', 'Provence', 'Côte d\'Azur', 'Alsace', 'Bourgogne', 'Normandie', 'Bretagne', 'Loire', 'Aquitaine', 'Midi-Pyrénées'];
const SKILLS = ['Transport', 'Hébergement', 'Restauration', 'Activités', 'Guides touristiques', 'Animation', 'Logistique'];

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<InscriptionForm>({
    proType: null,
    name: '',
    email: '',
    phone: '',
    zone: '',
    skills: [],
    description: '',
    acceptCharte: false,
    acceptCGV: false,
    acceptRGPD: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleProTypeSelect = (type: ProType) => {
    setForm({ ...form, proType: type });
  };

  const toggleSkill = (skill: string) => {
    setForm({
      ...form,
      skills: form.skills.includes(skill)
        ? form.skills.filter((s) => s !== skill)
        : [...form.skills, skill],
    });
  };

  const canProceedStep1 = form.proType !== null;
  const canProceedStep2 = form.name && form.email && form.phone && (form.proType !== 'MAGASIN' || form.siret);
  const canProceedStep3 = form.zone && form.skills.length > 0 && form.description;
  const canSubmit = form.acceptCharte && form.acceptCGV && form.acceptRGPD;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setLoading(true);
      const res = await fetch('/api/pro/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proType: form.proType,
          name: form.name,
          email: form.email,
          phone: form.phone,
          siret: form.siret,
          zone: form.zone,
          skills: form.skills,
          description: form.description,
        }),
      });

      if (!res.ok) throw new Error('Erreur enregistrement');

      setSubmitted(true);
      setTimeout(() => {
        router.push('/pro/onboarding');
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div className="pro-panel" style={{ width: '100%', maxWidth: '448px', padding: '32px', textAlign: 'center' }}>
          <CheckCircle2 className="w-16 h-16" style={{ color: 'var(--pro-mint)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628', marginBottom: '16px' }}>Inscription réussie!</h2>
          <p style={{ color: '#8896A6' }}>
            Merci de vous être inscrit. Redirection vers l'onboarding...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        {/* Progress Steps */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '14px',
                    backgroundColor: s <= step ? 'var(--pro-ocean)' : '#E0E0E0',
                    color: s <= step ? 'white' : '#8896A6'
                  }}
                >
                  {s <= step && s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      margin: '0 8px',
                      backgroundColor: s < step ? 'var(--pro-ocean)' : '#E0E0E0'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8896A6' }}>
            <span>Type Pro</span>
            <span>Infos perso</span>
            <span>Détails pro</span>
            <span>Conditions</span>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--pro-coral)', flexShrink: 0 }} />
            <p style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {/* Step 1: Pro Type */}
        {step === 1 && (
          <div className="pro-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Quel type de professionnel êtes-vous?</h2>
            <p style={{ color: '#8896A6', marginBottom: '24px', fontSize: '14px' }}>Sélectionnez le profil qui vous correspond</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PRO_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleProTypeSelect(type.id)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid ' + (form.proType === type.id ? 'var(--pro-ocean)' : '#E0E0E0'),
                      borderRadius: '8px',
                      textAlign: 'left',
                      backgroundColor: form.proType === type.id ? '#F0F7FF' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', marginTop: '4px', flexShrink: 0, color: form.proType === type.id ? 'var(--pro-ocean)' : '#8896A6' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: '#0A1628' }}>{type.label}</p>
                      <p style={{ fontSize: '14px', color: '#8896A6' }}>{type.description}</p>
                    </div>
                    {form.proType === type.id && (
                      <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--pro-ocean)', flexShrink: 0 }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <div className="pro-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Informations personnelles</h2>
            <p style={{ color: '#8896A6', marginBottom: '24px', fontSize: '14px' }}>Vos coordonnées de contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Nom complet *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="pro-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Email professionnel *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="pro@example.com"
                  className="pro-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Téléphone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="pro-input"
                />
              </div>

              {form.proType === 'MAGASIN' && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>SIRET *</label>
                  <input
                    type="text"
                    value={form.siret || ''}
                    onChange={(e) => setForm({ ...form, siret: e.target.value })}
                    placeholder="12345678901234"
                    className="pro-input"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Professional Details */}
        {step === 3 && (
          <div className="pro-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Détails professionnels</h2>
            <p style={{ color: '#8896A6', marginBottom: '24px', fontSize: '14px' }}>Vos compétences et zone d&apos;expertise</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Zone géographique *</label>
                <select
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value })}
                  className="pro-input"
                >
                  <option value="">Sélectionnez une zone</option>
                  {ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '12px' }}>Compétences *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid ' + (form.skills.includes(skill) ? 'var(--pro-ocean)' : '#E0E0E0'),
                        borderRadius: '8px',
                        textAlign: 'left',
                        backgroundColor: form.skills.includes(skill) ? '#F0F7FF' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: '2px solid ' + (form.skills.includes(skill) ? 'var(--pro-ocean)' : '#8896A6'),
                        backgroundColor: form.skills.includes(skill) ? 'var(--pro-ocean)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {form.skills.includes(skill) && (
                          <CheckCircle2 style={{ width: '16px', height: '16px', color: 'white' }} />
                        )}
                      </div>
                      <span style={{ color: '#0A1628' }}>{skill}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Description professionnelle *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez votre expérience et vos spécialités..."
                  rows={4}
                  className="pro-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Legal Agreement */}
        {step === 4 && (
          <div className="pro-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Conditions d&apos;utilisation</h2>
            <p style={{ color: '#8896A6', marginBottom: '24px', fontSize: '14px' }}>Acceptez nos conditions pour continuer</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#F5F5F5', padding: '16px', borderRadius: '8px', maxHeight: '256px', overflowY: 'auto', border: '1px solid #E0E0E0' }}>
                <h4 style={{ fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Charte Eventy Life</h4>
                <p style={{ fontSize: '12px', color: '#8896A6', marginBottom: '16px' }}>
                  En tant que professionnel partenaire, vous vous engagez à respecter nos valeurs
                  d'excellence, de transparence et de responsabilité envers nos clients...
                </p>

                <h4 style={{ fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>Conditions Générales de Vente Pro</h4>
                <p style={{ fontSize: '12px', color: '#8896A6', marginBottom: '16px' }}>
                  Vous acceptez les conditions de commission, les délais de paiement et les
                  responsabilités contractuelles définies dans nos CGV...
                </p>

                <h4 style={{ fontWeight: 600, color: '#0A1628', marginBottom: '8px' }}>RGPD & Confidentialité</h4>
                <p style={{ fontSize: '12px', color: '#8896A6' }}>
                  Vos données seront traitées conformément à la réglementation RGPD. Nous nous
                  engageons à protéger vos informations personnelles...
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.acceptCharte}
                    onChange={(e) => setForm({ ...form, acceptCharte: e.target.checked })}
                    style={{ marginTop: '4px', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '14px', color: '#0A1628' }}>
                    J'accepte la <strong>Charte Eventy Life</strong> *
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.acceptCGV}
                    onChange={(e) => setForm({ ...form, acceptCGV: e.target.checked })}
                    style={{ marginTop: '4px', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '14px', color: '#0A1628' }}>
                    J'accepte les <strong>Conditions Générales de Vente Pro</strong> *
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.acceptRGPD}
                    onChange={(e) => setForm({ ...form, acceptRGPD: e.target.checked })}
                    style={{ marginTop: '4px', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '14px', color: '#0A1628' }}>
                    J'accepte la <strong>Politique de confidentialité RGPD</strong> *
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '32px' }}>
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="pro-btn-outline"
            style={{ opacity: step === 1 ? 0.5 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
          >
            Précédent
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
              className="pro-btn-sun"
              style={{
                opacity: ((step === 1 && !canProceedStep1) ||
                          (step === 2 && !canProceedStep2) ||
                          (step === 3 && !canProceedStep3)) ? 0.5 : 1,
                cursor: ((step === 1 && !canProceedStep1) ||
                         (step === 2 && !canProceedStep2) ||
                         (step === 3 && !canProceedStep3)) ? 'not-allowed' : 'pointer'
              }}
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="pro-btn-sun"
              style={{
                opacity: (!canSubmit || loading) ? 0.5 : 1,
                cursor: (!canSubmit || loading) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
