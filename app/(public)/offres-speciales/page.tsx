'use client';

const offres = [
  {
    badge: "PROMO",
    titre: "S\u00e9jour Andalousie \u2014 D\u00e9part Avril",
    desc: "8 jours / 7 nuits en pension compl\u00e8te. S\u00e9ville, Cordoue, Grenade. Bus depuis Paris, Lyon ou Marseille.",
    prixBarre: "1 290",
    prix: "990",
    economie: "300",
    places: "8 places restantes",
    couleur: "#C75B39",
  },
  {
    badge: "DERNI\u00c8RE MINUTE",
    titre: "Croatie & Mont\u00e9n\u00e9gro",
    desc: "10 jours / 9 nuits. Dubrovnik, Split, Kotor. Vol + h\u00f4tel 4\u2605 + excursions incluses.",
    prixBarre: "1 590",
    prix: "1 190",
    economie: "400",
    places: "5 places restantes",
    couleur: "#7C3AED",
  },
  {
    badge: "NOUVEAUT\u00c9",
    titre: "Portugal Authentique",
    desc: "7 jours / 6 nuits. Lisbonne, Porto, Sintra, Algarve. Bus grand confort + accompagnateur.",
    prixBarre: "1 190",
    prix: "890",
    economie: "300",
    places: "12 places restantes",
    couleur: "#059669",
  },
  {
    badge: "BEST-SELLER",
    titre: "Italie du Sud & Sicile",
    desc: "12 jours / 11 nuits. Naples, C\u00f4te Amalfitaine, Palerme, Taormine. Pension compl\u00e8te.",
    prixBarre: "1 890",
    prix: "1 490",
    economie: "400",
    places: "3 places restantes",
    couleur: "#D4A853",
  },
];

const avantages = [
  { icon: "\uD83D\uDCB8", titre: "Jusqu\u2019\u00e0 -30%", desc: "R\u00e9ductions exclusives sur une s\u00e9lection de voyages." },
  { icon: "\u23F0", titre: "Offres limit\u00e9es", desc: "Places compt\u00e9es, premier arriv\u00e9, premier servi." },
  { icon: "\uD83D\uDD12", titre: "Prix bloqu\u00e9", desc: "Le prix affich\u00e9 est garanti, sans suppl\u00e9ment cach\u00e9." },
  { icon: "\u2705", titre: "M\u00eame qualit\u00e9", desc: "Accompagnement, assurance et confort identiques." },
];

export default function OffresSpecialesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Bons plans"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Offres Sp\u00e9ciales"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
            {"Profitez de nos tarifs r\u00e9duits sur une s\u00e9lection de voyages. Places limit\u00e9es !"}
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(199,91,57,0.3)', border: '1px solid #C75B39', borderRadius: 8, padding: '8px 20px', color: '#C75B39', fontSize: 14, fontWeight: 700 }}>
            {"\uD83D\uDD25 4 offres en cours"}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', margin: '-30px 0 40px' }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 12, padding: '20px 18px', textAlign: 'center', minWidth: 160, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.titre}</div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>{a.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Nos offres du moment"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"S\u00e9lection de voyages \u00e0 prix r\u00e9duit"}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
          {offres.map(o => (
            <div key={o.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px', borderLeft: `4px solid ${o.couleur}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ background: o.couleur, color: '#FFFFFF', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase' }}>{o.badge}</span>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>{o.places}</span>
                </div>
                <div style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{o.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{o.desc}</p>
              </div>
              <div style={{ textAlign: 'center', minWidth: 160 }}>
                <div style={{ color: '#9CA3AF', fontSize: 14, textDecoration: 'line-through' }}>{`${o.prixBarre} \u20AC`}</div>
                <div style={{ color: o.couleur, fontSize: 32, fontWeight: 800 }}>{`${o.prix} \u20AC`}</div>
                <div style={{ color: '#059669', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{`\u00c9conomisez ${o.economie} \u20AC`}</div>
                <button style={{ padding: '12px 28px', background: o.couleur, color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{"R\u00e9server"}</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Comment profiter de nos offres ?"}</h3>
          {[
            { q: "Les offres sont-elles r\u00e9servables en ligne ?", r: "Oui, r\u00e9servez directement sur notre site ou contactez-nous par t\u00e9l\u00e9phone. Un acompte de 30% confirme votre place." },
            { q: "Puis-je combiner une offre avec le parrainage ?", r: "Absolument ! Cumulez votre r\u00e9duction parrainage avec nos offres sp\u00e9ciales pour un maximum d\u2019\u00e9conomies." },
            { q: "Les offres incluent-elles l\u2019assurance ?", r: "Oui, toutes nos offres incluent l\u2019assurance annulation et l\u2019assistance rapatriement, comme nos voyages classiques." },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ color: '#C75B39', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{faq.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{faq.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #D4A853 0%, #E8C97A 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\uD83C\uDF1F"}</div>
            <h3 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Ne ratez aucune offre !"}</h3>
            <p style={{ color: 'rgba(26,26,46,0.7)', fontSize: 14, marginBottom: 20 }}>{"Inscrivez-vous \u00e0 notre newsletter pour recevoir nos bons plans en avant-premi\u00e8re."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#1A1A2E', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"S\u2019inscrire \u00e0 la newsletter"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(26,26,46,0.1)', color: '#1A1A2E', border: '1px solid rgba(26,26,46,0.3)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Voir tous les voyages"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
