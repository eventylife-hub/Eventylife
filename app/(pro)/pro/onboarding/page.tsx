'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useProStore } from '@/lib/stores/pro-store';
import { ChevronRight, CheckCircle2, Clock, Shield, FileText, AlertCircle } from 'lucide-react';
import { FileUpload } from '@/components/uploads/file-upload';

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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMsg);
      console.error('Erreur submission étape:', err);
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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMsg);
      console.error('Erreur completion onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Complétez votre inscription</h1>
          <p className="text-slate-600 mt-2">
            Nous avons besoin de quelques informations pour valider votre compte Pro
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
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
                <div key={step.number} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-slate-300'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <p className="text-xs font-medium text-slate-700">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
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
        <div className="flex justify-between items-center">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Précédent
            </button>
          )}
          <div className="flex-1" />
          {currentStep < 6 ? (
            <button
              onClick={handleStepSubmit}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium flex items-center gap-2"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={loading}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center gap-2"
            >
              Soumettre pour vérification <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-900">
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
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Étape 1: Votre profil</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom d'affichage</label>
          <input
            type="text"
            value={formData.displayName || ''}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Ex: Voyages Entreprise"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Biographie (optionnel)</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Parlez de votre expérience..."
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Site web (optionnel)</label>
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="https://exemple.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Type de prestataire</label>
          <select
            value={formData.proType || ''}
            onChange={(e) => setFormData({ ...formData, proType: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
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
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Étape 2: Informations légales</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">SIRET (optionnel)</label>
          <input
            type="text"
            value={formData.siret || ''}
            onChange={(e) => setFormData({ ...formData, siret: e.target.value.replace(/\D/g, '') })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="14 chiffres"
            maxLength={14}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom de la société (optionnel)</label>
          <input
            type="text"
            value={formData.companyName || ''}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Adresse de la société (optionnel)</label>
          <input
            type="text"
            value={formData.companyAddress || ''}
            onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Type d'entité (optionnel)</label>
          <input
            type="text"
            value={formData.entityType || ''}
            onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
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
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Étape 3: Configuration des paiements</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">IBAN français</label>
          <input
            type="text"
            value={formData.iban || ''}
            onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="FR76 3000 6000 0101 0009 7839"
          />
          <p className="text-xs text-slate-500 mt-1">Format: FR + 2 chiffres + 23 caractères alphanumériques</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">BIC (optionnel)</label>
          <input
            type="text"
            value={formData.bic || ''}
            onChange={(e) => setFormData({ ...formData, bic: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="SOFRFRPP"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom du titulaire</label>
          <input
            type="text"
            value={formData.holderName || ''}
            onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
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
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Étape 4: Upload des documents</h2>

      {/* Info sécurité */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-start gap-3 border border-green-200">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-900">
          Vos documents sont chiffrés et stockés de manière sécurisée.
          Ils ne seront consultés que par notre équipe de vérification.
        </p>
      </div>

      <div className="space-y-6">
        {/* Pièce d'identité */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Pièce d&apos;identité <span className="text-red-500">*</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Carte nationale d&apos;identité ou passeport en cours de validité (PDF, JPG ou PNG, max 5 Mo)
          </p>
          <FileUpload
            accept={['application/pdf', 'image/jpeg', 'image/png']}
            maxSize={5 * 1024 * 1024}
            onUpload={handleIdentityUpload}
            label="Déposer votre pièce d'identité ici"
          />
          {formData.identityDocAssetId && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Document téléchargé avec succès
            </p>
          )}
        </div>

        {/* KBIS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Extrait KBIS <span className="text-slate-400 text-xs font-normal">(si société)</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Extrait KBIS de moins de 3 mois (PDF, JPG ou PNG, max 5 Mo)
          </p>
          <FileUpload
            accept={['application/pdf', 'image/jpeg', 'image/png']}
            maxSize={5 * 1024 * 1024}
            onUpload={handleKbisUpload}
            label="Déposer votre KBIS ici"
          />
          {formData.kbisDocAssetId && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
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
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Étape 5: Signatures numériques</h2>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptTerms || false}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1"
            />
            <div>
              <label className="text-sm font-medium text-slate-900">Contrat prestataire indépendant</label>
              <p className="text-xs text-slate-600 mt-1">
                Je confirme avoir lu et accepté les conditions d'utilisation.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptCharter || false}
              onChange={(e) => setFormData({ ...formData, acceptCharter: e.target.checked })}
              className="mt-1"
            />
            <div>
              <label className="text-sm font-medium text-slate-900">Charte de prestataire</label>
              <p className="text-xs text-slate-600 mt-1">
                J'accepte les règles d'utilisation et d'éthique.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptRGPD || false}
              onChange={(e) => setFormData({ ...formData, acceptRGPD: e.target.checked })}
              className="mt-1"
            />
            <div>
              <label className="text-sm font-medium text-slate-900">Politique RGPD</label>
              <p className="text-xs text-slate-600 mt-1">
                J'accepte le traitement de mes données selon la politique RGPD.
              </p>
            </div>
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
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Étape 6: Modules de formation</h2>
      <p className="text-sm text-slate-600 mb-4">Marquez les modules que vous avez complétés :</p>
      <div className="space-y-3">
        {modules.map((module, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={(formData.completedModules || []).includes(idx)}
              onChange={(e) => {
                const completed = formData.completedModules || [];
                if (e.target.checked) {
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
              className="rounded"
            />
            <label className="text-sm font-medium text-slate-900">{module}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
