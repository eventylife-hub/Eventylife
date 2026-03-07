'use client';
import { useState } from 'react';

const mockVoyages = [
  { id: '1', titre: 'Week-end Amsterdam', date: '15-17 Mars 2026', statut: 'confirm\u00e9', image: '', prix: 289, paiement: 'pay\u00e9' },
  { id: '2', titre: 'S\u00e9jour Marrakech', date: '5-12 Avril 2026', statut: 'en attente', image: '', prix: 649, paiement: 'acompte' },
];

export default function TableauDeBordPage() {
  const [activeTab, setActiveTab] = useState('apercu');
  const prenom = 'David';

  const tabs = [
    { id: 'apercu', label: 'Aper\u00e7u' },
    { id: 'voyages', label: 'Mes voyages' },
    { id: 'paiements', label: 'Paiements' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <header style={{ background: '#1A1A2E', padding: '16px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'white', fontSize: 22, fontWeight: 800 }}>Eventy Life</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/profil" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Mon profil</a>
            <a href="/connexion" style={{ color: '#FAF7F2', textDecoration: 'none', fontSize: 14, opacity: 0.8 }}>D&#233;connexion</a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>Bonjour {prenom} !</h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>Bienvenue sur votre espace personnel Eventy Life</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '2px solid #E8E4DE', paddingBottom: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#C75B39' : '#6B7280',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #C75B39' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: -2,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'apercu' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Voyages r&#233;serv&#233;s', value: '2', color: '#C75B39' },
                { label: 'Prochain d&#233;part', value: '15 Mars', color: '#059669' },
                { label: 'Total d&#233;pens&#233;', value: '938 &#8364;', color: '#D4A853' },
                { label: 'Points fid&#233;lit&#233;', value: '420', color: '#7C3AED' },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 8px' }} dangerouslySetInnerHTML={{ __html: stat.label }} />
                  <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, margin: 0 }} dangerouslySetInnerHTML={{ __html: stat.value }} />
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A2E', marginBottom: 16 }}>Prochains voyages</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {mockVoyages.map(v => (
                <div key={v.id} style={{ background: 'white', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px' }}>{v.titre}</h3>
                    <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>{v.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: v.statut === 'confirm\u00e9' ? '#ECFDF5' : '#FEF3C7', color: v.statut === 'confirm\u00e9' ? '#059669' : '#D97706' }}>{v.statut}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>{v.prix} &#8364;</span>
                    <a href={'/voyages/' + v.id} style={{ padding: '8px 16px', background: '#C75B39', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>D&#233;tails</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'voyages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A2E', margin: 0 }}>Mes voyages</h2>
              <a href="/voyages" style={{ padding: '10px 20px', background: '#C75B39', color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>D&#233;couvrir des voyages</a>
            </div>
            {mockVoyages.map(v => (
              <div key={v.id} style={{ background: 'white', borderRadius: 12, padding: '24px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A2E', margin: '0 0 8px' }}>{v.titre}</h3>
                    <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 4px' }}>Date : {v.date}</p>
                    <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Paiement : <span style={{ fontWeight: 600, color: v.paiement === 'pay\u00e9' ? '#059669' : '#D97706' }}>{v.paiement}</span></p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 24, fontWeight: 700, color: '#1A1A2E', margin: '0 0 8px' }}>{v.prix} &#8364;</p>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: v.statut === 'confirm\u00e9' ? '#ECFDF5' : '#FEF3C7', color: v.statut === 'confirm\u00e9' ? '#059669' : '#D97706' }}>{v.statut}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'paiements' && (
          <div style={{ background: 'white', borderRadius: 12, padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128179;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A2E', margin: '0 0 8px' }}>Historique des paiements</h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Votre historique de paiements appara&#238;tra ici une fois vos premiers achats effectu&#233;s.</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={{ background: 'white', borderRadius: 12, padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128276;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A2E', margin: '0 0 8px' }}>Notifications</h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Aucune notification pour le moment. Vous serez inform&#233; des mises &#224; jour de vos voyages ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
