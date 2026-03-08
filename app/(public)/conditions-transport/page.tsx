'use client';

const sections = [
  {
    titre: "R\u00e8gles g\u00e9n\u00e9rales",
    items: [
      "Les horaires de d\u00e9part sont communiqu\u00e9s par email 48h avant le voyage.",
      "Pr\u00e9sentez-vous au point de rendez-vous 15 minutes avant l\u2019heure indiqu\u00e9e.",
      "Une pi\u00e8ce d\u2019identit\u00e9 valide est obligatoire pour tous les passagers.",
      "Les mineurs doivent \u00eatre accompagn\u00e9s d\u2019un adulte responsable.",
    ],
  },
  {
    titre: "Bagages",
    items: [
      "Chaque passager peut emporter 1 bagage en soute (max 23 kg) et 1 bagage \u00e0 main.",
      "Les bagages hors gabarit doivent \u00eatre signal\u00e9s lors de la r\u00e9servation.",
      "Eventy Life d\u00e9cline toute responsabilit\u00e9 pour les objets de valeur non d\u00e9clar\u00e9s.",
      "Les articles dangereux ou ill\u00e9gaux sont strictement interdits.",
    ],
  },
  {
    titre: "Annulation et modification",
    items: [
      "Annulation gratuite jusqu\u2019\u00e0 30 jours avant le d\u00e9part.",
      "Entre 30 et 15 jours : retenue de 30% du montant total.",
      "Entre 14 et 7 jours : retenue de 50% du montant total.",
      "Moins de 7 jours : aucun remboursement sauf cas de force majeure.",
    ],
  },
  {
    titre: "Responsabilit\u00e9s du transporteur",
    items: [
      "Le transporteur s\u2019engage \u00e0 assurer la s\u00e9curit\u00e9 des passagers durant le trajet.",
      "En cas de retard sup\u00e9rieur \u00e0 2h, une compensation peut \u00eatre demand\u00e9e.",
      "Le transporteur est assur\u00e9 en responsabilit\u00e9 civile professionnelle.",
      "Les itin\u00e9raires peuvent \u00eatre modifi\u00e9s pour des raisons de s\u00e9curit\u00e9.",
    ],
  },
  {
    titre: "Confort \u00e0 bord",
    items: [
      "Nos autocars sont \u00e9quip\u00e9s de la climatisation et de si\u00e8ges inclinables.",
      "WiFi disponible sur la majorit\u00e9 de nos v\u00e9hicules longue distance.",
      "Des pauses r\u00e9guli\u00e8res sont pr\u00e9vues toutes les 2 heures environ.",
      "Il est interdit de fumer et de consommer de l\u2019alcool \u00e0 bord.",
    ],
  },
];

const urgences = [
  { titre: "Num\u00e9ro d\u2019urgence", desc: "Disponible 24h/24 pendant votre voyage : +33 1 XX XX XX XX", couleur: "#C75B39" },
  { titre: "Assurance incluse", desc: "Responsabilit\u00e9 civile et assistance rapatriement incluses.", couleur: "#059669" },
  { titre: "M\u00e9diation", desc: "En cas de litige, contactez notre service m\u00e9diation \u00e0 mediation@eventylife.fr", couleur: "#7C3AED" },
];

export default function ConditionsTransportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Transport"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Conditions de transport"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Retrouvez toutes les informations relatives \u00e0 vos d\u00e9placements avec Eventy Life."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        {sections.map((s, i) => (
          <div key={s.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flexShrink: 0 }}>{String(i + 1)}</div>
              <h2 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, margin: 0 }}>{s.titre}</h2>
            </div>
            {s.items.map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ color: '#D4A853', fontSize: 16, lineHeight: 1.7 }}>{"\u2022"}</span>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        ))}

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 32 }}>{"En cas de besoin"}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
          {urgences.map(u => (
            <div key={u.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', borderLeft: `4px solid ${u.couleur}` }}>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{u.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{u.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 24 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Cadre l\u00e9gal"}</h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {"Les pr\u00e9sentes conditions sont soumises au droit fran\u00e7ais. En cas de litige, les tribunaux comp\u00e9tents sont ceux du si\u00e8ge social d\u2019Eventy Life. Ces conditions sont conformes au Code du tourisme et aux r\u00e8glements europ\u00e9ens relatifs aux droits des passagers dans le transport par autocar (R\u00e8glement UE n\u00b0 181/2011)."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
