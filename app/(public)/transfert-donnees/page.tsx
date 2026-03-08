'use client';

const droits = [
  { icone: "\u{1F4CB}", titre: "Droit d\u2019acc\u00e8s", desc: "Vous pouvez demander une copie compl\u00e8te de toutes les donn\u00e9es personnelles que nous d\u00e9tenons \u00e0 votre sujet, dans un format lisible." },
  { icone: "\u{1F504}", titre: "Droit de portabilit\u00e9", desc: "Vos donn\u00e9es vous sont transmises dans un format structur\u00e9, couramment utilis\u00e9 et lisible par machine (JSON ou CSV)." },
  { icone: "\u270F\uFE0F", titre: "Droit de rectification", desc: "Vous pouvez demander la correction de toute donn\u00e9e personnelle inexacte ou incompl\u00e8te vous concernant." },
  { icone: "\u{1F5D1}\uFE0F", titre: "Droit \u00e0 l\u2019effacement", desc: "Vous pouvez demander la suppression de vos donn\u00e9es personnelles, sous r\u00e9serve des obligations l\u00e9gales de conservation." },
];

const categories = [
  { nom: "Identit\u00e9", details: "Nom, pr\u00e9nom, date de naissance, nationalit\u00e9", format: "JSON / CSV", delai: "48h" },
  { nom: "Contact", details: "Email, t\u00e9l\u00e9phone, adresse postale", format: "JSON / CSV", delai: "48h" },
  { nom: "R\u00e9servations", details: "Historique des voyages, pr\u00e9f\u00e9rences, accompagnants", format: "JSON", delai: "5 jours" },
  { nom: "Paiements", details: "Historique des transactions (montants, dates, moyens)", format: "CSV", delai: "5 jours" },
  { nom: "Communications", details: "Messages \u00e9chang\u00e9s avec le support, pr\u00e9f\u00e9rences newsletter", format: "JSON", delai: "5 jours" },
  { nom: "Technique", details: "Logs de connexion, adresses IP, cookies", format: "JSON", delai: "10 jours" },
];

const etapes = [
  { num: "1", titre: "Demande", desc: "Envoyez votre demande par email \u00e0 dpo@eventylife.fr ou depuis votre espace client, rubrique \u00ab Mes donn\u00e9es \u00bb.", couleur: "#059669" },
  { num: "2", titre: "V\u00e9rification", desc: "Nous v\u00e9rifions votre identit\u00e9 sous 48h pour prot\u00e9ger vos donn\u00e9es contre tout acc\u00e8s non autoris\u00e9.", couleur: "#D4A853" },
  { num: "3", titre: "Traitement", desc: "Vos donn\u00e9es sont extraites et pr\u00e9par\u00e9es dans le format demand\u00e9 sous 10 jours ouvr\u00e9s maximum.", couleur: "#7C3AED" },
  { num: "4", titre: "Livraison", desc: "Vous recevez un lien s\u00e9curis\u00e9 de t\u00e9l\u00e9chargement valable 7 jours, via email chiffr\u00e9.", couleur: "#C75B39" },
];

export default function TransfertDonneesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"RGPD"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Transfert de donn\u00e9es"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Exercez vos droits RGPD : acc\u00e8s, portabilit\u00e9, rectification et effacement de vos donn\u00e9es personnelles."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Vos droits"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {droits.map(d => (
            <div key={d.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{d.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{"Donn\u00e9es concern\u00e9es"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>{"Cat\u00e9gories de donn\u00e9es personnelles que nous collectons et leurs formats d\u2019export."}</p>
        <div style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 50 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', padding: '14px 20px', background: '#1A1A2E' }}>
            {["Cat\u00e9gorie", "D\u00e9tails", "Format", "D\u00e9lai"].map(h => (
              <div key={h} style={{ color: '#D4A853', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</div>
            ))}
          </div>
          {categories.map((c, i) => (
            <div key={c.nom} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', padding: '14px 20px', borderBottom: i < categories.length - 1 ? '1px solid #F3F0EB' : 'none' }}>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 600 }}>{c.nom}</div>
              <div style={{ color: '#6B7280', fontSize: 13 }}>{c.details}</div>
              <div style={{ color: '#6B7280', fontSize: 13 }}>{c.format}</div>
              <div style={{ color: '#059669', fontSize: 13, fontWeight: 600 }}>{c.delai}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>{"Proc\u00e9dure de demande"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 50 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center', borderTop: `4px solid ${e.couleur}` }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: e.couleur, color: '#FFFFFF', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{e.num}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{e.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', marginBottom: 40 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Contact DPO"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {"Pour toute question relative \u00e0 vos donn\u00e9es personnelles ou pour exercer vos droits, contactez notre D\u00e9l\u00e9gu\u00e9 \u00e0 la Protection des Donn\u00e9es \u00e0 l\u2019adresse dpo@eventylife.fr. Nous nous engageons \u00e0 r\u00e9pondre sous 30 jours conform\u00e9ment au RGPD. En cas de litige, vous pouvez saisir la CNIL (www.cnil.fr)."}
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"S\u00e9curit\u00e9 des transferts"}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              "Tous les fichiers export\u00e9s sont chiffr\u00e9s en AES-256 avant transmission.",
              "Les liens de t\u00e9l\u00e9chargement sont \u00e0 usage unique et expirent apr\u00e8s 7 jours.",
              "Une v\u00e9rification d\u2019identit\u00e9 par double authentification est requise avant tout transfert.",
              "Aucune donn\u00e9e n\u2019est transf\u00e9r\u00e9e en dehors de l\u2019Espace \u00c9conomique Europ\u00e9en sans garanties ad\u00e9quates.",
            ].map((texte, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A853', marginTop: 7, flexShrink: 0 }} />
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{texte}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
