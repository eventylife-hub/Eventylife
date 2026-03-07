'use client';
import { useState } from 'react';

const reservations = [
  { id: '1', titre: 'Week-end Amsterdam', destination: 'Amsterdam, Pays-Bas', date: '15-17 Mars 2026', statut: 'confirm\u00e9', transport: 'Bus', depart: 'Paris Bercy', places: 2, prix: 289, paiement: 'pay\u00e9', ref: 'EVT-2026-0042' },
  { id: '2', titre: 'S\u00e9jour Marrakech', destination: 'Marrakech, Maroc', date: '5-12 Avril 2026', statut: 'en attente', transport: 'Avion', depart: 'Paris CDG', places: 1, prix: 649, paiement: 'acompte', ref: 'EVT-2026-0089' },
  { id: '3', titre: 'Rome Express', destination: 'Rome, Italie', date: '20-23 Juin 2026', statut: 'confirm\u00e9', transport: 'Avion', depart: 'Lyon Saint-Exup\u00e9ry', places: 2, prix: 459, paiement: 'pay\u00e9', ref: 'EVT-2026-0156' },
];

export default function MesReservationsPage() {
  const [filter, setFilter] = useState('tous');

  const filtered = filter === 'tous' ? reservations : reservations.filter(r => r.statut === filter);

  const filters = [
    { id: 'tous', label: 'Tous' },
    { id: 'confirm\u00e9', label: 'Confirm\u00e9s' },
    { id: 'en attente', label: 'En attente' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <header style={{ background: '#1A1A2E', padding: '16px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'white', fontSize: 22, fontWeight: 800 }}>Eventy Life</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
            <a href="/connexion" style={{ color: '#FAF7F2', textDecoration: 'none', fontSize: 14, opacity: 0.8 }}>D&#233;connexion</a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>Mes r&#233;servations</h1>
            <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>{reservations.length} voyage{reservations.length > 1 ? 's' : ''} r&#233;serv&#233;{reservations.length > 1 ? 's' : ''}</p>
          </div>
          <a href="/voyages" style={{ padding: '10px 24px', background: '#C75B39', color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>R&#233;server un voyage</a>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: filter === f.id ? 600 : 400, background: filter === f.id ? '#1A1A2E' : 'white', color: filter === f.id ? 'white' : '#6B7280', border: filter === f.id ? 'none' : '1px solid #E8E4DE', cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {filtered.map(r => (
            <div key={r.id} style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{r.titre}</h3>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: r.statut === 'confirm\u00e9' ? '#ECFDF5' : '#FEF3C7', color: r.statut === 'confirm\u00e9' ? '#059669' : '#D97706' }}>{r.statut}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>{r.destination}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>{r.prix} &#8364;</p>
                  <span style={{ fontSize: 12, fontWeight: 500, color: r.paiement === 'pay\u00e9' ? '#059669' : '#D97706' }}>{r.paiement === 'pay\u00e9' ? 'Pay\u00e9 en totalit\u00e9' : 'Acompte vers\u00e9'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, padding: '16px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 600 }}>Dates</p>
                  <p style={{ fontSize: 14, color: '#1A1A2E', margin: 0, fontWeight: 500 }}>{r.date}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 600 }}>Transport</p>
                  <p style={{ fontSize: 14, color: '#1A1A2E', margin: 0, fontWeight: 500 }}>{r.transport}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 600 }}>D&#233;part</p>
                  <p style={{ fontSize: 14, color: '#1A1A2E', margin: 0, fontWeight: 500 }}>{r.depart}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 600 }}>Places</p>
                  <p style={{ fontSize: 14, color: '#1A1A2E', margin: 0, fontWeight: 500 }}>{r.places} personne{r.places > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>R&#233;f : {r.ref}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={'/voyages/' + r.id} style={{ padding: '8px 16px', background: '#FAF7F2', color: '#C75B39', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Voir le voyage</a>
                  <button style={{ padding: '8px 16px', background: '#C75B39', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>T&#233;l&#233;charger le billet</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ background: 'white', borderRadius: 12, padding: '48px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#9992;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A2E', margin: '0 0 8px' }}>Aucune r&#233;servation</h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px' }}>Aucune r&#233;servation ne correspond &#224; ce filtre.</p>
            <button onClick={() => setFilter('tous')} style={{ padding: '10px 24px', background: '#C75B39', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Voir toutes les r&#233;servations</button>
          </div>
        )}
      </div>
    </div>
  );
}
