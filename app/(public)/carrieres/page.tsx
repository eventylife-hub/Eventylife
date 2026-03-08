'use client';

const valeurs = [
  { icon: "\u{1F30D}", titre: "Passion du voyage", desc: "Nous vivons ce que nous vendons. Chaque membre de l\u2019\u00e9quipe est un voyageur passionn\u00e9 qui comprend les attentes de nos clients.", couleur: "#059669" },
  { icon: "\u2764\uFE0F", titre: "Bienveillance", desc: "Le client doit se sentir aim\u00e9. Cette philosophie guide chacune de nos actions, de la r\u00e9servation au retour.", couleur: "#C75B39" },
  { icon: "\u{1F91D}", titre: "Esprit d\u2019\u00e9quipe", desc: "Nous croyons en la force du collectif. Chaque succ\u00e8s est partag\u00e9, chaque d\u00e9fi relev\u00e9 ensemble.", couleur: "#D4A853" },
  { icon: "\u{1F680}", titre: "Innovation", desc: "Nous r\u00e9inventons le voyage de groupe avec la technologie, tout en gardant l\u2019humain au c\u0153ur de l\u2019exp\u00e9rience.", couleur: "#7C3AED" },
];

const avantages = [
  { icon: "\u{1F3E0}", titre: "T\u00e9l\u00e9travail flexible", desc: "Travaillez d\u2019o\u00f9 vous voulez, avec des retrouvailles r\u00e9guli\u00e8res en \u00e9quipe." },
  { icon: "\u2708\uFE0F", titre: "Voyages offerts", desc: "D\u00e9couvrez nos destinations gratuitement pour mieux les recommander." },
  { icon: "\u{1F4DA}", titre: "Formation continue", desc: "Budget formation individuel et acc\u00e8s \u00e0 des conf\u00e9rences du secteur." },
  { icon: "\u{1F3AF}", titre: "Impact r\u00e9el", desc: "Rejoignez une startup en pleine croissance o\u00f9 chaque contribution compte." },
  { icon: "\u{1F4B0}", titre: "R\u00e9mun\u00e9ration attractive", desc: "Salaire comp\u00e9titif + int\u00e9ressement + avantages voyage exclusifs." },
  { icon: "\u{1F331}", titre: "\u00c9co-engagement", desc: "Participez \u00e0 un tourisme responsable et \u00e0 impact positif." },
];

const postes = [
  { titre: "D\u00e9veloppeur Full-Stack", equipe: "Tech", lieu: "Remote / Paris", type: "CDI", desc: "Rejoignez l\u2019\u00e9quipe tech pour construire la plateforme de voyage de demain avec Next.js et NestJS." },
  { titre: "Responsable Partenariats", equipe: "Commercial", lieu: "Paris / Lyon", type: "CDI", desc: "D\u00e9veloppez notre r\u00e9seau de partenaires h\u00f4teliers, transporteurs et prestataires locaux." },
  { titre: "Accompagnateur Voyages", equipe: "Op\u00e9rations", lieu: "France + Destinations", type: "CDD saisonnier", desc: "Accompagnez nos groupes de voyageurs et assurez une exp\u00e9rience m\u00e9morable porte-\u00e0-porte." },
  { titre: "Community Manager", equipe: "Marketing", lieu: "Remote", type: "CDI", desc: "Animez notre communaut\u00e9 de voyageurs sur les r\u00e9seaux sociaux et cr\u00e9ez du contenu inspirant." },
];

const processus = [
  { num: "1", titre: "Candidature", desc: "Envoyez votre CV et une lettre de motivation expliquant pourquoi le voyage de groupe vous passionne." },
  { num: "2", titre: "Entretien d\u00e9couverte", desc: "30 minutes pour faire connaissance, comprendre vos motivations et vous pr\u00e9senter Eventy Life." },
  { num: "3", titre: "Cas pratique", desc: "Un exercice concret li\u00e9 au poste pour \u00e9valuer vos comp\u00e9tences et votre cr\u00e9ativit\u00e9." },
  { num: "4", titre: "Bienvenue !", desc: "Int\u00e9gration personnalis\u00e9e avec un voyage d\u2019\u00e9quipe pour d\u00e9couvrir nos destinations." },
];

const faq = [
  { q: "Peut-on postuler sans exp\u00e9rience dans le tourisme ?", r: "Absolument ! Nous valorisons la passion du voyage et les comp\u00e9tences transf\u00e9rables. La formation est assur\u00e9e en interne." },
  { q: "Comment se passe le t\u00e9l\u00e9travail ?", r: "Nous utilisons des outils collaboratifs modernes. Des retrouvailles en \u00e9quipe sont organis\u00e9es r\u00e9guli\u00e8rement, souvent dans nos destinations." },
  { q: "Y a-t-il des opportunit\u00e9s de stage ?", r: "Oui, nous accueillons des stagiaires et alternants dans tous les d\u00e9partements. Contactez-nous avec votre projet." },
  { q: "Quel est le processus pour les candidatures spontan\u00e9es ?", r: "Envoyez votre CV \u00e0 carrieres@eventylife.fr en pr\u00e9cisant le domaine qui vous int\u00e9resse. Nous r\u00e9pondons sous 5 jours." },
];

export default function CarrieresPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Carri\u00e8res"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Rejoignez l\u2019aventure"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"Eventy Life r\u00e9invente le voyage de groupe. Nous cherchons des talents passionn\u00e9s pour construire ensemble le tourisme de demain."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
            {[{ v: "4", l: "Postes ouverts" }, { v: "100%", l: "T\u00e9l\u00e9travail possible" }, { v: "1", l: "Voyage offert/an" }, { v: "\u221E", l: "Passion requise" }].map(c => (
              <div key={c.l} style={{ textAlign: 'center' }}>
                <div style={{ color: '#D4A853', fontSize: 32, fontWeight: 800 }}>{c.v}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Nos valeurs"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Ce qui nous anime au quotidien"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {valeurs.map(v => (
            <div key={v.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', borderLeft: `4px solid ${v.couleur}` }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{v.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{v.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Pourquoi nous rejoindre ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Des avantages qui font la diff\u00e9rence"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Nos offres d\u2019emploi"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Trouvez le poste qui vous correspond"}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          {postes.map(p => (
            <div key={p.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700 }}>{p.titre}</div>
                  <div style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>{`${p.equipe} \u00b7 ${p.lieu}`}</div>
                </div>
                <span style={{ background: '#EBF5FF', color: '#1A1A2E', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20 }}>{p.type}</span>
              </div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Notre processus"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"4 \u00e9tapes pour rejoindre l\u2019\u00e9quipe"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {processus.map(e => (
            <div key={e.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 14px' }}>{e.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Questions fr\u00e9quentes"}</h3>
          {faq.map(f => (
            <div key={f.q} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.q}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.r}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F680}"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Pr\u00eat \u00e0 embarquer ?"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"Envoyez votre candidature et rejoignez une \u00e9quipe passionn\u00e9e qui r\u00e9invente le voyage de groupe."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Postuler maintenant"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Candidature spontan\u00e9e"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
