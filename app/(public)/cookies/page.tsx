'use client';

const categories = [
  { nom: "Cookies essentiels", desc: "N\u00e9cessaires au fonctionnement du site. Ils permettent la navigation, l\u2019authentification et la s\u00e9curit\u00e9. Ces cookies ne peuvent pas \u00eatre d\u00e9sactiv\u00e9s.", obligatoire: true, exemples: "Session utilisateur, jeton CSRF, pr\u00e9f\u00e9rences cookies", couleur: "#059669" },
  { nom: "Cookies analytiques", desc: "Nous aident \u00e0 comprendre comment les visiteurs utilisent le site gr\u00e2ce \u00e0 des statistiques anonymes. Aucune donn\u00e9e personnelle n\u2019est collect\u00e9e.", obligatoire: false, exemples: "Google Analytics (anonymis\u00e9), Plausible, compteurs de pages vues", couleur: "#D4A853" },
  { nom: "Cookies fonctionnels", desc: "Permettent de m\u00e9moriser vos choix (langue, r\u00e9gion, devise) pour personnaliser votre exp\u00e9rience sur la plateforme.", obligatoire: false, exemples: "Langue pr\u00e9f\u00e9r\u00e9e, devise, derni\u00e8re recherche, filtres sauvegard\u00e9s", couleur: "#7C3AED" },
  { nom: "Cookies marketing", desc: "Utilis\u00e9s pour afficher des publicit\u00e9s pertinentes et mesurer l\u2019efficacit\u00e9 de nos campagnes. Partag\u00e9s avec nos partenaires publicitaires.", obligatoire: false, exemples: "Meta Pixel, Google Ads, partenaires affiliation", couleur: "#C75B39" },
];

const droits = [
  { titre: "Accepter ou refuser", desc: "Lors de votre premi\u00e8re visite, un bandeau vous permet de choisir quels cookies accepter." },
  { titre: "Modifier vos choix", desc: "Vous pouvez \u00e0 tout moment modifier vos pr\u00e9f\u00e9rences depuis le lien \u00ab G\u00e9rer les cookies \u00bb en bas de page." },
  { titre: "Supprimer les cookies", desc: "Vous pouvez supprimer les cookies stock\u00e9s via les param\u00e8tres de votre navigateur." },
  { titre: "Naviguer sans cookies", desc: "La plupart des navigateurs permettent de bloquer tous les cookies. Certaines fonctionnalit\u00e9s du site pourraient ne plus fonctionner." },
];

export default function CookiesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Confidentialit\u00e9"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Politique de cookies"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Eventy Life utilise des cookies pour am\u00e9liorer votre exp\u00e9rience. D\u00e9couvrez comment nous les utilisons et g\u00e9rez vos pr\u00e9f\u00e9rences."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 60px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 24 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Qu\u2019est-ce qu\u2019un cookie ?"}</h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {"Un cookie est un petit fichier texte d\u00e9pos\u00e9 sur votre appareil (ordinateur, tablette, smartphone) lorsque vous visitez un site web. Il permet au site de m\u00e9moriser des informations sur votre visite, comme votre langue pr\u00e9f\u00e9r\u00e9e ou votre session de connexion, afin de faciliter votre prochaine visite et rendre le site plus utile pour vous."}
          </p>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 32 }}>{"Types de cookies utilis\u00e9s"}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {categories.map(c => (
            <div key={c.nom} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', borderLeft: `4px solid ${c.couleur}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <span style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700 }}>{c.nom}</span>
                <span style={{ background: c.obligatoire ? '#ECFDF5' : '#FEF3C7', color: c.obligatoire ? '#059669' : '#D97706', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>{c.obligatoire ? "Obligatoire" : "Optionnel"}</span>
              </div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: '0 0 10px' }}>{c.desc}</p>
              <div style={{ color: '#9CA3AF', fontSize: 12 }}>{"Exemples : "}{c.exemples}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{"Vos droits"}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          {droits.map(d => (
            <div key={d.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 28px', marginBottom: 24 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Dur\u00e9e de conservation"}</h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {"Les cookies essentiels sont conserv\u00e9s pendant la dur\u00e9e de votre session. Les cookies analytiques et fonctionnels sont conserv\u00e9s 13 mois maximum, conform\u00e9ment aux recommandations de la CNIL. Les cookies marketing sont conserv\u00e9s 6 mois maximum. Vous pouvez \u00e0 tout moment supprimer l\u2019ensemble des cookies via les param\u00e8tres de votre navigateur."}
          </p>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', borderRadius: 16, padding: '40px 30px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F36A}"}</div>
            <h3 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{"G\u00e9rer vos pr\u00e9f\u00e9rences"}</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 20 }}>
              {"Modifiez vos choix de cookies \u00e0 tout moment."}
            </p>
            <button style={{ padding: '14px 32px', background: '#D4A853', color: '#1A1A2E', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{"Param\u00e9trer les cookies"}</button>
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Conform\u00e9ment au RGPD et aux directives de la CNIL."}
        </p>
      </div>
    </div>
  );
}
