'use client';
import Link from 'next/link';
const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  white: '#FFFFFF', muted: '#6B7280', border: '#E8E4DE',
};
const sections = [
  {
    title: '1. Responsable du traitement',
    content: 'Eventy Life SAS (en cours d\u0027immatriculation), dont le si\u00e8ge social est situ\u00e9 \u00e0 Paris, France. Contact DPO : contact@eventylife.fr.',
  },
  {
    title: '2. Donn\u00e9es collect\u00e9es',
    content: 'Nous collectons les donn\u00e9es suivantes : donn\u00e9es d\u0027identification (nom, pr\u00e9nom, email, t\u00e9l\u00e9phone), donn\u00e9es de r\u00e9servation (destinations, dates, participants), donn\u00e9es de paiement (trait\u00e9es par Stripe, nous ne stockons aucune donn\u00e9e bancaire), donn\u00e9es de navigation (cookies, adresse IP, pages visit\u00e9es), donn\u00e9es des partenaires (SIRET, informations bancaires pour les virements de commissions).',
  },
  {
    title: '3. Finalit\u00e9s du traitement',
    content: 'Vos donn\u00e9es sont utilis\u00e9es pour : la gestion de votre compte et de vos r\u00e9servations, le traitement des paiements et remboursements, l\u0027envoi de confirmations et documents de voyage, la communication marketing (avec votre consentement), l\u0027am\u00e9lioration de nos services et de l\u0027exp\u00e9rience utilisateur, le respect de nos obligations l\u00e9gales.',
  },
  {
    title: '4. Bases l\u00e9gales',
    content: 'Le traitement de vos donn\u00e9es repose sur : l\u0027ex\u00e9cution du contrat de voyage, votre consentement (marketing), nos obligations l\u00e9gales (comptabilit\u00e9, fiscalit\u00e9), notre int\u00e9r\u00eat l\u00e9gitime (am\u00e9lioration des services, pr\u00e9vention de la fraude).',
  },
  {
    title: '5. Dur\u00e9e de conservation',
    content: 'Donn\u00e9es de compte : dur\u00e9e de la relation commerciale + 3 ans. Donn\u00e9es de r\u00e9servation : 10 ans (obligation comptable). Donn\u00e9es de navigation : 13 mois maximum. Donn\u00e9es marketing : 3 ans apr\u00e8s le dernier contact.',
  },
  {
    title: '6. Partage des donn\u00e9es',
    content: 'Vos donn\u00e9es peuvent \u00eatre partag\u00e9es avec : nos partenaires de voyage (h\u00f4tels, transporteurs) pour l\u0027ex\u00e9cution de votre r\u00e9servation, Stripe pour le traitement des paiements, nos prestataires techniques (h\u00e9bergement, email), les autorit\u00e9s comp\u00e9tentes si requis par la loi. Nous ne vendons jamais vos donn\u00e9es \u00e0 des tiers.',
  },
  {
    title: '7. Vos droits',
    content: 'Conform\u00e9ment au RGPD, vous disposez des droits suivants : acc\u00e8s \u00e0 vos donn\u00e9es, rectification des donn\u00e9es inexactes, suppression de vos donn\u00e9es, limitation du traitement, portabilit\u00e9 de vos donn\u00e9es, opposition au traitement, retrait du consentement \u00e0 tout moment. Pour exercer vos droits : contact@eventylife.fr. D\u00e9lai de r\u00e9ponse : 1 mois maximum.',
  },
  {
    title: '8. S\u00e9curit\u00e9',
    content: 'Nous mettons en oeuvre des mesures techniques et organisationnelles pour prot\u00e9ger vos donn\u00e9es : chiffrement SSL/TLS, hashage des mots de passe (Argon2id), acc\u00e8s restreint aux donn\u00e9es, sauvegardes r\u00e9guli\u00e8res, monitoring des acc\u00e8s.',
  },
  {
    title: '9. Cookies',
    content: 'Nous utilisons des cookies essentiels (fonctionnement du site), des cookies analytiques (mesure d\u0027audience), et des cookies marketing (avec votre consentement). Vous pouvez g\u00e9rer vos pr\u00e9f\u00e9rences via le bandeau cookies ou les param\u00e8tres de votre navigateur.',
  },
  {
    title: '10. R\u00e9clamation',
    content: 'Si vous estimez que vos droits ne sont pas respect\u00e9s, vous pouvez adresser une r\u00e9clamation \u00e0 la CNIL (Commission Nationale de l\u0027Informatique et des Libert\u00e9s) : www.cnil.fr.',
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
