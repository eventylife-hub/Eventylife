'use client';

import Link from 'next/link';

const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  white: '#FFFFFF', muted: '#6B7280', border: '#E8E4DE', green: '#059669',
  greenBg: '#ECFDF5',
};

const avantages = [
  { icon: '&#128176;', title: 'Revenus compl\u00e9mentaires', desc: 'Gagnez des commissions attractives sur chaque r\u00e9servation. Jusqu\u0027\u00e0 15% de commission sur le prix du voyage.' },
  { icon: '&#128188;', title: 'Outils professionnels', desc: 'Tableau de bord d\u00e9di\u00e9, suivi des r\u00e9servations en temps r\u00e9el, statistiques de vente et rapports financiers.' },
  { icon: '&#128101;', title: 'Vos groupes, votre rythme', desc: 'Cr\u00e9ez et g\u00e9rez vos propres groupes de voyageurs. Vous choisissez les destinations et les dates.' },
  { icon: '&#127891;', title: 'Formation incluse', desc: 'Acc\u00e9dez \u00e0 notre programme de formation complet pour devenir un expert du voyage de groupe.' },
  { icon: '&#128640;', title: 'Z\u00e9ro logistique', desc: 'Eventy g\u00e8re tout : transport, h\u00e9bergement, restauration, assurances. Concentrez-vous sur vos clients.' },
  { icon: '&#129309;', title: 'Accompagnement d\u00e9di\u00e9', desc: 'Un charg\u00e9 de compte personnel vous accompagne dans votre d\u00e9veloppement commercial.' },
];

const etapes = [
  { num: '1', title: 'Inscription en ligne', desc: 'Remplissez le formulaire en 5 minutes. Aucun dipl\u00f4me requis.' },
  { num: '2', title: 'Validation du profil', desc: 'Notre \u00e9quipe valide votre profil sous 48h.' },
  { num: '3', title: 'Formation express', desc: 'Suivez notre formation en ligne (2h) pour ma\u00eetriser la plateforme.' },
  { num: '4', title: 'Lancez-vous !', desc: 'Cr\u00e9ez votre premier voyage et commencez \u00e0 gagner des commissions.' },
];

const profils = [
  { icon: '&#128105;&#8205;&#128188;', title: 'Ind\u00e9pendants', desc: 'Auto-entrepreneurs, freelances, coachs... Diversifiez vos revenus avec le voyage.' },
  { icon: '&#127963;', title: 'Associations', desc: 'Comit\u00e9s d\u0027entreprise, clubs sportifs, associations culturelles... Organisez facilement.' },
  { icon: '&#128100;', title: 'Passionn\u00e9s', desc: 'Vous aimez voyager et partager ? Transformez votre passion en activit\u00e9.' },
  { icon: '&#128188;', title: 'Agences locales', desc: 'Compl\u00e9tez votre offre avec des voyages de groupe cl\u00e9 en main.' },
];

const temoignages = [
  { name: 'Marie L.', role: 'Ind\u00e9pendante depuis 2024', text: 'Gr\u00e2ce \u00e0 Eventy, j\u0027organise 3 voyages par an et je g\u00e9n\u00e8re un compl\u00e9ment de revenu appr\u00e9ciable. La plateforme est intuitive et l\u0027\u00e9quipe tr\u00e8s r\u00e9active.', rating: 5 },
  { name: 'Ahmed K.', role: 'Pr\u00e9sident association culturelle', text: 'On organisait d\u00e9j\u00e0 des voyages mais la logistique \u00e9tait un cauchemar. Avec Eventy, tout est simplifi\u00e9. Nos membres sont ravis.', rating: 5 },
  { name: 'Sophie D.', role: 'Coach bien-\u00eatre', text: 'J\u0027ai int\u00e9gr\u00e9 les voyages de groupe \u00e0 mes retraites bien-\u00eatre. Mes clientes adorent et \u00e7a booste mon activit\u00e9.', rating: 5 },
];

const faqs = [
  { q: 'Faut-il un dipl\u00f4me ou une licence pour devenir partenaire ?', a: 'Non. Eventy est une agence de voyages immatricul\u00e9e Atout France avec garantie APST. Vous agissez en tant qu\u0027apporteur d\u0027affaires, pas en tant qu\u0027agent de voyages.' },
  { q: 'Combien puis-je gagner ?', a: 'Les commissions varient de 8% \u00e0 15% selon le volume. Un partenaire actif organisant 4-5 voyages/an peut g\u00e9n\u00e9rer entre 3 000 et 8 000\u20ac de commissions annuelles.' },
  { q: 'Est-ce que \u00e7a prend beaucoup de temps ?', a: 'L\u0027inscription prend 5 minutes. La formation 2 heures. Ensuite, comptez quelques heures par voyage pour la promotion et le suivi de votre groupe.' },
  { q: 'Qui g\u00e8re la logistique ?', a: 'Eventy g\u00e8re 100% de la logistique : transport, h\u00e9bergement, restauration, assurances, accompagnement sur place. Vous vous concentrez sur vos clients.' },
];

export default function DevenirProPage() {
  return (
    <div style={{ background: C.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, ' + C.navy + ' 0%, #2D2B55 100%)',
        padding: '80px 20px 70px', textAlign: 'center', position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(199,91,57,0.15) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(199,91,57,0.2)',
            color: C.terra, padding: '8px 20px', borderRadius: 20,
            fontSize: 14, fontWeight: 700, marginBottom: 20,
          }}>&#127775; Rejoignez le r{'\u00e9'}seau Eventy</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: C.white, margin: '0 0 16px', lineHeight: 1.1 }}>
            Devenez cr{'\u00e9'}ateur de voyages
          </h1>
          <p style={{
            fontSize: 20, color: 'rgba(255,255,255,0.85)', margin: '0 0 36px',
            maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6,
          }}>
            Transformez votre passion du voyage en activit{'\u00e9'} lucrative. Z{'\u00e9'}ro investissement, z{'\u00e9'}ro logistique, commissions attractives.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/inscription?role=pro" style={{
              background: C.terra, color: C.white, padding: '16px 40px',
              borderRadius: 14, fontWeight: 700, fontSize: 17, textDecoration: 'none',
              display: 'inline-block',
            }}>Devenir partenaire</Link>
            <a href="#comment-ca-marche" style={{
              background: 'rgba(255,255,255,0.1)', color: C.white,
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '14px 36px', borderRadius: 14, fontWeight: 600,
              fontSize: 16, textDecoration: 'none', display: 'inline-block',
            }}>Comment {'\u00e7'}a marche</a>
          </div>
          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 48, marginTop: 50,
            flexWrap: 'wrap',
          }}>
            {[
              { val: '150+', label: 'partenaires actifs' },
              { val: '15%', label: 'commission max' },
              { val: '48h', label: 'validation profil' },
              { val: '0\u20ac', label: 'd\u0027investissement' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.gold }}>{s.val}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: C.navy, textAlign: 'center', margin: '0 0 12px' }}>
          Pourquoi devenir partenaire Eventy ?
        </h2>
        <p style={{ fontSize: 17, color: C.muted, textAlign: 'center', margin: '0 0 48px' }}>
          Tout ce qu{'\u0027'}il faut pour r{'\u00e9'}ussir, sans les contraintes
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {avantages.map((a, i) => (
            <div key={i} style={{
              background: C.white, borderRadius: 16, padding: '28px 24px',
              border: '1px solid ' + C.border,
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: a.icon }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{a.title}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment ca marche */}
      <div id="comment-ca-marche" style={{
        background: C.white, padding: '60px 20px',
        borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: C.navy, textAlign: 'center', margin: '0 0 48px' }}>
            Comment {'\u00e7'}a marche ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 32 }}>
            {etapes.map((e, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, ' + C.terra + ', ' + C.gold + ')',
                  color: C.white, fontSize: 24, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>{e.num}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{e.title}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profils */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: C.navy, textAlign: 'center', margin: '0 0 12px' }}>
          Pour qui ?
        </h2>
        <p style={{ fontSize: 17, color: C.muted, textAlign: 'center', margin: '0 0 48px' }}>
          Le programme partenaire est ouvert {'\u00e0'} tous les profils
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {profils.map((p, i) => (
            <div key={i} style={{
              background: C.white, borderRadius: 16, padding: '24px',
              border: '1px solid ' + C.border, textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: p.icon }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{p.title}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Temoignages */}
      <div style={{
        background: 'linear-gradient(135deg, ' + C.navy + ' 0%, #2D2B55 100%)',
        padding: '60px 20px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: C.white, textAlign: 'center', margin: '0 0 48px' }}>
            Ils nous font confiance
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {temoignages.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 16,
                padding: '28px 24px', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontSize: 14, color: C.gold, marginBottom: 12 }}>
                  {'&#9733;'.repeat(t.rating).split('').map((_, j) => (
                    <span key={j} dangerouslySetInnerHTML={{ __html: '&#9733;' }} />
                  ))}
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>
                  &laquo; {t.text} &raquo;
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{t.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: C.navy, textAlign: 'center', margin: '0 0 48px' }}>
          Questions fr{'\u00e9'}quentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{
              background: C.white, borderRadius: 14, padding: '24px',
              border: '1px solid ' + C.border,
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 10 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div style={{
        background: 'linear-gradient(135deg, ' + C.terra + ' 0%, #A84A2E 100%)',
        padding: '60px 20px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: '0 0 16px' }}>
            Pr{'\u00ea'}t {'\u00e0'} vous lancer ?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.9)', margin: '0 0 32px', lineHeight: 1.6 }}>
            Inscription gratuite, aucun engagement. Commencez {'\u00e0'} organiser des voyages d{'\u00e8'}s aujourd{'\u0027'}hui.
          </p>
          <Link href="/inscription?role=pro" style={{
            background: C.white, color: C.terra, padding: '16px 48px',
            borderRadius: 14, fontWeight: 800, fontSize: 18, textDecoration: 'none',
            display: 'inline-block',
          }}>Cr{'\u00e9'}er mon compte partenaire</Link>
          <div style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            &#128274; Inscription gratuite &#183; Validation sous 48h &#183; Aucun engagement
          </div>
        </div>
      </div>
    </div>
  );
}
