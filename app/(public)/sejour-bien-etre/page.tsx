'use client';

const soins = [
  { icone: "\u{1F9D6}", titre: "Spa & Thalasso", desc: "Accès aux centres de thalassothérapie et spas partenaires avec soins inclus : massages, bains, enveloppements.", couleur: "#059669" },
  { icone: "\u{1F9D8}", titre: "Yoga & Méditation", desc: "Séances quotidiennes encadrées par des professionnels certifiés, adaptées à tous les niveaux.", couleur: "#D4A853" },
  { icone: "\u{1F957}", titre: "Nutrition santé", desc: "Menus élaborés par des diététiciens : cuisine locale, bio et équilibrée pour revitaliser le corps.", couleur: "#7C3AED" },
  { icone: "\u{1F3DE}\uFE0F", titre: "Nature & Ressourcement", desc: "Randonnées douces, balades en forêt et activités en plein air pour reconnecter corps et esprit.", couleur: "#C75B39" },
];

const destinations = [
  { nom: "Côte Basque", duree: "5 jours", prix: "à partir de 890€", desc: "Thalasso, surf doux et gastronomie basque face à l'océan." },
  { nom: "Provence", duree: "4 jours", prix: "à partir de 750€", desc: "Lavande, huiles essentielles et massages au cœur du Luberon." },
  { nom: "Bretagne", duree: "6 jours", prix: "à partir de 980€", desc: "Thalassothérapie, algues marines et grand air breton." },
  { nom: "Alpes & Thermes", duree: "5 jours", prix: "à partir de 850€", desc: "Eaux thermales, montagne et détente dans les stations alpines." },
];

const inclus = [
  "Hébergement en hôtel spa 3 ou 4 étoiles avec accès illimité aux installations.",
  "Programme de soins personnalisé établi avant le départ.",
  "Séances de yoga ou méditation quotidiennes avec instructeur.",
  "Pension complète avec menus diététiques adaptés.",
  "Accompagnateur Eventy dédié tout au long du séjour.",
  "Transport aller-retour en bus grand confort.",
  "Assurance voyage et assistance rapatriement incluses.",
];

const temoignages = [
  { nom: "Catherine, 62 ans", texte: "Une parenthèse de douceur absolue. Les soins, la nourriture, l'accompagnement... tout était pensé pour notre bien-être.", note: 5 },
  { nom: "Marie et Pierre, 70 ans", texte: "Nous revenons chaque année. La thalasso en Bretagne avec Eventy est devenue notre rituel de santé.", note: 5 },
  { nom: "Françoise, 58 ans", texte: "Je ne connaissais pas le yoga avant ce séjour. Maintenant je pratique chaque jour. Merci Eventy !", note: 5 },
];

export default function SejourBienEtrePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Bien-être"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Séjours bien-être"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Offrez-vous une pause ressourçante : spa, yoga, nature et cuisine saine dans des cadres d'exception."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Nos prestations bien-être"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {soins.map(s => (
            <div key={s.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Nos destinations bien-être"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Des lieux choisis pour leur cadre exceptionnel et leurs infrastructures de soin."}</p>
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
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Envie de vous ressourcer ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Contactez notre équipe pour organiser votre prochain séjour bien-être."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"bienetre@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
