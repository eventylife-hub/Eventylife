'use client';

const sections = [
  { titre: "Principe général", desc: "Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux prestations de services d'hébergement, de transport, de restauration et de loisirs devant être fournis à une date ou selon une périodicité déterminée." },
  { titre: "Voyages et séjours", desc: "Les contrats de voyage et de séjour touristique sont expressément exclus du droit de rétractation en vertu de l'article L211-14 du Code du tourisme. Cette exclusion s'applique dès la confirmation de la réservation." },
  { titre: "Services complémentaires", desc: "Les assurances voyage optionnelles souscrites lors de la réservation sont également exclues du droit de rétractation une fois que la couverture a pris effet." },
];

const alternatives = [
  { icone: "\u{1F4DD}", titre: "Conditions d'annulation", desc: "Consultez nos CGV pour connaître les conditions d'annulation et les frais applicables selon le délai avant le départ." },
  { icone: "\u{1F6E1}\uFE0F", titre: "Assurance annulation", desc: "Nous proposons une assurance annulation optionnelle qui vous couvre en cas d'imprévu (maladie, accident, etc.)." },
  { icone: "\u{1F4DE}", titre: "Service client", desc: "Notre équipe est à votre disposition pour étudier votre situation et trouver la meilleure solution." },
  { icone: "\u2696\uFE0F", titre: "Médiation", desc: "En cas de litige, vous pouvez recourir gratuitement au Médiateur du Tourisme et du Voyage (MTV)." },
];

const etapes = [
  { num: "1", titre: "Contactez-nous", desc: "Envoyez votre demande d'annulation par email ou via votre espace client dans les meilleurs délais." },
  { num: "2", titre: "Étude du dossier", desc: "Nous examinons votre demande et calculons les frais d'annulation selon nos CGV et le délai avant départ." },
  { num: "3", titre: "Remboursement", desc: "Le remboursement, déduction faite des frais d'annulation, est effectué sous 14 jours sur votre moyen de paiement." },
];

export default function DroitRetractationPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Information légale"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Droit de rétractation"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Informations sur le droit de rétractation applicable aux services de voyage et de tourisme."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', marginBottom: 40 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Important"}</div>
          <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{"Exception légale au droit de rétractation"}</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {"Les prestations de voyage et de séjour touristique sont légalement exclues du droit de rétractation de 14 jours prévu par le Code de la consommation."}
          </p>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Cadre juridique"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {sections.map(s => (
            <div key={s.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Vos alternatives"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 50 }}>
          {alternatives.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Procédure d'annulation"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Si vous souhaitez annuler votre voyage"}</p>
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
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Références légales"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"Article L221-28 du Code de la consommation — Exception au droit de rétractation pour les contrats de fourniture de services d'hébergement, de transport de biens, de location de voitures, de restauration ou d'activités de loisirs. Article L211-14 du Code du tourisme — Conditions d'annulation des contrats de voyage."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
