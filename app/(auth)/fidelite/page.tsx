'use client';
import { useState } from 'react';

export default function FidelitePage() {
  const [tab, setTab] = useState('avantages');

  const niveau = { nom: "Explorateur", points: 320, prochain: "Aventurier", pointsProchain: 500, pct: 64 };

  const niveaux = [
    { nom: "D\u00e9couvreur", points: "0-199", icon: "\uD83C\uDF31", avantages: ["Acc\u00e8s aux offres membres", "Newsletter exclusive"] },
    { nom: "Explorateur", points: "200-499", icon: "\uD83C\uDF0D", avantages: ["5% sur le 3\u00e8me voyage", "Acc\u00e8s ventes priv\u00e9es", "Cadeau de bienvenue"] },
    { nom: "Aventurier", points: "500-999", icon: "\u26F0\uFE0F", avantages: ["10% sur le 3\u00e8me voyage", "Surclassement h\u00f4tel possible", "Support prioritaire"] },
    { nom: "Ambassador", points: "1000+", icon: "\uD83D\uDC51", avantages: ["15% permanent", "Acc\u00e8s voyages exclusifs", "Concierge d\u00e9di\u00e9", "Invitations \u00e9v\u00e9nements VIP"] },
  ];

  const historique = [
    { action: "Voyage Santorin", points: "+150", date: "15 mars 2026", type: "gain" },
    { action: "Avis d\u00e9pos\u00e9", points: "+20", date: "2 mars 2026", type: "gain" },
    { action: "Parrainage Marie L.", points: "+50", date: "2 mars 2026", type: "gain" },
    { action: "Voyage Sahara", points: "+100", date: "10 f\u00e9v 2026", type: "gain" },
    { action: "R\u00e9duction utilis\u00e9e", points: "-50", date: "5 f\u00e9v 2026", type: "depense" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 900, margin: '0 auto' }}>
        <a href="/" style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic', textDecoration: 'none' }}>Eventy Life</a>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{"\uD83C\uDFC6"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>
            {"Programme Fid\u00e9lit\u00e9"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 0 }}>
            {"Voyagez plus, gagnez plus. Chaque aventure vous rapproche du niveau suivant\u00a0!"}
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #D4A853 0%, #C75B39 100%)', borderRadius: 16, padding: '28px 32px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Votre niveau</div>
              <div style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700 }}>{`${"\uD83C\uDF0D"} ${niveau.nom}`}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700 }}>{niveau.points}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>points</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 8, height: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${niveau.pct}%`, height: '100%', background: '#FFFFFF', borderRadius: 8 }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'right' }}>
            {`${niveau.points} / ${niveau.pointsProchain} points pour ${niveau.prochain}`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[{ key: 'avantages', label: 'Niveaux' }, { key: 'historique', label: 'Historique' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '10px 24px', borderRadius: 20, border: 'none', background: tab === t.key ? '#D4A853' : '#FFFFFF', color: tab === t.key ? '#1A1A2E' : '#6B7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'avantages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {niveaux.map((n, i) => (
              <div key={i} style={{ background: n.nom === niveau.nom ? '#FFFFFF' : 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 24px', border: n.nom === niveau.nom ? '2px solid #D4A853' : '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{n.icon}</span>
                    <span style={{ color: n.nom === niveau.nom ? '#1A1A2E' : '#FFFFFF', fontSize: 18, fontWeight: 700 }}>{n.nom}</span>
                    {n.nom === niveau.nom && (
                      <span style={{ background: '#059669', color: '#FFFFFF', fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>
                        {"Niveau actuel"}
                      </span>
                    )}
                  </div>
                  <span style={{ color: n.nom === niveau.nom ? '#C75B39' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{n.points} pts</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {n.avantages.map((a, j) => (
                    <span key={j} style={{ background: n.nom === niveau.nom ? '#FAF7F2' : 'rgba(255,255,255,0.08)', color: n.nom === niveau.nom ? '#1A1A2E' : 'rgba(255,255,255,0.7)', fontSize: 12, padding: '4px 12px', borderRadius: 20 }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'historique' && (
          <div style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px', padding: '12px 20px', background: '#F9FAFB', borderBottom: '1px solid #E8E4DE' }}>
              <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Action</span>
              <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Points</span>
              <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Date</span>
            </div>
            {historique.map((h, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px', padding: '14px 20px', borderBottom: i < historique.length - 1 ? '1px solid #F3F4F6' : 'none', alignItems: 'center' }}>
                <span style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>{h.action}</span>
                <span style={{ color: h.type === 'gain' ? '#059669' : '#C75B39', fontSize: 14, fontWeight: 700, textAlign: 'center' }}>{h.points}</span>
                <span style={{ color: '#6B7280', fontSize: 13, textAlign: 'right' }}>{h.date}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="/voyages" style={{ display: 'inline-block', padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {"Gagner plus de points"}
          </a>
        </div>
      </div>
    </div>
  );
}
