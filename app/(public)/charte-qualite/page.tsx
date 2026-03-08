'use client';

const engagements = [
  { icone: "\u{1F91D}", titre: "Accompagnement humain", desc: "Un accompagnateur d\u00e9di\u00e9 vous guide de votre porte jusqu'\u00e0 votre destination et tout au long du s\u00e9jour." },
  { icone: "\u2B50", titre: "S\u00e9lection rigoureuse", desc: "Chaque prestataire (h\u00e9bergement, transport, restauration) est visit\u00e9 et \u00e9valu\u00e9 avant d'\u00eatre r\u00e9f\u00e9renc\u00e9." },
  { icone: "\u{1F4AC}", titre: "\u00c9coute permanente", desc: "Notre service client est disponible avant, pendant et apr\u00e8s votre voyage pour r\u00e9pondre \u00e0 toutes vos questions." },
  { icone: "\u{1F4B0}", titre: "Transparence tarifaire", desc: "Prix tout compris affich\u00e9s sans surprise. Chaque composante du voyage est d\u00e9taill\u00e9e dans votre devis." },
  { icone: "\u2665\uFE0F", titre: "Bienveillance", desc: "Nous adaptons chaque voyage aux besoins sp\u00e9cifiques de nos voyageurs : mobilit\u00e9 r\u00e9duite, r\u00e9gimes alimentaires, rythme." },
  { icone: "\u{1F30D}", titre: "Tourisme responsable", desc: "Nous privil\u00e9gions les circuits courts, les prestataires locaux et les pratiques respectueuses de l'environnement." },
];

const indicateurs = [
  { valeur: "98%", label: "Satisfaction client" },
  { valeur: "100%", label: "Voyages accompagn\u00e9s" },
  { valeur: "24h", label: "D\u00e9lai de r\u00e9ponse max" },
  { valeur: "4.8/5", label: "Note moyenne" },
];

export default function CharteQualitePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Notre engagement"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Charte Qualit\u00e9"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Chez Eventy Life, la qualit\u00e9 n'est pas une option. D\u00e9couvrez les engagements concrets que nous prenons pour chaque voyage."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 50 }}>
          {engagements.map(e => (
            <div key={e.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{e.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '40px 28px', textAlign: 'center', marginBottom: 50 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{"Nos indicateurs"}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 24 }}>
            {indicateurs.map(i => (
              <div key={i.label}>
                <div style={{ color: '#D4A853', fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{i.valeur}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{i.label}</div>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Notre processus qualit\u00e9"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {[
            { num: "1", titre: "Audit des prestataires", desc: "Chaque h\u00e9bergement, transporteur et restaurant est \u00e9valu\u00e9 selon une grille de 50 crit\u00e8res avant r\u00e9f\u00e9rencement." },
            { num: "2", titre: "Formation des accompagnateurs", desc: "Nos accompagnateurs suivent une formation compl\u00e8te : s\u00e9curit\u00e9, premiers secours, relation client, gestion de groupe." },
            { num: "3", titre: "Enqu\u00eates de satisfaction", desc: "Apr\u00e8s chaque voyage, un questionnaire d\u00e9taill\u00e9 est envoy\u00e9 pour mesurer votre satisfaction et am\u00e9liorer nos services." },
            { num: "4", titre: "Am\u00e9lioration continue", desc: "Les retours sont analys\u00e9s chaque mois et int\u00e9gr\u00e9s dans notre plan d'am\u00e9lioration continue." },
          ].map(e => (
            <div key={e.num} style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 }}>{e.num}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{e.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
