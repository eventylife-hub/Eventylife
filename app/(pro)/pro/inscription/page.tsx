'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200 bg-white">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Inscription réussie!</h2>
            <p className="text-slate-600">
              Merci de vous être inscrit. Redirection vers l'onboarding...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    s <= step
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s <= step && s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      s < step ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-2">
            <span>Type Pro</span>
            <span>Infos perso</span>
            <span>Détails pro</span>
            <span>Conditions</span>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Pro Type */}
        {step === 1 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Quel type de professionnel êtes-vous?</CardTitle>
              <CardDescription>Sélectionnez le profil qui vous correspond</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {PRO_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleProTypeSelect(type.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      form.proType === type.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-1 flex-shrink-0 ${form.proType === type.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="font-semibold text-slate-900">{type.label}</p>
                        <p className="text-sm text-slate-600">{type.description}</p>
                      </div>
                      {form.proType === type.id && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 ml-auto flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Vos coordonnées de contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email professionnel *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="pro@example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              {form.proType === 'MAGASIN' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SIRET *</label>
                  <input
                    type="text"
                    value={form.siret || ''}
                    onChange={(e) => setForm({ ...form, siret: e.target.value })}
                    placeholder="12345678901234"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Professional Details */}
        {step === 3 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Détails professionnels</CardTitle>
              <CardDescription>Vos compétences et zone d&apos;expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Zone géographique *</label>
                <select
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
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
                <label className="block text-sm font-medium text-slate-700 mb-3">Compétences *</label>
                <div className="space-y-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                        form.skills.includes(skill)
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          form.skills.includes(skill)
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-slate-300'
                        }`}>
                          {form.skills.includes(skill) && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-slate-700">{skill}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description professionnelle *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez votre expérience et vos spécialités..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Legal Agreement */}
        {step === 4 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Conditions d&apos;utilisation</CardTitle>
              <CardDescription>Acceptez nos conditions pour continuer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg max-h-64 overflow-y-auto border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Charte Eventy Life</h4>
                <p className="text-xs text-slate-600 mb-4">
                  En tant que professionnel partenaire, vous vous engagez à respecter nos valeurs
                  d'excellence, de transparence et de responsabilité envers nos clients...
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">Conditions Générales de Vente Pro</h4>
                <p className="text-xs text-slate-600 mb-4">
                  Vous acceptez les conditions de commission, les délais de paiement et les
                  responsabilités contractuelles définies dans nos CGV...
                </p>

                <h4 className="font-semibold text-slate-900 mb-2">RGPD & Confidentialité</h4>
                <p className="text-xs text-slate-600">
                  Vos données seront traitées conformément à la réglementation RGPD. Nous nous
                  engageons à protéger vos informations personnelles...
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptCharte}
                    onChange={(e) => setForm({ ...form, acceptCharte: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 mt-1 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-700">
                    J'accepte la <strong>Charte Eventy Life</strong> *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptCGV}
                    onChange={(e) => setForm({ ...form, acceptCGV: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 mt-1 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-700">
                    J'accepte les <strong>Conditions Générales de Vente Pro</strong> *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptRGPD}
                    onChange={(e) => setForm({ ...form, acceptRGPD: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 mt-1 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-700">
                    J'accepte la <strong>Politique de confidentialité RGPD</strong> *
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <Button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            variant="outline"
          >
            Précédent
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
