'use client';

const delais = [
  { periode: "Plus de 60 jours", remboursement: "100 %", retenue: "0 \u20ac", couleur: "#059669" },
  { periode: "60 \u00e0 31 jours", remboursement: "70 %", retenue: "30 %", couleur: "#D4A853" },
  { periode: "30 \u00e0 15 jours", remboursement: "50 %", retenue: "50 %", couleur: "#F59E0B" },
  { periode: "14 \u00e0 8 jours", remboursement: "25 %", retenue: "75 %", couleur: "#C75B39" },
  { periode: "Moins de 8 jours", remboursement: "0 %", retenue: "100 %", couleur: "#DC2626" },
];

const motifs = [
  { icone: "\u{1F3E5}", titre: "Maladie ou accident grave", desc: "Sur pr\u00e9sentation d\u2019un certificat m\u00e9dical justifiant l\u2019impossibilit\u00e9 de voyager." },
  { icone: "\u{1F3DB}\uFE0F", titre: "D\u00e9c\u00e8s d\u2019un proche", desc: "D\u00e9c\u00e8s d\u2019un membre de la famille directe (conjoint, enfant, parent, fr\u00e8re/s\u0153ur)." },
  { icone: "\u26A0\uFE0F", titre: "Force majeure", desc: "Cat\u00e9gorie reconnue par la loi : catastrophe naturelle, pand\u00e9mie, conflit arm\u00e9, fermeture de fronti\u00e8res." },
  { icone: "\u{1F4C4}", titre: "Convocation officielle", desc: "Convocation judiciaire, jury d\u2019assises ou \u00e9v\u00e9nement administratif impr\u00e9visible et imp\u00e9ratif." },
];

const etapes = [
  { num: "1", titre: "Demande en ligne", desc: "Connectez-vous \u00e0 votre espace client et acc\u00e9dez \u00e0 la rubrique Mes r\u00e9servations pour initier votre demande d\u2019annulation." },
  { num: "2", titre: "Justificatifs", desc: "Joignez les pi\u00e8ces justificatives demand\u00e9es selon le motif d\u2019annulation invoqu\u00e9." },
  { num: "3", titre: "\u00c9tude du dossier", desc: "Notre \u00e9quipe analyse votre demande sous 48h ouvr\u00e9es et vous informe de la d\u00e9cision par email." },
  { num: "4", titre: "Remboursement", desc: "Le remboursement est effectu\u00e9 sous 14 jours ouvr\u00e9s sur le moyen de paiement utilis\u00e9 lors de la r\u00e9servation." },
];

export default function PolitiqueAnnulationPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Conditions"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Politique d\u2019annulation"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Conditions de remboursement et d\u00e9lais applicables en cas d\u2019annulation de votre voyage Eventy Life."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{"Bar\u00e8me de remboursement"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>{"Le montant rembours\u00e9 d\u00e9pend du d\u00e9lai entre votre annulation et la date de d\u00e9part."}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 50 }}>
          {delais.map(d => (
            <div key={d.periode} style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 8, height: 48, borderRadius: 4, background: d.couleur, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700 }}>{d.periode}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#059669', fontSize: 16, fontWeight: 700 }}>{"Rembours\u00e9 : " + d.remboursement}</div>
                <div style={{ color: '#6B7280', fontSize: 13 }}>{"Retenu : " + d.retenue}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Motifs l\u00e9gitimes d\u2019annulation"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {motifs.map(m => (
            <div key={m.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{m.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', marginBottom: 50 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Bon \u00e0 savoir"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {"Si vous avez souscrit l\u2019assurance annulation Eventy Life lors de votre r\u00e9servation, vous b\u00e9n\u00e9ficiez d\u2019un remboursement \u00e0 100 % pour tous les motifs l\u00e9gitimes list\u00e9s ci-dessus, quel que soit le d\u00e9lai d\u2019annulation. L\u2019assurance couvre \u00e9galement les frais de modification de dates ou de destination."}
          </p>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Proc\u00e9dure d\u2019annulation"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Les \u00e9tapes pour annuler votre r\u00e9servation"}</p>

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

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"R\u00e9f\u00e9rences l\u00e9gales"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"Articles L211-14 et R211-9 du Code du tourisme. Le voyageur peut r\u00e9silier son contrat avant le d\u00e9but du voyage. L\u2019organisateur peut retenir des frais de r\u00e9siliation ad\u00e9quats et justifiables. En cas de circonstances exceptionnelles et in\u00e9vitables, le voyageur a droit au remboursement int\u00e9gral sans frais (article L211-14 II du Code du tourisme)."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
