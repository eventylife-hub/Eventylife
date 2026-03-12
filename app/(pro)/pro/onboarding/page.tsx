'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useProStore } from '@/lib/stores/pro-store';
import { ChevronRight, CheckCircle2, Clock, Shield, FileText, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
const FileUpload = dynamic(() => import('@/components/uploads/file-upload').then(m => ({ default: m.FileUpload })), { ssr: false });
const STEPS = [
  { number: 1, label: 'Profil', description: 'Informations personnelles' },
  { number: 2, label: 'Légal', description: 'Informations légales' },
  { number: 3, label: 'Paiements', description: 'Configuration IBAN' },
  { number: 4, label: 'Documents', description: 'Upload des documents' },
  { number: 5, label: 'Contrats', description: 'Signatures numériques' },
  { number: 6, label: 'Formation', description: 'Modules de formation' },
];

// Interface pour les données du formulaire d'onboarding
interface OnboardingFormData {
  displayName?: string;
  bio?: string;
  website?: string;
  proType?: string;
  siret?: string;
  companyName?: string;
  companyAddress?: string;
  entityType?: string;
  iban?: string;
  bic?: string;
  holderName?: string;
  identityDocAssetId?: string;
  kbisDocAssetId?: string;
  acceptTerms?: boolean;
  acceptCharter?: boolean;
  acceptRGPD?: boolean;
  completedModules?: number[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const { onboardingStatus, fetchOnboardingStatus } = useProStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({});

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const validateStep = (): boolean => {
    setError(null);

    // Validation spécifique par étape
    switch (currentStep) {
      case 1:
        if (!formData.displayName?.trim()) {
          setError('Le nom d\'affichage est requis');
          return false;
        }
        if (!formData.proType) {
          setError('Le type de prestataire est requis');
          return false;
        }
        break;
      case 2:
        // Données légales optionnelles
        break;
      case 3:
        if (!formData.iban?.trim()) {
          setError('L\'IBAN est requis');
          return false;
        }
        if (!formData.holderName?.trim()) {
          setError('Le nom du titulaire est requis');
          return false;
        }
        break;
      case 5:
        if (!formData.acceptTerms || !formData.acceptCharter || !formData.acceptRGPD) {
          setError('Vous devez accepter tous les contrats et politiques');
          return false;
        }
        break;
    }

    return true;
  };

  const handleStepSubmit = async () => {
    if (!validateStep()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pro/onboarding/step/${currentStep}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la soumission de l\'étape');
      }

      setCurrentStep(currentStep + 1);
      setFormData({});
      setError(null);
      fetchOnboardingStatus();
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Une erreur est survenue'));
      logger.error('Erreur submission étape:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pro/onboarding/complete', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la finalisation de l\'inscription');
      }

      router.push('/pro');
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Une erreur est survenue'));
      logger.error('Erreur completion onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="pro-page-title">Complétez votre inscription</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>
            Nous avons besoin de quelques informations pour valider votre compte Pro
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--pro-coral)', flexShrink: 0, marginTop: '4px' }} />
            <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>{error}</p>
          </div>
        )}

        {/* Step Indicator */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            {STEPS.map((step, idx) => {
              const isCompleted = onboardingStatus && [
                onboardingStatus.step1_profile,
                onboardingStatus.step2_legal,
                onboardingStatus.step3_payout,
                onboardingStatus.step4_documents,
                onboardingStatus.step5_contracts,
                onboardingStatus.step6_formation,
              ][step.number - 1];

              const isCurrent = step.number === currentStep;

              return (
                <div key={step.number} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
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
                      backgroundColor: isCompleted ? 'var(--pro-mint)' : isCurrent ? 'var(--pro-ocean)' : '#E0E0E0',
                      color: (isCompleted || isCurrent) ? 'white' : '#64748B'
                    }}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', margin: '0 8px', backgroundColor: isCompleted ? 'var(--pro-mint)' : '#E0E0E0' }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {STEPS.map((step) => (
              <div key={step.number} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="pro-panel" style={{ padding: '32px', marginBottom: '24px' }}>
          {currentStep === 1 && (
            <StepProfile formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 2 && (
            <StepLegal formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && (
            <StepPayout formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && (
            <StepDocuments formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 5 && (
            <StepContracts formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 6 && (
            <StepFormation formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          {currentStep > 1 && (
            <button type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{ padding: '8px 24px', color: 'var(--pro-ocean)', fontWeight: 500, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              ← Précédent
            </button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < 6 ? (
            <button type="button"
              onClick={handleStepSubmit}
              disabled={loading}
              className="pro-btn-sun"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              style={{
                padding: '8px 24px',
                backgroundColor: 'var(--pro-mint)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                fontWeight: 500,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Soumettre pour vérification <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Info */}
        <div style={{ padding: '16px', backgroundColor: '#F0F7FF', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #E8F0FA' }}>
          <Clock className="w-5 h-5" style={{ color: 'var(--pro-ocean)', flexShrink: 0 }} />
          <p style={{ fontSize: '14px', color: 'var(--pro-ocean)' }}>
            Votre progression est automatiquement sauvegardée. Cette procédure prend environ 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

// Step Components
function StepProfile({ formData, setFormData }: { formData: OnboardingFormData; setFormData: (data: OnboardingFormData) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '24px' }}>Étape 1: Votre profil</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="onboard-displayName" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Nom d&apos;affichage</label>
          <input
            id="onboard-displayName"
            type="text"
            value={formData.displayName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, displayName: (e.target as HTMLInputElement).value })}
            className="pro-input"
            placeholder="Ex: Voyages Entreprise"
          />
        </div>
        <div>
          <label htmlFor="onboard-bio" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Biographie (optionnel)</label>
          <textarea
            id="onboard-bio"
            value={formData.bio || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bio: (e.target as HTMLInputElement).value })}
            className="pro-input"
            placeholder="Parlez de votre expérience..."
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="onboard-website" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Site web (optionnel)</label>
          <input
            id="onboard-website"
            type="url"
            value={formData.website || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, website: (e.target as HTMLInputElement).value })}
            className="pro-input"
            placeholder="https://exemple.com"
          />
        </div>
        <div>
          <label htmlFor="onboard-proType" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Type de prestataire</label>
          <select
            id="onboard-proType"
            value={formData.proType || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, proType: e.target.value })}
            className="pro-input"
          >
            <option value="">Sélectionner...</option>
            <option value="CREATOR">Créateur</option>
            <option value="INDEPENDANT">Indépendant</option>
            <option value="VENDEUR">Vendeur</option>
            <option value="MAGASIN">Magasin</option>
            <option value="DISTRIBUTION_PARTNER">Partenaire Distribution</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function StepLegal({ formData, setFormData }: { formData: OnboardingFormData; setFormData: (data: OnboardingFormData) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '24px' }}>Étape 2: Informations légales</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="onboard-siret" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>SIRET (optionnel)</label>
          <input
            id="onboard-siret"
            type="text"
            value={formData.siret || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, siret: (e.target as HTMLInputElement).value.replace(/\D/g, '') })}
            className="pro-input"
            placeholder="14 chiffres"
            maxLength={14}
          />
        </div>
        <div>
          <label htmlFor="onboard-companyName" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Nom de la société (optionnel)</label>
          <input
            id="onboard-companyName"
            type="text"
            value={formData.companyName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, companyName: (e.target as HTMLInputElement).value })}
            className="pro-input"
          />
        </div>
        <div>
          <label htmlFor="onboard-companyAddress" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Adresse de la société (optionnel)</label>
          <input
            id="onboard-companyAddress"
            type="text"
            value={formData.companyAddress || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, companyAddress: (e.target as HTMLInputElement).value })}
            className="pro-input"
          />
        </div>
        <div>
          <label htmlFor="onboard-entityType" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Type d&apos;entité (optionnel)</label>
          <input
            id="onboard-entityType"
            type="text"
            value={formData.entityType || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, entityType: (e.target as HTMLInputElement).value })}
            className="pro-input"
            placeholder="Ex: SARL, SAS, Auto-entrepreneur"
          />
        </div>
      </div>
    </div>
  );
}

function StepPayout({ formData, setFormData }: { formData: OnboardingFormData; setFormData: (data: OnboardingFormData) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '24px' }}>Étape 3: Configuration des paiements</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="onboard-iban" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>IBAN français</label>
          <input
            id="onboard-iban"
            type="text"
            value={formData.iban || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, iban: (e.target as HTMLInputElement).value.toUpperCase() })}
            className="pro-input"
            placeholder="FR76 3000 6000 0101 0009 7839"
          />
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>Format: FR + 2 chiffres + 23 caractères alphanumériques</p>
        </div>
        <div>
          <label htmlFor="onboard-bic" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>BIC (optionnel)</label>
          <input
            id="onboard-bic"
            type="text"
            value={formData.bic || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bic: (e.target as HTMLInputElement).value.toUpperCase() })}
            className="pro-input"
            placeholder="SOFRFRPP"
          />
        </div>
        <div>
          <label htmlFor="onboard-holderName" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '8px' }}>Nom du titulaire</label>
          <input
            id="onboard-holderName"
            type="text"
            value={formData.holderName || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, holderName: (e.target as HTMLInputElement).value })}
            className="pro-input"
            placeholder="Votre nom"
          />
        </div>
      </div>
    </div>
  );
}

function StepDocuments({ formData, setFormData }: { formData: OnboardingFormData; setFormData: (data: OnboardingFormData | ((prev: OnboardingFormData) => OnboardingFormData)) => void }) {
  const handleIdentityUpload = useCallback((assetId: string) => {
    setFormData((prev: OnboardingFormData) => ({
      ...prev,
      identityDocAssetId: assetId,
    }));
  }, [setFormData]);

  const handleKbisUpload = useCallback((assetId: string) => {
    setFormData((prev: OnboardingFormData) => ({
      ...prev,
      kbisDocAssetId: assetId,
    }));
  }, [setFormData]);

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '24px' }}>Étape 4: Upload des documents</h2>

      {/* Info sécurité */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#E0FFF5', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid #B8F3E6' }}>
        <Shield className="w-5 h-5" style={{ color: 'var(--pro-mint)', flexShrink: 0, marginTop: '4px' }} />
        <p style={{ fontSize: '14px', color: 'var(--pro-mint)' }}>
          Vos documents sont chiffrés et stockés de manière sécurisée.
          Ils ne seront consultés que par notre équipe de vérification.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Pièce d'identité */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <FileText className="w-5 h-5" style={{ color: 'var(--pro-ocean)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>
              Pièce d&apos;identité <span style={{ color: 'var(--pro-coral)' }}>*</span>
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
            Carte nationale d&apos;identité ou passeport en cours de validité (PDF, JPG ou PNG, max 5 Mo)
          </p>
          <FileUpload
            accept={['application/pdf', 'image/jpeg', 'image/png']}
            maxSize={5 * 1024 * 1024}
            onUpload={handleIdentityUpload}
            label="Déposer votre pièce d&apos;identité ici"
          />
          {formData.identityDocAssetId && (
            <p style={{ fontSize: '12px', color: 'var(--pro-mint)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 className="w-3 h-3" /> Document téléchargé avec succès
            </p>
          )}
        </div>

        {/* KBIS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <FileText className="w-5 h-5" style={{ color: 'var(--pro-ocean)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>
              Extrait KBIS <span style={{ color: '#64748B', fontSize: '12px', fontWeight: 400 }}>(si société)</span>
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
            Extrait KBIS de moins de 3 mois (PDF, JPG ou PNG, max 5 Mo)
          </p>
          <FileUpload
            accept={['application/pdf', 'image/jpeg', 'image/png']}
            maxSize={5 * 1024 * 1024}
            onUpload={handleKbisUpload}
            label="Déposer votre KBIS ici"
          />
          {formData.kbisDocAssetId && (
            <p style={{ fontSize: '12px', color: 'var(--pro-mint)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 className="w-3 h-3" /> Document téléchargé avec succès
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StepContracts({ formData, setFormData }: { formData: OnboardingFormData; setFormData: (data: OnboardingFormData) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '24px' }}>Étape 5: Signatures numériques</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: '#F5F5F5', borderRadius: '8px', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            id="onboard-acceptTerms"
            type="checkbox"
            checked={!!formData.acceptTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, acceptTerms: (e.target as HTMLInputElement).checked })}
            style={{ marginTop: '4px', flexShrink: 0 }}
          />
          <div>
            <label htmlFor="onboard-acceptTerms" style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628' }}>Contrat prestataire indépendant</label>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              Je confirme avoir lu et accepté les conditions d&apos;utilisation.
            </p>
          </div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#F5F5F5', borderRadius: '8px', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            id="onboard-acceptCharter"
            type="checkbox"
            checked={!!formData.acceptCharter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, acceptCharter: (e.target as HTMLInputElement).checked })}
            style={{ marginTop: '4px', flexShrink: 0 }}
          />
          <div>
            <label htmlFor="onboard-acceptCharter" style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628' }}>Charte de prestataire</label>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              J&apos;accepte les règles d&apos;utilisation et d&apos;éthique.
            </p>
          </div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#F5F5F5', borderRadius: '8px', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            id="onboard-acceptRGPD"
            type="checkbox"
            checked={!!formData.acceptRGPD}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, acceptRGPD: (e.target as HTMLInputElement).checked })}
            style={{ marginTop: '4px', flexShrink: 0 }}
          />
          <div>
            <label htmlFor="onboard-acceptRGPD" style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628' }}>Politique RGPD</label>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              J&apos;accepte le traitement de mes données selon la politique RGPD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepFormation({ formData, setFormData }: { formData: OnboardingFormData; setFormData: (data: OnboardingFormData) => void }) {
  const modules = [
    'Créer votre premier voyage',
    'Configurer les arrêts de bus',
    'Comprendre le checkout',
    'Gérer les participants',
    'Documents et signatures',
    'Marketing et promotion',
    'Finance et paiements',
  ];

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A1628', marginBottom: '24px' }}>Étape 6: Modules de formation</h2>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>Marquez les modules que vous avez complétés :</p>
      <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: 'none', padding: 0, margin: 0 }}>
        <legend className="sr-only">Modules de formation complétés</legend>
        {modules.map((module, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#F5F5F5', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
            <input
              id={`onboard-module-${idx}`}
              type="checkbox"
              checked={(formData.completedModules || []).includes(idx)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const completed = formData.completedModules || [];
                if ((e.target as HTMLInputElement).checked) {
                  setFormData({
                    ...formData,
                    completedModules: [...completed, idx],
                  });
                } else {
                  setFormData({
                    ...formData,
                    completedModules: completed.filter((i: number) => i !== idx),
                  });
                }
              }}
            />
            <label htmlFor={`onboard-module-${idx}`} style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628', cursor: 'pointer' }}>{module}</label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
