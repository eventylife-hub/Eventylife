'use client';

const garanties = [
  { icon: "\uD83D\uDEE1\uFE0F", titre: "Assurance annulation", desc: "Remboursement int\u00e9gral en cas d\u2019annulation pour maladie, accident, d\u00e9c\u00e8s d\u2019un proche, ou toute cause l\u00e9gitime pr\u00e9vue au contrat.", couleur: "#7C3AED" },
  { icon: "\uD83C\uDFE5", titre: "Assistance m\u00e9dicale 24h/24", desc: "Prise en charge des frais m\u00e9dicaux \u00e0 l\u2019\u00e9tranger, rapatriement sanitaire, assistance t\u00e9l\u00e9phonique m\u00e9dicale permanente.", couleur: "#059669" },
  { icon: "\uD83D\uDCBC", titre: "Bagages prot\u00e9g\u00e9s", desc: "Indemnisation en cas de perte, vol ou d\u00e9t\u00e9rioration de vos bagages pendant le voyage.", couleur: "#C75B39" },
  { icon: "\u2708\uFE0F", titre: "Retard & correspondance", desc: "Prise en charge des frais suppl\u00e9mentaires en cas de retard de transport ou de correspondance manqu\u00e9e.", couleur: "#D4A853" },
  { icon: "\uD83D\uDC68\u200D\u2696\uFE0F", titre: "Responsabilit\u00e9 civile", desc: "Couverture des dommages caus\u00e9s involontairement \u00e0 des tiers pendant votre s\u00e9jour.", couleur: "#1A1A2E" },
  { icon: "\uD83D\uDD12", titre: "Garantie financi\u00e8re APST", desc: "Votre argent est prot\u00e9g\u00e9 par notre garantie financi\u00e8re aupr\u00e8s de l\u2019APST, organisme agr\u00e9\u00e9 par l\u2019\u00c9tat.", couleur: "#7C3AED" },
];

const mesures = [
  { num: "01", titre: "Accompagnateur form\u00e9", desc: "Chaque accompagnateur est form\u00e9 aux premiers secours (PSC1) et aux proc\u00e9dures d\u2019urgence." },
  { num: "02", titre: "Num\u00e9ro d\u2019urgence 24h/24", desc: "Une ligne d\u00e9di\u00e9e disponible jour et nuit pour toute urgence pendant votre voyage." },
  { num: "03", titre: "Partenaires certifi\u00e9s", desc: "H\u00f4tels, transporteurs et prestataires s\u00e9lectionn\u00e9s selon des crit\u00e8res stricts de s\u00e9curit\u00e9 et qualit\u00e9." },
  { num: "04", titre: "Protocole COVID adapt\u00e9", desc: "Mesures sanitaires ajust\u00e9es selon les recommandations officielles de chaque destination." },
  { num: "05", titre: "Trousse de secours", desc: "Chaque groupe dispose d\u2019une trousse de premiers soins compl\u00e8te pendant tout le s\u00e9jour." },
  { num: "06", titre: "V\u00e9rification pr\u00e9-d\u00e9part", desc: "Contr\u00f4le syst\u00e9matique des documents, assurances et conditions sanitaires avant chaque d\u00e9part." },
];

const labels = [
  { icon: "\uD83C\uDDEB\uD83C\uDDF7", texte: "Immatricul\u00e9 Atout France" },
  { icon: "\u2705", texte: "Garantie financi\u00e8re APST" },
  { icon: "\uD83D\uDCCB", texte: "RC Pro active" },
  { icon: "\uD83D\uDD10", texte: "RGPD conforme" },
  { icon: "\uD83D\uDCB3", texte: "Paiement s\u00e9curis\u00e9 Stripe" },
];

export default function SecuritePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Votre tranquillit\u00e9"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"S\u00e9curit\u00e9 & Assurance"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Voyagez l\u2019esprit tranquille : chaque d\u00e9tail de votre s\u00e9curit\u00e9 est anticip\u00e9 et couvert."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {labels.map(l => (
              <div key={l.texte} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>{l.icon}</span>
                <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600 }}>{l.texte}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '50px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Vos garanties incluses"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Chaque voyage Eventy Life inclut une couverture compl\u00e8te"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {garanties.map(g => (
            <div key={g.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', borderTop: `3px solid ${g.couleur}` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{g.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{g.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Mesures de s\u00e9curit\u00e9"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"6 dispositifs concrets pour votre protection"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {mesures.map(m => (
            <div key={m.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, margin: '0 auto 14px' }}>{m.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{m.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions fr\u00e9quentes sur la s\u00e9curit\u00e9"}</h3>
          {[
            { q: "Que se passe-t-il si je tombe malade pendant le voyage ?", r: "Notre accompagnateur prend imm\u00e9diatement en charge la situation : appel au m\u00e9decin local, contact avec l\u2019assurance, organisation du rapatriement si n\u00e9cessaire. Vous n\u2019avez rien \u00e0 g\u00e9rer." },
            { q: "Mon argent est-il prot\u00e9g\u00e9 en cas de faillite ?", r: "Oui, 100%. Notre garantie financi\u00e8re aupr\u00e8s de l\u2019APST prot\u00e8ge int\u00e9gralement les fonds vers\u00e9s par nos clients, conform\u00e9ment \u00e0 la r\u00e9glementation fran\u00e7aise." },
            { q: "Puis-je annuler mon voyage et \u00eatre rembours\u00e9 ?", r: "Oui, notre assurance annulation couvre de nombreux motifs : maladie, accident, d\u00e9c\u00e8s d\u2019un proche, convocation judiciaire, et bien d\u2019autres cas pr\u00e9vus au contrat." },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ color: '#C75B39', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{faq.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{faq.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\uD83D\uDEE1\uFE0F"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Prot\u00e9g\u00e9 \u00e0 chaque instant"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"D\u00e9couvrez nos voyages et partez l\u2019esprit l\u00e9ger."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#FFFFFF', color: '#059669', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Voir nos voyages"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Nous contacter"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
