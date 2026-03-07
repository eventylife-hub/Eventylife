'use client';
import Link from 'next/link';
const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  white: '#FFFFFF', muted: '#6B7280', border: '#E8E4DE',
};
const sections = [
  {
    title: '1. Informations légales',
    content: 'Le site www.eventylife.fr est édité par la société Eventy Life SAS (en cours d\u0027immatriculation), dont le siège social est situé à Paris, France. Capital social : 5 000 \u20ac. Directeur de la publication : David. Contact : contact@eventylife.fr.',
  },
  {
    title: '2. Hébergement',
    content: 'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Téléphone : +1 (951) 383-6898.',
  },
  {
    title: '3. Activité réglementée',
    content: 'Eventy Life exerce une activité d\u0027agence de voyages et est immatriculée au registre des opérateurs de voyages et de séjours auprès d\u0027Atout France (immatriculation en cours). Garantie financière : APST (Association Professionnelle de Solidarité du Tourisme). Assurance Responsabilité Civile Professionnelle : en cours de souscription.',
  },
  {
    title: '4. Propriété intellectuelle',
    content: 'L\u0027ensemble du contenu du site (textes, images, graphismes, logo, icônes, sons, logiciels) est la propriété exclusive d\u0027Eventy Life SAS ou de ses partenaires. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie du site est interdite sans autorisation préalable.',
  },
  {
    title: '5. Données personnelles',
    content: 'Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d\u0027un droit d\u0027accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : contact@eventylife.fr. Pour plus de détails, consultez notre Politique de Confidentialité.',
  },
  {
    title: '6. Cookies',
    content: 'Le site utilise des cookies pour améliorer votre expérience de navigation, mesurer l\u0027audience et personnaliser le contenu. Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur.',
  },
  {
    title: '7. Limitation de responsabilité',
    content: 'Eventy Life s\u0027efforce de fournir des informations exactes et à jour. Toutefois, la société ne saurait être tenue responsable des erreurs, omissions ou résultats obtenus suite à l\u0027utilisation de ces informations.',
  },
  {
    title: '8. Droit applicable',
    content: 'Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux de Paris seront seuls compétents.',
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
