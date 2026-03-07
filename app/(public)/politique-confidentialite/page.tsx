'use client';
import Link from 'next/link';
const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  white: '#FFFFFF', muted: '#6B7280', border: '#E8E4DE',
};
const sections = [
  {
    title: '1. Responsable du traitement',
    content: 'Eventy Life SAS (en cours d\u0027immatriculation), dont le siège social est situé à Paris, France. Contact DPO : contact@eventylife.fr.',
  },
  {
    title: '2. Données collectées',
    content: 'Nous collectons les données suivantes : données d\u0027identification (nom, prénom, email, téléphone), données de réservation (destinations, dates, participants), données de paiement (traitées par Stripe, nous ne stockons aucune donnée bancaire), données de navigation (cookies, adresse IP, pages visitées), données des partenaires (SIRET, informations bancaires pour les virements de commissions).',
  },
  {
    title: '3. Finalités du traitement',
    content: 'Vos données sont utilisées pour : la gestion de votre compte et de vos réservations, le traitement des paiements et remboursements, l\u0027envoi de confirmations et documents de voyage, la communication marketing (avec votre consentement), l\u0027amélioration de nos services et de l\u0027expérience utilisateur, le respect de nos obligations légales.',
  },
  {
    title: '4. Bases légales',
    content: 'Le traitement de vos données repose sur : l\u0027exécution du contrat de voyage, votre consentement (marketing), nos obligations légales (comptabilité, fiscalité), notre intérêt légitime (amélioration des services, prévention de la fraude).',
  },
  {
    title: '5. Durée de conservation',
    content: 'Données de compte : durée de la relation commerciale + 3 ans. Données de réservation : 10 ans (obligation comptable). Données de navigation : 13 mois maximum. Données marketing : 3 ans après le dernier contact.',
  },
  {
    title: '6. Partage des données',
    content: 'Vos données peuvent être partagées avec : nos partenaires de voyage (hôtels, transporteurs) pour l\u0027exécution de votre réservation, Stripe pour le traitement des paiements, nos prestataires techniques (hébergement, email), les autorités compétentes si requis par la loi. Nous ne vendons jamais vos données à des tiers.',
  },
  {
    title: '7. Vos droits',
    content: 'Conformément au RGPD, vous disposez des droits suivants : accès à vos données, rectification des données inexactes, suppression de vos données, limitation du traitement, portabilité de vos données, opposition au traitement, retrait du consentement à tout moment. Pour exercer vos droits : contact@eventylife.fr. Délai de réponse : 1 mois maximum.',
  },
  {
    title: '8. Sécurité',
    content: 'Nous mettons en oeuvre des mesures techniques et organisationnelles pour protéger vos données : chiffrement SSL/TLS, hashage des mots de passe (Argon2id), accès restreint aux données, sauvegardes régulières, monitoring des accès.',
  },
  {
    title: '9. Cookies',
    content: 'Nous utilisons des cookies essentiels (fonctionnement du site), des cookies analytiques (mesure d\u0027audience), et des cookies marketing (avec votre consentement). Vous pouvez gérer vos préférences via le bandeau cookies ou les paramètres de votre navigateur.',
  },
  {
    title: '10. Réclamation',
    content: 'Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (Commission Nationale de l\u0027Informatique et des Libertés) : www.cnil.fr.',
  },
];
export default function PolitiqueConfidentialitePage() {
  return (
    <div style={{ minHeight: '100vh', background: C.cream }}>
      <div style={{
        background: 'linear-gradient(135deg, ' + C.navy + ' 0%, #2D2B55 100%)',
        padding: '80px 20px 60px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: C.white, margin: '0 0 16px' }}>
          Politique de confidentialit&#233;
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }}>
          Derni&#232;re mise &#224; jour : mars 2026
        </p>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{
          background: '#EBF5FF', borderRadius: 14, padding: '20px 24px',
          border: '1px solid #B3D4FC', marginBottom: 32,
        }}>
          <p style={{ fontSize: 15, color: C.navy, lineHeight: 1.6, margin: 0 }}>
            Eventy Life s&#8217;engage &#224; prot&#233;ger votre vie priv&#233;e. Cette politique d&#233;crit comment nous collectons, utilisons et prot&#233;geons vos donn&#233;es personnelles conform&#233;ment au RGPD.
          </p>
        </div>
        {sections.map((s, i) => (
          <div key={i} style={{
            background: C.white, borderRadius: 14, padding: '28px 24px',
            border: '1px solid ' + C.border, marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 12px' }}>{s.title}</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}>{s.content}</p>
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/mentions-legales" style={{
            color: C.terra, fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>Mentions l&#233;gales &#8594;</Link>
          <span style={{ margin: '0 20px', color: C.border }}>|</span>
          <Link href="/cgv" style={{
            color: C.terra, fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>CGV &#8594;</Link>
        </div>
      </div>
    </div>
  );
}
