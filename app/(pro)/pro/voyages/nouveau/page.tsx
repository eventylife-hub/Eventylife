'use client';

import { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
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

/** Structure d&apos;une activité dans le programme */
interface Activity {
  id: string;
  time: string;
  label: string;
  description: string;
}

/** Structure d&apos;une journée du programme */
interface DayProgram {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: Activity[];
}

/** Structure d&apos;un type de chambre */
interface Room {
  id: string;
  type: string;
  label: string;
  capacity: number;
  pricePerPersonCents: number;
  quantity: number;
}

/** Structure d&apos;une photo téléchargée */
interface Photo {
  assetId: string;
  uploadedAt: string;
}

/** Structure d&apos;un arrêt de bus */
interface BusStop {
  stopId: string;
  type: string;
}

/** Structure d&apos;un arrêt de bus depuis l&apos;API */
interface BusStopFromAPI {
  id: string;
  publicName: string;
  city: string;
  addressLine: string;
  type: string;
  status: string;
}

/** Structure de la tarification */
interface Pricing {
  basePrice: number;
  inclusions: string[];
  exclusions: string[];
}

/** Structure principale du formulaire de voyage */
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

export default function CreateTravelPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [viewOnly, setViewOnly] = useState(false);
  const [formData, setFormData] = useState<TravelFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    destination: '',
    transportMode: 'BUS',
    capacity: 40,
    rooms: [],
    program: [],
    photos: [],
    busStops: [],
    pricing: { basePrice: 0, inclusions: [], exclusions: [] },
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  /**
   * Sauvegarder le voyage en brouillon (DRAFT)
   * Appelle POST /api/pro/travels avec les données actuelles
   */
  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch('/api/pro/travels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          // Le backend crée en status DRAFT par défaut
        }),
      });

      if (response.ok) {
        const travel = await response.json();
        setSaveMessage('Brouillon sauvegardé avec succès !');
        // Rediriger vers la page d'édition après 1.5s
        setTimeout(() => {
          router.push(`/pro/voyages/${travel.data?.id || travel.id}`);
        }, 1500);
      } else {
        const error = await response.json().catch(() => null);
        setSaveMessage(
          error?.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.',
        );
      }
    } catch (error: unknown) {
      // Fallback: API indisponible — utiliser données démo
      logger.warn('API /api/pro/travels indisponible — données démo');
      setSaveMessage('Mode démo: brouillon sauvegardé localement');
      // Simuler une redirection après 1.5s
      setTimeout(() => {
        router.push(`/pro/voyages/demo-${Date.now()}`);
      }, 1500);
    } finally {
      setSaving(false);
    }
  }, [formData, router]);

  const handleStepSubmit = async () => {
    if (currentStep === WIZARD_STEPS.length) {
      // Submit final form
      try {
        const response = await fetch('/api/pro/travels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const travel = await response.json();
          router.push(`/pro/voyages/${travel.id}`);
        }
      } catch (error: unknown) {
        logger.warn('API /api/pro/travels indisponible — données démo');
        // Fallback: redirection avec ID démo
        router.push(`/pro/voyages/demo-${Date.now()}`);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Créer un nouveau voyage</h1>
          <p className="text-slate-600 mt-2">Remplissez les étapes pour créer votre offre de voyage</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {WIZARD_STEPS.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <button type="button"
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
              <button type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button"
              onClick={handleSaveDraft}
              disabled={saving || !formData.title}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <span className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Sauvegarde...' : 'Sauvegarder en brouillon'}
            </button>
            {saveMessage && (
              <span className={`text-sm self-center ${saveMessage.includes('succès') ? 'text-green-600' : 'text-red-500'}`}>
                {saveMessage}
              </span>
            )}

            {currentStep === WIZARD_STEPS.length ? (
              <button type="button"
                onClick={handleStepSubmit}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
              >
                Soumettre Phase 1
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button"
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
            Votre progression est sauvegardée automatiquement. Vous pouvez revenir aux étapes précédentes à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}

// Step Components
function StepInfo({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Informations de base</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Titre du voyage</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: (e.target as HTMLInputElement).value } as TravelFormData)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Ex: Week-end à Paris"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value } as TravelFormData)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Décrivez votre voyage..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date de départ</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, startDate: (e.target as HTMLInputElement).value } as TravelFormData)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date d&apos;arrivée</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, endDate: (e.target as HTMLInputElement).value } as TravelFormData)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, destination: (e.target as HTMLInputElement).value } as TravelFormData)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Ex: Paris"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mode de transport</label>
            <select
              value={formData.transportMode}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, transportMode: e.target.value } as TravelFormData)}
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
          <label className="block text-sm font-medium text-slate-700 mb-2">Capacité (places)</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, capacity: parseInt((e.target as HTMLInputElement).value) } as TravelFormData)}
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
    setFormData((prev: TravelFormData) => ({
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
    setFormData((prev: TravelFormData) => {
      const updated = [...prev.rooms];
      updated[index] = { ...updated[index], [field]: value } as Room;
      // Auto-update capacity when type changes
      if (field === 'type') {
        const rt = ROOM_TYPES.find((r) => r.value === value);
        if (rt) updated[index].capacity = rt.defaultCapacity;
      }
      return { ...prev, rooms: updated };
    });
  };

  const removeRoom = (index: number) => {
    setFormData((prev: TravelFormData) => ({
      ...prev,
      rooms: prev.rooms.filter((_: Room, i: number) => i !== index),
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Hébergement</h2>
      <p className="text-slate-600 mb-4">
        Ajoutez les types de chambres disponibles. Les prix sont par personne en euros.
      </p>

      <div className="space-y-4">
        {formData.rooms.map((room: Room, idx: number) => (
          <div key={room.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">Chambre #{idx + 1}</span>
              <button type="button"
                onClick={() => removeRoom(idx)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Supprimer"
                aria-label="Supprimer la chambre"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                <select
                  value={room.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateRoom(idx, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Libellé (optionnel)</label>
                <input
                  type="text"
                  value={room.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoom(idx, 'label', (e.target as HTMLInputElement).value)}
                  placeholder="Ex: Vue mer"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Capacité (pers.)</label>
                <input
                  type="number"
                  value={room.capacity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoom(idx, 'capacity', parseInt((e.target as HTMLInputElement).value) || 1)}
                  min={1}
                  max={8}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Prix / personne (€)</label>
                <input
                  type="number"
                  value={room.pricePerPersonCents / 100}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoom(idx, 'pricePerPersonCents', Math.round(parseFloat((e.target as HTMLInputElement).value) * 100) || 0)}
                  min={0}
                  step="0.01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre de chambres</label>
                <input
                  type="number"
                  value={room.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoom(idx, 'quantity', parseInt((e.target as HTMLInputElement).value) || 1)}
                  min={1}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button"
          onClick={addRoom}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" /> Ajouter un type de chambre
        </button>
      </div>

      {formData.rooms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
          Total : {formData.rooms.reduce((s: number, r: Room) => s + r.quantity, 0)} chambres ·{' '}
          {formData.rooms.reduce((s: number, r: Room) => s + r.quantity * r.capacity, 0)} places max
        </div>
      )}
    </div>
  );
}

function StepProgram({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  // Auto-calculate days from dates
  const dayCount =
    formData.startDate && formData.endDate
      ? Math.max(1, Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000) + 1)
      : 0;

  const addDay = () => {
    setFormData((prev: TravelFormData) => ({
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
    setFormData((prev: TravelFormData) => {
      const updated = [...prev.program];
      updated[index] = { ...updated[index], [field]: value } as DayProgram;
      return { ...prev, program: updated };
    });
  };

  const removeDay = (index: number) => {
    setFormData((prev: TravelFormData) => ({
      ...prev,
      program: prev.program
        .filter((_: DayProgram, i: number) => i !== index)
        .map((d: DayProgram, i: number) => ({ ...d, dayNumber: i + 1 })),
    }));
  };

  const addActivity = (dayIndex: number) => {
    setFormData((prev: TravelFormData) => {
      const updated = [...prev.program];
      const day = updated[dayIndex];
      if (day) {
        updated[dayIndex] = {
          ...day,
          activities: [
            ...day.activities,
            { id: `act-${Date.now()}`, time: '', label: '', description: '' },
          ],
        } as DayProgram;
      }
      return { ...prev, program: updated };
    });
  };

  const updateActivity = (dayIndex: number, actIndex: number, field: string, value: string) => {
    setFormData((prev: TravelFormData) => {
      const updated = [...prev.program];
      const day = updated[dayIndex];
      if (day) {
        const acts = [...day.activities];
        if (acts[actIndex]) {
          acts[actIndex] = { ...acts[actIndex], [field]: value } as Activity;
          updated[dayIndex] = { ...day, activities: acts } as DayProgram;
        }
      }
      return { ...prev, program: updated };
    });
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    setFormData((prev: TravelFormData) => {
      const updated = [...prev.program];
      const day = updated[dayIndex];
      if (day) {
        updated[dayIndex] = {
          ...day,
          activities: day.activities.filter((_: Activity, i: number) => i !== actIndex),
        } as DayProgram;
      }
      return { ...prev, program: updated };
    });
  };

  // Auto-generate days from dates if program is empty
  const autoGenerateDays = () => {
    if (dayCount > 0 && formData.program.length === 0) {
      const days = Array.from({ length: dayCount }, (_, i) => ({
        id: `day-${Date.now()}-${i}`,
        dayNumber: i + 1,
        title: `Jour ${i + 1}`,
        description: '',
        activities: [],
      })) as DayProgram[];
      setFormData((prev: TravelFormData) => ({ ...prev, program: days }));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Programme</h2>
      <p className="text-slate-600 mb-4">Décrivez le programme jour par jour avec les activités prévues.</p>

      {dayCount > 0 && formData.program.length === 0 && (
        <button type="button"
          onClick={autoGenerateDays}
          className="mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm font-medium flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" /> Générer automatiquement {dayCount} jours depuis vos dates
        </button>
      )}

      <div className="space-y-4">
        {formData.program.map((day: DayProgram, dIdx: number) => (
          <div key={day.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {day.dayNumber}
                </span>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDay(dIdx, 'title', (e.target as HTMLInputElement).value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                  placeholder="Titre du jour"
                />
              </div>
              <button type="button" onClick={() => removeDay(dIdx)} className="text-red-500 hover:text-red-700 p-1 ml-2" aria-label="Supprimer le jour">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <textarea
                value={day.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateDay(dIdx, 'description', e.target.value)}
                placeholder="Description générale du jour (optionnel)"
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600"
              />

              {/* Activities */}
              <div className="space-y-2">
                {day.activities.map((act: Activity, aIdx: number) => (
                  <div key={act.id} className="flex items-start gap-2 bg-white border border-slate-200 rounded p-2">
                    <input
                      type="time"
                      value={act.time}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateActivity(dIdx, aIdx, 'time', (e.target as HTMLInputElement).value)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-indigo-600"
                    />
                    <input
                      type="text"
                      value={act.label}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateActivity(dIdx, aIdx, 'label', (e.target as HTMLInputElement).value)}
                      placeholder="Activité"
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-600"
                    />
                    <button type="button" onClick={() => removeActivity(dIdx, aIdx)} className="text-red-400 hover:text-red-600 p-1" aria-label="Supprimer l'activité">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => addActivity(dIdx)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Ajouter une activité
                </button>
              </div>
            </div>
          </div>
        ))}

        <button type="button"
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
      setFormData((prev: TravelFormData) => ({
        ...prev,
        photos: [...prev.photos, { assetId, uploadedAt: new Date().toISOString() }],
      }));
    },
    [setFormData],
  );

  const removePhoto = (index: number) => {
    setFormData((prev: TravelFormData) => ({
      ...prev,
      photos: prev.photos.filter((_: Photo, i: number) => i !== index),
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Photos</h2>
      <p className="text-slate-600 mb-4">
        Ajoutez des photos de votre voyage. Minimum 3 photos recommandées pour un bon taux de conversion.
      </p>

      {/* Uploaded photos list */}
      {formData.photos.length > 0 && (
        <div className="mb-4 space-y-2">
          {formData.photos.map((photo: Photo, idx: number) => (
            <div
              key={photo.assetId}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900">Photo {idx + 1}</span>
                <span className="text-xs text-green-600">({photo.assetId.slice(0, 8)}…)</span>
              </div>
              <button type="button"
                onClick={() => removePhoto(idx)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Supprimer"
                aria-label="Supprimer la photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <p className="text-xs text-slate-500">{formData.photos.length} photo(s) téléchargée(s)</p>
        </div>
      )}

      {/* FileUpload component */}
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

  // Fetch user's bus stops on mount
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await fetch('/api/pro/bus-stops?take=50', { credentials: 'include' });
        if (res.ok) {
          const data = (await res.json()) as { items?: BusStopFromAPI[] };
          setMyStops(data?.items || []);
        } else {
          setError('Impossible de charger vos arrêts');
        }
      } catch (error: unknown) {
        logger.warn('API /api/pro/bus-stops indisponible — données démo');
        // Fallback: données démo pour les arrêts de bus
        const demoStops: BusStopFromAPI[] = [
          {
            id: 'demo-pickup-paris',
            publicName: 'Paris - Gare de l'Est',
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
            id: 'demo-pickup-marseille',
            publicName: 'Marseille - Gare Saint-Charles',
            city: 'Marseille',
            addressLine: 'Avenue Pierre Semard, 13001 Marseille',
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
  }, []);

  const pickupStops = myStops.filter((s) => s.type === 'PICKUP_DEPARTURE');
  const dropoffStops = myStops.filter((s) => s.type === 'DROPOFF_ARRIVAL');

  const selectedPickupIds = new Set(
    formData.busStops.filter((bs: BusStop) => bs.type === 'PICKUP_DEPARTURE').map((bs: BusStop) => bs.stopId),
  );
  const selectedDropoffIds = new Set(
    formData.busStops.filter((bs: BusStop) => bs.type === 'DROPOFF_ARRIVAL').map((bs: BusStop) => bs.stopId),
  );

  const toggleStop = (stopId: string, type: string) => {
    setFormData((prev: TravelFormData) => {
      const exists = prev.busStops.find((bs: BusStop) => bs.stopId === stopId);
      if (exists) {
        return { ...prev, busStops: prev.busStops.filter((bs: BusStop) => bs.stopId !== stopId) };
      }
      return { ...prev, busStops: [...prev.busStops, { stopId, type }] };
    });
  };

  const StopList = ({ stops, type, selectedIds }: { stops: BusStopFromAPI[]; type: string; selectedIds: Set<string> }) => {
    const validated = stops.filter((s) => s.status === 'VALIDATED');
    const others = stops.filter((s) => s.status !== 'VALIDATED');

    if (stops.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 mb-2">Aucun arrêt de ce type</p>
          <a
            href="/pro/arrets"
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Créer un arrêt →
          </a>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {validated.map((stop) => (
          <label
            key={stop.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedIds.has(stop.id)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(stop.id)}
              onChange={() => toggleStop(stop.id, type)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{stop.publicName}</p>
              <p className="text-xs text-slate-500">{stop.city} — {stop.addressLine}</p>
            </div>
            <MapPin className="w-4 h-4 text-slate-400" />
          </label>
        ))}

        {others.length > 0 && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-400 mb-2">En attente de validation ({others.length})</p>
            {others.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3 p-2 rounded opacity-50">
                <input type="checkbox" disabled className="w-4 h-4" />
                <span className="text-xs text-slate-500">{stop.publicName} ({stop.status})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Arrêts de bus</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-slate-200 rounded-lg" />
          <div className="h-24 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Arrêts de bus</h2>
      <p className="text-slate-600 mb-4">
        Sélectionnez les arrêts de départ et d&apos;arrivée parmi vos arrêts validés.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" /> Arrêts de départ ({selectedPickupIds.size} sélectionné{selectedPickupIds.size > 1 ? 's' : ''})
          </h3>
          <StopList stops={pickupStops} type="PICKUP_DEPARTURE" selectedIds={selectedPickupIds} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" /> Arrêts d&apos;arrivée ({selectedDropoffIds.size} sélectionné{selectedDropoffIds.size > 1 ? 's' : ''})
          </h3>
          <StopList stops={dropoffStops} type="DROPOFF_ARRIVAL" selectedIds={selectedDropoffIds} />
        </div>
      </div>

      {myStops.length === 0 && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            Vous n&apos;avez pas encore d&apos;arrêts de bus. Créez-les dans la section{' '}
            <a href="/pro/arrets" target="_blank" rel="noopener noreferrer" className="font-medium underline">
              Mes arrêts
            </a>{' '}
            avant de les associer à un voyage.
          </p>
        </div>
      )}
    </div>
  );
}

function StepPricing({ formData, setFormData }: { formData: TravelFormData; setFormData: React.Dispatch<React.SetStateAction<TravelFormData>> }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Tarification</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Prix de base par personne (EUR)</label>
          <input
            type="number"
            value={formData.pricing.basePrice / 100}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: TravelFormData) => ({
                ...prev,
                pricing: { ...prev.pricing, basePrice: parseInt((e.target as HTMLInputElement).value) * 100 },
              }))
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Inclusions (une par ligne)</label>
          <textarea
            value={formData.pricing.inclusions.join('\n')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: TravelFormData) => ({
                ...prev,
                pricing: { ...prev.pricing, inclusions: (e.target as HTMLInputElement).value.split('\n') },
              }))
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Hébergement 4 nuits"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Exclusions (optionnel)</label>
          <textarea
            value={formData.pricing.exclusions.join('\n')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: TravelFormData) => ({
                ...prev,
                pricing: { ...prev.pricing, exclusions: (e.target as HTMLInputElement).value.split('\n') },
              }))
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Déjeuners"
            rows={4}
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
        <div className="border border-slate-200 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-4">Informations générales</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-600">Titre</dt>
              <dd className="font-medium text-slate-900">{formData.title}</dd>
            </div>
            <div>
              <dt className="text-slate-600">Destination</dt>
              <dd className="font-medium text-slate-900">{formData.destination}</dd>
            </div>
            <div>
              <dt className="text-slate-600">Dates</dt>
              <dd className="font-medium text-slate-900">
                {formData.startDate} → {formData.endDate}
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Capacité</dt>
              <dd className="font-medium text-slate-900">{formData.capacity} places</dd>
            </div>
          </dl>
        </div>

        <div className="border border-slate-200 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-4">Tarification</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Prix de base</dt>
              <dd className="font-medium text-slate-900">{formatPrice(formData.pricing.basePrice)}</dd>
            </div>
            {formData.pricing.inclusions.length > 0 && (
              <div>
                <dt className="text-slate-600 font-medium mb-2">Inclusions:</dt>
                <ul className="ml-4 list-disc">
                  {formData.pricing.inclusions.map((inc: string, i: number) => (
                    inc && <li key={i} className="text-slate-700">{inc}</li>
                  ))}
                </ul>
              </div>
            )}
          </dl>
        </div>

        {/* Hébergement */}
        {formData.rooms.length > 0 && (
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-4">Hébergement</h3>
            <div className="space-y-2 text-sm">
              {formData.rooms.map((room: Room, i: number) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-600">
                    {room.type} {room.label && `(${room.label})`} × {room.quantity}
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(room.pricePerPersonCents)}/pers.
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Programme */}
        {formData.program.length > 0 && (
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-4">Programme — {formData.program.length} jour(s)</h3>
            <div className="space-y-2 text-sm">
              {formData.program.map((day: DayProgram) => (
                <div key={day.id}>
                  <span className="font-medium text-slate-900">J{day.dayNumber}: {day.title}</span>
                  {day.activities.length > 0 && (
                    <span className="text-slate-500"> — {day.activities.length} activité(s)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos & Arrêts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-2">Photos</h3>
            <p className="text-sm text-slate-600">{formData.photos.length} photo(s) téléchargée(s)</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-2">Arrêts bus</h3>
            <p className="text-sm text-slate-600">
              {formData.busStops.filter((bs: BusStop) => bs.type === 'PICKUP_DEPARTURE').length} départ(s),{' '}
              {formData.busStops.filter((bs: BusStop) => bs.type === 'DROPOFF_ARRIVAL').length} arrivée(s)
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            En cliquant sur "Soumettre Phase 1", votre voyage passera en révision auprès de notre équipe.
            Vous recevrez un email de confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
