'use client';

const etapes = [
  { num: "1", titre: "R\u00e9clamation pr\u00e9alable", desc: "Contactez d'abord notre service client. Nous nous engageons \u00e0 vous r\u00e9pondre sous 30 jours." },
  { num: "2", titre: "Saisine du m\u00e9diateur", desc: "Si notre r\u00e9ponse ne vous satisfait pas, vous pouvez saisir gratuitement le M\u00e9diateur du Tourisme et du Voyage." },
  { num: "3", titre: "Instruction du dossier", desc: "Le m\u00e9diateur examine votre dossier et recueille les observations des deux parties." },
  { num: "4", titre: "Proposition de solution", desc: "Le m\u00e9diateur rend un avis dans un d\u00e9lai de 90 jours. Les parties sont libres de l'accepter ou non." },
];

const infos = [
  { titre: "Qui peut saisir le m\u00e9diateur ?", desc: "Tout consommateur ayant un litige avec Eventy Life li\u00e9 \u00e0 un contrat de vente de voyage ou de s\u00e9jour touristique." },
  { titre: "Quand saisir le m\u00e9diateur ?", desc: "Apr\u00e8s avoir adress\u00e9 une r\u00e9clamation \u00e9crite \u00e0 notre service client, rest\u00e9e sans r\u00e9ponse pendant 30 jours ou dont la r\u00e9ponse est insatisfaisante." },
  { titre: "Co\u00fbt de la proc\u00e9dure", desc: "La m\u00e9diation est enti\u00e8rement gratuite pour le consommateur. Les frais sont \u00e0 la charge de l'op\u00e9rateur." },
  { titre: "Caract\u00e8re non contraignant", desc: "L'avis du m\u00e9diateur est une recommandation. Chaque partie reste libre de l'accepter ou de le refuser." },
];

export default function MediateurTourismePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"R\u00e8glement des litiges"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"M\u00e9diateur du Tourisme"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"En cas de litige non r\u00e9solu avec notre service client, vous pouvez recourir gratuitement \u00e0 la m\u00e9diation."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Comment \u00e7a fonctionne ?"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Les \u00e9tapes de la proc\u00e9dure de m\u00e9diation"}</p>

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

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Questions fr\u00e9quentes"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {infos.map(i => (
            <div key={i.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{i.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{i.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"MTV \u2014 M\u00e9diateur du Tourisme et du Voyage"}</div>
          <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{"Coordonn\u00e9es du m\u00e9diateur"}</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
            {"BP 80 303 \u2014 75823 Paris Cedex 17"}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, marginBottom: 8 }}>
            {"Site : www.mtv.travel | Email : info@mtv.travel"}
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Base l\u00e9gale"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"Articles L612-1 \u00e0 L612-5 du Code de la consommation et articles L211-16 du Code du tourisme. Conform\u00e9ment \u00e0 la r\u00e9glementation, Eventy Life adh\u00e8re au dispositif de m\u00e9diation MTV (M\u00e9diateur du Tourisme et du Voyage), m\u00e9diateur r\u00e9f\u00e9renc\u00e9 par la Commission d'\u00e9valuation et de contr\u00f4le de la m\u00e9diation de la consommation (CECMC)."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
