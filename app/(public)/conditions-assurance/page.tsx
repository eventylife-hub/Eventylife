'use client';

const garanties = [
  { icone: "\u{1F6AB}", titre: "Annulation", desc: "Remboursement des frais d'annulation en cas de maladie, accident, décès d'un proche, licenciement ou convocation judiciaire.", montant: "100% des frais" },
  { icone: "\u{1F3E5}", titre: "Assistance rapatriement", desc: "Prise en charge du rapatriement médical et du transport sanitaire en cas de maladie ou d'accident pendant le voyage.", montant: "Frais réels" },
  { icone: "\u{1F4BC}", titre: "Bagages", desc: "Indemnisation en cas de perte, vol ou détérioration de vos bagages pendant le transport ou le séjour.", montant: "2 000€/pers." },
  { icone: "\u{23F0}", titre: "Retard transport", desc: "Prise en charge des frais supplémentaires en cas de retard significatif de votre transport (hébergement, repas).", montant: "150€/pers." },
];

const exclusions = [
  "Maladies ou états de santé préexistants non déclarés",
  "Annulation sans motif médical ou justificatif valable",
  "Pratique de sports extrêmes non déclarés",
  "Guerre, émeutes, catastrophes nucléaires",
  "Épidémies classées pandémie par l'OMS (sauf clause spécifique)",
  "Dommages causés par l'abus d'alcool ou de stupéfiants",
];

const etapes = [
  { num: "1", titre: "Déclaration", desc: "Déclarez votre sinistre dans les 5 jours ouvrés suivant l'événement via votre espace client ou par email." },
  { num: "2", titre: "Constitution du dossier", desc: "Rassemblez les justificatifs nécessaires : certificat médical, attestation employeur, récépissé de dépôt de plainte, etc." },
  { num: "3", titre: "Instruction", desc: "Notre assureur examine votre dossier sous 15 jours ouvrés et vous informe de sa décision." },
  { num: "4", titre: "Indemnisation", desc: "En cas d'accord, l'indemnisation est versée sous 30 jours par virement bancaire." },
];

export default function ConditionsAssurancePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Protection voyage"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Conditions d'assurance"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Détail des garanties, exclusions et procédures de notre assurance voyage optionnelle."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Nos garanties"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {garanties.map(g => (
            <div key={g.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 24px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{g.icone}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700 }}>{g.titre}</div>
                  <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 700 }}>{g.montant}</div>
                </div>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', marginBottom: 50 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{"Exclusions de garantie"}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {exclusions.map(ex => (
              <div key={ex} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ color: '#C75B39', fontSize: 16, flexShrink: 0 }}>{"✕"}</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{ex}</div>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Procédure de déclaration"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Comment déclarer un sinistre"}</p>
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
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Informations importantes"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"L'assurance voyage est optionnelle et peut être souscrite lors de la réservation. Elle est fournie par notre partenaire assureur agréé. Les conditions détaillées, plafonds et franchises sont précisés dans la notice d'information remise lors de la souscription. Le contrat est soumis au Code des assurances français. Pour toute question, contactez notre service client."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
