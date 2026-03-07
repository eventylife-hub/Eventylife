'use client';
import { useState } from 'react';

export default function ParrainagePage() {
  const [copied, setCopied] = useState(false);
  const code = 'EVENTY-DAVID2026';

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const avantages = [
    { icon: "\uD83C\uDF81", titre: "20\u20ac offerts", description: "Pour vous et votre filleul sur le prochain voyage" },
    { icon: "\uD83D\uDE80", titre: "Illimit\u00e9", description: "Parrainez autant de personnes que vous le souhaitez" },
    { icon: "\u26A1", titre: "Instantan\u00e9", description: "Le cr\u00e9dit est appliqu\u00e9 d\u00e8s la premi\u00e8re r\u00e9servation" },
  ];

  const etapes = [
    { num: "1", titre: "Partagez votre code", description: "Envoyez votre code unique \u00e0 vos proches par email, SMS ou r\u00e9seaux sociaux." },
    { num: "2", titre: "Votre filleul s\u2019inscrit", description: "Il cr\u00e9e son compte sur Eventy Life et saisit votre code de parrainage." },
    { num: "3", titre: "Il r\u00e9serve un voyage", description: "D\u00e8s sa premi\u00e8re r\u00e9servation confirm\u00e9e, vous recevez tous les deux 20\u20ac de cr\u00e9dit." },
  ];

  const parrainages = [
    { nom: "Marie L.", statut: "confirm\u00e9", date: "2 mars 2026", gain: "20\u20ac" },
    { nom: "Paul R.", statut: "en attente", date: "5 mars 2026", gain: "-" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>Eventy Life</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 750, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{"\uD83C\uDF1F"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Parrainage
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, maxWidth: 480, margin: '0 auto 24px' }}>
            {"Invitez vos proches \u00e0 d\u00e9couvrir Eventy Life et gagnez 20\u20ac de cr\u00e9dit pour chaque filleul\u00a0!"}
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #D4A853 0%, #C75B39 100%)', borderRadius: 16, padding: '28px 32px', marginBottom: 32, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 12, marginTop: 0, textTransform: 'uppercase', letterSpacing: 1 }}>
            Votre code de parrainage
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace' }}>{code}</span>
          </div>
          <button onClick={handleCopy} style={{ background: '#FFFFFF', color: '#C75B39', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {copied ? "Copi\u00e9 !" : "Copier le code"}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {avantages.map((a, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{a.titre}</div>
              <div style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5 }}>{a.description}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 600, marginBottom: 24 }}>
          {"Comment \u00e7a marche\u00a0?"}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {etapes.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#D4A853', color: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                {e.num}
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '16px 20px', flex: 1 }}>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{e.titre}</div>
                <div style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5 }}>{e.description}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
          Mes parrainages
        </h2>
        <div style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', padding: '12px 20px', background: '#F9FAFB', borderBottom: '1px solid #E8E4DE' }}>
            <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Filleul</span>
            <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Statut</span>
            <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Date</span>
            <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Gain</span>
          </div>
          {parrainages.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', padding: '14px 20px', borderBottom: i < parrainages.length - 1 ? '1px solid #F3F4F6' : 'none', alignItems: 'center' }}>
              <span style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>{p.nom}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: p.statut === "confirm\u00e9" ? '#059669' : '#D97706' }}>
                {p.statut === "confirm\u00e9" ? "Confirm\u00e9" : "En attente"}
              </span>
              <span style={{ color: '#6B7280', fontSize: 13 }}>{p.date}</span>
              <span style={{ color: p.gain !== '-' ? '#C75B39' : '#9CA3AF', fontSize: 14, fontWeight: 600 }}>{p.gain}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px', textAlign: 'center' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600, marginBottom: 8, marginTop: 0 }}>
            {"Solde parrainage : 20\u20ac"}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16, marginTop: 0 }}>
            {"Utilisable sur votre prochaine r\u00e9servation"}
          </p>
          <a href="/voyages" style={{ display: 'inline-block', padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {"R\u00e9server un voyage"}
          </a>
        </div>
      </div>
    </div>
  );
}
