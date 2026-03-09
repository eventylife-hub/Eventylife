'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Skeleton, SkeletonGrid } from '@/components/ui/skeleton';

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
    } catch (err) {
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

      const data = await response.json();
      window.location.href = `/admin/voyages/${data.id}`;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue lors de la création du voyage';
      setSubmitError(errorMsg);
      setIsSubmitting(false);
    }
  };

  // Skeleton loader for initial loading
  if (isInitializing) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <Skeleton height="2rem" width="50%" className="mb-4" />
          <Skeleton height="1rem" width="70%" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton height="1.5rem" width="30%" />
          </CardHeader>
          <CardContent>
            <SkeletonGrid columns={1} count={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">{error}</p>
            <button
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">{submitError}</p>
            <button
              onClick={() => setSubmitError(null)}
              className="text-sm text-red-700 hover:text-red-900 underline mt-1"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Créer un voyage</h1>
        <p className="text-gray-600 mt-2">
          Complétez les 5 étapes pour créer un nouveau voyage
        </p>
      </div>

      {/* Indicateur de progression */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <button
              onClick={() => {
                if (step < currentStep) setCurrentStep(step as Step);
              }}
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
      <Card>
        <CardContent className="p-8">
          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Informations de base</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre du voyage</Label>
                  <Input
                    id="title"
                    value={basicInfo.title}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Ex: Voyage à Barcelone 2024"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (auto-généré)</Label>
                  <Input
                    id="slug"
                    value={basicInfo.slug}
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={basicInfo.description}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description détaillée du voyage"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Date de départ</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={basicInfo.startDate}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Date de retour</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={basicInfo.endDate}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={basicInfo.destination}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    placeholder="Ex: Barcelone, Espagne"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">URL de l&apos;image</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={basicInfo.imageUrl}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({ ...prev, imageUrl: e.target.value }))
                    }
                    placeholder="https://..."
                    className="mt-1"
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
                  <Label htmlFor="transport-mode">Mode de transport</Label>
                  <Select value={transport.mode} onValueChange={(value) => setTransport((prev) => ({ ...prev, mode: value as TransportMode }))}>
                    <SelectTrigger id="transport-mode" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="FLIGHT">Avion</SelectItem>
                      <SelectItem value="MIXED">Mixte (Bus + Avion)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(transport.mode === 'BUS' || transport.mode === 'MIXED') && (
                  <div>
                    <Label htmlFor="busCompany">Transporteur bus</Label>
                    <Input
                      id="busCompany"
                      value={transport.busCompany || ''}
                      onChange={(e) =>
                        setTransport((prev) => ({
                          ...prev,
                          busCompany: e.target.value,
                        }))
                      }
                      placeholder="Ex: FlixBus"
                      className="mt-1"
                    />
                  </div>
                )}

                {(transport.mode === 'FLIGHT' || transport.mode === 'MIXED') && (
                  <div>
                    <Label htmlFor="flightCompany">Transporteur avion</Label>
                    <Input
                      id="flightCompany"
                      value={transport.flightCompany || ''}
                      onChange={(e) =>
                        setTransport((prev) => ({
                          ...prev,
                          flightCompany: e.target.value,
                        }))
                      }
                      placeholder="Ex: Ryanair"
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacité (places)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={transport.capacity}
                      onChange={(e) =>
                        setTransport((prev) => ({
                          ...prev,
                          capacity: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerSeat">Prix/place (EUR)</Label>
                    <Input
                      id="pricePerSeat"
                      type="number"
                      value={transport.pricePerSeatCentimes / 100}
                      onChange={(e) =>
                        setTransport((prev) => ({
                          ...prev,
                          pricePerSeatCentimes: Math.round(
                            (parseFloat(e.target.value) || 0) * 100
                          ),
                        }))
                      }
                      step="0.01"
                      min="0"
                      className="mt-1"
                    />
                  </div>
                </div>

                {transport.mode === 'BUS' && (
                  <div>
                    <Label htmlFor="busStop">Arrêts bus</Label>
                    <div className="mt-1 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="busStop"
                          value={newBusStop}
                          onChange={(e) => setNewBusStop(e.target.value)}
                          placeholder="Ajouter un arrêt"
                        />
                        <Button onClick={handleAddBusStop} size="sm">
                          Ajouter
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(transport.busStops || []).map((stop, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                          >
                            <span>{stop}</span>
                            <Button
                              onClick={() => handleRemoveBusStop(index)}
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
                  <Label htmlFor="hotelName">Nom de l&apos;hôtel</Label>
                  <Input
                    id="hotelName"
                    value={accommodation.hotelName}
                    onChange={(e) =>
                      setAccommodation((prev) => ({
                        ...prev,
                        hotelName: e.target.value,
                      }))
                    }
                    placeholder="Ex: Hotel Barcelona Vista"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="checkInDate">Check-in</Label>
                    <Input
                      id="checkInDate"
                      type="date"
                      value={accommodation.checkInDate}
                      onChange={(e) =>
                        setAccommodation((prev) => ({
                          ...prev,
                          checkInDate: e.target.value,
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
                      onChange={(e) =>
                        setAccommodation((prev) => ({
                          ...prev,
                          checkOutDate: e.target.value,
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
                      onChange={(e) =>
                        setAccommodation((prev) => ({
                          ...prev,
                          totalRooms: parseInt(e.target.value) || 0,
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
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="roomName" className="text-sm">
                            Type
                          </Label>
                          <Input
                            id="roomName"
                            value={newRoomType.name}
                            onChange={(e) =>
                              setNewRoomType((prev) => ({
                                ...prev,
                                name: e.target.value,
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
                            onChange={(e) =>
                              setNewRoomType((prev) => ({
                                ...prev,
                                capacity: parseInt(e.target.value) || 0,
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
                            onChange={(e) =>
                              setNewRoomType((prev) => ({
                                ...prev,
                                priceCentimes: Math.round(
                                  (parseFloat(e.target.value) || 0) * 100
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
                    onChange={(e) =>
                      setPricing((prev) => ({
                        ...prev,
                        basePriceTTCCentimes: Math.round(
                          (parseFloat(e.target.value) || 0) * 100
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
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="insuranceName" className="text-sm">
                            Nom
                          </Label>
                          <Input
                            id="insuranceName"
                            value={newInsurance.name}
                            onChange={(e) =>
                              setNewInsurance((prev) => ({
                                ...prev,
                                name: e.target.value,
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
                            onChange={(e) =>
                              setNewInsurance((prev) => ({
                                ...prev,
                                priceCentimes: Math.round(
                                  (parseFloat(e.target.value) || 0) * 100
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
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPricing((prev) => ({
                                ...prev,
                                paymentModes: [...prev.paymentModes, mode.id],
                              }));
                            } else {
                              setPricing((prev) => ({
                                ...prev,
                                paymentModes: prev.paymentModes.filter(
                                  (m) => m !== mode.id
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
        </CardContent>
      </Card>

      {/* Boutons de navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCurrentStep((prev) => (Math.max(1, prev - 1) as Step))}
          disabled={currentStep === 1}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </Button>

        <div className="text-sm text-gray-600">
          Étape {currentStep} sur 5
        </div>

        {currentStep < 5 ? (
          <Button
            onClick={() => {
              if (currentStep === 1 && !isStep1Valid()) {
                alert('Veuillez remplir tous les champs de cette étape');
                return;
              }
              if (currentStep === 2 && !isStep2Valid()) {
                alert('Veuillez remplir tous les champs de cette étape');
                return;
              }
              if (currentStep === 3 && !isStep3Valid()) {
                alert('Veuillez remplir tous les champs de cette étape');
                return;
              }
              if (currentStep === 4 && !isStep4Valid()) {
                alert('Veuillez remplir tous les champs de cette étape');
                return;
              }
              setCurrentStep((prev) => (Math.min(5, prev + 1) as Step));
            }}
            className="gap-2"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCreateTrip}
            disabled={isSubmitting}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            {isSubmitting ? 'Création...' : 'Créer le voyage'}
          </Button>
        )}
      </div>
    </div>
  );
}
