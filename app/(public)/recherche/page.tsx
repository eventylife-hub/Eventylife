'use client';
import { useState } from 'react';

const voyages = [
  { id: 'amsterdam', titre: 'Week-end Amsterdam', destination: 'Amsterdam, Pays-Bas', prix: 289, transport: 'Bus', duree: '3 jours', depart: 'Paris', date: '15-17 Mars 2026', places: 8, image: '&#127758;', categorie: 'europe' },
  { id: 'marrakech', titre: 'S&#233;jour Marrakech', destination: 'Marrakech, Maroc', prix: 649, transport: 'Avion', duree: '7 jours', depart: 'Paris', date: '5-12 Avril 2026', places: 12, image: '&#127796;', categorie: 'afrique' },
  { id: 'rome', titre: 'Rome Express', destination: 'Rome, Italie', prix: 459, transport: 'Avion', duree: '4 jours', depart: 'Lyon', date: '20-23 Juin 2026', places: 5, image: '&#127855;', categorie: 'europe' },
  { id: 'barcelone', titre: 'Barcelone en groupe', destination: 'Barcelone, Espagne', prix: 349, transport: 'Bus', duree: '4 jours', depart: 'Toulouse', date: '10-13 Mai 2026', places: 15, image: '&#9728;&#65039;', categorie: 'europe' },
  { id: 'istanbul', titre: 'Istanbul D&#233;couverte', destination: 'Istanbul, Turquie', prix: 599, transport: 'Avion', duree: '5 jours', depart: 'Paris', date: '1-5 Juillet 2026', places: 3, image: '&#128332;', categorie: 'asie' },
  { id: 'lisbonne', titre: 'Lisbonne Authentique', destination: 'Lisbonne, Portugal', prix: 389, transport: 'Avion', duree: '4 jours', depart: 'Bordeaux', date: '15-18 Ao&#251;t 2026', places: 20, image: '&#127754;', categorie: 'europe' },
];

const categories = [
  { id: 'tous', label: 'Tous' },
  { id: 'europe', label: 'Europe' },
  { id: 'afrique', label: 'Afrique' },
  { id: 'asie', label: 'Asie' },
];

export default function RecherchePage() {
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState('tous');
  const [transport, setTransport] = useState('tous');
  const [tri, setTri] = useState('prix-asc');

  let filtered = voyages.filter(v => {
    const matchSearch = search === '' || v.titre.toLowerCase().includes(search.toLowerCase()) || v.destination.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === 'tous' || v.categorie === categorie;
    const matchTransport = transport === 'tous' || v.transport.toLowerCase() === transport;
    return matchSearch && matchCat && matchTransport;
  });

  if (tri === 'prix-asc') filtered.sort((a, b) => a.prix - b.prix);
  else if (tri === 'prix-desc') filtered.sort((a, b) => b.prix - a.prix);
  else if (tri === 'date') filtered.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)' }}>
      <nav style={{ background: '#1A1A2E', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <a href="/" style={{ color: '#D4A853', fontSize: 22, fontWeight: 700, textDecoration: 'none', fontStyle: 'italic' }}>Eventy Life</a>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/voyages" style={{ color: '#FAF7F2', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Voyages</a>
          <a href="/connexion" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Connexion</a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>Rechercher un voyage</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px' }}>Trouvez votre prochaine aventure parmi nos destinations</p>

        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <input type="text" placeholder="Rechercher une destination..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 15, outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {categories.map(c => (
                <button key={c.id} onClick={() => setCategorie(c.id)} style={{ padding: '6px 16px', borderRadius: 20, border: categorie === c.id ? 'none' : '1px solid #E8E4DE', background: categorie === c.id ? '#1A1A2E' : 'white', color: categorie === c.id ? 'white' : '#6B7280', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{c.label}</button>
              ))}
            </div>

            <select value={transport} onChange={e => setTransport(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 13, background: 'white', cursor: 'pointer' }}>
              <option value="tous">Tout transport</option>
              <option value="bus">Bus</option>
              <option value="avion">Avion</option>
            </select>

            <select value={tri} onChange={e => setTri(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 13, background: 'white', cursor: 'pointer' }}>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix d&#233;croissant</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 16 }}>{filtered.length} voyage{filtered.length > 1 ? 's' : ''} trouv&#233;{filtered.length > 1 ? 's' : ''}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(v => (
            <div key={v.id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ width: 160, minHeight: 160, background: 'linear-gradient(135deg, #FAF7F2, #E8E4DE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }} dangerouslySetInnerHTML={{ __html: v.image }} />
                <div style={{ flex: 1, padding: 20, minWidth: 280 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A2E', margin: 0 }} dangerouslySetInnerHTML={{ __html: v.titre }} />
                      <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>{v.destination}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 24, fontWeight: 700, color: '#C75B39', margin: 0 }}>{v.prix} &#8364;</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>par personne</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '12px 0', padding: '12px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
                    <div><p style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', margin: '0 0 2px' }}>Dates</p><p style={{ fontSize: 13, color: '#1A1A2E', fontWeight: 500, margin: 0 }}>{v.date}</p></div>
                    <div><p style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', margin: '0 0 2px' }}>Transport</p><p style={{ fontSize: 13, color: '#1A1A2E', fontWeight: 500, margin: 0 }}>{v.transport}</p></div>
                    <div><p style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', margin: '0 0 2px' }}>D&#233;part</p><p style={{ fontSize: 13, color: '#1A1A2E', fontWeight: 500, margin: 0 }}>{v.depart}</p></div>
                    <div><p style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', margin: '0 0 2px' }}>Places</p><p style={{ fontSize: 13, color: v.places <= 5 ? '#DC2626' : '#059669', fontWeight: 500, margin: 0 }}>{v.places} dispo</p></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{v.duree}</span>
                    <a href={'/voyages/' + v.id} style={{ padding: '10px 24px', background: '#C75B39', color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Voir le voyage</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128269;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: '0 0 8px' }}>Aucun voyage trouv&#233;</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 20px' }}>Essayez de modifier vos crit&#232;res de recherche</p>
            <button onClick={() => { setSearch(''); setCategorie('tous'); setTransport('tous'); }} style={{ padding: '10px 24px', background: '#C75B39', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>R&#233;initialiser les filtres</button>
          </div>
        )}
      </div>
    </div>
  );
}
