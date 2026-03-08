'use client';

const conseils = [
  { icone: "\u{1F4CB}", titre: "Préparez vos documents", desc: "Vérifiez la validité de votre carte d'identité ou passeport au moins 3 mois avant le départ. Faites des copies numériques de tous vos documents.", couleur: "#059669" },
  { icone: "\u{1F9F3}", titre: "Faites votre valise intelligemment", desc: "Préparez une liste et commencez 3 jours avant. Privilégiez les vêtements polyvalents et n'oubliez pas vos médicaments habituels.", couleur: "#D4A853" },
  { icone: "\u{1F4B3}", titre: "Gérez votre budget", desc: "Prévoyez un budget quotidien pour les dépenses personnelles. Informez votre banque de votre voyage pour éviter le blocage de votre carte.", couleur: "#7C3AED" },
  { icone: "\u{1F4F1}", titre: "Restez connecté", desc: "Téléchargez l'application Eventy avant le départ. Enregistrez les numéros d'urgence et le contact de votre accompagnateur.", couleur: "#C75B39" },
  { icone: "\u{1F3E5}", titre: "Pensez à votre santé", desc: "Consultez votre médecin si nécessaire. Vérifiez vos vaccinations et emportez une trousse de premiers soins basique.", couleur: "#1A1A2E" },
  { icone: "\u2708\uFE0F", titre: "Le jour du départ", desc: "Arrivez au point de rendez-vous 15 minutes en avance. Votre accompagnateur vous accueillera et gérera toute la logistique.", couleur: "#059669" },
];

const inclus = [
  { icone: "\u{1F68C}", titre: "Transport", desc: "Bus climatisé ou vol selon la destination. Transferts aéroport-hôtel inclus." },
  { icone: "\u{1F3E8}", titre: "Hébergement", desc: "Hôtels sélectionnés et vérifiés. Petit-déjeuner inclus dans tous nos voyages." },
  { icone: "\u{1F464}", titre: "Accompagnement", desc: "Un accompagnateur professionnel du départ au retour, disponible 24h/24." },
  { icone: "\u{1F6E1}\uFE0F", titre: "Assurance", desc: "Assurance voyage complète incluse : annulation, rapatriement, bagages." },
];

const faq = [
  { q: "Dois-je m'occuper de l'organisation ?", r: "Non ! Eventy gère tout pour vous : transport, hébergement, activités et logistique. Vous n'avez qu'à profiter." },
  { q: "Puis-je voyager seul(e) dans un groupe ?", r: "Absolument ! La majorité de nos voyageurs partent seuls et font de belles rencontres. L'accompagnateur facilite les échanges." },
  { q: "Que se passe-t-il en cas de problème ?", r: "Votre accompagnateur est formé pour gérer tous les imprévus. De plus, notre équipe support est joignable 24h/24." },
  { q: "Les repas sont-ils inclus ?", r: "Le petit-déjeuner est toujours inclus. Pour les autres repas, cela dépend de la formule choisie. Consultez le détail de chaque voyage." },
];

export default function GuidePremierVoyagePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Nouveau voyageur"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Guide du premier voyage"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Tout ce que vous devez savoir pour préparer et profiter pleinement de votre premier voyage avec Eventy."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>{"Nos conseils pour bien préparer votre voyage"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {conseils.map((c, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start', borderLeft: `4px solid ${c.couleur}` }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{c.icone}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Ce qui est inclus dans votre voyage"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {inclus.map(item => (
            <div key={item.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{item.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>{"Questions fréquentes"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {faq.map((f, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px' }}>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.q}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.r}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Prêt pour l'aventure ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Découvrez nos prochains départs et réservez votre place dès maintenant."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"Voir les voyages"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
