'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Save, Loader, AlertCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusStopForm {
  publicName: string;
  internalName: string;
  type: 'PICKUP_DEPARTURE' | 'DROPOFF_ARRIVAL';
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  instructions: string;
  parkingInfo: string;
  accessibilityInfo: string;
}

export default function NouvelArretPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BusStopForm>({
    publicName: '',
    internalName: '',
    type: 'PICKUP_DEPARTURE',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'France',
    latitude: '',
    longitude: '',
    instructions: '',
    parkingInfo: '',
    accessibilityInfo: '',
  });

  const updateField = (field: keyof BusStopForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      };

      const res = await fetch('/api/pro/bus-stops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la creation');
      }

      router.push('/pro/arrets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pro/arrets"
            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux arrets
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Nouvel arret de bus</h1>
          <p className="text-slate-600 mt-1">
            Creez un nouveau point de depart ou d&apos;arrivee pour vos voyages
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations generales */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Informations generales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom public *
                </label>
                <input
                  type="text"
                  value={form.publicName}
                  onChange={(e) => updateField('publicName', e.target.value)}
                  placeholder="Ex: Gare routiere de Lyon - Perrache"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ce nom sera visible par les voyageurs
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom interne
                </label>
                <input
                  type="text"
                  value={form.internalName}
                  onChange={(e) => updateField('internalName', e.target.value)}
                  placeholder="Ex: Lyon-P"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="PICKUP_DEPARTURE">Point de depart (ramassage)</option>
                  <option value="DROPOFF_ARRIVAL">Point d&apos;arrivee (depose)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Adresse</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={form.addressLine}
                  onChange={(e) => updateField('addressLine', e.target.value)}
                  placeholder="Numero et rue"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Lyon"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Code postal *
                </label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  placeholder="69002"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  value={form.latitude}
                  onChange={(e) => updateField('latitude', e.target.value)}
                  placeholder="45.7484"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  value={form.longitude}
                  onChange={(e) => updateField('longitude', e.target.value)}
                  placeholder="4.8422"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Informations pratiques</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instructions pour les voyageurs
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => updateField('instructions', e.target.value)}
                  rows={3}
                  placeholder="Ex: Rendez-vous sur le parking face a la gare, le bus sera identifie par le logo Eventy Life."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Parking
                </label>
                <textarea
                  value={form.parkingInfo}
                  onChange={(e) => updateField('parkingInfo', e.target.value)}
                  rows={2}
                  placeholder="Ex: Parking gratuit de 200 places a 50m."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Accessibilite PMR
                </label>
                <textarea
                  value={form.accessibilityInfo}
                  onChange={(e) => updateField('accessibilityInfo', e.target.value)}
                  rows={2}
                  placeholder="Ex: Acces PMR avec rampe pour fauteuil roulant."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Photos</h2>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 font-medium">
                Glissez vos photos ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-slate-500 mt-1">
                JPG, PNG - Max 5 Mo par photo - 5 photos maximum
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/pro/arrets"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Annuler
            </Link>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Creation...' : 'Creer l\'arret'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
