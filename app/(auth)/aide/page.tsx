'use client';
import { useState } from 'react';

const faqItems = [
  {
    question: "Comment r\u00e9server un voyage ?",
    answer: "Parcourez nos voyages disponibles, s\u00e9lectionnez celui qui vous int\u00e9resse, choisissez vos options (chambre, transport, assurance) puis proc\u00e9dez au paiement s\u00e9curis\u00e9. Votre accompagnateur vous contactera ensuite pour organiser les d\u00e9tails."
  },
  {
    question: "Puis-je annuler ma r\u00e9servation ?",
    answer: "Oui, vous pouvez annuler votre r\u00e9servation depuis votre espace personnel. Les conditions d\u2019annulation d\u00e9pendent du d\u00e9lai avant le d\u00e9part : remboursement int\u00e9gral jusqu\u2019\u00e0 30 jours avant, 50% entre 30 et 15 jours, et aucun remboursement en dessous de 15 jours sauf assurance annulation."
  },
  {
    question: "Comment fonctionne l\u2019accompagnement ?",
    answer: "Chaque voyage est encadr\u00e9 par un accompagnateur d\u00e9di\u00e9 qui vous assiste de votre porte de d\u00e9part jusqu\u2019\u00e0 votre retour. Il g\u00e8re la logistique, r\u00e9pond \u00e0 vos questions et s\u2019assure que tout se passe parfaitement."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), le paiement en 3 ou 4 fois sans frais, et le virement bancaire. Tous les paiements sont s\u00e9curis\u00e9s par Stripe."
  },
  {
    question: "Puis-je voyager seul(e) ?",
    answer: "Absolument ! Nos voyages de groupe sont ouverts \u00e0 tous, que vous voyagiez seul(e), en couple ou en famille. C\u2019est d\u2019ailleurs une excellente occasion de rencontrer d\u2019autres voyageurs."
  },
  {
    question: "Comment modifier ma r\u00e9servation ?",
    answer: "Rendez-vous dans votre espace \u00ab Mes r\u00e9servations \u00bb pour modifier les d\u00e9tails de votre voyage (chambre, options, voyageurs). Certaines modifications peuvent entra\u00eener un ajustement tarifaire."
  },
  {
    question: "Que comprend le prix affich\u00e9 ?",
    answer: "Le prix par personne inclut le transport (bus ou avion), l\u2019h\u00e9bergement, l\u2019accompagnement porte-\u00e0-porte et les activit\u00e9s mentionn\u00e9es dans le programme. Les repas et l\u2019assurance sont en option."
  },
  {
    question: "Comment devenir accompagnateur partenaire ?",
    answer: "Visitez notre page \u00ab Devenir Pro \u00bb pour d\u00e9couvrir le programme partenaire. Vous pourrez cr\u00e9er et vendre vos propres voyages sur notre plateforme apr\u00e8s une formation gratuite."
  },
];

const contactOptions = [
  {
    icon: "\uD83D\uDCE7",
    titre: "Email",
    description: "R\u00e9ponse sous 24h",
    action: "support@eventylife.fr",
    lien: "mailto:support@eventylife.fr",
  },
  {
    icon: "\uD83D\uDCDE",
    titre: "T\u00e9l\u00e9phone",
    description: "Lun-Ven 9h-18h",
    action: "01 23 45 67 89",
    lien: "tel:+33123456789",
  },
  {
    icon: "\uD83D\uDCAC",
    titre: "Chat en direct",
    description: "Disponible en ligne",
    action: "D\u00e9marrer le chat",
    lien: "#",
  },
];

export default function AidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [recherche, setRecherche] = useState('');

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(recherche.toLowerCase()) ||
    item.answer.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>Eventy Life</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 750, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            {"Centre d\u2019aide"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 24 }}>
            {"Comment pouvons-nous vous aider\u00a0?"}
          </p>
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Rechercher dans la FAQ..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              style={{ width: '100%', padding: '14px 20px 14px 48px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20 }}>{"\uD83D\uDD0D"}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {contactOptions.map((opt, i) => (
            <a key={i} href={opt.lien} style={{ background: '#FFFFFF', borderRadius: 14, padding: '24px 20px', textAlign: 'center', textDecoration: 'none', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{opt.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{opt.titre}</div>
              <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 8 }}>{opt.description}</div>
              <div style={{ color: '#C75B39', fontSize: 13, fontWeight: 500 }}>{opt.action}</div>
            </a>
          ))}
        </div>

        <h2 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 600, marginBottom: 20 }}>
          Questions les plus pos{"é"}es
        </h2>

        {filteredFaq.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.06)', borderRadius: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\uD83E\uDD14"}</div>
            <p style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Aucun résultat</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              {"Essayez un autre terme de recherche ou contactez-nous directement."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredFaq.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} style={{ background: '#FFFFFF', borderRadius: 12, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600, flex: 1 }}>{item.question}</span>
                    <span style={{ color: '#C75B39', fontSize: 20, fontWeight: 700, marginLeft: 12, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', color: '#4B5563', fontSize: 14, lineHeight: 1.7 }}>
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px 28px', marginTop: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{"\uD83D\uDCE9"}</div>
          <h3 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 600, marginBottom: 8, marginTop: 0 }}>
            {"Vous n\u2019avez pas trouv\u00e9 votre r\u00e9ponse\u00a0?"}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 20 }}>
            {"Notre \u00e9quipe est \u00e0 votre disposition pour r\u00e9pondre \u00e0 toutes vos questions."}
          </p>
          <a href="/contact" style={{ display: 'inline-block', padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}
