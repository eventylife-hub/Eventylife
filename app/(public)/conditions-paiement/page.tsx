'use client';

const moyens = [
  { icone: "\u{1F4B3}", titre: "Carte bancaire", desc: "Visa, Mastercard, American Express. Paiement s\u00e9curis\u00e9 via Stripe avec authentification 3D Secure." },
  { icone: "\u{1F3E6}", titre: "Virement bancaire", desc: "Virement SEPA accept\u00e9 pour les r\u00e9servations sup\u00e9rieures \u00e0 1 000 \u20ac. D\u00e9lai de traitement : 2-3 jours ouvr\u00e9s." },
  { icone: "\u{1F4C5}", titre: "Paiement en 3 fois", desc: "Sans frais pour toute r\u00e9servation sup\u00e9rieure \u00e0 500 \u20ac. \u00c9ch\u00e9ances mensuelles automatiques par carte bancaire." },
  { icone: "\u{1F91D}", titre: "Ch\u00e8ques vacances", desc: "Ch\u00e8ques vacances ANCV accept\u00e9s (classiques et Connect). Envoi par courrier recommand\u00e9 requis." },
];

const echeances = [
  { etape: "Acompte \u00e0 la r\u00e9servation", montant: "30 %", delai: "Imm\u00e9diat", couleur: "#059669" },
  { etape: "2\u00e8me \u00e9ch\u00e9ance", montant: "35 %", delai: "60 jours avant le d\u00e9part", couleur: "#D4A853" },
  { etape: "Solde", montant: "35 %", delai: "30 jours avant le d\u00e9part", couleur: "#C75B39" },
];

const garanties = [
  { icone: "\u{1F512}", titre: "Paiement s\u00e9curis\u00e9", desc: "Toutes les transactions sont chiffr\u00e9es en TLS 1.3 et trait\u00e9es par Stripe, certifi\u00e9 PCI DSS niveau 1." },
  { icone: "\u{1F6E1}\uFE0F", titre: "3D Secure 2", desc: "Authentification forte du porteur de carte conform\u00e9ment \u00e0 la directive europ\u00e9enne DSP2." },
  { icone: "\u2705", titre: "Garantie financi\u00e8re", desc: "Vos fonds sont prot\u00e9g\u00e9s par notre garantie financi\u00e8re APST, assurant le remboursement en cas de d\u00e9faillance." },
  { icone: "\u{1F4C4}", titre: "Confirmation imm\u00e9diate", desc: "Vous recevez un email de confirmation avec votre facture d\u00e8s la validation du paiement." },
];

export default function ConditionsPaiementPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Paiement"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Conditions de paiement"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Moyens de paiement accept\u00e9s, \u00e9ch\u00e9ancier et garanties pour r\u00e9server votre voyage en toute s\u00e9r\u00e9nit\u00e9."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Moyens de paiement accept\u00e9s"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {moyens.map(m => (
            <div key={m.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{m.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"\u00c9ch\u00e9ancier de paiement"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"R\u00e9partissez le co\u00fbt de votre voyage en plusieurs versements."}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 50 }}>
          {echeances.map(e => (
            <div key={e.etape} style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 8, height: 48, borderRadius: 4, background: e.couleur, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700 }}>{e.etape}</div>
                <div style={{ color: '#6B7280', fontSize: 13 }}>{e.delai}</div>
              </div>
              <div style={{ color: e.couleur, fontSize: 22, fontWeight: 800 }}>{e.montant}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', marginBottom: 50 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Paiement en 3 fois sans frais"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {"Pour toute r\u00e9servation d\u2019un montant sup\u00e9rieur \u00e0 500 \u20ac, vous pouvez opter pour le paiement en 3 fois sans frais par carte bancaire. Les pr\u00e9l\u00e8vements sont effectu\u00e9s automatiquement \u00e0 J+0, J+30 et J+60. Aucuns frais suppl\u00e9mentaires ne sont appliqu\u00e9s. En cas d\u2019\u00e9chec de pr\u00e9l\u00e8vement, vous \u00eates notifi\u00e9 par email et disposez de 72h pour r\u00e9gulariser."}
          </p>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"S\u00e9curit\u00e9 et garanties"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {garanties.map(g => (
            <div key={g.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{g.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{g.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Informations importantes"}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              "Le prix du voyage est garanti une fois l\u2019acompte vers\u00e9. Aucune majoration ne sera appliqu\u00e9e apr\u00e8s confirmation.",
              "En cas de non-paiement du solde dans les d\u00e9lais, la r\u00e9servation pourra \u00eatre annul\u00e9e avec retenue de l\u2019acompte.",
              "Les remboursements sont effectu\u00e9s sous 14 jours ouvr\u00e9s sur le moyen de paiement d\u2019origine.",
              "Pour les groupes de plus de 10 personnes, des conditions sp\u00e9cifiques de paiement peuvent \u00eatre n\u00e9goci\u00e9es.",
            ].map((texte, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A853', marginTop: 7, flexShrink: 0 }} />
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{texte}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
