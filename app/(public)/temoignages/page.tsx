'use client';
import { useState } from 'react';

const temoignages = [
  { id: 1, nom: "Marie-Claire D.", age: 67, ville: "Lyon", voyage: "Santorin, Gr\u00e8ce", note: 5, date: "Avril 2025", avatar: "\uD83D\uDC69\u200D\uD83E\uDDB3", texte: "Mon premier voyage de groupe et quelle d\u00e9couverte ! L\u2019accompagnement depuis chez moi jusqu\u2019\u00e0 l\u2019h\u00f4tel \u00e9tait parfait. Sophie, notre accompagnatrice, \u00e9tait aux petits soins. Les couchers de soleil \u00e0 Oia resteront grav\u00e9s dans ma m\u00e9moire." },
  { id: 2, nom: "Jean-Pierre M.", age: 72, ville: "Bordeaux", voyage: "Andalousie, Espagne", note: 5, date: "Mai 2025", avatar: "\uD83D\uDC74", texte: "Excellent circuit ! Grenade et l\u2019Alhambra m\u2019ont laiss\u00e9 sans voix. Le bus \u00e9tait confortable, les h\u00f4tels bien choisis et les tapas d\u00e9licieuses. Je recommande les yeux ferm\u00e9s." },
  { id: 3, nom: "Fran\u00e7oise L.", age: 58, ville: "Nantes", voyage: "Toscane, Italie", note: 4, date: "Juin 2025", avatar: "\uD83D\uDC69", texte: "Tr\u00e8s beau voyage en Toscane. Les paysages sont magnifiques et les d\u00e9gustations de vin \u00e9taient un vrai plaisir. Seul b\u00e9mol : j\u2019aurais aim\u00e9 un peu plus de temps libre \u00e0 Florence." },
  { id: 4, nom: "Robert et Monique T.", age: 70, ville: "Marseille", voyage: "Croatie", note: 5, date: "Juillet 2025", avatar: "\uD83D\uDC6B", texte: "Notre 3\u00e8me voyage avec Eventy Life et toujours la m\u00eame qualit\u00e9 ! Dubrovnik est une merveille. L\u2019eau cristalline, les vieilles pierres\u2026 On a d\u00e9j\u00e0 r\u00e9serv\u00e9 le prochain en Gr\u00e8ce." },
  { id: 5, nom: "Sylvie R.", age: 63, ville: "Toulouse", voyage: "Marrakech, Maroc", note: 5, date: "Octobre 2025", avatar: "\uD83D\uDC69\u200D\uD83E\uDDB0", texte: "Marrakech est envoutante ! Le riad \u00e9tait sublime, la m\u00e9dina fascinante. Notre guide local connaissait chaque recoin. Le d\u00eener dans le d\u00e9sert sous les \u00e9toiles : magique." },
  { id: 6, nom: "Philippe B.", age: 55, ville: "Paris", voyage: "Istanbul, Turquie", note: 4, date: "Novembre 2025", avatar: "\uD83D\uDC68\u200D\uD83E\uDDB1", texte: "Istanbul est une ville incroyable entre deux continents. La Mosqu\u00e9e Bleue, Sainte-Sophie, le Grand Bazar\u2026 Le programme \u00e9tait dense mais bien \u00e9quilibr\u00e9. Tr\u00e8s bonne organisation." },
  { id: 7, nom: "Claudine V.", age: 68, ville: "Strasbourg", voyage: "Alsace, France", note: 5, date: "D\u00e9cembre 2025", avatar: "\uD83D\uDC75", texte: "M\u00eame en habitant en Alsace, j\u2019ai red\u00e9couvert ma r\u00e9gion ! Les march\u00e9s de No\u00ebl avec le groupe \u00e9taient f\u00e9eriques. Ambiance chaleureuse et conviviale. Merci Eventy Life !" },
  { id: 8, nom: "Andr\u00e9 et Josiane K.", age: 75, ville: "Nice", voyage: "Lisbonne, Portugal", note: 5, date: "Janvier 2026", avatar: "\uD83D\uDC6B", texte: "Lisbonne nous a charm\u00e9s ! Les pasteis de Bel\u00e9m, le tram 28, le fado le soir\u2026 Tout \u00e9tait parfaitement organis\u00e9. L\u2019accompagnement porte-\u00e0-porte est un vrai plus quand on vieillit." },
  { id: 9, nom: "Catherine G.", age: 60, ville: "Rennes", voyage: "Provence, France", note: 4, date: "F\u00e9vrier 2026", avatar: "\uD83D\uDC69", texte: "Les champs de lavande, Gordes, Roussillon\u2026 La Provence est sublime. Le rythme \u00e9tait parfait, ni trop rapide ni trop lent. J\u2019ai rencontr\u00e9 des personnes formidables dans le groupe." },
];

const notes = ["Toutes", "5", "4"];

export default function TemoignagesPage() {
  const [filtre, setFiltre] = useState("Toutes");
  const filtered = filtre === "Toutes" ? temoignages : temoignages.filter(t => t.note === parseInt(filtre));
  const avg = (temoignages.reduce((s, t) => s + t.note, 0) / temoignages.length).toFixed(1);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Ils nous font confiance"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"T\u00e9moignages Voyageurs"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            {"D\u00e9couvrez les exp\u00e9riences de nos voyageurs et pourquoi ils reviennent."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#D4A853', fontSize: 36, fontWeight: 800 }}>{avg}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{"Note moyenne"}</div>
              <div style={{ color: '#F59E0B', fontSize: 18, marginTop: 4 }}>{"\u2B50\u2B50\u2B50\u2B50\u2B50"}</div>
            </div>
            <div>
              <div style={{ color: '#D4A853', fontSize: 36, fontWeight: 800 }}>{temoignages.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{"Avis v\u00e9rifi\u00e9s"}</div>
            </div>
            <div>
              <div style={{ color: '#D4A853', fontSize: 36, fontWeight: 800 }}>{"98%"}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{"Recommandent"}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 8, padding: '24px 0 16px' }}>
          {notes.map(n => (
            <button key={n} onClick={() => setFiltre(n)} style={{ padding: '8px 20px', borderRadius: 20, border: filtre === n ? 'none' : '1px solid #E8E4DE', background: filtre === n ? '#C75B39' : '#FFFFFF', color: filtre === n ? '#FFFFFF' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {n === "Toutes" ? "Tous les avis" : `${"⭐".repeat(parseInt(n))} (${temoignages.filter(t => t.note === parseInt(n)).length})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 36 }}>{t.avatar}</span>
                  <div>
                    <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700 }}>{t.nom}</div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>{`${t.age} ans \u2022 ${t.ville}`}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#F59E0B', fontSize: 14 }}>{"⭐".repeat(t.note)}</div>
                  <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>{t.date}</div>
                </div>
              </div>
              <div style={{ background: '#FAF7F2', borderRadius: 10, padding: '6px 12px', display: 'inline-block', marginBottom: 12 }}>
                <span style={{ color: '#C75B39', fontSize: 12, fontWeight: 600 }}>{`\uD83C\uDF0D ${t.voyage}`}</span>
              </div>
              <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.8, marginTop: 0, marginBottom: 0 }}>{`\u201C${t.texte}\u201D`}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u2708\uFE0F"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Pr\u00eat \u00e0 vivre votre propre aventure ?"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 20 }}>{"Rejoignez nos voyageurs satisfaits et d\u00e9couvrez le monde avec Eventy Life."}</p>
            <button style={{ padding: '14px 32px', background: '#C75B39', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"D\u00e9couvrir nos voyages"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
