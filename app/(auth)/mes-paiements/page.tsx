'use client';
import { useState } from 'react';

const paiements = [
  { id: '1', voyage: 'Week-end Amsterdam', montant: 578, date: '12/02/2026', methode: 'Carte Visa ****6411', statut: 'pay\u00e9', type: 'total', ref: 'PAY-2026-0042' },
  { id: '2', voyage: 'S\u00e9jour Marrakech', montant: 195, date: '28/02/2026', methode: 'Carte Visa ****6411', statut: 'acompte', type: 'acompte', ref: 'PAY-2026-0089', restant: 454 },
  { id: '3', voyage: 'Rome Express', montant: 918, date: '05/03/2026', methode: 'Virement bancaire', statut: 'pay\u00e9', type: 'total', ref: 'PAY-2026-0156' },
];

export default function PaiementsPage() {
  const [filter, setFilter] = useState('tous');
  const filtered = filter === 'tous' ? paiements : paiements.filter(p => p.statut === filter);
  const totalPaye = paiements.reduce((s, p) => s + p.montant, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A8B6E 0%, #0F5A45 50%, #1A1A2E 100%)' }}>
      <nav style={{ background: '#1A1A2E', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ color: '#D4A853', fontSize: 22, fontWeight: 700, textDecoration: 'none', fontStyle: 'italic' }}>Eventy Life</a>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FAF7F2', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>D&#233;connexion</a>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>Mes paiements</h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Historique et suivi de vos paiements</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 20, backdropFilter: 'blur(10px)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', margin: '0 0 4px' }}>Total pay&#233;</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'white', margin: 0 }}>{totalPaye} &#8364;</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 20, backdropFilter: 'blur(10px)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', margin: '0 0 4px' }}>Paiements</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'white', margin: 0 }}>{paiements.length}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 20, backdropFilter: 'blur(10px)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', margin: '0 0 4px' }}>Restant d&#251;</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#FBBF24', margin: 0 }}>{paiements.reduce((s, p) => s + (p.restant || 0), 0)} &#8364;</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[{ id: 'tous', label: 'Tous' }, { id: 'pay\u00e9', label: 'Pay\u00e9s' }, { id: 'acompte', label: 'Acomptes' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '8px 20px', borderRadius: 20, border: filter === f.id ? 'none' : '1px solid rgba(255,255,255,0.3)', background: filter === f.id ? 'white' : 'transparent', color: filter === f.id ? '#1A1A2E' : 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px' }} dangerouslySetInnerHTML={{ __html: p.voyage }} />
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{p.date} &middot; {p.methode}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>{p.montant} &#8364;</p>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: p.statut === 'pay\u00e9' ? '#ECFDF5' : '#FFFBEB', color: p.statut === 'pay\u00e9' ? '#059669' : '#D97706' }} dangerouslySetInnerHTML={{ __html: p.statut === 'pay\u00e9' ? 'Pay&#233; en totalit&#233;' : 'Acompte vers&#233;' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>R&#233;f : {p.ref}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {p.restant && <span style={{ fontSize: 13, color: '#D97706', fontWeight: 500 }}>Reste : {p.restant} &#8364;</span>}
                  <button style={{ padding: '6px 14px', background: '#FAF7F2', color: '#C75B39', border: '1px solid #E8E4DE', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Facture</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128176;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: '0 0 8px' }}>Aucun paiement</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Aucun paiement ne correspond &#224; ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
