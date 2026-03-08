'use client';

const avantages = [
  { icone: "\u{1F4B0}", titre: "Tarifs d\u00e9gressifs", desc: "Plus votre groupe est grand, plus le prix par personne diminue. Jusqu\u2019\u00e0 -20 % pour les groupes de 50+ participants." },
  { icone: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}", titre: "Accompagnement d\u00e9di\u00e9", desc: "Un chef de groupe Eventy vous est attribu\u00e9 pour coordonner l\u2019organisation de bout en bout." },
  { icone: "\u{1F4CB}", titre: "Devis personnalis\u00e9", desc: "Chaque voyage de groupe fait l\u2019objet d\u2019un devis sur mesure adapt\u00e9 \u00e0 vos besoins et votre budget." },
  { icone: "\u{1F4C5}", titre: "Paiement flexible", desc: "\u00c9ch\u00e9ancier personnalis\u00e9, paiement individuel ou collectif, et gestion centralis\u00e9e des r\u00e8glements." },
];

const paliers = [
  { taille: "10-19", reduction: "-5 %", couleur: "#059669" },
  { taille: "20-29", reduction: "-10 %", couleur: "#D4A853" },
  { taille: "30-49", reduction: "-15 %", couleur: "#7C3AED" },
  { taille: "50+", reduction: "-20 %", couleur: "#C75B39" },
];

const etapes = [
  { num: "1", titre: "Demande de devis", desc: "Remplissez le formulaire groupe ou contactez-nous avec le nombre de participants, la destination souhait\u00e9e et vos dates." },
  { num: "2", titre: "Proposition", desc: "Nous vous envoyons un devis d\u00e9taill\u00e9 sous 48h avec les options d\u2019h\u00e9bergement, transport et activit\u00e9s." },
  { num: "3", titre: "Validation", desc: "Apr\u00e8s accord, chaque participant re\u00e7oit un lien d\u2019inscription individuel pour renseigner ses informations." },
  { num: "4", titre: "Paiement", desc: "Acompte de 30 % \u00e0 la r\u00e9servation. Le solde est r\u00e9parti selon l\u2019\u00e9ch\u00e9ancier convenu, par personne ou en collectif." },
  { num: "5", titre: "D\u00e9part", desc: "Votre chef de groupe coordonne les derniers d\u00e9tails et vous accompagne le jour J pour un voyage sans stress." },
];

const conditions = [
  "Le tarif groupe s\u2019applique \u00e0 partir de 10 participants confirm\u00e9s et pay\u00e9s.",
  "En cas de d\u00e9sistement r\u00e9duisant le groupe en dessous du seuil, le tarif individuel s\u2019applique.",
  "L\u2019organisateur du groupe dispose d\u2019un tableau de bord pour suivre les inscriptions et paiements.",
  "Les enfants de moins de 12 ans b\u00e9n\u00e9ficient d\u2019une r\u00e9duction suppl\u00e9mentaire de 10 % sur le tarif groupe.",
  "Annulation gratuite jusqu\u2019\u00e0 45 jours avant le d\u00e9part pour les groupes de 30+ personnes.",
];

export default function ConditionsGroupePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Groupes"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Conditions groupe"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Tarifs pr\u00e9f\u00e9rentiels, organisation sur mesure et accompagnement d\u00e9di\u00e9 pour vos voyages de groupe."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Avantages groupe"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Grille tarifaire groupe"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"R\u00e9ductions appliqu\u00e9es automatiquement selon la taille du groupe."}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 50 }}>
          {paliers.map(p => (
            <div key={p.taille} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 16px', textAlign: 'center', borderTop: `4px solid ${p.couleur}` }}>
              <div style={{ color: p.couleur, fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{p.reduction}</div>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 600 }}>{p.taille}</div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>{"participants"}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>{"Comment organiser un voyage groupe ?"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1A1A2E', color: '#D4A853', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{e.num}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{e.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 40 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Conditions particuli\u00e8res"}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {conditions.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A853', marginTop: 7, flexShrink: 0 }} />
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Vous organisez un voyage de groupe ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Contactez notre \u00e9quipe d\u00e9di\u00e9e pour recevoir un devis personnalis\u00e9 sous 48h."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"groupes@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
