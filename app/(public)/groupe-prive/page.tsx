'use client';

const avantages = [
  { icon: "\uD83C\uDFAF", titre: "Sur-mesure total", desc: "Destination, dur\u00e9e, activit\u00e9s, h\u00e9bergement : tout est personnalis\u00e9 selon vos envies et votre budget.", couleur: "#7C3AED" },
  { icon: "\uD83D\uDC65", titre: "Votre groupe, votre rythme", desc: "Pas de m\u00e9lange avec d\u2019autres groupes. Vous voyagez entre vous, \u00e0 votre rythme.", couleur: "#059669" },
  { icon: "\uD83D\uDCB0", titre: "Tarifs d\u00e9gressifs", desc: "Plus vous \u00eates nombreux, plus le prix par personne diminue. D\u00e8s 15 participants.", couleur: "#C75B39" },
  { icon: "\uD83D\uDE8C", titre: "Transport inclus", desc: "Bus priv\u00e9 depuis votre ville de d\u00e9part ou vol group\u00e9 avec accompagnement.", couleur: "#D4A853" },
  { icon: "\uD83C\uDF89", titre: "\u00c9v\u00e9nements int\u00e9gr\u00e9s", desc: "Anniversaire, team building, c\u00e9r\u00e9monie : nous organisons vos moments sp\u00e9ciaux sur place.", couleur: "#1A1A2E" },
  { icon: "\uD83D\uDEE1\uFE0F", titre: "Z\u00e9ro stress", desc: "Un interlocuteur d\u00e9di\u00e9 g\u00e8re tout de A \u00e0 Z. Vous n\u2019avez qu\u2019\u00e0 profiter.", couleur: "#7C3AED" },
];

const typesGroupes = [
  { icon: "\uD83C\uDFE2", titre: "Comit\u00e9s d\u2019entreprise", desc: "Voyages CE cl\u00e9 en main : devis rapide, facturation entreprise, conformit\u00e9 CSE." },
  { icon: "\uD83E\uDD1D", titre: "Associations", desc: "Tarifs associatifs, accompagnement administratif, programmes adapt\u00e9s aux adh\u00e9rents." },
  { icon: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66", titre: "Familles & amis", desc: "R\u00e9unions de famille, voyages entre amis, f\u00eates priv\u00e9es dans un cadre exceptionnel." },
  { icon: "\uD83C\uDF93", titre: "\u00c9tablissements scolaires", desc: "Voyages \u00e9ducatifs encadr\u00e9s, programmes p\u00e9dagogiques, s\u00e9curit\u00e9 renforc\u00e9e." },
];

const etapes = [
  { num: "1", titre: "Demande de devis", desc: "Remplissez notre formulaire en 2 minutes : dates, nombre de participants, destination souhait\u00e9e." },
  { num: "2", titre: "Proposition personnalis\u00e9e", desc: "En 48h, recevez un programme d\u00e9taill\u00e9 et un devis transparent, sans frais cach\u00e9s." },
  { num: "3", titre: "\u00c9changes & ajustements", desc: "Votre conseiller d\u00e9di\u00e9 affine le programme selon vos retours jusqu\u2019\u00e0 satisfaction." },
  { num: "4", titre: "Confirmation & d\u00e9part", desc: "Paiement s\u00e9curis\u00e9, carnet de voyage envoy\u00e9, et c\u2019est parti pour l\u2019aventure !" },
];

const chiffres = [
  { valeur: "500+", label: "Groupes accompagn\u00e9s" },
  { valeur: "15", label: "Participants minimum" },
  { valeur: "48h", label: "D\u00e9lai devis" },
  { valeur: "100%", label: "Personnalisable" },
];

export default function GroupePrivePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Voyages exclusifs"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Votre Voyage de Groupe Priv\u00e9"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
            {"CE, associations, familles, amis\u2026 Cr\u00e9ez le voyage qui vous ressemble, 100% sur-mesure."}
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
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Pourquoi choisir Eventy Life ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"6 raisons de nous confier votre voyage de groupe"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {avantages.map(a => (
            <div key={a.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', borderLeft: `4px solid ${a.couleur}` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{a.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Pour qui ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"Nous accompagnons tous types de groupes"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {typesGroupes.map(t => (
            <div key={t.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>{t.icon}</div>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{t.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{"Comment \u00e7a marche ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>{"4 \u00e9tapes simples vers votre voyage id\u00e9al"}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingBottom: 40 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: '#C75B39', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '0 auto 14px' }}>{e.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 30 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>{"Ils nous ont fait confiance"}</h3>
          {[
            { nom: "CE Airbus Toulouse", texte: "Voyage en Croatie pour 45 collaborateurs. Organisation impeccable, programme vari\u00e9, tout le monde est revenu enchant\u00e9.", avatar: "\uD83C\uDFE2" },
            { nom: "Association Les Joyeux Retraités", texte: "3\u00e8me voyage avec Eventy Life. La confiance est totale. Nos adh\u00e9rents redemandent chaque ann\u00e9e.", avatar: "\uD83E\uDD1D" },
            { nom: "Famille Durand — 25 personnes", texte: "R\u00e9union de famille inoubliable en Andalousie. M\u00eame les plus \u00e2g\u00e9s ont pu profiter gr\u00e2ce \u00e0 l\u2019accompagnement.", avatar: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66" },
          ].map(t => (
            <div key={t.nom} style={{ borderBottom: '1px solid #E8E4DE', paddingBottom: 16, marginBottom: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 36 }}>{t.avatar}</span>
              <div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', marginTop: 0, marginBottom: 6 }}>{`\u201C${t.texte}\u201D`}</p>
                <div style={{ color: '#C75B39', fontSize: 13, fontWeight: 700 }}>{t.nom}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'linear-gradient(135deg, #C75B39 0%, #E07B5B 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\uD83C\uDF1F"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"Pr\u00eat \u00e0 cr\u00e9er votre voyage sur-mesure ?"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>{"Devis gratuit en 48h. Aucun engagement."}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 32px', background: '#FFFFFF', color: '#C75B39', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Demander un devis"}</button>
              <button style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"01 23 45 67 89"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
