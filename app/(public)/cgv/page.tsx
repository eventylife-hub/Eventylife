'use client';
import Link from 'next/link';
const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  white: '#FFFFFF', muted: '#6B7280', border: '#E8E4DE',
};
const sections = [
  {
    title: 'Article 1 \u2013 Objet',
    content: 'Les pr\u00e9sentes Conditions G\u00e9n\u00e9rales de Vente (CGV) r\u00e9gissent les relations contractuelles entre Eventy Life SAS, agence de voyages immatricul\u00e9e aupr\u00e8s d\u0027Atout France, et ses clients. Toute r\u00e9servation implique l\u0027acceptation pleine et enti\u00e8re des pr\u00e9sentes CGV.',
  },
  {
    title: 'Article 2 \u2013 R\u00e9servation et paiement',
    content: 'La r\u00e9servation est confirm\u00e9e apr\u00e8s paiement int\u00e9gral ou versement d\u0027un acompte de 30% du prix total. Le solde doit \u00eatre r\u00e9gl\u00e9 au plus tard 30 jours avant la date de d\u00e9part. Le paiement s\u0027effectue par carte bancaire via notre plateforme s\u00e9curis\u00e9e (Stripe). Le paiement en 3 ou 4 fois sans frais est disponible pour les r\u00e9servations sup\u00e9rieures \u00e0 300\u20ac.',
  },
  {
    title: 'Article 3 \u2013 Prix',
    content: 'Les prix sont indiqu\u00e9s en euros TTC (TVA sur la marge). Ils comprennent : le transport (bus ou avion selon le voyage), l\u0027h\u00e9bergement, la restauration (selon programme), les activit\u00e9s et visites pr\u00e9vues, l\u0027accompagnement porte-\u00e0-porte, les assurances de base. Sauf mention contraire, les prix ne comprennent pas : les d\u00e9penses personnelles, les assurances compl\u00e9mentaires optionnelles, les extras non pr\u00e9vus au programme.',
  },
  {
    title: 'Article 4 \u2013 Modification et annulation par le client',
    content: 'Annulation plus de 30 jours avant le d\u00e9part : remboursement int\u00e9gral moins 50\u20ac de frais de dossier. Annulation entre 30 et 15 jours : retenue de 30% du prix. Annulation entre 14 et 7 jours : retenue de 50% du prix. Annulation moins de 7 jours ou non-pr\u00e9sentation : aucun remboursement. Toute modification de r\u00e9servation est soumise \u00e0 disponibilit\u00e9 et peut entra\u00eener un suppl\u00e9ment tarifaire.',
  },
  {
    title: 'Article 5 \u2013 Modification et annulation par Eventy Life',
    content: 'En cas de force majeure ou de nombre insuffisant de participants (minimum 15 personnes), Eventy Life se r\u00e9serve le droit d\u0027annuler le voyage. Dans ce cas, le client se voit proposer un report ou un remboursement int\u00e9gral. Eventy Life peut modifier des \u00e9l\u00e9ments non essentiels du programme (ordre des visites, h\u00f4tel de cat\u00e9gorie \u00e9quivalente) sans que cela constitue un motif d\u0027annulation.',
  },
  {
    title: 'Article 6 \u2013 Transport et ramassage',
    content: 'Le ramassage est organis\u00e9 \u00e0 proximit\u00e9 du domicile du client. Les points et horaires de ramassage sont communiqu\u00e9s 7 jours avant le d\u00e9part. Le client doit se pr\u00e9senter \u00e0 l\u0027heure indiqu\u00e9e. Aucun remboursement ne sera effectu\u00e9 en cas de retard du client.',
  },
  {
    title: 'Article 7 \u2013 Assurances',
    content: 'Eventy Life est couverte par une assurance Responsabilit\u00e9 Civile Professionnelle et b\u00e9n\u00e9ficie de la garantie financi\u00e8re APST. Une assurance annulation et rapatriement est incluse dans le prix. Des options d\u0027assurance compl\u00e9mentaire peuvent \u00eatre propos\u00e9es lors de la r\u00e9servation.',
  },
  {
    title: 'Article 8 \u2013 R\u00e9clamations',
    content: 'Toute r\u00e9clamation doit \u00eatre adress\u00e9e par \u00e9crit \u00e0 contact@eventylife.fr dans un d\u00e9lai de 30 jours apr\u00e8s le retour de voyage. Eventy Life s\u0027engage \u00e0 r\u00e9pondre dans un d\u00e9lai de 15 jours ouvr\u00e9s. En cas de litige non r\u00e9solu, le client peut recourir au M\u00e9diateur du Tourisme et du Voyage (MTV).',
  },
  {
    title: 'Article 9 \u2013 Responsabilit\u00e9',
    content: 'Eventy Life est responsable de la bonne ex\u00e9cution des prestations pr\u00e9vues au contrat, sous r\u00e9serve des cas de force majeure, du fait d\u0027un tiers \u00e9tranger au contrat, ou du fait du client lui-m\u00eame. La responsabilit\u00e9 d\u0027Eventy Life ne saurait exc\u00e9der les limites pr\u00e9vues par les conventions internationales applicables.',
  },
  {
    title: 'Article 10 \u2013 Droit applicable',
    content: 'Les pr\u00e9sentes CGV sont soumises au droit fran\u00e7ais. En cas de litige, et apr\u00e8s tentative de r\u00e9solution amiable, les tribunaux de Paris seront seuls comp\u00e9tents. Le client peut \u00e9galement recourir \u00e0 la plateforme europ\u00e9enne de r\u00e8glement en ligne des litiges : https://ec.europa.eu/odr.',
  },
];
export default function CgvPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.cream }}>
      <div style={{
        background: 'linear-gradient(135deg, ' + C.navy + ' 0%, #2D2B55 100%)',
        padding: '80px 20px 60px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: C.white, margin: '0 0 16px' }}>
          Conditions G&#233;n&#233;rales de Vente
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }}>
          Derni&#232;re mise &#224; jour : mars 2026
        </p>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{
          background: '#FFF7ED', borderRadius: 14, padding: '20px 24px',
          border: '1px solid ' + C.gold, marginBottom: 32,
        }}>
          <p style={{ fontSize: 15, color: C.navy, lineHeight: 1.6, margin: 0 }}>
            &#9888;&#65039; Veuillez lire attentivement ces conditions avant de proc&#233;der &#224; toute r&#233;servation. En r&#233;servant un voyage sur www.eventylife.fr, vous acceptez ces CGV.
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
          <Link href="/politique-confidentialite" style={{
            color: C.terra, fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>Politique de confidentialit&#233; &#8594;</Link>
        </div>
      </div>
    </div>
  );
}
