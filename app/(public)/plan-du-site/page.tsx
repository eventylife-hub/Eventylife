'use client';

const sections = [
  { titre: "D\u00e9couvrir", liens: [
    { nom: "Accueil", url: "/" },
    { nom: "Comment \u00e7a marche", url: "/comment-ca-marche" },
    { nom: "\u00c0 propos", url: "/a-propos" },
    { nom: "T\u00e9moignages", url: "/temoignages" },
    { nom: "Blog", url: "/blog" },
    { nom: "FAQ", url: "/faq" },
  ], couleur: "#059669" },
  { titre: "Voyages", liens: [
    { nom: "Tous les voyages", url: "/voyages" },
    { nom: "Destinations", url: "/destinations" },
    { nom: "Offres sp\u00e9ciales", url: "/offres-speciales" },
    { nom: "Voyage de groupe priv\u00e9", url: "/groupe-prive" },
    { nom: "Recherche", url: "/recherche" },
  ], couleur: "#D4A853" },
  { titre: "Services", liens: [
    { nom: "Accompagnement", url: "/accompagnement" },
    { nom: "Assurance voyage", url: "/assurance-voyage" },
    { nom: "Programme fid\u00e9lit\u00e9", url: "/programme-fidelite" },
    { nom: "Parrainage", url: "/parrainage-public" },
    { nom: "S\u00e9curit\u00e9", url: "/securite" },
  ], couleur: "#C75B39" },
  { titre: "Mon compte", liens: [
    { nom: "Connexion", url: "/connexion" },
    { nom: "Inscription", url: "/inscription" },
    { nom: "Tableau de bord", url: "/tableau-de-bord" },
    { nom: "Mes r\u00e9servations", url: "/mes-reservations" },
    { nom: "Mes paiements", url: "/mes-paiements" },
    { nom: "Profil", url: "/profil" },
    { nom: "Param\u00e8tres", url: "/parametres" },
    { nom: "Notifications", url: "/notifications" },
    { nom: "Favoris", url: "/favoris" },
    { nom: "Messages", url: "/messages" },
    { nom: "Avis", url: "/avis" },
    { nom: "Fid\u00e9lit\u00e9", url: "/fidelite" },
  ], couleur: "#7C3AED" },
  { titre: "Entreprise", liens: [
    { nom: "Presse", url: "/presse" },
    { nom: "Carri\u00e8res", url: "/carrieres" },
    { nom: "Devenir pro", url: "/devenir-pro" },
    { nom: "Engagement \u00e9co", url: "/engagement-eco" },
    { nom: "Contact", url: "/contact" },
  ], couleur: "#0D9488" },
  { titre: "L\u00e9gal", liens: [
    { nom: "Mentions l\u00e9gales", url: "/mentions-legales" },
    { nom: "CGV", url: "/cgv" },
    { nom: "Politique de confidentialit\u00e9", url: "/politique-confidentialite" },
    { nom: "Cookies", url: "/cookies" },
    { nom: "Accessibilit\u00e9", url: "/accessibilite" },
  ], couleur: "#6B7280" },
];

export default function PlanDuSitePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Navigation"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Plan du site"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Retrouvez l\u2019ensemble des pages d\u2019Eventy Life organis\u00e9es par cat\u00e9gorie."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {sections.map(s => (
            <div key={s.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', borderTop: `4px solid ${s.couleur}` }}>
              <h2 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{s.titre}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {s.liens.map(l => (
                  <a key={l.nom} href={l.url} style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: s.couleur, fontSize: 10 }}>{"\u25CF"}</span>
                    {l.nom}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
