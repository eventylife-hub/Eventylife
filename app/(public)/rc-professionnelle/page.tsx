'use client';

const couvertures = [
  { icone: "\u{1F6E1}", titre: "Dommages corporels", desc: "Couverture des pr\u00e9judices physiques subis par les voyageurs pendant le voyage, y compris les frais m\u00e9dicaux et d'hospitalisation." },
  { icone: "\u{1F4BC}", titre: "Dommages mat\u00e9riels", desc: "Prise en charge des d\u00e9g\u00e2ts sur les biens des voyageurs : bagages endommag\u00e9s, effets personnels perdus ou vol\u00e9s." },
  { icone: "\u2696\uFE0F", titre: "Dommages immat\u00e9riels", desc: "Indemnisation du pr\u00e9judice moral, perte de jouissance du voyage, stress et d\u00e9sagr\u00e9ments caus\u00e9s." },
  { icone: "\u{1F4CB}", titre: "Erreurs de conseil", desc: "Protection en cas d'information erron\u00e9e fournie sur les destinations, visa, vaccinations ou conditions de voyage." },
];

const garanties = [
  { label: "Plafond g\u00e9n\u00e9ral", valeur: "1 500 000 \u20ac", detail: "Par sinistre et par ann\u00e9e d'assurance" },
  { label: "Dommages corporels", valeur: "800 000 \u20ac", detail: "Par victime et par \u00e9v\u00e9nement" },
  { label: "Dommages mat\u00e9riels", valeur: "500 000 \u20ac", detail: "Par sinistre" },
  { label: "D\u00e9fense p\u00e9nale", valeur: "Incluse", detail: "Prise en charge des frais de d\u00e9fense" },
  { label: "Franchise", valeur: "500 \u20ac", detail: "Par sinistre, sauf dommages corporels" },
];

const situations = [
  { num: "1", titre: "Incident pendant le voyage", desc: "Un voyageur se blesse lors d'une activit\u00e9 organis\u00e9e par Eventy Life." },
  { num: "2", titre: "D\u00e9claration", desc: "L'incident est d\u00e9clar\u00e9 \u00e0 notre assureur dans les 48h suivant sa connaissance." },
  { num: "3", titre: "Expertise", desc: "L'assureur mandate un expert pour \u00e9valuer les circonstances et le pr\u00e9judice." },
  { num: "4", titre: "Indemnisation", desc: "Le voyageur est indemnis\u00e9 directement par l'assureur selon les garanties du contrat." },
];

export default function RcProfessionnellePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"S\u00e9curit\u00e9 & Assurance"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"RC Professionnelle"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Notre assurance Responsabilit\u00e9 Civile Professionnelle vous prot\u00e8ge en cas de pr\u00e9judice li\u00e9 \u00e0 nos services."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 50 }}>
          {couvertures.map(c => (
            <div key={c.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{c.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Montants de garantie"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 50 }}>
          {garanties.map(g => (
            <div key={g.label} style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{g.label}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12 }}>{g.detail}</div>
              </div>
              <div style={{ color: '#D4A853', fontSize: 20, fontWeight: 800 }}>{g.valeur}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Comment \u00e7a fonctionne ?"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Le processus en cas de sinistre"}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {situations.map(s => (
            <div key={s.num} style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 }}>{s.num}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Notre assureur"}</div>
          <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{"Contrat RC Pro n\u00b0 RCXXXXXX"}</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {"Assurance souscrite aupr\u00e8s d'un assureur agr\u00e9\u00e9 conforme aux exigences du Code du tourisme."}
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Base l\u00e9gale"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"Article L211-18 du Code du tourisme. Tout op\u00e9rateur de voyages doit justifier d'une assurance garantissant les cons\u00e9quences p\u00e9cuniaires de la responsabilit\u00e9 civile professionnelle. Cette obligation est contr\u00f4l\u00e9e lors de l'immatriculation aupr\u00e8s d'Atout France."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
