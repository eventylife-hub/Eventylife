'use client';
import { useState } from 'react';

const destinations = [
  { id: 1, nom: "Santorin, Gr\u00e8ce", pays: "Gr\u00e8ce", continent: "Europe", transport: "avion", image: "\uD83C\uDDEC\uD83C\uDDF7", prix: 1299, duree: "7 jours", date: "15-22 avril 2026", places: 4, total: 24, description: "D\u00e9couvrez les maisons blanches et couchers de soleil l\u00e9gendaires de Santorin.", note: 4.9 },
  { id: 2, nom: "Andalousie, Espagne", pays: "Espagne", continent: "Europe", transport: "bus", image: "\uD83C\uDDEA\uD83C\uDDF8", prix: 899, duree: "6 jours", date: "5-10 mai 2026", places: 12, total: 30, description: "S\u00e9ville, Grenade, Cordoue : un circuit flamenco et tapas inoubliable.", note: 4.8 },
  { id: 3, nom: "Toscane, Italie", pays: "Italie", continent: "Europe", transport: "bus", image: "\uD83C\uDDEE\uD83C\uDDF9", prix: 799, duree: "5 jours", date: "20-24 mai 2026", places: 18, total: 30, description: "Vignobles, collines et villages m\u00e9di\u00e9vaux au c\u0153ur de la Toscane.", note: 4.7 },
  { id: 4, nom: "Marrakech, Maroc", pays: "Maroc", continent: "Afrique", transport: "avion", image: "\uD83C\uDDF2\uD83C\uDDE6", prix: 749, duree: "5 jours", date: "1-5 juin 2026", places: 8, total: 20, description: "Souks, palais et jardins : plongez dans la magie de Marrakech.", note: 4.6 },
  { id: 5, nom: "Lisbonne, Portugal", pays: "Portugal", continent: "Europe", transport: "avion", image: "\uD83C\uDDF5\uD83C\uDDF9", prix: 849, duree: "5 jours", date: "10-14 juin 2026", places: 6, total: 22, description: "Ruelles color\u00e9es, pasteis de nata et fado dans la capitale portugaise.", note: 4.8 },
  { id: 6, nom: "Croatie, Split & Dubrovnik", pays: "Croatie", continent: "Europe", transport: "avion", image: "\uD83C\uDDED\uD83C\uDDF7", prix: 1099, duree: "7 jours", date: "18-24 juin 2026", places: 10, total: 24, description: "Eaux turquoise et cit\u00e9s m\u00e9di\u00e9vales le long de la c\u00f4te dalmate.", note: 4.9 },
  { id: 7, nom: "Alsace, France", pays: "France", continent: "Europe", transport: "bus", image: "\uD83C\uDDEB\uD83C\uDDF7", prix: 499, duree: "3 jours", date: "25-27 juin 2026", places: 22, total: 30, description: "Villages \u00e0 colombages, route des vins et gastronomie alsacienne.", note: 4.5 },
  { id: 8, nom: "Istanbul, Turquie", pays: "Turquie", continent: "Europe", transport: "avion", image: "\uD83C\uDDF9\uD83C\uDDF7", prix: 949, duree: "6 jours", date: "2-7 juillet 2026", places: 14, total: 24, description: "Entre Orient et Occident, Istanbul fascine par ses mosqu\u00e9es et bazars.", note: 4.7 },
  { id: 9, nom: "Provence, France", pays: "France", continent: "Europe", transport: "bus", image: "\uD83C\uDDEB\uD83C\uDDF7", prix: 599, duree: "4 jours", date: "8-11 juillet 2026", places: 20, total: 30, description: "Lavande, march\u00e9s proven\u00e7aux et villages perch\u00e9s du Luberon.", note: 4.6 },
];

const transports = ["Tous", "Bus", "Avion"];

export default function DestinationsPage() {
  const [transport, setTransport] = useState("Tous");
  const [tri, setTri] = useState("prix-asc");
  const [recherche, setRecherche] = useState("");

  let filtered = destinations.filter(d => {
    if (transport !== "Tous" && d.transport !== transport.toLowerCase()) return false;
    if (recherche && !d.nom.toLowerCase().includes(recherche.toLowerCase()) && !d.pays.toLowerCase().includes(recherche.toLowerCase())) return false;
    return true;
  });

  if (tri === "prix-asc") filtered.sort((a, b) => a.prix - b.prix);
  else if (tri === "prix-desc") filtered.sort((a, b) => b.prix - a.prix);
  else if (tri === "date") filtered.sort((a, b) => a.id - b.id);
  else if (tri === "note") filtered.sort((a, b) => b.note - a.note);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"\uD83C\uDF0D Explorez le monde"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Nos Destinations"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            {"D\u00e9couvrez nos circuits accompagn\u00e9s en bus et en avion, avec prise en charge porte-\u00e0-porte."}
          </p>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <input
              type="text"
              placeholder={"\uD83D\uDD0D Rechercher une destination, un pays..."}
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              style={{ width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none', fontSize: 15, outline: 'none', background: 'rgba(255,255,255,0.95)', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '24px 0 16px' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {transports.map(t => (
              <button key={t} onClick={() => setTransport(t)} style={{ padding: '8px 20px', borderRadius: 20, border: transport === t ? 'none' : '1px solid #E8E4DE', background: transport === t ? '#C75B39' : '#FFFFFF', color: transport === t ? '#FFFFFF' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {t === "Bus" ? "\uD83D\uDE8C Bus" : t === "Avion" ? "\u2708\uFE0F Avion" : t}
              </button>
            ))}
          </div>
          <select value={tri} onChange={e => setTri(e.target.value)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #E8E4DE', background: '#FFFFFF', color: '#6B7280', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
            <option value="prix-asc">{"Prix croissant"}</option>
            <option value="prix-desc">{"Prix d\u00e9croissant"}</option>
            <option value="date">{"Date de d\u00e9part"}</option>
            <option value="note">{"Meilleures notes"}</option>
          </select>
        </div>

        <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 16 }}>{`${filtered.length} voyage${filtered.length > 1 ? 's' : ''} trouv\u00e9${filtered.length > 1 ? 's' : ''}`}</div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDD0D"}</div>
            <h3 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Aucun voyage trouv\u00e9"}</h3>
            <p style={{ color: '#6B7280', fontSize: 14 }}>{"Essayez de modifier vos filtres ou votre recherche."}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20, paddingBottom: 60 }}>
            {filtered.map(d => {
              const pct = Math.round(((d.total - d.places) / d.total) * 100);
              return (
                <div key={d.id} style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s' }}>
                  <div style={{ padding: '30px 24px 16px', background: '#F9FAFB', textAlign: 'center', position: 'relative' }}>
                    <div style={{ fontSize: 64 }}>{d.image}</div>
                    <span style={{ position: 'absolute', top: 12, right: 12, background: d.transport === 'bus' ? '#EEF2FF' : '#FEF3C7', color: d.transport === 'bus' ? '#4F46E5' : '#D97706', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                      {d.transport === 'bus' ? "\uD83D\uDE8C Bus" : "\u2708\uFE0F Avion"}
                    </span>
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <h3 style={{ color: '#1A1A2E', fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 0, lineHeight: 1.3, flex: 1 }}>{d.nom}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, marginLeft: 8 }}>
                        <span style={{ color: '#F59E0B', fontSize: 14 }}>{"\u2B50"}</span>
                        <span style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 600 }}>{d.note}</span>
                      </div>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, marginTop: 4, marginBottom: 12 }}>{d.description}</p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12, color: '#6B7280', fontSize: 12 }}>
                      <span>{`\uD83D\uDCC5 ${d.date}`}</span>
                      <span>{`\u23F1\uFE0F ${d.duree}`}</span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280', marginBottom: 4 }}>
                        <span>{`${d.places} places restantes`}</span>
                        <span>{`${pct}% rempli`}</span>
                      </div>
                      <div style={{ background: '#F3F4F6', borderRadius: 10, height: 6, overflow: 'hidden' }}>
                        <div style={{ background: d.places <= 5 ? '#EF4444' : d.places <= 10 ? '#F59E0B' : '#059669', height: '100%', width: `${pct}%`, borderRadius: 10, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                      <div>
                        <span style={{ color: '#C75B39', fontSize: 22, fontWeight: 800 }}>{`${d.prix}\u20ac`}</span>
                        <span style={{ color: '#6B7280', fontSize: 12, marginLeft: 4 }}>{"/ pers."}</span>
                      </div>
                      <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C75B39, #D4A853)', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        {"D\u00e9couvrir \u2192"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\uD83D\uDCDE"}</div>
            <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Besoin d\u2019aide pour choisir ?"}</h3>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{"Nos conseillers voyage sont \u00e0 votre \u00e9coute pour vous aider \u00e0 trouver le circuit id\u00e9al."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '12px 28px', background: '#1A1A2E', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{"Appeler le 01 XX XX XX XX"}</button>
              <button style={{ padding: '12px 28px', background: '#FFFFFF', color: '#1A1A2E', border: '2px solid #1A1A2E', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{"Demander un devis"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
