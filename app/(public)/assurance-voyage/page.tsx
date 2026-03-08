'use client';

const garanties = [
  {
    icon: "\u{1F6E1}\uFE0F",
    titre: "Annulation toutes causes",
    desc: "Remboursement jusqu\u2019\u00e0 100% du voyage en cas d\u2019annulation pour maladie, accident, d\u00e9c\u00e8s d\u2019un proche, perte d\u2019emploi ou tout \u00e9v\u00e9nement impr\u00e9vu.",
    couleur: "#C75B39",
  },
  {
    icon: "\u{1F3E5}",
    titre: "Frais m\u00e9dicaux \u00e0 l\u2019\u00e9tranger",
    desc: "Prise en charge des frais m\u00e9dicaux, hospitalisation et pharmacie jusqu\u2019\u00e0 150 000\u20AC par personne, partout dans le monde.",
    couleur: "#059669",
  },
  {
    icon: "\u2708\uFE0F",
    titre: "Rapatriement sanitaire",
    desc: "Organisation et prise en charge compl\u00e8te du rapatriement en cas de maladie ou blessure grave. Assistance 24h/24.",
    couleur: "#7C3AED",
  },
  {
    icon: "\u{1F4BC}",
    titre: "Bagages prot\u00e9g\u00e9s",
    desc: "Indemnisation en cas de perte, vol ou d\u00e9t\u00e9rioration de vos bagages. Couverture jusqu\u2019\u00e0 2 000\u20AC par personne.",
    couleur: "#D4A853",
  },
  {
    icon: "\u23F0",
    titre: "Retard & correspondance",
    desc: "Indemnisation en cas de retard a\u00e9rien sup\u00e9rieur \u00e0 4h ou de correspondance manqu\u00e9e. H\u00e9bergement et repas pris en charge.",
    couleur: "#1A1A2E",
  },
  {
    icon: "\u{1F91D}",
    titre: "Responsabilit\u00e9 civile",
    desc: "Couverture des dommages caus\u00e9s \u00e0 des tiers pendant votre voyage, jusqu\u2019\u00e0 4 500 000\u20AC.",
    couleur: "#C75B39",
  },
];

const chiffres = [
  { valeur: "100%", label: "Des voyageurs assur\u00e9s" },
  { valeur: "150K\u20AC", label: "Frais m\u00e9dicaux couverts" },
  { valeur: "24/7", label: "Assistance t\u00e9l\u00e9phonique" },
  { valeur: "0\u20AC", label: "Franchise m\u00e9dicale" },
];

const etapes = [
  { num: "1", titre: "R\u00e9servation", desc: "Votre assurance est automatiquement incluse dans chaque r\u00e9servation. Aucune d\u00e9marche suppl\u00e9mentaire." },
  { num: "2", titre: "Sinistre", desc: "Contactez notre \u00e9quipe ou l\u2019assureur directement. Nous vous guidons \u00e0 chaque \u00e9tape." },
  { num: "3", titre: "D\u00e9claration", desc: "Remplissez le formulaire en ligne avec les justificatifs. D\u00e9lai moyen de traitement : 15 jours." },
  { num: "4", titre: "Remboursement", desc: "Indemnisation vers\u00e9e directement sur votre compte bancaire apr\u00e8s validation du dossier." },
];

export default function AssuranceVoyagePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Votre s\u00e9r\u00e9nit\u00e9"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Assurance Voyage"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Chaque voyageur Eventy Life est prot\u00e9g\u00e9 par une assurance compl\u00e8te, incluse dans le prix de votre voyage. Voyagez l\u2019esprit libre."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
            {chiffres.map(c => (
              <div key={c.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#D4A853', fontSize: 32, fontWeight: 800 }}>{c.valeur}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'inline-block', background: '#059669', color: '#FFFFFF', fontSize: 13, fontWeight: 700, padding: '8px 20px', borderRadius: 8, margin: '-20px 0 0 0', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
          {"\u2705 Assurance incluse dans tous nos voyages"}
        </div>

        <div style={{ textAlign: 'center', padding: '30px 0 20px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Nos garanties"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Une couverture compl\u00e8te pour voyager sans souci"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {garanties.map(g => (
            <div key={g.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', borderLeft: `4px solid ${g.couleur}` }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{g.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{g.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"En cas de sinistre"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Un processus simple et accompagn\u00e9"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: '#7C3AED', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 14px' }}>{e.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions fr\u00e9quentes sur l\u2019assurance"}</h3>
          {[
            { q: "L\u2019assurance est-elle vraiment incluse ?", r: "Oui, chaque voyage Eventy Life inclut automatiquement une assurance annulation et assistance. Aucun suppl\u00e9ment \u00e0 payer." },
            { q: "Puis-je souscrire une assurance compl\u00e9mentaire ?", r: "Absolument. Nous proposons des options premium : annulation toutes causes sans justificatif, couverture bagages renforc\u00e9e, et assurance interruption de voyage." },
            { q: "Quelle est la proc\u00e9dure en cas d\u2019urgence m\u00e9dicale ?", r: "Appelez le num\u00e9ro d\u2019assistance 24/7 fourni dans votre carnet de voyage. L\u2019\u00e9quipe m\u00e9dicale coordonne tout : m\u00e9decin, hospitalisation, rapatriement." },
            { q: "Les maladies chroniques sont-elles couvertes ?", r: "Les aggravations impr\u00e9visibles de maladies chroniques pr\u00e9existantes sont couvertes. D\u00e9clarez votre \u00e9tat de sant\u00e9 \u00e0 la r\u00e9servation pour une couverture optimale." },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ color: '#7C3AED', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{faq.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{faq.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9F67FF 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F6E1}\uFE0F"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Voyagez prot\u00e9g\u00e9, voyagez serein"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"Tous nos voyages incluent une assurance compl\u00e8te. D\u00e9couvrez nos destinations."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#FFFFFF', color: '#7C3AED', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"D\u00e9couvrir nos voyages"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Nous contacter"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
