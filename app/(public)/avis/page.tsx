'use client';
import { useState } from 'react';

export default function AvisPage() {
  const [filter, setFilter] = useState('tous');

  const stats = { moyenne: 4.8, total: 127, cinq: 89, quatre: 28, trois: 7, deux: 2, un: 1 };

  const avis = [
    { id: 1, nom: "Marie L.", destination: "Santorin, Gr\u00e8ce", note: 5, date: "2 mars 2026", texte: "Une exp\u00e9rience absolument magique ! L\u2019accompagnement d\u2019Eventy Life \u00e9tait parfait du d\u00e9but \u00e0 la fin. Le groupe \u00e9tait super sympa et les h\u00f4tels magnifiques. Je recommande \u00e0 1000%\u00a0!", avatar: "ML", verified: true },
    { id: 2, nom: "Pierre D.", destination: "D\u00e9sert du Sahara, Maroc", note: 5, date: "28 f\u00e9v 2026", texte: "Mon premier voyage en groupe et certainement pas le dernier ! Karim notre accompagnateur \u00e9tait incroyable. La nuit sous les \u00e9toiles dans le d\u00e9sert restera grav\u00e9e dans ma m\u00e9moire.", avatar: "PD", verified: true },
    { id: 3, nom: "Sophie M.", destination: "Lisbonne & Porto", note: 4, date: "15 f\u00e9v 2026", texte: "Tr\u00e8s bon voyage, bien organis\u00e9. Petit b\u00e9mol sur le temps libre qui \u00e9tait un peu court \u00e0 Porto. Mais l\u2019ambiance du groupe et la qualit\u00e9 des restaurants s\u00e9lectionn\u00e9s compensent largement\u00a0!", avatar: "SM", verified: true },
    { id: 4, nom: "Lucas R.", destination: "Tokyo & Kyoto", note: 5, date: "10 f\u00e9v 2026", texte: "Le Japon avec Eventy Life c\u2019est une autre dimension\u00a0! Tout \u00e9tait parfaitement orchestr\u00e9 : les transits, les visites, les repas. On se sent pris en charge sans \u00eatre \u00e9touff\u00e9. Bravo\u00a0!", avatar: "LR", verified: true },
    { id: 5, nom: "Camille B.", destination: "Santorin, Gr\u00e8ce", note: 5, date: "5 f\u00e9v 2026", texte: "Coup de c\u0153ur total pour ce voyage\u00a0! Les couchers de soleil \u00e0 Oia sont encore plus beaux en vrai. L\u2019\u00e9quipe Eventy est aux petits soins. J\u2019ai d\u00e9j\u00e0 r\u00e9serv\u00e9 le prochain\u00a0!", avatar: "CB", verified: false },
    { id: 6, nom: "Thomas G.", destination: "D\u00e9sert du Sahara, Maroc", note: 4, date: "1 f\u00e9v 2026", texte: "Belle aventure dans le d\u00e9sert. L\u2019organisation \u00e9tait top. J\u2019aurais aim\u00e9 un jour de plus pour profiter davantage de l\u2019oasis. Tr\u00e8s bonne ambiance dans le groupe.", avatar: "TG", verified: true },
  ];

  const filtres = [
    { key: 'tous', label: 'Tous' },
    { key: '5', label: '5 \u2605' },
    { key: '4', label: '4 \u2605' },
    { key: '3', label: '3 \u2605 et moins' },
  ];

  const filtered = filter === 'tous' ? avis : filter === '3' ? avis.filter(a => a.note <= 3) : avis.filter(a => a.note === parseInt(filter));

  const renderStars = (n) => {
    let s = '';
    for (let i = 0; i < 5; i++) s += i < n ? '\u2605' : '\u2606';
    return s;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 900, margin: '0 auto' }}>
        <a href="/" style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic', textDecoration: 'none' }}>Eventy Life</a>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/voyages" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Voyages</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Connexion</a>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{"\u2B50"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>
            {"Avis de nos voyageurs"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 0 }}>
            {"D\u00e9couvrez ce que nos voyageurs pensent de leur exp\u00e9rience Eventy Life"}
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px', marginBottom: 32, display: 'flex', gap: 40, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <div style={{ color: '#C75B39', fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{stats.moyenne}</div>
            <div style={{ color: '#D4A853', fontSize: 24, marginTop: 4 }}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
            <div style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>{`${stats.total} avis`}</div>
          </div>
          <div style={{ flex: 1 }}>
            {[
              { label: '5 \u2605', count: stats.cinq, pct: Math.round(stats.cinq / stats.total * 100) },
              { label: '4 \u2605', count: stats.quatre, pct: Math.round(stats.quatre / stats.total * 100) },
              { label: '3 \u2605', count: stats.trois, pct: Math.round(stats.trois / stats.total * 100) },
              { label: '2 \u2605', count: stats.deux, pct: Math.round(stats.deux / stats.total * 100) },
              { label: '1 \u2605', count: stats.un, pct: Math.round(stats.un / stats.total * 100) },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ color: '#6B7280', fontSize: 13, width: 30 }}>{r.label}</span>
                <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: '#D4A853', borderRadius: 4 }} />
                </div>
                <span style={{ color: '#9CA3AF', fontSize: 12, width: 24, textAlign: 'right' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {filtres.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', background: filter === f.key ? '#D4A853' : '#FFFFFF', color: filter === f.key ? '#1A1A2E' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(a => (
            <div key={a.id} style={{ background: '#FFFFFF', borderRadius: 14, padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1A1A2E', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                    {a.avatar}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600 }}>{a.nom}</span>
                      {a.verified && (
                        <span style={{ background: '#059669', color: '#FFFFFF', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                          {"V\u00e9rifi\u00e9"}
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>{a.destination}</div>
                  </div>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: 12 }}>{a.date}</span>
              </div>
              <div style={{ color: '#D4A853', fontSize: 16, marginBottom: 8, letterSpacing: 2 }}>
                {renderStars(a.note)}
              </div>
              <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {a.texte}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="/voyages" style={{ display: 'inline-block', padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {"R\u00e9server votre voyage"}
          </a>
        </div>
      </div>
    </div>
  );
}
