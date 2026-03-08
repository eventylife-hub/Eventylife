'use client';

const avantages = [
  { icon: "\u{1F30D}", titre: "Destinations exclusives", desc: "Soyez les premiers inform\u00e9s de nos nouvelles destinations et itin\u00e9raires." },
  { icon: "\u{1F381}", titre: "Offres privil\u00e8ges", desc: "Acc\u00e9dez \u00e0 des r\u00e9ductions exclusives r\u00e9serv\u00e9es \u00e0 nos abonn\u00e9s." },
  { icon: "\u{1F4A1}", titre: "Conseils voyage", desc: "Recevez nos meilleures astuces pour pr\u00e9parer vos voyages de groupe." },
  { icon: "\u{2B50}", titre: "Avant-premi\u00e8res", desc: "R\u00e9servez en priorit\u00e9 avant l\u2019ouverture au grand public." },
];

const temoignages = [
  { nom: "Marie L.", lieu: "Lyon", texte: "Gr\u00e2ce \u00e0 la newsletter, j\u2019ai pu r\u00e9server le voyage en Croatie avant tout le monde. Une exp\u00e9rience incroyable !" },
  { nom: "Philippe D.", lieu: "Bordeaux", texte: "Les conseils voyage sont vraiment utiles. J\u2019ai d\u00e9couvert des astuces que je n\u2019aurais jamais trouv\u00e9es seul." },
  { nom: "Sophie M.", lieu: "Paris", texte: "Les offres exclusives de la newsletter m\u2019ont fait \u00e9conomiser plus de 200\u20ac sur mon dernier voyage." },
];

export default function NewsletterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{"\u{1F48C}"}</div>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Restez connect\u00e9"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Notre newsletter"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Recevez chaque mois nos meilleures offres, destinations coup de c\u0153ur et conseils voyage directement dans votre bo\u00eete mail."}
          </p>
          <div style={{ display: 'flex', gap: 0, maxWidth: 480, margin: '0 auto', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <input type="email" placeholder="Votre adresse email" style={{ flex: 1, padding: '16px 20px', border: 'none', fontSize: 15, outline: 'none', background: '#FFFFFF', color: '#1A1A2E' }} />
            <button style={{ padding: '16px 28px', background: '#D4A853', color: '#1A1A2E', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{"S\u2019inscrire"}</button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12 }}>{"Pas de spam. D\u00e9sinscription en un clic. Vos donn\u00e9es restent confidentielles."}</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>{"Pourquoi s\u2019inscrire ?"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Des avantages exclusifs r\u00e9serv\u00e9s \u00e0 notre communaut\u00e9"}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 50 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 40 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Ce que vous recevrez"}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { freq: "Chaque mois", desc: "S\u00e9lection de 3 voyages coup de c\u0153ur avec offres sp\u00e9ciales" },
              { freq: "Chaque trimestre", desc: "Guide complet d\u2019une destination avec itin\u00e9raires et bonnes adresses" },
              { freq: "En exclusivit\u00e9", desc: "Ventes priv\u00e9es et codes promo avant tout le monde" },
            ].map(item => (
              <div key={item.freq} style={{ padding: '16px', background: '#FAF7F2', borderRadius: 12 }}>
                <div style={{ color: '#D4A853', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{item.freq}</div>
                <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>{"Ils adorent notre newsletter"}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {temoignages.map(t => (
            <div key={t.nom} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: '0 0 12px', fontStyle: 'italic' }}>{"\u00ab " + t.texte + " \u00bb"}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 700 }}>{t.nom}</span>
                <span style={{ color: '#9CA3AF', fontSize: 12 }}>{"\u2014 " + t.lieu}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 40 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions fr\u00e9quentes"}</h3>
          {[
            { q: "\u00c0 quelle fr\u00e9quence recevrai-je la newsletter ?", r: "Vous recevrez un email par mois maximum, plus des offres sp\u00e9ciales ponctuelles." },
            { q: "Puis-je me d\u00e9sinscrire facilement ?", r: "Oui, chaque email contient un lien de d\u00e9sinscription en un clic. C\u2019est imm\u00e9diat." },
            { q: "Mes donn\u00e9es sont-elles prot\u00e9g\u00e9es ?", r: "Absolument. Nous respectons le RGPD et ne partageons jamais vos donn\u00e9es avec des tiers." },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: '1px solid #E8E4DE', padding: '16px 0' }}>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{faq.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{faq.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 40 }}>
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Rejoignez + de 5 000 voyageurs"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 24 }}>
              {"Inscrivez-vous maintenant et recevez en cadeau notre guide \u00ab 10 destinations tendance 2026 \u00bb."}
            </p>
            <div style={{ display: 'flex', gap: 0, maxWidth: 440, margin: '0 auto', borderRadius: 10, overflow: 'hidden' }}>
              <input type="email" placeholder="Votre email" style={{ flex: 1, padding: '14px 18px', border: 'none', fontSize: 14, outline: 'none' }} />
              <button style={{ padding: '14px 24px', background: '#D4A853', color: '#1A1A2E', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{"Je m\u2019inscris"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
