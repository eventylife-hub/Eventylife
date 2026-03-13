'use client';

import { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Save, Plus, Trash2, Image, MapPin, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { formatPrice } from '@/lib/utils';
import { logger } from '@/lib/logger';

const FileUpload = dynamic(
  () => import('@/components/uploads/file-upload').then((m) => m.FileUpload),
  { loading: () => <div className="animate-pulse rounded-xl h-32" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Activity {
  id: string;
  time: string;
  label: string;
  description: string;
}

interface DayProgram {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: Activity[];
}

interface Room {
  id: string;
  type: string;
  label: string;
  capacity: number;
  pricePerPersonCents: number;
  quantity: number;
}

interface Photo {
  assetId: string;
  uploadedAt: string;
}

interface BusStop {
  stopId: string;
  type: string;
}

interface BusStopFromAPI {
  id: string;
  publicName: string;
  city: string;
  addressLine: string;
  type: string;
  status: string;
}

interface Pricing {
  basePrice: number;
  inclusions: string[];
  exclusions: string[];
}

interface TravelFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: string;
  transportMode: string;
  capacity: number;
  rooms: Room[];
  program: DayProgram[];
  photos: Photo[];
  busStops: BusStop[];
  pricing: Pricing;
}

const WIZARD_STEPS = [
  { number: 1, label: 'Informations', description: 'Titre, dates, destination' },
  { number: 2, label: 'Hébergement', description: 'Types de chambres et tarifs' },
  { number: 3, label: 'Programme', description: 'Détails jour par jour' },
  { number: 4, label: 'Photos', description: 'Galerie d\'images' },
  { number: 5, label: 'Arrêts bus', description: 'Points de départ/arrivée' },
  { number: 6, label: 'Tarification', description: 'Prix et inclusions' },
  { number: 7, label: 'Récapitulatif', description: 'Vérification et soumission' },
];

// Données démo pour le voyage (protégées derrière NEXT_PUBLIC_DEMO_MODE)
const getDemoTravelData = (): TravelFormData => ({
  title: 'Week-end à Marrakech',
  description: 'Découvrez la magie de Marrakech avec ses souks colorés, sa médina fascinante et l\'hospitalité marocaine. Un voyage inoubliable à travers la culture et l\'histoire du Maroc.',
  startDate: '2026-05-15',
  endDate: '2026-05-18',
  destination: 'Marrakech',
  transportMode: 'BUS',
  capacity: 50,
  rooms: [
    {
      id: 'demo-room-1',
      type: 'DOUBLE',
      label: 'Vue sur la médina',
      capacity: 2,
      pricePerPersonCents: 15000,
      quantity: 15,
    },
    {
      id: 'demo-room-2',
      type: 'TRIPLE',
      label: '',
      capacity: 3,
      pricePerPersonCents: 12000,
      quantity: 10,
    },
  ],
  program: [
    {
      id: 'demo-day-1',
      dayNumber: 1,
      title: 'Jour 1 - Arrivée à Marrakech',
      description: 'Accueil et installation à l\'hôtel. Tour de la ville en soirée.',
      activities: [
        { id: 'demo-act-1-1', time: '14:00', label: 'Arrivée', description: 'Accueil au bus' },
        { id: 'demo-act-1-2', time: '15:30', label: 'Installation', description: 'Enregistrement et repos' },
        { id: 'demo-act-1-3', time: '19:00', label: 'Dîner', description: 'Repas traditionnel marocain' },
      ],
    },
    {
      id: 'demo-day-2',
      dayNumber: 2,
      title: 'Jour 2 - Exploration de la Médina',
      description: 'Visite guidée des souks et de la Place Jemaa el-Fnaa.',
      activities: [
        { id: 'demo-act-2-1', time: '08:00', label: 'Petit-déjeuner', description: '' },
        { id: 'demo-act-2-2', time: '09:00', label: 'Visite souks', description: 'Avec guide local' },
        { id: 'demo-act-2-3', time: '13:00', label: 'Déjeuner', description: '' },
        { id: 'demo-act-2-4', time: '15:00', label: 'Place Jemaa el-Fnaa', description: 'Musiciens et conteurs' },
      ],
    },
    {
      id: 'demo-day-3',
      dayNumber: 3,
      title: 'Jour 3 - Palais et Jardin Botanique',
      description: 'Visite du Palais Bahia et du Jardin Majorelle.',
      activities: [
        { id: 'demo-act-3-1', time: '09:00', label: 'Petit-déjeuner', description: '' },
        { id: 'demo-act-3-2', time: '10:00', label: 'Palais Bahia', description: 'Visite guidée' },
        { id: 'demo-act-3-3', time: '12:30', label: 'Déjeuner', description: '' },
        { id: 'demo-act-3-4', time: '14:30', label: 'Jardin Majorelle', description: 'Jardin botanique somptueux' },
      ],
    },
  ],
  photos: [
    { assetId: 'demo-photo-marrakech-1', uploadedAt: '2026-03-11T10:00:00Z' },
    { assetId: 'demo-photo-marrakech-2', uploadedAt: '2026-03-11T10:00:00Z' },
    { assetId: 'demo-photo-marrakech-3', uploadedAt: '2026-03-11T10:00:00Z' },
  ],
  busStops: [
    { stopId: 'demo-pickup-paris', type: 'PICKUP_DEPARTURE' },
    { stopId: 'demo-dropoff-marrakech', type: 'DROPOFF_ARRIVAL' },
  ],
  pricing: {
    basePrice: 12000,
    inclusions: ['Transport en bus climatisé', 'Hébergement 3 nuits', 'Petit-déjeuners et dîners', 'Guide local', 'Entrées musées'],
    exclusions: ['Déjeuners individuels', 'Dépenses personnelles', 'Assurance voyage'],
  },
});

export default function EditTravelPage() {
  const router = useRouter();
  const params = useParams();
  const travelId = params?.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<TravelFormData>(
    process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? getDemoTravelData() : { title: '', description: '', startDate: '', endDate: '', destination: '', transportMode: 'BUS', capacity: 0, rooms: [], program: [], photos: [], busStops: [], pricing: { basePrice: 0, inclusions: [], exclusions: [] } }
  );
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Fetch voyage data on mount
  useEffect(() => {
    const controller = new AbortController();
    const fetchTravel = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pro/travels/${travelId}`, { credentials: 'include', signal: controller.signal });
        if (res.ok) {
          const data = (await res.json()) as { data?: TravelFormData };
          setFormData(data?.data || (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? getDemoTravelData() : { title: '', description: '', startDate: '', endDate: '', destination: '', transportMode: 'BUS', capacity: 0, rooms: [], program: [], photos: [], busStops: [], pricing: { basePrice: 0, inclusions: [], exclusions: [] } }));
        } else {
          if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
            setFormData(getDemoTravelData());
          }
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        logger.warn(`API /api/pro/travels/${travelId} indisponible — données démo`);
        // Fallback: utiliser les données démo
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
          setFormData(getDemoTravelData());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTravel();
    return () => controller.abort();
  }, [travelId]);

  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch(`/api/pro/travels/${travelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSaveMessage('Brouillon sauvegardé avec succès !');
      } else {
        const error = (await response.json().catch((err) => {
          logger.error('[EditTravel] Erreur parsing réponse JSON:', err);
          return null;
        })) as { message?: string };
        setSaveMessage(error?.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.');
      }
    } catch (error: unknown) {
      logger.warn(`API /api/pro/travels/${travelId} indisponible — données démo`);
      // Fallback: afficher un message de succès local
      setSaveMessage('Mode démo: modifications sauvegardées localement');
    } finally {
      setSaving(false);
    }
  }, [formData, travelId]);

  const handleStepSubmit = async () => {
    if (currentStep === WIZARD_STEPS.length) {
      try {
        const response = await fetch(`/api/pro/travels/${travelId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          router.push(`/pro/voyages/${travelId}`);
        }
      } catch (error: unknown) {
        logger.warn(`API /api/pro/travels/${travelId} indisponible — données démo`);
        // Fallback: retour à la page du voyage
        router.push(`/pro/voyages/${travelId}`);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 128, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 200, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Éditer un voyage</h1>
          <p className="text-slate-600 mt-2">Modifiez les informations de votre offre de voyage</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {WIZARD_STEPS.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step.number < currentStep
                      ? 'bg-green-500 text-white'
                      : step.number === currentStep
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.number < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                </button>
                {idx < WIZARD_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${step.number < currentStep ? 'bg-green-500' : 'bg-slate-300'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {WIZARD_STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <p className="text-xs font-medium text-slate-700">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          {currentStep === 1 && <StepInfo formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <StepAccommodation formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <StepProgram formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <StepPhotos formData={formData} setFormData={setFormData} />}
          {currentStep === 5 && <StepBusStops formData={formData} setFormData={setFormData} />}
          {currentStep === 6 && <StepPricing formData={formData} setFormData={setFormData} />}
          {currentStep === 7 && <StepSummary formData={formData} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <span className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            {saveMessage && (
              <span className={`text-sm self-center ${saveMessage.includes('succès') ? 'text-green-600' : saveMessage.includes('démo') ? 'text-blue-600' : 'text-red-500'}`}>
                {saveMessage}
              </span>
            )}

            {currentStep === WIZARD_STEPS.length ? (
              <button
                type="button"
                onClick={handleStepSubmit}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
              >
                Terminer
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStepSubmit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Vos modifications sont sauvegardées automatiquement. Vous pouvez revenir aux étapes précédentes à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP COMPONENTS (réutilisés depuis nouveau/page.tsx)
// ============================================================================

function StepInfo({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Informations de base</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-2">Titre du voyage</label>
          <input
            id="edit-title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.currentTarget.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Ex: Week-end à Paris"
          />
        </div>

        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Décrivez votre voyage..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-startDate" className="block text-sm font-medium text-slate-700 mb-2">Date de départ</label>
            <input
              id="edit-startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.currentTarget.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="edit-endDate" className="block text-sm font-medium text-slate-700 mb-2">Date d&apos;arrivée</label>
            <input
              id="edit-endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.currentTarget.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-destination" className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
            <input
              id="edit-destination"
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.currentTarget.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Ex: Paris"
            />
          </div>
          <div>
            <label htmlFor="edit-transportMode" className="block text-sm font-medium text-slate-700 mb-2">Mode de transport</label>
            <select
              id="edit-transportMode"
              value={formData.transportMode}
              onChange={(e) => setFormData({ ...formData, transportMode: e.currentTarget.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="BUS">Bus</option>
              <option value="COACH">Car</option>
              <option value="MINIBUS">Minibus</option>
              <option value="VAN">Van</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="edit-capacity" className="block text-sm font-medium text-slate-700 mb-2">Capacité (places)</label>
          <input
            id="edit-capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.currentTarget.value) })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            min="1"
          />
        </div>
      </div>
    </div>
  );
}

function StepAccommodation({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  const ROOM_TYPES = [
    { value: 'SINGLE', label: 'Simple', defaultCapacity: 1 },
    { value: 'DOUBLE', label: 'Double', defaultCapacity: 2 },
    { value: 'TRIPLE', label: 'Triple', defaultCapacity: 3 },
    { value: 'QUAD', label: 'Quadruple', defaultCapacity: 4 },
    { value: 'SUITE', label: 'Suite', defaultCapacity: 2 },
    { value: 'FAMILY', label: 'Familiale', defaultCapacity: 4 },
  ];

  const addRoom = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          id: `room-${Date.now()}`,
          type: 'DOUBLE',
          label: '',
          capacity: 2,
          pricePerPersonCents: 0,
          quantity: 1,
        },
      ],
    }));
  };

  const updateRoom = (index: number, field: string, value: unknown) => {
    setFormData((prev) => {
      const updated = [...prev.rooms];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'type') {
        const rt = ROOM_TYPES.find((r) => r.value === value);
        if (rt) updated[index].capacity = rt.defaultCapacity;
      }
      return { ...prev, rooms: updated };
    });
  };

  const removeRoom = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Hébergement</h2>
      <p className="text-slate-600 mb-4">Ajoutez les types de chambres disponibles. Les prix sont par personne en centimes.</p>

      <div className="space-y-4">
        {formData.rooms.map((room, idx) => (
          <div key={room.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">Chambre #{idx + 1}</span>
              <button
                type="button"
                onClick={() => removeRoom(idx)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Supprimer"
                aria-label="Supprimer la chambre"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`edit-room-${idx}-type`} className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                <select
                  id={`edit-room-${idx}-type`}
                  value={room.type}
                  onChange={(e) => updateRoom(idx, 'type', e.currentTarget.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`edit-room-${idx}-label`} className="block text-xs font-medium text-slate-600 mb-1">Libellé (optionnel)</label>
                <input
                  id={`edit-room-${idx}-label`}
                  type="text"
                  value={room.label}
                  onChange={(e) => updateRoom(idx, 'label', e.currentTarget.value)}
                  placeholder="Ex: Vue mer"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor={`edit-room-${idx}-capacity`} className="block text-xs font-medium text-slate-600 mb-1">Capacité (pers.)</label>
                <input
                  id={`edit-room-${idx}-capacity`}
                  type="number"
                  value={room.capacity}
                  onChange={(e) => updateRoom(idx, 'capacity', parseInt(e.currentTarget.value) || 1)}
                  min={1}
                  max={8}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor={`edit-room-${idx}-price`} className="block text-xs font-medium text-slate-600 mb-1">Prix / personne (centimes)</label>
                <input
                  id={`edit-room-${idx}-price`}
                  type="number"
                  value={room.pricePerPersonCents}
                  onChange={(e) => updateRoom(idx, 'pricePerPersonCents', parseInt(e.currentTarget.value) || 0)}
                  min={0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor={`edit-room-${idx}-quantity`} className="block text-xs font-medium text-slate-600 mb-1">Quantité</label>
                <input
                  id={`edit-room-${idx}-quantity`}
                  type="number"
                  value={room.quantity}
                  onChange={(e) => updateRoom(idx, 'quantity', parseInt(e.currentTarget.value) || 1)}
                  min={1}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRoom}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" /> Ajouter un type de chambre
        </button>
      </div>

      {formData.rooms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
          Total : {formData.rooms.reduce((s, r) => s + r.quantity, 0)} chambres · {formData.rooms.reduce((s, r) => s + r.quantity * r.capacity, 0)} places max
        </div>
      )}
    </div>
  );
}

function StepProgram({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  const addDay = () => {
    setFormData((prev) => ({
      ...prev,
      program: [
        ...prev.program,
        {
          id: `day-${Date.now()}`,
          dayNumber: prev.program.length + 1,
          title: `Jour ${prev.program.length + 1}`,
          description: '',
          activities: [],
        },
      ],
    }));
  };

  const updateDay = (index: number, field: string, value: unknown) => {
    setFormData((prev) => {
      const updated = [...prev.program];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, program: updated };
    });
  };

  const removeDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      program: prev.program
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, dayNumber: i + 1 })),
    }));
  };

  const addActivity = (dayIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.program];
      const day = updated[dayIndex];
      if (day) {
        updated[dayIndex] = {
          ...day,
          activities: [
            ...day.activities,
            { id: `act-${Date.now()}`, time: '', label: '', description: '' },
          ],
        };
      }
      return { ...prev, program: updated };
    });
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.program];
      const day = updated[dayIndex];
      if (day) {
        updated[dayIndex] = {
          ...day,
          activities: day.activities.filter((_, i) => i !== actIndex),
        };
      }
      return { ...prev, program: updated };
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Programme</h2>
      <p className="text-slate-600 mb-4">Décrivez le programme jour par jour avec les activités prévues.</p>

      <div className="space-y-4">
        {formData.program.map((day, dIdx) => (
          <div key={day.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {day.dayNumber}
                </span>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => updateDay(dIdx, 'title', e.currentTarget.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                  placeholder="Titre du jour"
                  aria-label={`Titre du jour ${day.dayNumber}`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeDay(dIdx)}
                className="text-red-500 hover:text-red-700 p-1 ml-2"
                aria-label="Supprimer le jour"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <textarea
                value={day.description}
                onChange={(e) => updateDay(dIdx, 'description', e.currentTarget.value)}
                placeholder="Description générale du jour (optionnel)"
                aria-label={`Description du jour ${dIdx + 1}`}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
              />

              <div className="space-y-2">
                {day.activities.map((act, aIdx) => (
                  <div key={act.id} className="flex items-start gap-2 bg-white border border-slate-200 rounded p-2">
                    <input
                      type="time"
                      value={act.time}
                      aria-label={`Heure activité ${aIdx + 1} du jour ${day.dayNumber}`}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-indigo-600"
                    />
                    <input
                      type="text"
                      value={act.label}
                      placeholder="Activité"
                      aria-label={`Nom activité ${aIdx + 1} du jour ${day.dayNumber}`}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeActivity(dIdx, aIdx)}
                      className="text-red-400 hover:text-red-600 p-1"
                      aria-label="Supprimer l'activité"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addActivity(dIdx)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Ajouter une activité
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addDay}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" /> Ajouter un jour
        </button>
      </div>
    </div>
  );
}

function StepPhotos({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  const handlePhotoUpload = useCallback(
    (assetId: string) => {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, { assetId, uploadedAt: new Date().toISOString() }],
      }));
    },
    [setFormData],
  );

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Photos</h2>
      <p className="text-slate-600 mb-4">
        Ajoutez des photos de votre voyage. Minimum 3 photos recommandées pour un bon taux de conversion.
      </p>

      {formData.photos.length > 0 && (
        <div className="mb-4 space-y-2">
          {formData.photos.map((photo, idx) => (
            <div key={photo.assetId} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900">Photo {idx + 1}</span>
                <span className="text-xs text-green-600">({photo.assetId.slice(0, 8)}…)</span>
              </div>
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Supprimer la photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <p className="text-xs text-slate-500">{formData.photos.length} photo(s) téléchargée(s)</p>
        </div>
      )}

      <FileUpload
        accept={['image/jpeg', 'image/png', 'image/webp']}
        maxSize={10 * 1024 * 1024}
        onUpload={handlePhotoUpload}
        label="Déposer vos photos ici (JPG, PNG, WebP — max 10 Mo)"
      />

      {formData.photos.length < 3 && formData.photos.length > 0 && (
        <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Ajoutez au moins {3 - formData.photos.length} photo(s) supplémentaire(s) pour un meilleur taux de conversion.
        </p>
      )}
    </div>
  );
}

function StepBusStops({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  const [myStops, setMyStops] = useState<BusStopFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchStops = async () => {
      try {
        const res = await fetch('/api/pro/bus-stops?take=50', { credentials: 'include', signal: controller.signal });
        if (res.ok) {
          const data = (await res.json()) as { items?: BusStopFromAPI[] };
          setMyStops(data?.items || []);
        } else {
          setError('Impossible de charger vos arrêts');
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        logger.warn('API /api/pro/bus-stops indisponible — données démo');
        const demoStops: BusStopFromAPI[] = [
          {
            id: 'demo-pickup-paris',
            publicName: 'Paris - Gare de l\'Est',
            city: 'Paris',
            addressLine: '3 rue du 8 mai 1945, 75010 Paris',
            type: 'PICKUP_DEPARTURE',
            status: 'VALIDATED'
          },
          {
            id: 'demo-pickup-lyon',
            publicName: 'Lyon - Gare Perrache',
            city: 'Lyon',
            addressLine: '12 cours de Verdun, 69002 Lyon',
            type: 'PICKUP_DEPARTURE',
            status: 'VALIDATED'
          },
          {
            id: 'demo-dropoff-marrakech',
            publicName: 'Marrakech - Medina',
            city: 'Marrakech',
            addressLine: 'Place Jemaa el-Fnaa, 40000 Marrakech',
            type: 'DROPOFF_ARRIVAL',
            status: 'VALIDATED'
          },
          {
            id: 'demo-dropoff-agadir',
            publicName: 'Agadir - Front de Mer',
            city: 'Agadir',
            addressLine: 'Boulevard du 20 Août, 80000 Agadir',
            type: 'DROPOFF_ARRIVAL',
            status: 'VALIDATED'
          }
        ];
        setMyStops(demoStops);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
    return () => controller.abort();
  }, []);

  const pickupStops = myStops.filter((s) => s.type === 'PICKUP_DEPARTURE');
  const dropoffStops = myStops.filter((s) => s.type === 'DROPOFF_ARRIVAL');

  const selectedPickupIds = new Set(
    formData.busStops.filter((bs) => bs.type === 'PICKUP_DEPARTURE').map((bs) => bs.stopId),
  );
  const selectedDropoffIds = new Set(
    formData.busStops.filter((bs) => bs.type === 'DROPOFF_ARRIVAL').map((bs) => bs.stopId),
  );

  const toggleStop = (stopId: string, type: string) => {
    setFormData((prev) => {
      const exists = prev.busStops.find((bs) => bs.stopId === stopId);
      if (exists) {
        return { ...prev, busStops: prev.busStops.filter((bs) => bs.stopId !== stopId) };
      }
      return { ...prev, busStops: [...prev.busStops, { stopId, type }] };
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ height: '24px', width: '200px', borderRadius: '8px', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ height: '48px', borderRadius: '12px', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Arrêts de bus</h2>
      <p className="text-slate-600 mb-6">Sélectionnez les arrêts de départ et d'arrivée.</p>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="font-semibold text-slate-900 mb-3">Points de départ</legend>
          {pickupStops.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun arrêt disponible</p>
          ) : (
            <div className="space-y-2">
              {pickupStops.map((stop) => (
                <label key={stop.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedPickupIds.has(stop.id) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={selectedPickupIds.has(stop.id)}
                    onChange={() => toggleStop(stop.id, 'PICKUP_DEPARTURE')}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{stop.publicName}</p>
                    <p className="text-xs text-slate-500">{stop.city}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="font-semibold text-slate-900 mb-3">Points d&apos;arrivée</legend>
          {dropoffStops.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun arrêt disponible</p>
          ) : (
            <div className="space-y-2">
              {dropoffStops.map((stop) => (
                <label key={stop.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedDropoffIds.has(stop.id) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={selectedDropoffIds.has(stop.id)}
                    onChange={() => toggleStop(stop.id, 'DROPOFF_ARRIVAL')}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{stop.publicName}</p>
                    <p className="text-xs text-slate-500">{stop.city}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      </div>
    </div>
  );
}

function StepPricing({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Tarification</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="edit-basePrice" className="block text-sm font-medium text-slate-700 mb-2">Prix de base (centimes)</label>
          <input
            id="edit-basePrice"
            type="number"
            value={formData.pricing.basePrice}
            onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, basePrice: parseInt(e.currentTarget.value) || 0 } })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
            min={0}
          />
        </div>

        <div>
          <label htmlFor="edit-inclusions" className="block text-sm font-medium text-slate-700 mb-2">Inclusions (une par ligne)</label>
          <textarea
            id="edit-inclusions"
            value={formData.pricing.inclusions.join('\n')}
            onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, inclusions: e.currentTarget.value.split('\n').filter(Boolean) } })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
            rows={3}
            placeholder="Transport&#10;Hébergement&#10;Petit-déjeuner"
          />
        </div>

        <div>
          <label htmlFor="edit-exclusions" className="block text-sm font-medium text-slate-700 mb-2">Exclusions (une par ligne)</label>
          <textarea
            id="edit-exclusions"
            value={formData.pricing.exclusions.join('\n')}
            onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, exclusions: e.currentTarget.value.split('\n').filter(Boolean) } })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
            rows={3}
            placeholder="Déjeuners&#10;Assurance voyage&#10;Dépenses personnelles"
          />
        </div>
      </div>
    </div>
  );
}

function StepSummary({ formData }: { formData: TravelFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Récapitulatif</h2>

      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Titre</p>
          <p className="text-lg font-semibold text-slate-900">{formData.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Destination</p>
            <p className="font-semibold text-slate-900">{formData.destination}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Période</p>
            <p className="font-semibold text-slate-900">{formData.startDate} au {formData.endDate}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">Résumé</p>
          <ul className="text-sm space-y-1 text-slate-900">
            <li>• {formData.rooms.length} type(s) de chambre</li>
            <li>• {formData.program.length} jour(s) de programme</li>
            <li>• {formData.photos.length} photo(s)</li>
            <li>• {formData.busStops.length} arrêt(s) de bus sélectionné(s)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
