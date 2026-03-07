'use client';

const etapes = [
  { num: "01", titre: "Prise de contact", icon: "\uD83D\uDCDE", desc: "Appelez-nous ou remplissez le formulaire. Un conseiller d\u00e9di\u00e9 vous rappelle sous 24h pour comprendre vos envies et vos besoins.", couleur: "#7C3AED" },
  { num: "02", titre: "Organisation personnalis\u00e9e", icon: "\uD83D\uDCCB", desc: "Nous pr\u00e9parons votre voyage sur-mesure : transport, h\u00e9bergement, activit\u00e9s, restauration. Vous validez chaque \u00e9tape.", couleur: "#C75B39" },
  { num: "03", titre: "D\u00e9part depuis chez vous", icon: "\uD83C\uDFE0", desc: "Le jour J, un accompagnateur vient vous chercher \u00e0 votre domicile. Pas de stress, pas de logistique : on s\u2019occupe de tout.", couleur: "#059669" },
  { num: "04", titre: "Voyage accompagn\u00e9", icon: "\u2708\uFE0F", desc: "Pendant tout le s\u00e9jour, votre accompagnateur est pr\u00e9sent. Il g\u00e8re les impr\u00e9vus, traduit, guide et veille \u00e0 votre confort.", couleur: "#D4A853" },
  { num: "05", titre: "Retour porte-\u00e0-porte", icon: "\uD83D\uDE4F", desc: "Au retour, on vous ram\u00e8ne jusqu\u2019\u00e0 votre porte. Vos souvenirs en t\u00eate, z\u00e9ro souci en plus.", couleur: "#1A1A2E" },
];

const avantages = [
  { icon: "\uD83D\uDEE1\uFE0F", titre: "S\u00e9curit\u00e9 totale", desc: "Assurance compl\u00e8te, num\u00e9ro d\u2019urgence 24h/24, accompagnateur form\u00e9 aux premiers secours." },
  { icon: "\u2764\uFE0F", titre: "Attention humaine", desc: "Chaque voyageur est unique. Nos accompagnateurs s\u2019adaptent \u00e0 votre rythme et vos pr\u00e9f\u00e9rences." },
  { icon: "\uD83C\uDF0D", titre: "Destinations s\u00e9lectionn\u00e9es", desc: "Nous choisissons des destinations adapt\u00e9es, des h\u00f4tels de qualit\u00e9 et des activit\u00e9s accessibles \u00e0 tous." },
  { icon: "\uD83D\uDC65", titre: "Petits groupes", desc: "Maximum 30 personnes par voyage pour garantir la convivialit\u00e9 et l\u2019attention individuelle." },
  { icon: "\uD83D\uDCB0", titre: "Prix tout compris", desc: "Transport, h\u00e9bergement, repas, activit\u00e9s, assurance : tout est inclus dans un prix transparent." },
  { icon: "\uD83D\uDE8C", titre: "Transport confort", desc: "Bus grand tourisme climatis\u00e9 ou vols directs selon la destination. Toujours le meilleur pour votre confort." },
];

const temoignages = [
  { nom: "Monique, 72 ans", texte: "Je n\u2019aurais jamais os\u00e9 voyager seule. Gr\u00e2ce \u00e0 l\u2019accompagnement Eventy, j\u2019ai d\u00e9couvert la Gr\u00e8ce sereinement.", avatar: "\uD83D\uDC75" },
  { nom: "Pierre et Anne, 68 ans", texte: "Le porte-\u00e0-porte change tout. Plus besoin de demander aux enfants de nous conduire \u00e0 l\u2019a\u00e9roport !", avatar: "\uD83D\uDC6B" },
  { nom: "Fran\u00e7oise, 65 ans", texte: "Sophie, notre accompagnatrice, \u00e9tait formidable. Toujours souriante, toujours disponible. Un vrai ange gardien.", avatar: "\uD83D\uDC69" },
];

export default function AccompagnementPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Notre engagement"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Accompagnement Porte-\u00e0-Porte"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            {"De votre domicile \u00e0 votre destination et retour, nous sommes \u00e0 vos c\u00f4t\u00e9s \u00e0 chaque instant."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#D4A853', fontSize: 36, fontWeight: 800 }}>{"100%"}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{"Porte-\u00e0-porte"}</div>
            </div>
            <div>
              <div style={{ color: '#D4A853', fontSize: 36, fontWeight: 800 }}>{"24/7"}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{"Assistance"}</div>
            </div>
            <div>
              <div style={{ color: '#D4A853', fontSize: 36, fontWeight: 800 }}>{"98%"}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{"Satisfaction"}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '50px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Comment \u00e7a fonctionne ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"5 \u00e9tapes simples pour un voyage sans souci"}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 30px', display: 'flex', gap: 20, alignItems: 'flex-start', borderLeft: `4px solid ${e.couleur}` }}>
              <div style={{ minWidth: 56, height: 56, borderRadius: 14, background: `${e.couleur}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ color: e.couleur, fontSize: 13, fontWeight: 700 }}>{`\u00c9TAPE ${e.num}`}</span>
                  <span style={{ color: '#1A1A2E', fontSize: 17, fontWeight: 700 }}>{e.titre}</span>
                </div>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '30px 0 20px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Pourquoi choisir Eventy Life ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"6 bonnes raisons de nous faire confiance"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 0 40px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 20 }}>{"Ils t\u00e9moignent"}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {temoignages.map(t => (
              <div key={t.nom} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', borderTop: '3px solid #C75B39' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{t.avatar}</div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', marginTop: 0, marginBottom: 12 }}>{`\u201C${t.texte}\u201D`}</p>
                <div style={{ color: '#C75B39', fontSize: 13, fontWeight: 700 }}>{t.nom}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #C75B39 0%, #E07A56 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Pr\u00eat \u00e0 partir l\u2019esprit tranquille ?"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"Contactez-nous pour organiser votre prochain voyage accompagn\u00e9."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#FFFFFF', color: '#C75B39', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Demander un devis"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"01 23 45 67 89"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
