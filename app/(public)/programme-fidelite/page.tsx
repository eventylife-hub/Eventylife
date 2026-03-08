'use client';

const niveaux = [
  {
    nom: "Bronze",
    icon: "\u{1F949}",
    condition: "D\u00e8s votre 1er voyage",
    avantages: ["5% de r\u00e9duction sur le 2\u00e8me voyage", "Newsletter VIP avec offres exclusives", "Acc\u00e8s prioritaire aux nouvelles destinations"],
    couleur: "#CD7F32",
  },
  {
    nom: "Argent",
    icon: "\u{1F948}",
    condition: "Apr\u00e8s 2 voyages",
    avantages: ["8% de r\u00e9duction permanente", "Surclassement h\u00f4tel offert (selon dispo)", "Cadeau de bienvenue \u00e0 bord", "Choix prioritaire des places dans le bus"],
    couleur: "#A0A0A0",
  },
  {
    nom: "Or",
    icon: "\u{1F947}",
    condition: "Apr\u00e8s 4 voyages",
    avantages: ["12% de r\u00e9duction permanente", "Excursion premium offerte par voyage", "Assurance annulation toutes causes incluse", "Accompagnateur d\u00e9di\u00e9 pour votre groupe", "Acc\u00e8s au salon VIP a\u00e9roport"],
    couleur: "#D4A853",
  },
  {
    nom: "Diamant",
    icon: "\u{1F48E}",
    condition: "Apr\u00e8s 7 voyages",
    avantages: ["15% de r\u00e9duction permanente", "1 nuit suppl\u00e9mentaire offerte par voyage", "Transfert priv\u00e9 a\u00e9roport inclus", "Repas gastronomique offert", "Concierge voyage personnel 24/7", "Invitation \u00e9v\u00e9nements exclusifs Eventy Life"],
    couleur: "#7C3AED",
  },
];

const chiffres = [
  { valeur: "4", label: "Niveaux de fid\u00e9lit\u00e9" },
  { valeur: "15%", label: "R\u00e9duction max" },
  { valeur: "0\u20AC", label: "Inscription gratuite" },
  { valeur: "\u221E", label: "Points sans expiration" },
];

const faq = [
  { q: "Comment gagner des points ?", r: "Chaque euro d\u00e9pens\u00e9 sur un voyage Eventy Life vous rapporte 1 point. Les parrainages, avis et r\u00e9servations anticip\u00e9es donnent des points bonus." },
  { q: "Mes points expirent-ils ?", r: "Non ! Vos points de fid\u00e9lit\u00e9 n\u2019expirent jamais tant que votre compte est actif. Voyagez \u00e0 votre rythme." },
  { q: "Puis-je cumuler fid\u00e9lit\u00e9 et parrainage ?", r: "Absolument ! Les r\u00e9ductions fid\u00e9lit\u00e9 se cumulent avec le parrainage et les offres sp\u00e9ciales pour un maximum d\u2019\u00e9conomies." },
  { q: "Comment conna\u00eetre mon niveau ?", r: "Connectez-vous \u00e0 votre espace client. Votre niveau, vos points et vos avantages sont visibles sur votre tableau de bord." },
];

export default function ProgrammeFidelitePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"R\u00e9compenses"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Programme Fid\u00e9lit\u00e9"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Plus vous voyagez avec nous, plus vous \u00eates r\u00e9compens\u00e9. D\u00e9couvrez nos 4 niveaux d\u2019avantages exclusifs."}
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
        <div style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Nos niveaux de fid\u00e9lit\u00e9"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Chaque voyage vous rapproche du niveau sup\u00e9rieur"}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>
          {niveaux.map(n => (
            <div key={n.nom} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px', borderLeft: `4px solid ${n.couleur}`, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 48 }}>{n.icon}</div>
                <div style={{ color: n.couleur, fontSize: 18, fontWeight: 800, marginTop: 4 }}>{n.nom}</div>
                <div style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>{n.condition}</div>
              </div>
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{"Avantages :"}</div>
                {n.avantages.map(a => (
                  <div key={a} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ color: n.couleur, fontSize: 14, flexShrink: 0 }}>{"\u2713"}</span>
                    <span style={{ color: '#374151', fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions sur le programme"}</h3>
          {faq.map(f => (
            <div key={f.q} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #D4A853 0%, #E8C97A 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F48E}"}</div>
            <h3 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Rejoignez le programme d\u00e8s maintenant"}</h3>
            <p style={{ color: 'rgba(26,26,46,0.7)', fontSize: 14, marginBottom: 20 }}>{"Inscrivez-vous gratuitement et commencez \u00e0 cumuler des avantages d\u00e8s votre premier voyage."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#1A1A2E', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Cr\u00e9er mon compte"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(26,26,46,0.1)', color: '#1A1A2E', border: '1px solid rgba(26,26,46,0.3)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"D\u00e9couvrir nos voyages"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
