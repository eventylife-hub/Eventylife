'use client';
import { useState } from 'react';

const notifications = [
  { id: '1', type: 'confirmation', titre: 'R\u00e9servation confirm\u00e9e', message: 'Votre r\u00e9servation pour le Week-end Amsterdam a \u00e9t\u00e9 confirm\u00e9e. Rendez-vous le 15 mars 2026 !', date: 'Il y a 2 heures', lu: false, voyage: 'Week-end Amsterdam' },
  { id: '2', type: 'paiement', titre: 'Paiement re\u00e7u', message: 'Votre paiement de 578\u20ac pour le Week-end Amsterdam a bien \u00e9t\u00e9 enregistr\u00e9.', date: 'Il y a 5 heures', lu: false, voyage: 'Week-end Amsterdam' },
  { id: '3', type: 'rappel', titre: 'Rappel : d\u00e9part dans 8 jours', message: 'Votre voyage Week-end Amsterdam approche ! Pensez \u00e0 v\u00e9rifier vos documents de voyage.', date: 'Hier', lu: true, voyage: 'Week-end Amsterdam' },
  { id: '4', type: 'promo', titre: 'Offre sp\u00e9ciale -15%', message: 'Profitez de -15% sur le S\u00e9jour Marrakech pour toute r\u00e9servation avant le 20 mars. Code : SPRING15', date: 'Il y a 2 jours', lu: true },
  { id: '5', type: 'info', titre: 'Nouveau voyage disponible', message: 'D\u00e9couvrez notre nouveau voyage Rome Express ! 5 jours de d\u00e9couverte au c\u0153ur de l\'Italie.', date: 'Il y a 3 jours', lu: true },
  { id: '6', type: 'paiement', titre: 'Acompte enregistr\u00e9', message: 'Votre acompte de 195\u20ac pour le S\u00e9jour Marrakech a \u00e9t\u00e9 enregistr\u00e9. Reste \u00e0 payer : 454\u20ac.', date: 'Il y a 5 jours', lu: true, voyage: 'S\u00e9jour Marrakech' },
];

const typeConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
  confirmation: { icon: '\u2705', color: '#059669', bgColor: '#ECFDF5' },
  paiement: { icon: '\uD83D\uDCB3', color: '#2563EB', bgColor: '#EFF6FF' },
  rappel: { icon: '\u23F0', color: '#D97706', bgColor: '#FFFBEB' },
  promo: { icon: '\uD83C\uDF81', color: '#7C3AED', bgColor: '#F5F3FF' },
  info: { icon: '\u2139\uFE0F', color: '#6B7280', bgColor: '#F9FAFB' },
};

export default function NotificationsPage() {
  const [filtre, setFiltre] = useState('tous');
  const [notifs, setNotifs] = useState(notifications);

  const filtres = [
    { id: 'tous', label: 'Toutes' },
    { id: 'non-lues', label: 'Non lues' },
    { id: 'confirmation', label: 'Confirmations' },
    { id: 'paiement', label: 'Paiements' },
    { id: 'promo', label: 'Promos' },
  ];

  const filtered = notifs.filter(n => {
    if (filtre === 'tous') return true;
    if (filtre === 'non-lues') return !n.lu;
    return n.type === filtre;
  });

  const nonLues = notifs.filter(n => !n.lu).length;

  const marquerToutLu = () => {
    setNotifs(notifs.map(n => ({ ...n, lu: true })));
  };

  const toggleLu = (id: string) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, lu: !n.lu } : n));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 40%, #1A1A2E 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>Eventy Life</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, margin: 0 }}>Notifications</h1>
          {nonLues > 0 && (
            <span style={{ background: '#C75B39', color: '#FFF', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600 }}>
              {nonLues} non lue{nonLues > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 24, marginTop: 4 }}>
          {"Restez inform\u00e9 de l\u2019activit\u00e9 de vos voyages"}
        </p>

        {nonLues > 0 && (
          <button onClick={marquerToutLu} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', marginBottom: 20 }}>
            {"Tout marquer comme lu"}
          </button>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {filtres.map(f => (
            <button key={f.id} onClick={() => setFiltre(f.id)} style={{ padding: '8px 18px', borderRadius: 20, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: filtre === f.id ? '#FFFFFF' : 'rgba(255,255,255,0.15)', color: filtre === f.id ? '#1A1A2E' : '#FFFFFF', transition: 'all 0.2s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.08)', borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDD14"}</div>
            <p style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Aucune notification</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
              {"Vous \u00eates \u00e0 jour !"}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              return (
                <div key={n.id} onClick={() => toggleLu(n.id)} style={{ background: '#FFFFFF', borderRadius: 14, padding: '18px 20px', cursor: 'pointer', borderLeft: n.lu ? '4px solid transparent' : `4px solid ${cfg.color}`, opacity: n.lu ? 0.85 : 1, transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 14, flex: 1, alignItems: 'flex-start' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {cfg.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 15, color: '#1A1A2E' }}>{n.titre}</span>
                          {!n.lu && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C75B39', display: 'inline-block' }} />}
                        </div>
                        <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5, margin: '0 0 8px' }}>{n.message}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ color: '#9CA3AF', fontSize: 12 }}>{n.date}</span>
                          {n.voyage && (
                            <span style={{ color: cfg.color, fontSize: 12, fontWeight: 500 }}>{n.voyage}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
