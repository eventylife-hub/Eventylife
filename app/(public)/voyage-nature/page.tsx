'use client';

const activites = [
  { icone: "\u{1F3D4}\uFE0F", titre: "Randonnées guidées", desc: "Sentiers balisés adaptés à tous les niveaux, avec un guide nature qui vous fait découvrir la faune et la flore locales.", couleur: "#059669" },
  { icone: "\u{1F426}", titre: "Observation de la faune", desc: "Sorties ornithologiques, safaris nature et points d'observation pour admirer la vie sauvage dans son habitat naturel.", couleur: "#D4A853" },
  { icone: "\u{1F333}", titre: "Forêts & Parcs nationaux", desc: "Excursions dans les plus beaux espaces naturels protégés de France et d'Europe.", couleur: "#7C3AED" },
  { icone: "\u{1F30A}", titre: "Littoral & Lacs", desc: "Découverte des côtes sauvages, lacs de montagne et zones humides préservées.", couleur: "#C75B39" },
];

const destinations = [
  { nom: "Pyrénées", duree: "5 jours", prix: "à partir de 790€", desc: "Cirques, gaves et sommets : la nature pyrénéenne dans toute sa splendeur." },
  { nom: "Cévennes", duree: "4 jours", prix: "à partir de 690€", desc: "Parc national classé UNESCO, sentiers de Stevenson et villages authentiques." },
  { nom: "Lacs italiens", duree: "6 jours", prix: "à partir de 990€", desc: "Côme, Garde, Majeur : eaux turquoise et jardins botaniques somptueux." },
  { nom: "Écosse sauvage", duree: "7 jours", prix: "à partir de 1 390€", desc: "Highlands, lochs et îles : une nature brute et majestueuse." },
];

const inclus = [
  "Guide nature francophone spécialisé sur chaque destination.",
  "Hébergement en éco-lodges, gîtes de charme ou hôtels nature.",
  "Transport en bus grand confort avec arrêts panoramiques.",
  "Matériel d'observation fourni (jumelles, guides naturalistes).",
  "Pension complète avec produits locaux et de saison.",
  "Accompagnateur Eventy dédié tout au long du séjour.",
  "Assurance voyage et assistance rapatriement incluses.",
];

const temoignages = [
  { nom: "François, 71 ans", texte: "Les Pyrénées avec Eventy, c'est un autre monde. Le guide connaissait chaque fleur, chaque oiseau. Magnifique !", note: 5 },
  { nom: "Colette et André, 68 ans", texte: "Les Cévennes à pied, à notre rythme, avec des pauses gourmandes. On en rêvait depuis longtemps.", note: 5 },
  { nom: "Isabelle, 63 ans", texte: "L'Écosse sauvage m'a coupé le souffle. Organisation parfaite, hébergements charmants. Je recommande !", note: 5 },
];

export default function VoyageNaturePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Nature"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Voyages nature"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Reconnectez-vous à la nature avec des séjours en pleine nature, guidés par des passionnés."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Nos activités nature"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {activites.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Nos destinations nature"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Les plus beaux espaces naturels d'Europe, accessibles en groupe."}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {destinations.map(d => (
            <div key={d.nom} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', borderTop: '4px solid #D4A853' }}>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{d.nom}</div>
              <div style={{ color: '#D4A853', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{d.duree + " · " + d.prix}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 50 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Ce qui est inclus"}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inclus.map((texte, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A853', marginTop: 7, flexShrink: 0 }} />
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{texte}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>{"Témoignages"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {temoignages.map((t, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px' }}>
              <div style={{ color: '#D4A853', fontSize: 18, marginBottom: 8 }}>{"★".repeat(t.note)}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0, marginBottom: 12, fontStyle: 'italic' }}>{"\"" + t.texte + "\""}</p>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 700 }}>{t.nom}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Envie de nature ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Contactez notre équipe pour organiser votre prochain voyage nature."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"nature@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
