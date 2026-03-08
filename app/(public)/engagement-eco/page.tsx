'use client';

const engagements = [
  { icon: "\u{1F333}", titre: "Compensation carbone", desc: "100% des \u00e9missions CO\u2082 de nos voyages sont compens\u00e9es via des projets certifi\u00e9s de reforestation et d\u2019\u00e9nergies renouvelables.", couleur: "#059669" },
  { icon: "\u{1F30D}", titre: "Tourisme responsable", desc: "Nous privil\u00e9gions les h\u00e9bergements \u00e9co-certifi\u00e9s, les restaurants locaux et les excursions respectueuses de l\u2019environnement.", couleur: "#0D9488" },
  { icon: "\u{1F46A}", titre: "Impact local positif", desc: "Nos voyages g\u00e9n\u00e8rent des retomb\u00e9es \u00e9conomiques directes pour les communaut\u00e9s locales : guides, artisans, producteurs.", couleur: "#D4A853" },
  { icon: "\u267B\uFE0F", titre: "Z\u00e9ro plastique", desc: "Gourdes r\u00e9utilisables offertes, suppression des plastiques \u00e0 usage unique sur tous nos voyages depuis 2025.", couleur: "#059669" },
  { icon: "\u{1F68C}", titre: "Transport optimis\u00e9", desc: "Voyages en groupe = empreinte carbone par personne r\u00e9duite de 70% par rapport au voyage individuel.", couleur: "#1A1A2E" },
  { icon: "\u2764\uFE0F", titre: "Bien-\u00eatre animal", desc: "Aucune activit\u00e9 impliquant l\u2019exploitation animale. Nous soutenons les sanctuaires et r\u00e9serves naturelles.", couleur: "#C75B39" },
];

const chiffres = [
  { valeur: "100%", label: "Compensation carbone" },
  { valeur: "-70%", label: "Empreinte CO\u2082/personne" },
  { valeur: "0", label: "Plastique \u00e0 usage unique" },
  { valeur: "85%", label: "Partenaires \u00e9co-certifi\u00e9s" },
];

const actions = [
  { num: "1", titre: "Avant le voyage", desc: "S\u00e9lection rigoureuse de partenaires \u00e9co-responsables, calcul de l\u2019empreinte carbone pr\u00e9visionnelle, pr\u00e9paration des kits z\u00e9ro d\u00e9chet." },
  { num: "2", titre: "Pendant le voyage", desc: "Sensibilisation des voyageurs, gestes \u00e9co-responsables int\u00e9gr\u00e9s au programme, respect des \u00e9cosyst\u00e8mes visit\u00e9s." },
  { num: "3", titre: "Apr\u00e8s le voyage", desc: "Compensation carbone int\u00e9grale, bilan environnemental du voyage, am\u00e9lioration continue de nos pratiques." },
];

const faq = [
  { q: "Comment compensez-vous les \u00e9missions carbone ?", r: "Nous calculons pr\u00e9cis\u00e9ment les \u00e9missions de chaque voyage (transport, h\u00e9bergement, activit\u00e9s) et les compensons via des projets certifi\u00e9s Gold Standard." },
  { q: "Qu\u2019est-ce qu\u2019un h\u00e9bergement \u00e9co-certifi\u00e9 ?", r: "Un \u00e9tablissement disposant d\u2019un label environnemental reconnu (EU Ecolabel, Green Key, Cl\u00e9 Verte) garantissant des pratiques durables." },
  { q: "Le voyage en groupe est-il vraiment plus \u00e9cologique ?", r: "Oui ! Un bus de 50 personnes \u00e9met 70% moins de CO\u2082 par voyageur qu\u2019une voiture individuelle. Le groupe optimise l\u2019impact de chaque trajet." },
  { q: "Comment puis-je contribuer en tant que voyageur ?", r: "En choisissant Eventy Life, vous contribuez d\u00e9j\u00e0. Sur place, nos accompagnateurs partagent des gestes simples pour un tourisme plus responsable." },
];

export default function EngagementEcoPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#A7F3D0', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Notre engagement"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Voyager responsable"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Chez Eventy Life, chaque voyage est con\u00e7u pour minimiser son impact environnemental et maximiser les retomb\u00e9es positives locales."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
            {chiffres.map(c => (
              <div key={c.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 800 }}>{c.valeur}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Nos 6 engagements"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Des actions concr\u00e8tes pour un tourisme durable"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {engagements.map(e => (
            <div key={e.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', borderLeft: `4px solid ${e.couleur}` }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{e.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Notre d\u00e9marche"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"L\u2019\u00e9co-responsabilit\u00e9 \u00e0 chaque \u00e9tape"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {actions.map(a => (
            <div key={a.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #0D9488)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 14px' }}>{a.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions sur notre engagement"}</h3>
          {faq.map(f => (
            <div key={f.q} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ color: '#059669', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F30D}"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Voyagez avec sens"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"Chaque voyage Eventy Life contribue \u00e0 un tourisme plus responsable. D\u00e9couvrez nos destinations."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#FFFFFF', color: '#059669', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"D\u00e9couvrir nos voyages"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Notre charte \u00e9thique"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
