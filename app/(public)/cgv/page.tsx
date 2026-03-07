'use client';
import Link from 'next/link';
const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  white: '#FFFFFF', muted: '#6B7280', border: '#E8E4DE',
};
const sections = [
  {
    title: 'Article 1 \u2013 Objet',
    content: 'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Eventy Life SAS, agence de voyages immatriculée auprès d\u0027Atout France, et ses clients. Toute réservation implique l\u0027acceptation pleine et entière des présentes CGV.',
  },
  {
    title: 'Article 2 \u2013 Réservation et paiement',
    content: 'La réservation est confirmée après paiement intégral ou versement d\u0027un acompte de 30% du prix total. Le solde doit être réglé au plus tard 30 jours avant la date de départ. Le paiement s\u0027effectue par carte bancaire via notre plateforme sécurisée (Stripe). Le paiement en 3 ou 4 fois sans frais est disponible pour les réservations supérieures à 300\u20ac.',
  },
  {
    title: 'Article 3 \u2013 Prix',
    content: 'Les prix sont indiqués en euros TTC (TVA sur la marge). Ils comprennent : le transport (bus ou avion selon le voyage), l\u0027hébergement, la restauration (selon programme), les activités et visites prévues, l\u0027accompagnement porte-à-porte, les assurances de base. Sauf mention contraire, les prix ne comprennent pas : les dépenses personnelles, les assurances complémentaires optionnelles, les extras non prévus au programme.',
  },
  {
    title: 'Article 4 \u2013 Modification et annulation par le client',
    content: 'Annulation plus de 30 jours avant le départ : remboursement intégral moins 50\u20ac de frais de dossier. Annulation entre 30 et 15 jours : retenue de 30% du prix. Annulation entre 14 et 7 jours : retenue de 50% du prix. Annulation moins de 7 jours ou non-présentation : aucun remboursement. Toute modification de réservation est soumise à disponibilité et peut entraîner un supplément tarifaire.',
  },
  {
    title: 'Article 5 \u2013 Modification et annulation par Eventy Life',
    content: 'En cas de force majeure ou de nombre insuffisant de participants (minimum 15 personnes), Eventy Life se réserve le droit d\u0027annuler le voyage. Dans ce cas, le client se voit proposer un report ou un remboursement intégral. Eventy Life peut modifier des éléments non essentiels du programme (ordre des visites, hôtel de catégorie équivalente) sans que cela constitue un motif d\u0027annulation.',
  },
  {
    title: 'Article 6 \u2013 Transport et ramassage',
    content: 'Le ramassage est organisé à proximité du domicile du client. Les points et horaires de ramassage sont communiqués 7 jours avant le départ. Le client doit se présenter à l\u0027heure indiquée. Aucun remboursement ne sera effectué en cas de retard du client.',
  },
  {
    title: 'Article 7 \u2013 Assurances',
    content: 'Eventy Life est couverte par une assurance Responsabilité Civile Professionnelle et bénéficie de la garantie financière APST. Une assurance annulation et rapatriement est incluse dans le prix. Des options d\u0027assurance complémentaire peuvent être proposées lors de la réservation.',
  },
  {
    title: 'Article 8 \u2013 Réclamations',
    content: 'Toute réclamation doit être adressée par écrit à contact@eventylife.fr dans un délai de 30 jours après le retour de voyage. Eventy Life s\u0027engage à répondre dans un délai de 15 jours ouvrés. En cas de litige non résolu, le client peut recourir au Médiateur du Tourisme et du Voyage (MTV).',
  },
  {
    title: 'Article 9 \u2013 Responsabilité',
    content: 'Eventy Life est responsable de la bonne exécution des prestations prévues au contrat, sous réserve des cas de force majeure, du fait d\u0027un tiers étranger au contrat, ou du fait du client lui-même. La responsabilité d\u0027Eventy Life ne saurait excéder les limites prévues par les conventions internationales applicables.',
  },
  {
    title: 'Article 10 \u2013 Droit applicable',
    content: 'Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux de Paris seront seuls compétents. Le client peut également recourir à la plateforme européenne de règlement en ligne des litiges : https://ec.europa.eu/odr.',
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
