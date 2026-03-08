'use client';

const principes = [
  { icone: "\u{1F512}", titre: "Minimisation", desc: "Nous ne collectons que les données strictement nécessaires au fonctionnement du service et à la réservation de vos voyages." },
  { icone: "\u{1F6E1}", titre: "Sécurité", desc: "Toutes vos données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nos serveurs sont hébergés en France." },
  { icone: "\u23F3", titre: "Durée limitée", desc: "Vos données sont conservées uniquement pendant la durée nécessaire, puis supprimées conformément à nos obligations légales." },
  { icone: "\u2705", titre: "Transparence", desc: "Vous savez exactement quelles données nous collectons, pourquoi, et comment les exercer vos droits dessus." },
];

const donnees = [
  { categorie: "Identité", exemples: "Nom, prénom, date de naissance", finalite: "Réservation, facturation, obligations légales", duree: "3 ans après le dernier voyage" },
  { categorie: "Contact", exemples: "Email, téléphone, adresse postale", finalite: "Communication, service client, envoi des documents", duree: "3 ans après le dernier contact" },
  { categorie: "Paiement", exemples: "IBAN (partiel), historique transactions", finalite: "Traitement des paiements, remboursements", duree: "5 ans (obligation comptable)" },
  { categorie: "Navigation", exemples: "Cookies, pages visitées, appareil", finalite: "Amélioration du site, statistiques anonymisées", duree: "13 mois maximum" },
  { categorie: "Voyage", exemples: "Destinations, préférences, accompagnants", finalite: "Personnalisation, organisation des voyages", duree: "3 ans après le dernier voyage" },
];

const droits = [
  { titre: "Droit d'accès", desc: "Obtenez une copie de toutes vos données personnelles que nous détenons." },
  { titre: "Droit de rectification", desc: "Corrigez vos données si elles sont inexactes ou incomplètes." },
  { titre: "Droit à l'effacement", desc: "Demandez la suppression de vos données (sous réserve des obligations légales)." },
  { titre: "Droit à la portabilité", desc: "Récupérez vos données dans un format structuré et lisible par machine." },
  { titre: "Droit d'opposition", desc: "Opposez-vous au traitement de vos données à des fins de prospection." },
  { titre: "Droit à la limitation", desc: "Demandez la limitation du traitement dans certains cas prévus par la loi." },
];

export default function ProtectionDonneesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"RGPD & Vie priv\u00e9e"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Protection de vos donn\u00e9es"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Chez Eventy Life, la protection de vos donn\u00e9es personnelles est une priorit\u00e9 absolue. D\u00e9couvrez nos engagements concrets."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 50 }}>
          {principes.map(p => (
            <div key={p.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{p.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{"Donn\u00e9es collect\u00e9es"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>{"D\u00e9tail des donn\u00e9es que nous traitons et leur finalit\u00e9"}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 50 }}>
          {donnees.map(d => (
            <div key={d.categorie} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700 }}>{d.categorie}</div>
                <div style={{ background: '#FAF7F2', borderRadius: 8, padding: '4px 12px', color: '#6B7280', fontSize: 12, fontWeight: 600 }}>{d.duree}</div>
              </div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, margin: '0 0 4px' }}>{d.exemples}</p>
              <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>{d.finalite}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Vos droits"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Conform\u00e9ment au RGPD, vous disposez des droits suivants"}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {droits.map(d => (
            <div key={d.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Exercer vos droits"}</div>
          <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{"Contactez notre DPO"}</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
            {"Pour toute demande relative \u00e0 vos donn\u00e9es personnelles, contactez notre D\u00e9l\u00e9gu\u00e9 \u00e0 la Protection des Donn\u00e9es :"}
          </p>
          <div style={{ color: '#D4A853', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{"dpo@eventylife.fr"}</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>
            {"R\u00e9ponse sous 30 jours maximum conform\u00e9ment au RGPD"}
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Autorit\u00e9 de contr\u00f4le"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"Si vous estimez que le traitement de vos donn\u00e9es ne respecte pas la r\u00e9glementation, vous pouvez adresser une r\u00e9clamation \u00e0 la CNIL (Commission Nationale de l'Informatique et des Libert\u00e9s) : www.cnil.fr | 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
