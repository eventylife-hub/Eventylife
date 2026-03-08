'use client';

const obligations = [
  { icone: "\u{1F4CB}", titre: "Documents de voyage", desc: "Le voyageur est responsable de la validité de ses documents d'identité (passeport, carte d'identité) et de l'obtention des visas nécessaires avant le départ." },
  { icone: "\u{1F489}", titre: "Santé et vaccinations", desc: "Il appartient au voyageur de s'informer des conditions sanitaires de la destination et d'effectuer les vaccinations obligatoires ou recommandées." },
  { icone: "\u{1F6E1}\uFE0F", titre: "Assurance personnelle", desc: "Le voyageur doit vérifier sa couverture d'assurance personnelle et souscrire, si nécessaire, une assurance voyage complémentaire." },
  { icone: "\u23F0", titre: "Ponctualité", desc: "Le respect des horaires de rendez-vous, de départ et des activités programmées est essentiel au bon déroulement du voyage pour l'ensemble du groupe." },
  { icone: "\u{1F4DE}", titre: "Communication", desc: "Le voyageur doit signaler sans délai tout problème, incident ou besoin particulier à l'accompagnateur ou au service client Eventy Life." },
  { icone: "\u2764\uFE0F", titre: "Respect du groupe", desc: "Chaque voyageur s'engage à respecter les autres membres du groupe, les accompagnateurs, les prestataires locaux et les règles de vie commune." },
];

const interdictions = [
  "Comportement violent, menaçant ou discriminatoire envers les autres voyageurs ou le personnel",
  "Consommation excessive d'alcool ou usage de substances illicites",
  "Dégradation volontaire des équipements, hébergements ou moyens de transport",
  "Non-respect des consignes de sécurité données par l'accompagnateur ou les autorités locales",
  "Abandon du groupe sans prévenir l'accompagnateur référent",
  "Activités dangereuses non prévues au programme sans accord préalable",
];

const consequences = [
  { num: "1", titre: "Avertissement", desc: "Un rappel à l'ordre verbal est effectué par l'accompagnateur en cas de premier manquement mineur." },
  { num: "2", titre: "Mise en demeure", desc: "En cas de récidive ou de manquement grave, une mise en demeure écrite est adressée au voyageur." },
  { num: "3", titre: "Exclusion du voyage", desc: "L'exclusion immédiate peut être prononcée en cas de comportement mettant en danger le groupe. Les frais restent à la charge du voyageur." },
];

export default function ResponsabiliteVoyageurPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Cadre du voyage"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Responsabilité du voyageur"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Droits et obligations de chaque voyageur pour garantir un voyage agréable et sécurisé pour tous."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Vos obligations"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {obligations.map(o => (
            <div key={o.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{o.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{o.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{o.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', marginBottom: 50 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{"Comportements interdits"}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {interdictions.map(i => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ color: '#C75B39', fontSize: 16, flexShrink: 0 }}>{"✕"}</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{i}</div>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"En cas de manquement"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Les mesures graduelles appliquées"}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {consequences.map(c => (
            <div key={c.num} style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 }}>{c.num}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{c.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"Références légales"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"Articles L211-1 à L211-24 du Code du tourisme. Le voyageur est tenu de respecter les conditions générales de vente acceptées lors de la réservation. Tout dommage causé par le voyageur engage sa responsabilité civile personnelle conformément aux articles 1240 et 1241 du Code civil."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
