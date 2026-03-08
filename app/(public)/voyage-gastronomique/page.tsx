'use client';

const experiences = [
  { icone: "\u{1F372}", titre: "Cuisine régionale", desc: "Découvrez les spécialités culinaires de chaque région : marchés locaux, recettes traditionnelles et produits du terroir.", couleur: "#059669" },
  { icone: "\u{1F377}", titre: "Vignobles & Dégustations", desc: "Visites de domaines viticoles, caves et dégustations commentées par des sommeliers passionnés.", couleur: "#D4A853" },
  { icone: "\u{1F468}\u200D\u{1F373}", titre: "Ateliers culinaires", desc: "Cours de cuisine avec des chefs locaux : apprenez à préparer les plats emblématiques de chaque destination.", couleur: "#7C3AED" },
  { icone: "\u{1F9C0}", titre: "Fromages & Terroir", desc: "Rencontres avec des artisans fromagers, visites de fermes et dégustations de produits artisanaux.", couleur: "#C75B39" },
];

const destinations = [
  { nom: "Bourgogne", duree: "4 jours", prix: "à partir de 790€", desc: "Vins prestigieux, bœuf bourguignon et escargots : le cœur gastronomique de la France." },
  { nom: "Pays Basque", duree: "5 jours", prix: "à partir de 890€", desc: "Pintxos, piment d'Espelette, fromage de brebis et cuisine basque authentique." },
  { nom: "Toscane", duree: "6 jours", prix: "à partir de 1 090€", desc: "Chianti, truffe, pasta fresca et huile d'olive : l'Italie dans toute sa splendeur." },
  { nom: "Alsace", duree: "4 jours", prix: "à partir de 750€", desc: "Route des vins, choucroute, kougelhopf et marchés de Noël gastronomiques." },
];

const inclus = [
  "Guide gastronomique francophone spécialisé sur chaque destination.",
  "Dégustations de vins, fromages et produits locaux incluses.",
  "Ateliers de cuisine avec des chefs locaux renommés.",
  "Hébergement en hôtels de charme avec restaurant gastronomique.",
  "Pension complète avec menus découverte et accords mets-vins.",
  "Accompagnateur Eventy dédié tout au long du séjour.",
  "Transport en bus grand confort avec arrêts gourmands.",
];

const temoignages = [
  { nom: "Danielle, 70 ans", texte: "La Bourgogne avec Eventy, un festin pour les papilles ! Chaque repas était une découverte, chaque vin une révélation.", note: 5 },
  { nom: "Michel et Françoise, 74 ans", texte: "L'atelier cuisine en Toscane restera notre plus beau souvenir. Grazie Eventy !", note: 5 },
  { nom: "Hubert, 67 ans", texte: "Le Pays Basque gourmand, un voyage qui se déguste. Organisation parfaite et groupe convivial.", note: 5 },
];

export default function VoyageGastronomiquePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Gastronomie"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Voyages gastronomiques"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Savourez les trésors culinaires de France et d'Europe avec des séjours dédiés à la gastronomie."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Nos expériences gourmandes"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {experiences.map(e => (
            <div key={e.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{e.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Nos destinations gourmandes"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Les hauts lieux de la gastronomie européenne, accessibles en groupe."}</p>
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
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Envie de saveurs ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Contactez notre équipe pour organiser votre prochain voyage gastronomique."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"gastronomie@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
