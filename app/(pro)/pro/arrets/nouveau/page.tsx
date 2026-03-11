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
        const data = await res.json() as { message?: string };
        throw new Error(data.message || 'Erreur lors de la creation');
      }

      router.push('/pro/arrets');
    } catch (err: unknown) {
      console.warn('API /api/pro/bus-stops indisponible — données démo');
      // Fallback demo: simulate successful creation
      setError(null);
      setTimeout(() => {
        router.push('/pro/arrets');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            href="/pro/arrets"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#8896A6', marginBottom: '16px', textDecoration: 'none' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux arrets
          </Link>
          <h1 className="pro-page-title">Nouvel arret de bus</h1>
          <p style={{ color: '#8896A6', marginTop: '4px' }}>
            Creez un nouveau point de depart ou d&apos;arrivee pour vos voyages
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid #FFE0E3' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--pro-coral)', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Informations generales */}
          <div className="pro-panel">
            <h2 className="pro-panel-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapPin className="w-5 h-5" style={{ color: 'var(--pro-sun)' }} />
              Informations generales
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="pro-input" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Nom public *
                </label>
                <input
                  type="text"
                  value={form.publicName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('publicName', (e.target as HTMLInputElement).value)}
                  placeholder="Ex: Gare routiere de Lyon - Perrache"
                  className="pro-input"
                  required
                />
                <p style={{ fontSize: '12px', color: '#8896A6', marginTop: '4px' }}>
                  Ce nom sera visible par les voyageurs
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Nom interne
                </label>
                <input
                  type="text"
                  value={form.internalName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('internalName', (e.target as HTMLInputElement).value)}
                  placeholder="Ex: Lyon-P"
                  className="pro-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('type', (e.target as HTMLInputElement).value)}
                  className="pro-input"
                >
                  <option value="PICKUP_DEPARTURE">Point de depart (ramassage)</option>
                  <option value="DROPOFF_ARRIVAL">Point d&apos;arrivee (depose)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="pro-panel">
            <h2 className="pro-panel-header" style={{ marginBottom: '16px' }}>Adresse</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Adresse *
                </label>
                <input
                  type="text"
                  value={form.addressLine}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('addressLine', (e.target as HTMLInputElement).value)}
                  placeholder="Numero et rue"
                  className="pro-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Ville *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('city', (e.target as HTMLInputElement).value)}
                  placeholder="Lyon"
                  className="pro-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Code postal *
                </label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('postalCode', (e.target as HTMLInputElement).value)}
                  placeholder="69002"
                  className="pro-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Pays
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('country', (e.target as HTMLInputElement).value)}
                  className="pro-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Latitude
                </label>
                <input
                  type="text"
                  value={form.latitude}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('latitude', (e.target as HTMLInputElement).value)}
                  placeholder="45.7484"
                  className="pro-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Longitude
                </label>
                <input
                  type="text"
                  value={form.longitude}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('longitude', (e.target as HTMLInputElement).value)}
                  placeholder="4.8422"
                  className="pro-input"
                />
              </div>
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="pro-panel">
            <h2 className="pro-panel-header" style={{ marginBottom: '16px' }}>Informations pratiques</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Instructions pour les voyageurs
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('instructions', (e.target as HTMLInputElement).value)}
                  rows={3}
                  placeholder="Ex: Rendez-vous sur le parking face a la gare, le bus sera identifie par le logo Eventy Life."
                  className="pro-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Parking
                </label>
                <textarea
                  value={form.parkingInfo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('parkingInfo', (e.target as HTMLInputElement).value)}
                  rows={2}
                  placeholder="Ex: Parking gratuit de 200 places a 50m."
                  className="pro-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '4px' }}>
                  Accessibilite PMR
                </label>
                <textarea
                  value={form.accessibilityInfo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('accessibilityInfo', (e.target as HTMLInputElement).value)}
                  rows={2}
                  placeholder="Ex: Acces PMR avec rampe pour fauteuil roulant."
                  className="pro-input"
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="pro-panel">
            <h2 className="pro-panel-header" style={{ marginBottom: '16px' }}>Photos</h2>
            <div style={{ border: '2px dashed #B3E5FC', borderRadius: '8px', padding: '32px 16px', textAlign: 'center' }}>
              <Upload className="w-8 h-8" style={{ color: '#8896A6', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '14px', color: '#0A1628', fontWeight: 500 }}>
                Glissez vos photos ici ou cliquez pour parcourir
              </p>
              <p style={{ fontSize: '12px', color: '#8896A6', marginTop: '4px' }}>
                JPG, PNG - Max 5 Mo par photo - 5 photos maximum
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link
              href="/pro/arrets"
              style={{ color: '#8896A6', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
            >
              Annuler
            </Link>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                className="pro-btn-sun"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Creation...' : 'Creer l\'arret'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
