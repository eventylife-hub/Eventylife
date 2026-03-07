'use client';
import { useState } from 'react';

export default function FavorisPage() {
  const [filter, setFilter] = useState('tous');

  const favoris = [
    {
      id: 1,
      titre: "Santorin, Gr\u00e8ce",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=250&fit=crop",
      prix: 890,
      duree: "7 jours",
      depart: "15 avril 2026",
      places: 8,
      categorie: "europe",
      description: "D\u00e9couvrez les \u00eeles grecques en groupe avec couchers de soleil l\u00e9gendaires."
    },
    {
      id: 2,
      titre: "D\u00e9sert du Sahara, Maroc",
      image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&h=250&fit=crop",
      prix: 650,
      duree: "5 jours",
      depart: "2 mai 2026",
      places: 12,
      categorie: "afrique",
      description: "Nuit sous les \u00e9toiles dans le d\u00e9sert marocain, m\u00e9harée et oasis."
    },
    {
      id: 3,
      titre: "Lisbonne & Porto",
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=250&fit=crop",
      prix: 520,
      duree: "4 jours",
      depart: "20 mars 2026",
      places: 3,
      categorie: "europe",
      description: "Road trip entre Lisbonne et Porto, past\u00e9is de nata et fado."
    },
    {
      id: 4,
      titre: "Tokyo & Kyoto",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop",
      prix: 1890,
      duree: "12 jours",
      depart: "10 juin 2026",
      places: 6,
      categorie: "asie",
      description: "Temples, cerisiers en fleurs et gastronomie japonaise."
    },
  ];

  const filtres = [
    { key: 'tous', label: 'Tous' },
    { key: 'europe', label: 'Europe' },
    { key: 'afrique', label: 'Afrique' },
    { key: 'asie', label: 'Asie' },
  ];

  const filtered = filter === 'tous' ? favoris : favoris.filter(f => f.categorie === filter);

  const handleRemove = (id) => {
    // mock remove
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>Eventy Life</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{"\u2764\uFE0F"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Mes favoris
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
            {`${favoris.length} voyages sauvegardes`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          {filtres.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '10px 22px',
                borderRadius: 20,
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                background: filter === f.key ? '#D4A853' : 'rgba(255,255,255,0.1)',
                color: filter === f.key ? '#1A1A2E' : '#FFFFFF',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDD0D"}</div>
            <h2 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              {"Aucun favori dans cette cat\u00e9gorie"}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              {"Explorez nos voyages et ajoutez vos coups de c\u0153ur\u00a0!"}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {filtered.map(v => (
              <div key={v.id} style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img src={v.image} alt={v.titre} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <button
                    onClick={() => handleRemove(v.id)}
                    style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {"\u2764\uFE0F"}
                  </button>
                  <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                    <span style={{ background: v.places <= 5 ? '#DC2626' : '#059669', color: '#FFFFFF', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {v.places <= 5 ? `Plus que ${v.places} places` : `${v.places} places`}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 6 }}>{v.titre}</h3>
                  <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5, marginBottom: 16, marginTop: 0 }}>{v.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{"\uD83D\uDCC5"}</span>
                      <span style={{ color: '#6B7280', fontSize: 13 }}>{v.depart}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{"\u23F1\uFE0F"}</span>
                      <span style={{ color: '#6B7280', fontSize: 13 }}>{v.duree}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: '#C75B39', fontSize: 22, fontWeight: 700 }}>{`${v.prix}\u20ac`}</span>
                      <span style={{ color: '#9CA3AF', fontSize: 13, marginLeft: 4 }}>/pers.</span>
                    </div>
                    <a href={`/voyages/${v.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{ display: 'inline-block', padding: '10px 20px', background: '#C75B39', color: '#FFFFFF', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                      {"R\u00e9server"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="/voyages" style={{ display: 'inline-block', padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {"D\u00e9couvrir plus de voyages"}
          </a>
        </div>
      </div>
    </div>
  );
}
