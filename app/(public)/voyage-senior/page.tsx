'use client';

const avantages = [
  { icone: "\u{1F9D3}", titre: "Rythme adapté", desc: "Des itinéraires pensés pour le confort : pauses régulières, visites à un rythme doux, temps libre pour se reposer.", couleur: "#059669" },
  { icone: "\u{1F3E8}", titre: "Hébergements confort", desc: "Hôtels sélectionnés pour leur accessibilité, leur calme et la qualité de leurs équipements : ascenseur, chambre au rez-de-chaussée sur demande.", couleur: "#D4A853" },
  { icone: "\u{1F464}", titre: "Accompagnement dédié", desc: "Un accompagnateur formé et attentionné vous assiste de votre porte de départ jusqu'à votre retour à domicile.", couleur: "#7C3AED" },
  { icone: "\u{1F6E1}\uFE0F", titre: "Sécurité renforcée", desc: "Assurance voyage complète, numéro d'urgence 24h/24, et coordination avec les services médicaux locaux.", couleur: "#C75B39" },
];

const inclus = [
  "Accompagnateur professionnel porte-à-porte tout au long du voyage.",
  "Transport en bus grand confort avec places réservées et assistance aux bagages.",
  "Hébergements 3 ou 4 étoiles vérifiés pour le confort et l'accessibilité.",
  "Pension complète avec menus adaptés aux régimes alimentaires spécifiques.",
  "Visites guidées à rythme adapté avec pauses régulières.",
  "Assurance voyage et assistance rapatriement incluses.",
  "Numéro d'urgence dédié accessible 24h/24.",
];

const destinations = [
  { nom: "Côte d'Azur", duree: "5 jours", prix: "à partir de 890€", desc: "Nice, Cannes, Monaco : soleil et élégance méditerranéenne." },
  { nom: "Châteaux de la Loire", duree: "4 jours", prix: "à partir de 750€", desc: "Chambord, Chenonceau, Amboise : patrimoine et art de vivre." },
  { nom: "Lourdes & Pyrénées", duree: "6 jours", prix: "à partir de 980€", desc: "Pèlerinage et découverte des paysages pyrénéens." },
  { nom: "Andalousie", duree: "8 jours", prix: "à partir de 1 290€", desc: "Séville, Grenade, Cordoue : culture et douceur de vivre espagnole." },
];

const temoignages = [
  { nom: "Monique, 74 ans", texte: "Mon premier voyage organisé et certainement pas le dernier ! Tout était parfait, l'accompagnateur aux petits soins.", note: 5 },
  { nom: "Robert et Simone, 78 ans", texte: "Nous voyageons avec Eventy depuis 2 ans. Le rythme est idéal et on se sent en sécurité.", note: 5 },
  { nom: "Gérard, 69 ans", texte: "Veuf depuis peu, je n'osais plus voyager seul. Grâce à Eventy, j'ai retrouvé le goût de la découverte.", note: 5 },
];

export default function VoyageSeniorPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Voyages seniors"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Voyages pour les seniors"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Des séjours pensés pour votre confort : rythme adapté, accompagnement humain et destinations de rêve."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Pourquoi choisir Eventy ?"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Nos destinations populaires"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Des voyages adaptés aux seniors, en France et en Europe."}</p>
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
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Envie de partir ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Contactez notre équipe pour organiser votre prochain voyage senior."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"seniors@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
