'use client';
import Link from 'next/link';
const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  white: '#FFFFFF', muted: '#6B7280', border: '#E8E4DE',
};
const sections = [
  {
    title: '1. Informations l\u00e9gales',
    content: 'Le site www.eventylife.fr est \u00e9dit\u00e9 par la soci\u00e9t\u00e9 Eventy Life SAS (en cours d\u0027immatriculation), dont le si\u00e8ge social est situ\u00e9 \u00e0 Paris, France. Capital social : 5 000 \u20ac. Directeur de la publication : David. Contact : contact@eventylife.fr.',
  },
  {
    title: '2. H\u00e9bergement',
    content: 'Le site est h\u00e9berg\u00e9 par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. T\u00e9l\u00e9phone : +1 (951) 383-6898.',
  },
  {
    title: '3. Activit\u00e9 r\u00e9glement\u00e9e',
    content: 'Eventy Life exerce une activit\u00e9 d\u0027agence de voyages et est immatricul\u00e9e au registre des op\u00e9rateurs de voyages et de s\u00e9jours aupr\u00e8s d\u0027Atout France (immatriculation en cours). Garantie financi\u00e8re : APST (Association Professionnelle de Solidarit\u00e9 du Tourisme). Assurance Responsabilit\u00e9 Civile Professionnelle : en cours de souscription.',
  },
  {
    title: '4. Propri\u00e9t\u00e9 intellectuelle',
    content: 'L\u0027ensemble du contenu du site (textes, images, graphismes, logo, ic\u00f4nes, sons, logiciels) est la propri\u00e9t\u00e9 exclusive d\u0027Eventy Life SAS ou de ses partenaires. Toute reproduction, repr\u00e9sentation, modification, publication ou adaptation de tout ou partie du site est interdite sans autorisation pr\u00e9alable.',
  },
  {
    title: '5. Donn\u00e9es personnelles',
    content: 'Conform\u00e9ment au R\u00e8glement G\u00e9n\u00e9ral sur la Protection des Donn\u00e9es (RGPD) et \u00e0 la loi Informatique et Libert\u00e9s, vous disposez d\u0027un droit d\u0027acc\u00e8s, de rectification, de suppression et de portabilit\u00e9 de vos donn\u00e9es. Pour exercer ces droits, contactez-nous \u00e0 : contact@eventylife.fr. Pour plus de d\u00e9tails, consultez notre Politique de Confidentialit\u00e9.',
  },
  {
    title: '6. Cookies',
    content: 'Le site utilise des cookies pour am\u00e9liorer votre exp\u00e9rience de navigation, mesurer l\u0027audience et personnaliser le contenu. Vous pouvez g\u00e9rer vos pr\u00e9f\u00e9rences de cookies \u00e0 tout moment via les param\u00e8tres de votre navigateur.',
  },
  {
    title: '7. Limitation de responsabilit\u00e9',
    content: 'Eventy Life s\u0027efforce de fournir des informations exactes et \u00e0 jour. Toutefois, la soci\u00e9t\u00e9 ne saurait \u00eatre tenue responsable des erreurs, omissions ou r\u00e9sultats obtenus suite \u00e0 l\u0027utilisation de ces informations.',
  },
  {
    title: '8. Droit applicable',
    content: 'Les pr\u00e9sentes mentions l\u00e9gales sont soumises au droit fran\u00e7ais. En cas de litige, les tribunaux de Paris seront seuls comp\u00e9tents.',
  },
];
export default function MentionsLegalesPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.cream }}>
      <div style={{
        background: 'linear-gradient(135deg, ' + C.navy + ' 0%, #2D2B55 100%)',
        padding: '80px 20px 60px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: C.white, margin: '0 0 16px' }}>
          Mentions l&#233;gales
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }}>
          Derni&#232;re mise &#224; jour : mars 2026
        </p>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px' }}>
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
          <Link href="/politique-confidentialite" style={{
            color: C.terra, fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>Politique de confidentialit&#233; &#8594;</Link>
          <span style={{ margin: '0 20px', color: C.border }}>|</span>
          <Link href="/cgv" style={{
            color: C.terra, fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>Conditions g&#233;n&#233;rales de vente &#8594;</Link>
        </div>
      </div>
    </div>
  );
}
