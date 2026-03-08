'use client';

const etapes = [
  { num: "1", titre: "Contactez-nous", desc: "Envoyez votre r\u00e9clamation par email ou via le formulaire ci-dessous dans un d\u00e9lai de 30 jours." },
  { num: "2", titre: "Accus\u00e9 de r\u00e9ception", desc: "Nous accusons r\u00e9ception de votre demande sous 48 heures ouvr\u00e9es." },
  { num: "3", titre: "Instruction du dossier", desc: "Notre \u00e9quipe examine votre r\u00e9clamation et collecte les \u00e9l\u00e9ments n\u00e9cessaires." },
  { num: "4", titre: "R\u00e9ponse", desc: "Vous recevez une r\u00e9ponse d\u00e9taill\u00e9e sous 14 jours ouvr\u00e9s maximum." },
];

const droits = [
  { titre: "Retard sup\u00e9rieur \u00e0 2h", desc: "Compensation possible selon le R\u00e8glement UE n\u00b0 181/2011 pour les trajets de plus de 250 km.", couleur: "#C75B39" },
  { titre: "Annulation par l\u2019organisateur", desc: "Remboursement int\u00e9gral ou report sans frais sur un prochain voyage.", couleur: "#D4A853" },
  { titre: "Bagages endommag\u00e9s", desc: "D\u00e9claration dans les 7 jours suivant la r\u00e9ception. Indemnisation selon la valeur d\u00e9clar\u00e9e.", couleur: "#059669" },
  { titre: "Probl\u00e8me de confort", desc: "Signalement pris en compte pour am\u00e9liorer nos services. Geste commercial possible.", couleur: "#7C3AED" },
];

const engagements = [
  "Traitement de chaque r\u00e9clamation avec s\u00e9rieux et bienveillance.",
  "R\u00e9ponse personnalis\u00e9e dans un d\u00e9lai maximum de 14 jours ouvr\u00e9s.",
  "Transparence totale sur les d\u00e9cisions prises et les compensations accord\u00e9es.",
  "Am\u00e9lioration continue de nos services gr\u00e2ce \u00e0 vos retours.",
];

export default function ReclamationsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Service client"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"R\u00e9clamations"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Votre satisfaction est notre priorit\u00e9. D\u00e9couvrez comment soumettre une r\u00e9clamation et vos droits en tant que passager."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Comment \u00e7a marche ?"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"4 \u00e9tapes simples pour traiter votre r\u00e9clamation"}</p>

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

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{"Vos droits"}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {droits.map(d => (
            <div key={d.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', borderLeft: `4px solid ${d.couleur}` }}>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 40 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Nos engagements"}</h2>
          {engagements.map(item => (
            <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <span style={{ color: '#059669', fontSize: 16, lineHeight: 1.7 }}>{"\u2713"}</span>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 40 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Formulaire de r\u00e9clamation"}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{"Nom complet"}</label>
                <input type="text" placeholder="Votre nom" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 10, fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{"Email"}</label>
                <input type="email" placeholder="votre@email.com" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 10, fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{"R\u00e9f\u00e9rence de r\u00e9servation"}</label>
              <input type="text" placeholder="Ex: EVT-2026-XXXXX" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 10, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{"D\u00e9crivez votre r\u00e9clamation"}</label>
              <textarea rows={5} placeholder="D\u00e9crivez le probl\u00e8me rencontr\u00e9 en d\u00e9tail..." style={{ width: '100%', padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 10, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <button style={{ padding: '16px 40px', background: '#D4A853', color: '#1A1A2E', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>{"Envoyer ma r\u00e9clamation"}</button>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 24 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"M\u00e9diation"}</h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {"Si notre r\u00e9ponse ne vous satisfait pas, vous pouvez saisir gratuitement le M\u00e9diateur du Tourisme et du Voyage : MTV M\u00e9diation Tourisme Voyage, BP 80 303 \u2014 75 823 Paris Cedex 17. Vous pouvez \u00e9galement d\u00e9poser votre demande en ligne sur mtv.travel. Ce recours est gratuit et confidentiel."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
