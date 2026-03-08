'use client';

const avantages = [
  { icon: "\u{1F381}", titre: "50\u20AC pour vous", desc: "Recevez 50\u20AC de r\u00e9duction sur votre prochain voyage pour chaque filleul qui r\u00e9serve.", couleur: "#C75B39" },
  { icon: "\u{1F389}", titre: "50\u20AC pour votre filleul", desc: "Votre filleul b\u00e9n\u00e9ficie \u00e9galement de 50\u20AC de r\u00e9duction sur sa premi\u00e8re r\u00e9servation.", couleur: "#D4A853" },
  { icon: "\u221E", titre: "Parrainages illimit\u00e9s", desc: "Aucune limite ! Plus vous parrainez, plus vous \u00e9conomisez sur vos voyages.", couleur: "#059669" },
  { icon: "\u{1F4B0}", titre: "Cumulable fid\u00e9lit\u00e9", desc: "Les avantages parrainage se cumulent avec votre niveau de fid\u00e9lit\u00e9 et les offres sp\u00e9ciales.", couleur: "#7C3AED" },
];

const chiffres = [
  { valeur: "50\u20AC", label: "Pour le parrain" },
  { valeur: "50\u20AC", label: "Pour le filleul" },
  { valeur: "\u221E", label: "Parrainages illimit\u00e9s" },
  { valeur: "2min", label: "Pour parrainer" },
];

const etapes = [
  { num: "1", titre: "Partagez votre lien", desc: "Connectez-vous \u00e0 votre espace et copiez votre lien de parrainage unique." },
  { num: "2", titre: "Votre ami s\u2019inscrit", desc: "Votre filleul s\u2019inscrit via votre lien et d\u00e9couvre nos voyages." },
  { num: "3", titre: "Il r\u00e9serve un voyage", desc: "D\u00e8s que votre filleul confirme sa premi\u00e8re r\u00e9servation, le parrainage est valid\u00e9." },
  { num: "4", titre: "Vous \u00eates r\u00e9compens\u00e9s", desc: "50\u20AC cr\u00e9dit\u00e9s automatiquement sur vos deux comptes. Utilisables imm\u00e9diatement." },
];

const temoignages = [
  { nom: "Marie L.", lieu: "Lyon", texte: "J\u2019ai parrain\u00e9 3 amies et on est toutes parties ensemble en Gr\u00e8ce. 150\u20AC d\u2019\u00e9conomies pour moi !", note: 5 },
  { nom: "Pierre D.", lieu: "Bordeaux", texte: "Syst\u00e8me simple et honn\u00eate. Mon fr\u00e8re a eu sa r\u00e9duc direct \u00e0 l\u2019inscription. Top.", note: 5 },
  { nom: "Sophie M.", lieu: "Toulouse", texte: "D\u00e9j\u00e0 5 parrainages valid\u00e9s ! Avec la fid\u00e9lit\u00e9, mes voyages me co\u00fbtent presque rien.", note: 5 },
];

const faq = [
  { q: "Comment fonctionne le parrainage ?", r: "Partagez votre lien unique avec vos proches. Quand ils r\u00e9servent leur premier voyage, vous recevez tous les deux 50\u20AC de r\u00e9duction." },
  { q: "Y a-t-il une limite de parrainages ?", r: "Non ! Vous pouvez parrainer autant de personnes que vous le souhaitez. Chaque parrainage valid\u00e9 g\u00e9n\u00e8re 50\u20AC de r\u00e9duction." },
  { q: "Quand puis-je utiliser ma r\u00e9duction ?", r: "La r\u00e9duction est cr\u00e9dit\u00e9e d\u00e8s que votre filleul confirme sa r\u00e9servation. Elle est utilisable imm\u00e9diatement sur votre prochain voyage." },
  { q: "Le parrainage est-il cumulable ?", r: "Oui ! Les r\u00e9ductions parrainage se cumulent avec le programme fid\u00e9lit\u00e9 et les offres sp\u00e9ciales en cours." },
];

export default function ParrainagePublicPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"R\u00e9compenses"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Parrainez vos proches"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Offrez 50\u20AC de r\u00e9duction \u00e0 vos amis et recevez 50\u20AC pour chaque filleul qui r\u00e9serve. Tout le monde y gagne !"}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
            {chiffres.map(c => (
              <div key={c.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#D4A853', fontSize: 32, fontWeight: 800 }}>{c.valeur}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Pourquoi parrainer ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Des avantages pour vous et vos proches"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', borderTop: `4px solid ${a.couleur}`, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Comment \u00e7a marche ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"4 \u00e9tapes simples pour parrainer"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #C75B39, #E8845A)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 14px' }}>{e.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Ils ont parrain\u00e9"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"T\u00e9moignages de nos parrains"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {temoignages.map(t => (
            <div key={t.nom} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ color: '#D4A853', fontSize: 18, marginBottom: 10 }}>{"★★★★★"}</div>
              <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', marginTop: 0, marginBottom: 12 }}>{`\u00AB ${t.texte} \u00BB`}</p>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 700 }}>{t.nom}</div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>{t.lieu}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions sur le parrainage"}</h3>
          {faq.map(f => (
            <div key={f.q} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ color: '#C75B39', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #C75B39 0%, #E8845A 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F381}"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Parrainez d\u00e8s maintenant"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"Connectez-vous et partagez votre lien unique. 50\u20AC pour vous, 50\u20AC pour vos proches."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#FFFFFF', color: '#C75B39', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Mon espace parrainage"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"En savoir plus"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
