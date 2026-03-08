'use client';

const etapes = [
  { icone: "\u{1F4DE}", titre: "Premier contact", desc: "D\u00e8s votre r\u00e9servation, un conseiller d\u00e9di\u00e9 vous contacte pour confirmer les d\u00e9tails et r\u00e9pondre \u00e0 toutes vos questions.", couleur: "#059669" },
  { icone: "\u{1F4CB}", titre: "Pr\u00e9paration du voyage", desc: "Votre dossier complet vous est envoy\u00e9 7 jours avant le d\u00e9part : itin\u00e9raire, h\u00e9bergement, documents et contacts utiles.", couleur: "#D4A853" },
  { icone: "\u{1F68C}", titre: "Jour du d\u00e9part", desc: "Votre accompagnateur vous accueille au point de d\u00e9part et reste \u00e0 vos c\u00f4t\u00e9s pendant tout le trajet.", couleur: "#7C3AED" },
  { icone: "\u{1F3E8}", titre: "Sur place", desc: "Assistance 24h/24 pendant tout le s\u00e9jour pour toute question, besoin ou imprevue.", couleur: "#C75B39" },
  { icone: "\u{1F3E0}", titre: "Retour", desc: "Accompagnement jusqu\u2019\u00e0 votre domicile et suivi post-voyage pour recueillir votre avis.", couleur: "#1A1A2E" },
];

const garanties = [
  { icone: "\u{1F464}", titre: "Accompagnateur d\u00e9di\u00e9", desc: "Un professionnel exp\u00e9riment\u00e9 vous accompagne de votre porte de d\u00e9part jusqu\u2019\u00e0 votre retour." },
  { icone: "\u{1F4F1}", titre: "Joignable 24h/24", desc: "Num\u00e9ro d\u2019urgence et messagerie instantan\u00e9e disponibles \u00e0 tout moment pendant le voyage." },
  { icone: "\u{1F6E1}\uFE0F", titre: "Gestion des impr\u00e9vus", desc: "Retard, probl\u00e8me de chambre, urgence m\u00e9dicale : votre accompagnateur g\u00e8re tout pour vous." },
  { icone: "\u2B50", titre: "Exp\u00e9rience personnalis\u00e9e", desc: "Recommandations locales, aide \u00e0 la communication et attention particuli\u00e8re aux besoins de chacun." },
];

const profils = [
  { icone: "\u{1F9D3}", titre: "Seniors", desc: "Assistance compl\u00e8te pour les personnes \u00e2g\u00e9es : aide aux bagages, rythme adapt\u00e9, v\u00e9rification des besoins de sant\u00e9." },
  { icone: "\u{1F46A}", titre: "Familles", desc: "Accompagnement adapt\u00e9 aux enfants : activit\u00e9s, repas sp\u00e9ciaux et attention particuli\u00e8re \u00e0 leur confort." },
  { icone: "\u267F", titre: "PMR", desc: "Prise en charge sp\u00e9cifique des personnes \u00e0 mobilit\u00e9 r\u00e9duite : accessibilit\u00e9, transferts adapt\u00e9s, h\u00e9bergement accessible." },
  { icone: "\u{1F30D}", titre: "Primo-voyageurs", desc: "Accompagnement renforc\u00e9 pour ceux qui voyagent pour la premi\u00e8re fois : conseils, rassurance et encadrement." },
];

export default function ProgrammeAccompagnementPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Notre engagement"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Programme d\u2019accompagnement"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Chez Eventy, chaque voyageur b\u00e9n\u00e9ficie d\u2019un accompagnement humain porte-\u00e0-porte pour un voyage serein et sans stress."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>{"Les \u00e9tapes de votre accompagnement"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {etapes.map((e, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start', borderLeft: `4px solid ${e.couleur}` }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{e.icone}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{e.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Nos garanties"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {garanties.map(g => (
            <div key={g.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{g.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{g.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Adapt\u00e9 \u00e0 chaque profil"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Notre accompagnement s\u2019adapte \u00e0 vos besoins sp\u00e9cifiques."}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {profils.map(p => (
            <div key={p.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{p.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 40 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Ce qui est inclus"}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              "Accompagnateur professionnel bilingue tout au long du voyage.",
              "Assistance t\u00e9l\u00e9phonique et messagerie 24h/24 pendant le s\u00e9jour.",
              "Coordination avec les prestataires locaux (h\u00f4tels, restaurants, activit\u00e9s).",
              "Gestion des formalit\u00e9s administratives et documents de voyage.",
              "Briefing d\u00e9taill\u00e9 avant le d\u00e9part avec toutes les informations pratiques.",
              "Suivi post-voyage et recueil de votre satisfaction.",
            ].map((texte, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A853', marginTop: 7, flexShrink: 0 }} />
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{texte}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Des questions sur l\u2019accompagnement ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Notre \u00e9quipe est disponible pour vous expliquer en d\u00e9tail notre programme d\u2019accompagnement."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"accompagnement@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
