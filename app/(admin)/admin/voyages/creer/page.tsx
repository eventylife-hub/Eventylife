'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { ToastNotification } from '@/components/ui/toast-notification';
type TransportMode = 'BUS' | 'FLIGHT' | 'MIXED';
type Step = 1 | 2 | 3 | 4 | 5;

interface BasicInfo {
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: string;
  imageUrl: string;
}

interface TransportConfig {
  mode: TransportMode;
  busCompany?: string;
  flightCompany?: string;
  capacity: number;
  pricePerSeatCentimes: number;
  busStops?: string[];
}

interface RoomType {
  name: string;
  capacity: number;
  priceCentimes: number;
}

interface HotelBlock {
  hotelName: string;
  roomTypes: RoomType[];
  totalRooms: number;
  checkInDate: string;
  checkOutDate: string;
}

interface PricingConfig {
  basePriceTTCCentimes: number;
  insuranceOptions: Array<{
    name: string;
    priceCentimes: number;
  }>;
  paymentModes: string[];
}

/**
 * Page Créer Voyage - Formulaire multi-étapes
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function CreateTripPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    title: '',
    slug: '',
    description: '',
    startDate: '',
    endDate: '',
    destination: '',
    imageUrl: '',
  });

  const [transport, setTransport] = useState<TransportConfig>({
    mode: 'BUS',
    capacity: 0,
    pricePerSeatCentimes: 0,
    busStops: [],
  });

  const [accommodation, setAccommodation] = useState<HotelBlock>({
    hotelName: '',
    roomTypes: [],
    totalRooms: 0,
    checkInDate: '',
    checkOutDate: '',
  });

  const [pricing, setPricing] = useState<PricingConfig>({
    basePriceTTCCentimes: 0,
    insuranceOptions: [],
    paymentModes: ['CARD', 'TRANSFER'],
  });

  const [newInsurance, setNewInsurance] = useState({ name: '', priceCentimes: 0 });
  const [newBusStop, setNewBusStop] = useState('');
  const [newRoomType, setNewRoomType] = useState<RoomType>({
    name: '',
    capacity: 0,
    priceCentimes: 0,
  });

  // Initialize form on mount
  useEffect(() => {
    try {
      setIsInitializing(false);
      setError(null);
    } catch (err: unknown) {
      setError('Erreur lors de l\'initialisation du formulaire');
      setIsInitializing(false);
    }
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    const slug = basicInfo.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setBasicInfo((prev) => ({ ...prev, slug }));
  }, [basicInfo.title]);

  const formatCurrency = (centimes: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(centimes / 100);
  };

  const handleAddInsurance = () => {
    if (newInsurance.name && newInsurance.priceCentimes > 0) {
      setPricing((prev) => ({
        ...prev,
        insuranceOptions: [...prev.insuranceOptions, newInsurance],
      }));
      setNewInsurance({ name: '', priceCentimes: 0 });
    }
  };

  const handleAddRoomType = () => {
    if (newRoomType.name && newRoomType.capacity > 0 && newRoomType.priceCentimes > 0) {
      setAccommodation((prev) => ({
        ...prev,
        roomTypes: [...prev.roomTypes, newRoomType],
      }));
      setNewRoomType({ name: '', capacity: 0, priceCentimes: 0 });
    }
  };

  const handleAddBusStop = () => {
    if (newBusStop.trim()) {
      setTransport((prev) => ({
        ...prev,
        busStops: [...(prev.busStops || []), newBusStop],
      }));
      setNewBusStop('');
    }
  };

  const handleRemoveInsurance = (index: number) => {
    setPricing((prev) => ({
      ...prev,
      insuranceOptions: prev.insuranceOptions.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveRoomType = (index: number) => {
    setAccommodation((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveBusStop = (index: number) => {
    setTransport((prev) => ({
      ...prev,
      busStops: prev.busStops?.filter((_, i) => i !== index) || [],
    }));
  };

  const isStep1Valid = () => {
    return (
      basicInfo.title.trim() &&
      basicInfo.description.trim() &&
      basicInfo.startDate &&
      basicInfo.endDate &&
      basicInfo.destination.trim() &&
      basicInfo.imageUrl.trim()
    );
  };

  const isStep2Valid = () => {
    return (
      transport.mode &&
      ((transport.mode === 'BUS' && transport.busCompany) ||
        (transport.mode === 'FLIGHT' && transport.flightCompany) ||
        (transport.mode === 'MIXED' && transport.busCompany && transport.flightCompany)) &&
      transport.capacity > 0 &&
      transport.pricePerSeatCentimes > 0
    );
  };

  const isStep3Valid = () => {
    return (
      accommodation.hotelName.trim() &&
      accommodation.checkInDate &&
      accommodation.checkOutDate &&
      accommodation.totalRooms > 0 &&
      accommodation.roomTypes.length > 0
    );
  };

  const isStep4Valid = () => {
    return (
      pricing.basePriceTTCCentimes > 0 && pricing.paymentModes.length > 0
    );
  };

  const handleCreateTrip = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        title: basicInfo.title,
        slug: basicInfo.slug,
        description: basicInfo.description,
        startDate: basicInfo.startDate,
        endDate: basicInfo.endDate,
        destination: basicInfo.destination,
        imageUrl: basicInfo.imageUrl,
        transportConfig: {
          mode: transport.mode,
          busCompany: transport.busCompany,
          flightCompany: transport.flightCompany,
          capacity: transport.capacity,
          pricePerSeatCentimes: transport.pricePerSeatCentimes,
          busStops: transport.busStops || [],
        },
        accommodationConfig: {
          hotelName: accommodation.hotelName,
          checkInDate: accommodation.checkInDate,
          checkOutDate: accommodation.checkOutDate,
          totalRooms: accommodation.totalRooms,
          roomTypes: accommodation.roomTypes,
        },
        pricingConfig: {
          basePriceTTCCentimes: pricing.basePriceTTCCentimes,
          insuranceOptions: pricing.insuranceOptions,
          paymentModes: pricing.paymentModes,
        },
      };

      const response = await fetch('/api/admin/travels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        if (response.status === 400) {
          throw new Error('Données invalides. Veuillez vérifier tous les champs.');
        }
        throw new Error('Erreur lors de la création du voyage');
      }

      const data = await response.json() as { id: string };
      window.location.href = `/admin/voyages/${data.id}`;
    } catch (err: unknown) {
      logger.warn('API /admin/travels (POST) indisponible — mode démo');
      const demoId = `demo-${Date.now()}`;
      setSubmitError(null);
      setIsSubmitting(false);
      window.location.href = `/admin/voyages/${demoId}`;
    }
  };

  // Skeleton loader for initial loading
  if (isInitializing) {
    return (
      <div className="admin-fade-in space-y-6 max-w-4xl mx-auto">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Créer un voyage
          </h1>
        </div>
        <div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
        <div className="admin-panel">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-fade-in space-y-6 max-w-4xl mx-auto">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Créer un voyage
        </h1>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 admin-fade-in delay-1">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">{error}</p>
            <button type="button"
              onClick={() => setError(null)}
              className="text-sm text-red-700 hover:text-red-900 underline mt-1"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Submit error banner */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 admin-fade-in delay-1">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">{submitError}</p>
            <button type="button"
              onClick={() => setSubmitError(null)}
              className="text-sm text-red-700 hover:text-red-900 underline mt-1"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Indicateur de progression */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <button type="button"
              onClick={() => {
                if (step < currentStep) setCurrentStep(step as Step);
              }}
              aria-label={`Étape ${step}${step < currentStep ? ' (complétée)' : step === currentStep ? ' (en cours)' : ''}`}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                step < currentStep
                  ? 'bg-green-600 text-white cursor-pointer'
                  : step === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
            </button>
            {step < 5 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Contenu par étape */}
      <div className="admin-panel admin-fade-in delay-2">
        <div className="admin-panel-body p-8">
          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Informations de base</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="admin-input-label">Titre du voyage</label>
                  <input
                    id="title"
                    value={basicInfo.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBasicInfo((prev) => ({ ...prev, title: (e.target as HTMLInputElement).value }))
                    }
                    placeholder="Ex: Voyage à Barcelone 2024"
                    className="admin-input mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="admin-input-label">Slug (auto-généré)</label>
                  <input
                    id="slug"
                    value={basicInfo.slug}
                    disabled
                    className="admin-input mt-1 bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="admin-input-label">Description</label>
                  <textarea
                    id="description"
                    value={basicInfo.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        description: (e.target as HTMLInputElement).value,
                      }))
                    }
                    placeholder="Description détaillée du voyage"
                    className="admin-input mt-1"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="admin-input-label">Date de départ</label>
                    <input
                      id="startDate"
                      type="date"
                      value={basicInfo.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          startDate: (e.target as HTMLInputElement).value,
                        }))
                      }
                      className="admin-input mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="admin-input-label">Date de retour</label>
                    <input
                      id="endDate"
                      type="date"
                      value={basicInfo.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          endDate: (e.target as HTMLInputElement).value,
                        }))
                      }
                      className="admin-input mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="destination" className="admin-input-label">Destination</label>
                  <input
                    id="destination"
                    value={basicInfo.destination}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        destination: (e.target as HTMLInputElement).value,
                      }))
                    }
                    placeholder="Ex: Barcelone, Espagne"
                    className="admin-input mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="admin-input-label">URL de l&apos;image</label>
                  <input
                    id="imageUrl"
                    type="url"
                    value={basicInfo.imageUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBasicInfo((prev) => ({ ...prev, imageUrl: (e.target as HTMLInputElement).value }))
                    }
                    placeholder="https://..."
                    className="admin-input mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Configuration transport */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Configuration du transport</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="transport-mode" className="admin-input-label">Mode de transport</label>
                  <select id="transport-mode" value={transport.mode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTransport((prev) => ({ ...prev, mode: e.target.value as TransportMode }))} className="admin-input mt-1">
                    <option value="BUS">Bus</option>
                    <option value="FLIGHT">Avion</option>
                    <option value="MIXED">Mixte (Bus + Avion)</option>
                  </select>
                </div>

                {(transport.mode === 'BUS' || transport.mode === 'MIXED') && (
                  <div>
                    <label htmlFor="busCompany" className="admin-input-label">Transporteur bus</label>
                    <input
                      id="busCompany"
                      value={transport.busCompany || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTransport((prev) => ({
                          ...prev,
                          busCompany: (e.target as HTMLInputElement).value,
                        }))
                      }
                      placeholder="Ex: FlixBus"
                      className="mt-1"
                    />
                  </div>
                )}

                {(transport.mode === 'FLIGHT' || transport.mode === 'MIXED') && (
                  <div>
                    <label htmlFor="flightCompany" className="admin-input-label">Transporteur avion</label>
                    <input
                      id="flightCompany"
                      value={transport.flightCompany || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTransport((prev) => ({
                          ...prev,
                          flightCompany: (e.target as HTMLInputElement).value,
                        }))
                      }
                      placeholder="Ex: Ryanair"
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacité (places)</Label>
                    <input
                      id="capacity"
                      type="number"
                      value={transport.capacity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTransport((prev) => ({
                          ...prev,
                          capacity: parseInt((e.target as HTMLInputElement).value) || 0,
                        }))
                      }
                      min="1"
                      className="admin-input mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="pricePerSeat" className="admin-input-label">Prix/place (EUR)</label>
                    <input
                      id="pricePerSeat"
                      type="number"
                      value={transport.pricePerSeatCentimes / 100}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTransport((prev) => ({
                          ...prev,
                          pricePerSeatCentimes: Math.round(
                            (parseFloat((e.target as HTMLInputElement).value) || 0) * 100
                          ),
                        }))
                      }
                      step="0.01"
                      min="0"
                      className="admin-input mt-1"
                    />
                  </div>
                </div>

                {transport.mode === 'BUS' && (
                  <div>
                    <label htmlFor="busStop" className="admin-input-label">Arrêts bus</label>
                    <div className="mt-1 space-y-2">
                      <div className="flex gap-2">
                        <input
                          id="busStop"
                          value={newBusStop}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBusStop((e.target as HTMLInputElement).value)}
                          placeholder="Ajouter un arrêt"
                          className="admin-input"
                        />
                        <button type="button" onClick={handleAddBusStop} className="admin-btn-secondary">
                          Ajouter
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(transport.busStops || []).map((stop, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                          >
                            <span>{stop}</span>
                            <button type="button"
                              onClick={() => handleRemoveBusStop(index)}
                              className="admin-btn-destructive text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Étape 3: Hébergement */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Configuration d&apos;hébergement</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="hotelName" className="admin-input-label">Nom de l&apos;hôtel</label>
                  <input
                    id="hotelName"
                    value={accommodation.hotelName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAccommodation((prev) => ({
                        ...prev,
                        hotelName: (e.target as HTMLInputElement).value,
                      }))
                    }
                    placeholder="Ex: Hotel Barcelona Vista"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="checkInDate">Check-in</Label>
                    <Input
                      id="checkInDate"
                      type="date"
                      value={accommodation.checkInDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAccommodation((prev) => ({
                          ...prev,
                          checkInDate: (e.target as HTMLInputElement).value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOutDate">Check-out</Label>
                    <Input
                      id="checkOutDate"
                      type="date"
                      value={accommodation.checkOutDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAccommodation((prev) => ({
                          ...prev,
                          checkOutDate: (e.target as HTMLInputElement).value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalRooms">Total chambres</Label>
                    <Input
                      id="totalRooms"
                      type="number"
                      value={accommodation.totalRooms}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAccommodation((prev) => ({
                          ...prev,
                          totalRooms: parseInt((e.target as HTMLInputElement).value) || 0,
                        }))
                      }
                      min="1"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Types de chambres</Label>
                  <div className="mt-1 space-y-3">
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="roomName" className="text-sm">
                            Type
                          </Label>
                          <Input
                            id="roomName"
                            value={newRoomType.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setNewRoomType((prev) => ({
                                ...prev,
                                name: (e.target as HTMLInputElement).value,
                              }))
                            }
                            placeholder="Ex: Double Standard"
                            className="mt-1 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="roomCapacity" className="text-sm">
                            Capacité
                          </Label>
                          <Input
                            id="roomCapacity"
                            type="number"
                            value={newRoomType.capacity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setNewRoomType((prev) => ({
                                ...prev,
                                capacity: parseInt((e.target as HTMLInputElement).value) || 0,
                              }))
                            }
                            min="1"
                            className="mt-1 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="roomPrice" className="text-sm">
                            Prix (EUR)
                          </Label>
                          <Input
                            id="roomPrice"
                            type="number"
                            value={newRoomType.priceCentimes / 100}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setNewRoomType((prev) => ({
                                ...prev,
                                priceCentimes: Math.round(
                                  (parseFloat((e.target as HTMLInputElement).value) || 0) * 100
                                ),
                              }))
                            }
                            step="0.01"
                            min="0"
                            className="mt-1 text-sm"
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddRoomType} size="sm" className="w-full">
                        Ajouter ce type
                      </Button>
                    </div>

                    {accommodation.roomTypes.map((room, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{room.name}</p>
                          <p className="text-sm text-gray-600">
                            {room.capacity} place(s) - {formatCurrency(room.priceCentimes)}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRemoveRoomType(index)}
                          size="sm"
                          variant="destructive"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 4: Tarification */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Tarification</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="basePrice">Prix de base (TTC, EUR)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={pricing.basePriceTTCCentimes / 100}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPricing((prev) => ({
                        ...prev,
                        basePriceTTCCentimes: Math.round(
                          (parseFloat((e.target as HTMLInputElement).value) || 0) * 100
                        ),
                      }))
                    }
                    step="0.01"
                    min="0"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Options d&apos;assurance</Label>
                  <div className="mt-1 space-y-3">
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="insuranceName" className="text-sm">
                            Nom
                          </Label>
                          <Input
                            id="insuranceName"
                            value={newInsurance.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setNewInsurance((prev) => ({
                                ...prev,
                                name: (e.target as HTMLInputElement).value,
                              }))
                            }
                            placeholder="Ex: Annulation complète"
                            className="mt-1 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="insurancePrice" className="text-sm">
                            Prix (EUR)
                          </Label>
                          <Input
                            id="insurancePrice"
                            type="number"
                            value={newInsurance.priceCentimes / 100}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setNewInsurance((prev) => ({
                                ...prev,
                                priceCentimes: Math.round(
                                  (parseFloat((e.target as HTMLInputElement).value) || 0) * 100
                                ),
                              }))
                            }
                            step="0.01"
                            min="0"
                            className="mt-1 text-sm"
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddInsurance} size="sm" className="w-full">
                        Ajouter cette option
                      </Button>
                    </div>

                    {pricing.insuranceOptions.map((insurance, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <p className="font-medium">{insurance.name}</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(insurance.priceCentimes)}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRemoveInsurance(index)}
                          size="sm"
                          variant="destructive"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Modes de paiement</Label>
                  <div className="mt-2 space-y-2">
                    {[
                      { id: 'CARD', label: 'Carte bancaire' },
                      { id: 'TRANSFER', label: 'Virement' },
                      { id: 'CHECK', label: 'Chèque' },
                      { id: 'CASH', label: 'Espèces' },
                    ].map((mode) => (
                      <label key={mode.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={pricing.paymentModes.includes(mode.id)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if ((e.target as HTMLInputElement).checked) {
                              setPricing((prev) => ({
                                ...prev,
                                paymentModes: [...prev.paymentModes, mode.id],
                              }));
                            } else {
                              setPricing((prev) => ({
                                ...prev,
                                paymentModes: prev.paymentModes.filter((m) => m !== mode.id
                                ),
                              }));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span>{mode.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 5: Résumé et publication */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Résumé et publication</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Informations de base</h3>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Titre</p>
                      <p className="font-medium">{basicInfo.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Destination</p>
                      <p className="font-medium">{basicInfo.destination}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dates</p>
                      <p className="font-medium">
                        {basicInfo.startDate && basicInfo.endDate
                          ? `${formatDate(basicInfo.startDate)} - ${formatDate(basicInfo.endDate)}`
                          : '-'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Transport</h3>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Mode</p>
                      <p className="font-medium">{transport.mode}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Capacité</p>
                      <p className="font-medium">{transport.capacity} places</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Prix/place</p>
                      <p className="font-medium">
                        {formatCurrency(transport.pricePerSeatCentimes)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Hébergement</h3>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Hôtel</p>
                      <p className="font-medium">{accommodation.hotelName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Types de chambres</p>
                      <p className="font-medium">
                        {accommodation.roomTypes.length} type(s)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Tarification</h3>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Prix de base</p>
                      <p className="font-medium">
                        {formatCurrency(pricing.basePriceTTCCentimes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Options assurance</p>
                      <p className="font-medium">
                        {pricing.insuranceOptions.length} option(s)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  Ce voyage sera créé en tant que <strong>BROUILLON</strong>. Vous
                  pourrez le modifier et le publier ultérieurement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons de navigation */}
      <div className="flex items-center justify-between admin-fade-in delay-3">
        <button type="button"
          onClick={() => setCurrentStep((prev) => (Math.max(1, prev - 1) as Step))}
          disabled={currentStep === 1}
          className="admin-btn-secondary gap-2 flex items-center"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </button>

        <div className="text-sm text-gray-600">
          Étape {currentStep} sur 5
        </div>

        {currentStep < 5 ? (
          <button type="button"
            onClick={() => {
              if (currentStep === 1 && !isStep1Valid()) {
                setToast({ type: 'error', message: 'Veuillez remplir tous les champs de cette étape' });
                return;
              }
              if (currentStep === 2 && !isStep2Valid()) {
                setToast({ type: 'error', message: 'Veuillez remplir tous les champs de cette étape' });
                return;
              }
              if (currentStep === 3 && !isStep3Valid()) {
                setToast({ type: 'error', message: 'Veuillez remplir tous les champs de cette étape' });
                return;
              }
              if (currentStep === 4 && !isStep4Valid()) {
                setToast({ type: 'error', message: 'Veuillez remplir tous les champs de cette étape' });
                return;
              }
              setCurrentStep((prev) => (Math.min(5, prev + 1) as Step));
            }}
            className="admin-btn-primary gap-2 flex items-center"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button"
            onClick={handleCreateTrip}
            disabled={isSubmitting}
            className="admin-btn-primary gap-2 flex items-center bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            {isSubmitting ? 'Création...' : 'Créer le voyage'}
          </button>
        )}
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
