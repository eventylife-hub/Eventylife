'use client';

const engagements = [
  { icon: "\u267F", titre: "Mobilit\u00e9 r\u00e9duite", desc: "H\u00e9bergements et transports adapt\u00e9s PMR, assistance personnalis\u00e9e pour les d\u00e9placements, fauteuils roulants disponibles.", couleur: "#7C3AED" },
  { icon: "\uD83D\uDC42", titre: "Difficult\u00e9s auditives", desc: "Accompagnateurs form\u00e9s, supports visuels pour les informations cl\u00e9s, boucles magn\u00e9tiques dans les bus.", couleur: "#059669" },
  { icon: "\uD83D\uDC41\uFE0F", titre: "D\u00e9ficience visuelle", desc: "Descriptions orales d\u00e9taill\u00e9es des sites visit\u00e9s, documents en gros caract\u00e8res, accompagnement rapproch\u00e9.", couleur: "#C75B39" },
  { icon: "\uD83E\uDDE0", titre: "Besoins cognitifs", desc: "Rythme adapt\u00e9, consignes claires et simples, patience et bienveillance de nos \u00e9quipes \u00e0 chaque instant.", couleur: "#D4A853" },
  { icon: "\uD83C\uDF7D\uFE0F", titre: "R\u00e9gimes alimentaires", desc: "Repas adapt\u00e9s sur demande : sans gluten, v\u00e9g\u00e9tarien, halal, casher, allergies sp\u00e9cifiques.", couleur: "#1A1A2E" },
  { icon: "\uD83D\uDC9A", titre: "Suivi m\u00e9dical", desc: "Gestion des traitements m\u00e9dicaux, proximit\u00e9 avec les structures de sant\u00e9, accompagnateur form\u00e9 PSC1.", couleur: "#059669" },
];

const chiffres = [
  { valeur: "100%", label: "Des h\u00e9bergements accessibles PMR" },
  { valeur: "30", label: "Personnes max par groupe" },
  { valeur: "24/7", label: "Assistance disponible" },
  { valeur: "5\u2B50", label: "Note accessibilit\u00e9 moyenne" },
];

const processus = [
  { num: "1", titre: "Questionnaire d\u00e9taill\u00e9", desc: "Avant le voyage, nous recueillons vos besoins sp\u00e9cifiques via un questionnaire personnalis\u00e9." },
  { num: "2", titre: "Adaptation du programme", desc: "Nous ajustons l\u2019itin\u00e9raire, les h\u00e9bergements et les activit\u00e9s selon vos besoins." },
  { num: "3", titre: "Briefing accompagnateur", desc: "Votre accompagnateur re\u00e7oit un dossier complet sur vos besoins avant le d\u00e9part." },
  { num: "4", titre: "Suivi continu", desc: "Pendant le voyage, nous restons attentifs et adaptons le programme en temps r\u00e9el." },
];

export default function AccessibilitePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Voyager pour tous"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Accessibilit\u00e9 & Inclusion"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Chaque personne m\u00e9rite de voyager. Nous adaptons chaque voyage \u00e0 vos besoins sp\u00e9cifiques."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {chiffres.map(c => (
              <div key={c.label}>
                <div style={{ color: '#D4A853', fontSize: 36, fontWeight: 800 }}>{c.valeur}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, maxWidth: 120 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '50px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Nos engagements"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Un voyage adapt\u00e9 \u00e0 chaque besoin"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {engagements.map(e => (
            <div key={e.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', borderLeft: `4px solid ${e.couleur}` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{e.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Notre processus d\u2019adaptation"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"4 \u00e9tapes pour un voyage parfaitement adapt\u00e9"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {processus.map(p => (
            <div key={p.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: '#7C3AED', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 14px' }}>{p.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{p.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>{"T\u00e9moignages accessibilit\u00e9"}</h3>
          {[
            { nom: "Robert, 74 ans", texte: "En fauteuil roulant depuis 10 ans, je pensais ne plus jamais voyager. Eventy Life m’a prouvé le contraire. Tout était adapté, du bus à l’hôtel.", avatar: "👨‍🦽" },
            { nom: "Claudine, 69 ans", texte: "Mon mari a des difficultés cognitives. L’accompagnateur a été d’une patience incroyable. Nous avons passé un séjour magnifique.", avatar: "👩‍🦳" },
            { nom: "Jean-Louis, 71 ans", texte: "Malgré mon diabète, les repas étaient parfaitement adaptés. L’équipe avait anticipé tous mes besoins.", avatar: "👴" },
          ].map(t => (
            <div key={t.nom} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 36 }}>{t.avatar}</span>
              <div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', marginTop: 0, marginBottom: 6 }}>{`“${t.texte}”`}</p>
                <div style={{ color: '#C75B39', fontSize: 13, fontWeight: 700 }}>{t.nom}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9F67FF 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"♿"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Un voyage adapté à vos besoins ?"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"Contactez-nous pour discuter de vos besoins spécifiques. Nous trouverons la solution."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#FFFFFF', color: '#7C3AED', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Nous contacter"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"01 23 45 67 89"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
