'use client';
import { useState } from 'react';

const voyages = [
  {
    id: '1',
    titre: 'Week-end Amsterdam',
    destination: 'Amsterdam, Pays-Bas',
    dateDepart: '15 mars 2026',
    dateRetour: '17 mars 2026',
    statut: 'confirme',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=250&fit=crop',
    nbPersonnes: 2,
    transport: 'Bus',
    prix: 578,
    accompagnateur: 'Marie Dubois',
  },
  {
    id: '2',
    titre: "S\u00e9jour Marrakech",
    destination: 'Marrakech, Maroc',
    dateDepart: '12 avril 2026',
    dateRetour: '17 avril 2026',
    statut: 'en-attente',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&h=250&fit=crop',
    nbPersonnes: 1,
    transport: 'Avion',
    prix: 649,
    accompagnateur: 'Thomas Martin',
  },
  {
    id: '3',
    titre: 'Escapade Barcelone',
    destination: 'Barcelone, Espagne',
    dateDepart: '5 janvier 2026',
    dateRetour: '8 janvier 2026',
    statut: 'termine',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=250&fit=crop',
    nbPersonnes: 2,
    transport: 'Bus',
    prix: 425,
    accompagnateur: 'Sophie Laurent',
  },
];

const statutConfig: Record<string, { label: string; color: string; bg: string }> = {
  'confirme': { label: "Confirm\u00e9", color: '#059669', bg: '#ECFDF5' },
  'en-attente': { label: 'En attente', color: '#D97706', bg: '#FFFBEB' },
  'termine': { label: "Termin\u00e9", color: '#6B7280', bg: '#F3F4F6' },
  'annule': { label: "Annul\u00e9", color: '#DC2626', bg: '#FEF2F2' },
};

export default function MesVoyagesPage() {
  const [filtre, setFiltre] = useState('tous');

  const filtres = [
    { id: 'tous', label: 'Tous' },
    { id: 'confirme', label: "Confirm\u00e9s" },
    { id: 'en-attente', label: 'En attente' },
    { id: 'termine', label: "Termin\u00e9s" },
  ];

  const filtered = voyages.filter(v => {
    if (filtre === 'tous') return true;
    return v.statut === filtre;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>Eventy Life</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, margin: 0 }}>Mes voyages</h1>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 500 }}>
            {voyages.length} voyage{voyages.length > 1 ? 's' : ''}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 28, marginTop: 4 }}>
          {"Retrouvez tous vos voyages pass\u00e9s et \u00e0 venir"}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {filtres.map(f => (
            <button key={f.id} onClick={() => setFiltre(f.id)} style={{ padding: '8px 18px', borderRadius: 20, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: filtre === f.id ? '#D4A853' : 'rgba(255,255,255,0.12)', color: filtre === f.id ? '#1A1A2E' : '#FFFFFF', transition: 'all 0.2s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.06)', borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83C\uDF0D"}</div>
            <p style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Aucun voyage</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              {"Aucun voyage dans cette cat\u00e9gorie"}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filtered.map(v => {
              const cfg = statutConfig[v.statut] || statutConfig['confirme'];
              return (
                <div key={v.id} style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: 220, minHeight: 200, background: `url(${v.image}) center/cover no-repeat`, flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: '20px 24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, margin: 0 }}>{v.titre}</h3>
                        <span style={{ background: cfg.bg, color: cfg.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {cfg.label}
                        </span>
                      </div>
                      <p style={{ color: '#6B7280', fontSize: 14, margin: '0 0 12px' }}>{v.destination}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 16 }}>
                        <div>
                          <span style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{"D\u00e9part"}</span>
                          <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>{v.dateDepart}</div>
                        </div>
                        <div>
                          <span style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>Retour</span>
                          <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>{v.dateRetour}</div>
                        </div>
                        <div>
                          <span style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>Transport</span>
                          <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>{v.transport === 'Bus' ? '\uD83D\uDE8C' : '\u2708\uFE0F'} {v.transport}</div>
                        </div>
                        <div>
                          <span style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>Voyageurs</span>
                          <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>{v.nbPersonnes} personne{v.nbPersonnes > 1 ? 's' : ''}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E8E4DE', paddingTop: 12 }}>
                        <div>
                          <span style={{ color: '#9CA3AF', fontSize: 11 }}>Accompagnateur</span>
                          <div style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 500 }}>{v.accompagnateur}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#C75B39', fontSize: 22, fontWeight: 700 }}>{v.prix}{"\u20ac"}</div>
                          <span style={{ color: '#9CA3AF', fontSize: 11 }}>par personne</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        {v.statut !== 'termine' && (
                          <a href="/mes-reservations" style={{ flex: 1, textAlign: 'center', padding: '10px 16px', background: '#C75B39', color: '#FFFFFF', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                            {"Voir la r\u00e9servation"}
                          </a>
                        )}
                        <a href="/voyages" style={{ flex: 1, textAlign: 'center', padding: '10px 16px', background: 'none', border: '1px solid #E8E4DE', color: '#1A1A2E', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                          {"D\u00e9tails du voyage"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="/voyages" style={{ display: 'inline-block', padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {"D\u00e9couvrir de nouveaux voyages"}
          </a>
        </div>
      </div>
    </div>
  );
}
