'use client';

const chiffres = [
  { v: "50+", l: "Voyages organis\u00e9s" },
  { v: "10K+", l: "Voyageurs satisfaits" },
  { v: "2024", l: "Ann\u00e9e de cr\u00e9ation" },
  { v: "95%", l: "Taux de satisfaction" },
];

const articles = [
  { date: "15 f\u00e9vrier 2026", source: "Le Figaro Voyage", titre: "Eventy Life r\u00e9invente le voyage de groupe en France", extrait: "La startup fran\u00e7aise propose une exp\u00e9rience de voyage de groupe in\u00e9dite, avec accompagnement porte-\u00e0-porte et r\u00e9servation 100% en ligne.", couleur: "#C75B39" },
  { date: "3 janvier 2026", source: "TourMaG", titre: "Les nouvelles plateformes qui bousculent le tourisme de groupe", extrait: "Parmi les acteurs innovants du secteur, Eventy Life se d\u00e9marque par son approche technologique et humaine du voyage collectif.", couleur: "#059669" },
  { date: "20 novembre 2025", source: "L\u2019\u00c9cho Touristique", titre: "Voyage de groupe : la g\u00e9n\u00e9ration Z adopte le collectif", extrait: "Avec des offres adapt\u00e9es aux jeunes voyageurs, Eventy Life capte une client\u00e8le en qu\u00eate d\u2019exp\u00e9riences partag\u00e9es et authentiques.", couleur: "#7C3AED" },
  { date: "8 octobre 2025", source: "BFM Business", titre: "Eventy Life l\u00e8ve le voile sur sa plateforme de voyage innovante", extrait: "La jeune pousse ambitionne de devenir le leader fran\u00e7ais du voyage de groupe gr\u00e2ce \u00e0 une technologie de pointe et un service premium.", couleur: "#D4A853" },
];

const communiques = [
  { date: "Mars 2026", titre: "Eventy Life lance ses premi\u00e8res destinations \u00e9t\u00e9 2026", desc: "D\u00e9couvrez notre catalogue de 12 destinations pour la saison estivale, du Portugal \u00e0 la Gr\u00e8ce." },
  { date: "Janvier 2026", titre: "Partenariat strat\u00e9gique avec FlixBus", desc: "Eventy Life s\u2019associe \u00e0 FlixBus pour proposer des trajets \u00e9co-responsables vers toute l\u2019Europe." },
  { date: "Novembre 2025", titre: "Lancement de la plateforme beta", desc: "Apr\u00e8s 18 mois de d\u00e9veloppement, la plateforme Eventy Life ouvre ses portes aux premiers testeurs." },
];

const contact = {
  nom: "Service Presse Eventy Life",
  email: "presse@eventylife.fr",
  tel: "+33 1 23 45 67 89",
};

export default function PressePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Espace presse"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Eventy Life dans les m\u00e9dias"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"D\u00e9couvrez nos derni\u00e8res actualit\u00e9s, communiqu\u00e9s de presse et ressources m\u00e9dias."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
            {chiffres.map(c => (
              <div key={c.l} style={{ textAlign: 'center' }}>
                <div style={{ color: '#D4A853', fontSize: 32, fontWeight: 800 }}>{c.v}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Ils parlent de nous"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Revue de presse et couverture m\u00e9diatique"}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          {articles.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', borderLeft: `4px solid ${a.couleur}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <span style={{ color: a.couleur, fontSize: 13, fontWeight: 700 }}>{a.source}</span>
                <span style={{ color: '#6B7280', fontSize: 12 }}>{a.date}</span>
              </div>
              <div style={{ color: '#1A1A2E', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{a.extrait}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Communiqu\u00e9s de presse"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Nos annonces officielles"}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          {communiques.map(c => (
            <div key={c.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ color: '#D4A853', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{c.date}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{c.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Kit m\u00e9dias"}</h3>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            {"T\u00e9l\u00e9chargez notre kit presse complet incluant logos, photos HD, biographies de l\u2019\u00e9quipe dirigeante et fiches produits."}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {["Logos & Charte graphique", "Photos HD", "Biographies", "Fiche entreprise"].map(item => (
              <span key={item} style={{ background: '#FAF7F2', color: '#1A1A2E', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 10, border: '1px solid #E8E4DE' }}>{item}</span>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F4F0}"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Contact presse"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 6 }}>{contact.nom}</p>
            <p style={{ color: '#D4A853', fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 4 }}>{contact.email}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 0, marginBottom: 20 }}>{contact.tel}</p>
            <button style={{ padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Demander une interview"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
