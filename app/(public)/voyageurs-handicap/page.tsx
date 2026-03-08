'use client';

const engagements = [
  { icone: "\u{267F}", titre: "Accessibilité garantie", desc: "Tous nos hébergements partenaires sont vérifiés pour l'accessibilité : chambres adaptées, ascenseurs, douches accessibles.", couleur: "#059669" },
  { icone: "\u{1F68C}", titre: "Transport adapté", desc: "Bus équipés de rampes d'accès et places réservées. Assistance à l'embarquement et au débarquement par notre équipe.", couleur: "#D4A853" },
  { icone: "\u{1F464}", titre: "Accompagnement renforcé", desc: "Un accompagnateur formé aux besoins spécifiques des personnes en situation de handicap, présent tout au long du voyage.", couleur: "#7C3AED" },
  { icone: "\u{1F4DE}", titre: "Écoute personnalisée", desc: "Un conseiller dédié recueille vos besoins spécifiques avant le voyage pour adapter chaque étape à votre situation.", couleur: "#C75B39" },
];

const types = [
  { icone: "\u{1F9BD}", titre: "Handicap moteur", desc: "Hébergements accessibles en fauteuil roulant, transferts adaptés, itinéraires sans obstacles, assistance aux déplacements." },
  { icone: "\u{1F441}\uFE0F", titre: "Handicap visuel", desc: "Descriptions audio des sites, accompagnement rapproché, documentation en gros caractères, signalétique adaptée." },
  { icone: "\u{1F442}", titre: "Handicap auditif", desc: "Accompagnateur formé à la communication adaptée, informations écrites systématiques, alertes visuelles dans les hébergements." },
  { icone: "\u{1F9E0}", titre: "Handicap cognitif", desc: "Rythme adapté, consignes simplifiées, accompagnement bienveillant et patient, environnement rassurant et structuré." },
];

const inclus = [
  "Étude personnalisée de vos besoins avant chaque voyage.",
  "Vérification sur site de l'accessibilité de tous les hébergements et lieux visités.",
  "Accompagnateur formé au handicap et aux premiers secours.",
  "Matériel d'assistance disponible sur demande (fauteuil de plage, siège de douche, etc.).",
  "Coordination avec les prestataires locaux pour garantir l'accessibilité.",
  "Assurance voyage adaptée couvrant les besoins spécifiques liés au handicap.",
  "Numéro d'urgence dédié accessible 24h/24 pendant le voyage.",
];

const temoignages = [
  { nom: "Marie-Claire, 67 ans", texte: "Grâce à Eventy, j'ai pu voyager en fauteuil roulant sans aucun stress. Tout était prévu et adapté. Un vrai bonheur !", note: 5 },
  { nom: "Jean-Pierre, 72 ans", texte: "Malvoyant, je pensais ne plus pouvoir voyager. L'accompagnateur m'a tout décrit avec patience. Inoubliable.", note: 5 },
  { nom: "Famille Durand", texte: "Notre fils en situation de handicap a été accueilli avec une bienveillance extraordinaire. Merci Eventy !", note: 5 },
];

export default function VoyageursHandicapPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Accessibilité"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Voyageurs en situation de handicap"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Chez Eventy, le voyage est un droit pour tous. Nous adaptons chaque séjour pour que chacun puisse voyager en toute sérénité."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Nos engagements"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {engagements.map((e, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start', borderLeft: `4px solid ${e.couleur}` }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{e.icone}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{e.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Adapté à chaque type de handicap"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Notre accompagnement s'adapte à vos besoins spécifiques."}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {types.map(t => (
            <div key={t.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{t.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
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
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Besoin d'un voyage adapté ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Contactez notre équipe spécialisée pour étudier ensemble votre projet de voyage."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"accessibilite@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
