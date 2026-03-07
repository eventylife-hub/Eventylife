'use client';
import { useState } from 'react';

const articles = [
  { id: 1, titre: "10 villages secrets de Gr\u00e8ce \u00e0 d\u00e9couvrir", categorie: "Destinations", image: "\uD83C\uDDEC\uD83C\uDDF7", date: "28 f\u00e9vrier 2026", temps: "8 min", extrait: "Loin des sentiers battus, ces p\u00e9pites grecques offrent authenticit\u00e9 et paysages \u00e0 couper le souffle. De Monemvasia \u00e0 Zagori, embarquez pour un voyage hors du temps.", auteur: "Sophie M.", avatar: "\uD83D\uDC69\u200D\uD83E\uDDB0" },
  { id: 2, titre: "Voyager en groupe : le guide complet pour d\u00e9butants", categorie: "Conseils", image: "\uD83D\uDE8C", date: "22 f\u00e9vrier 2026", temps: "12 min", extrait: "Premi\u00e8re exp\u00e9rience en voyage de groupe ? D\u00e9couvrez nos conseils pour profiter pleinement de l\u2019aventure collective tout en gardant votre espace personnel.", auteur: "Marc D.", avatar: "\uD83D\uDC68\u200D\uD83E\uDDB1" },
  { id: 3, titre: "Les plus beaux march\u00e9s de No\u00ebl en Europe", categorie: "Inspirations", image: "\uD83C\uDF84", date: "15 f\u00e9vrier 2026", temps: "6 min", extrait: "Strasbourg, Vienne, Cologne, Prague\u2026 Plongez dans la magie des f\u00eates avec notre s\u00e9lection des march\u00e9s de No\u00ebl les plus enchanteurs du continent.", auteur: "Julie R.", avatar: "\uD83D\uDC69" },
  { id: 4, titre: "Comment pr\u00e9parer sa valise pour un circuit en bus", categorie: "Conseils", image: "\uD83E\uDDF3", date: "8 f\u00e9vrier 2026", temps: "5 min", extrait: "Espace limit\u00e9 en soute ? Pas de panique. Voici notre m\u00e9thode infaillible pour tout caser sans stress et voyager l\u00e9ger.", auteur: "Sophie M.", avatar: "\uD83D\uDC69\u200D\uD83E\uDDB0" },
  { id: 5, titre: "Andalousie : 7 jours entre flamenco et tapas", categorie: "Destinations", image: "\uD83C\uDDEA\uD83C\uDDF8", date: "1 f\u00e9vrier 2026", temps: "10 min", extrait: "S\u00e9ville, Grenade, Cordoue, Ronda\u2026 L\u2019Andalousie est une terre de contrastes o\u00f9 chaque ville r\u00e9serve son lot de merveilles architecturales et gastronomiques.", auteur: "Marc D.", avatar: "\uD83D\uDC68\u200D\uD83E\uDDB1" },
  { id: 6, titre: "Pourquoi l\u2019accompagnement porte-\u00e0-porte change tout", categorie: "Eventy Life", image: "\uD83E\uDD1D", date: "25 janvier 2026", temps: "4 min", extrait: "Chez Eventy Life, chaque voyageur est accompagn\u00e9 de son domicile jusqu\u2019\u00e0 destination. D\u00e9couvrez comment ce service transforme l\u2019exp\u00e9rience de voyage.", auteur: "David P.", avatar: "\uD83D\uDC68\u200D\uD83D\uDCBC" },
];

const categories = ["Tous", "Destinations", "Conseils", "Inspirations", "Eventy Life"];

export default function BlogPage() {
  const [filtre, setFiltre] = useState("Tous");
  const filtered = filtre === "Tous" ? articles : articles.filter(a => a.categorie === filtre);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Le magazine"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Blog Eventy Life"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 0 }}>
            {"Inspirations, conseils de voyage et coulisses de nos circuits accompagn\u00e9s."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '30px 0 20px' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFiltre(c)} style={{ padding: '8px 20px', borderRadius: 20, border: filtre === c ? 'none' : '1px solid #E8E4DE', background: filtre === c ? '#C75B39' : '#FFFFFF', color: filtre === c ? '#FFFFFF' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <div style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 30 }}>
            <div style={{ padding: '50px 40px', display: 'flex', gap: 30, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 80, flexShrink: 0 }}>{filtered[0].image}</div>
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span style={{ background: '#FAF7F2', color: '#C75B39', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{filtered[0].categorie}</span>
                  <span style={{ color: '#6B7280', fontSize: 12, padding: '4px 0' }}>{filtered[0].date}</span>
                </div>
                <h2 style={{ color: '#1A1A2E', fontSize: 24, fontWeight: 700, marginTop: 0, marginBottom: 12, lineHeight: 1.3 }}>{filtered[0].titre}</h2>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{filtered[0].extrait}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{filtered[0].avatar}</span>
                    <span style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 600 }}>{filtered[0].auteur}</span>
                  </div>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>{`\u23F1\uFE0F ${filtered[0].temps} de lecture`}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, paddingBottom: 60 }}>
          {filtered.slice(1).map(a => (
            <div key={a.id} style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ padding: '30px 24px 16px', textAlign: 'center', background: '#F9FAFB', fontSize: 50 }}>{a.image}</div>
              <div style={{ padding: '16px 20px 20px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#FAF7F2', color: '#C75B39', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{a.categorie}</span>
                  <span style={{ color: '#6B7280', fontSize: 11, padding: '3px 0' }}>{a.temps}</span>
                </div>
                <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 8, lineHeight: 1.4 }}>{a.titre}</h3>
                <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{a.extrait.substring(0, 100)}{"..."}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                  <span style={{ fontSize: 16 }}>{a.avatar}</span>
                  <span style={{ color: '#1A1A2E', fontSize: 12, fontWeight: 500 }}>{a.auteur}</span>
                  <span style={{ color: '#6B7280', fontSize: 11, marginLeft: 'auto' }}>{a.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Restez inspir\u00e9s"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 20 }}>{"Recevez nos derniers articles et offres exclusives par email."}</p>
            <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto' }}>
              <input type="email" placeholder="votre@email.com" style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', fontSize: 14, outline: 'none' }} />
              <button style={{ padding: '12px 24px', background: '#C75B39', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{"S\u2019inscrire"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
