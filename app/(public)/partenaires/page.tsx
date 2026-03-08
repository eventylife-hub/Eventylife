'use client';

const avantages = [
  { icon: "\u{1F4B0}", titre: "Revenus suppl\u00e9mentaires", desc: "G\u00e9n\u00e9rez des commissions attractives sur chaque r\u00e9servation effectu\u00e9e via votre r\u00e9seau." },
  { icon: "\u{1F4CA}", titre: "Tableau de bord d\u00e9di\u00e9", desc: "Suivez vos performances, r\u00e9servations et commissions en temps r\u00e9el." },
  { icon: "\u{1F91D}", titre: "Accompagnement personnalis\u00e9", desc: "Un charg\u00e9 de compte d\u00e9di\u00e9 pour vous aider \u00e0 d\u00e9velopper votre activit\u00e9." },
  { icon: "\u{1F3AF}", titre: "Outils marketing", desc: "Acc\u00e9dez \u00e0 des supports de communication professionnels et personnalisables." },
  { icon: "\u{1F393}", titre: "Formation gratuite", desc: "B\u00e9n\u00e9ficiez de formations en ligne pour ma\u00eetriser notre plateforme." },
  { icon: "\u{2B50}", titre: "Visibilit\u00e9 accrue", desc: "Votre agence mise en avant sur notre plateforme aupr\u00e8s de milliers de voyageurs." },
];

const etapes = [
  { num: "1", titre: "Inscription", desc: "Remplissez le formulaire de candidature en quelques minutes." },
  { num: "2", titre: "Validation", desc: "Notre \u00e9quipe examine votre dossier sous 48h ouvr\u00e9es." },
  { num: "3", titre: "Formation", desc: "Acc\u00e9dez \u00e0 votre espace pro et suivez la formation d\u00e9di\u00e9e." },
  { num: "4", titre: "Lancement", desc: "Commencez \u00e0 proposer nos voyages et g\u00e9n\u00e9rez vos premi\u00e8res commissions." },
];

const profils = [
  { titre: "Agences de voyages", desc: "Enrichissez votre catalogue avec nos voyages de groupe cl\u00e9s en main.", couleur: "#059669" },
  { titre: "Autocaristes", desc: "Remplissez vos v\u00e9hicules gr\u00e2ce \u00e0 notre r\u00e9seau de voyageurs.", couleur: "#D4A853" },
  { titre: "Comit\u00e9s d\u2019entreprise", desc: "Offrez des voyages de groupe \u00e0 prix n\u00e9goci\u00e9s \u00e0 vos salari\u00e9s.", couleur: "#7C3AED" },
  { titre: "Associations", desc: "Organisez des voyages pour vos membres en toute simplicit\u00e9.", couleur: "#C75B39" },
];

const chiffres = [
  { valeur: "500+", label: "Partenaires actifs" },
  { valeur: "15%", label: "Commission moyenne" },
  { valeur: "48h", label: "Validation dossier" },
  { valeur: "98%", label: "Taux de satisfaction" },
];

export default function PartenairesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Partenariat"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Devenez partenaire Eventy"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Rejoignez notre r\u00e9seau de partenaires et d\u00e9veloppez votre activit\u00e9 gr\u00e2ce \u00e0 des voyages de groupe uniques."}
          </p>
          <button style={{ padding: '16px 40px', background: '#D4A853', color: '#1A1A2E', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>{"Devenir partenaire"}</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '50px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 50 }}>
          {chiffres.map(c => (
            <div key={c.label} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 16px', textAlign: 'center' }}>
              <div style={{ color: '#D4A853', fontSize: 32, fontWeight: 800, marginBottom: 6 }}>{c.valeur}</div>
              <div style={{ color: '#6B7280', fontSize: 13 }}>{c.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>{"Pourquoi nous rejoindre ?"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Des outils et un accompagnement pour d\u00e9velopper votre activit\u00e9"}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 50 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Qui peut devenir partenaire ?"}</h2>
        <p style={{ color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>{"Nous collaborons avec diff\u00e9rents types de professionnels du voyage"}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 50 }}>
          {profils.map(p => (
            <div key={p.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', borderTop: `4px solid ${p.couleur}` }}>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>{"Comment \u00e7a marche ?"}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 }}>{e.num}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{e.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 40 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions fr\u00e9quentes"}</h3>
          {[
            { q: "Quelles sont les conditions pour devenir partenaire ?", r: "\u00catre un professionnel du tourisme ou du transport avec un num\u00e9ro SIRET valide. Aucun frais d\u2019inscription." },
            { q: "Comment sont calcul\u00e9es les commissions ?", r: "Les commissions varient de 10% \u00e0 20% selon le type de voyage et le volume de r\u00e9servations g\u00e9n\u00e9r\u00e9." },
            { q: "Y a-t-il un engagement minimum ?", r: "Non, aucun engagement de dur\u00e9e ni de volume. Vous \u00eates libre de proposer nos voyages \u00e0 votre rythme." },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: '1px solid #E8E4DE', padding: '16px 0' }}>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{faq.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{faq.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 40 }}>
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Pr\u00eat \u00e0 nous rejoindre ?"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 24 }}>
              {"Cr\u00e9ez votre compte partenaire et commencez \u00e0 g\u00e9n\u00e9rer des revenus d\u00e8s aujourd\u2019hui."}
            </p>
            <button style={{ padding: '16px 40px', background: '#D4A853', color: '#1A1A2E', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>{"Cr\u00e9er mon compte pro"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
