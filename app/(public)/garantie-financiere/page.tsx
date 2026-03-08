'use client';

const infos = [
  { titre: "Qu'est-ce que la garantie financière ?", desc: "C'est une obligation légale pour tout opérateur de voyages immatriculé en France. Elle protège les fonds versés par les clients en cas de défaillance de l'agence. Cette garantie couvre le rapatriement et le remboursement des prestations non exécutées." },
  { titre: "Qui est notre garant ?", desc: "Eventy Life est garanti par l'APST (Association Professionnelle de Solidarité du Tourisme), le premier organisme de garantie du secteur touristique français. L'APST couvre plus de 3 800 professionnels du tourisme." },
  { titre: "Quel montant est couvert ?", desc: "La garantie couvre l'intégralité des fonds versés par les voyageurs pour leurs réservations. Il n'y a pas de plafond individuel : chaque euro versé est protégé, conformément aux dispositions du Code du tourisme." },
];

const protections = [
  { icone: "\u{1F6E1}", titre: "Remboursement garanti", desc: "Récupérez l'intégralité de vos paiements si un voyage est annulé par l'organisateur." },
  { icone: "\u2708\uFE0F", titre: "Rapatriement assuré", desc: "En cas de défaillance pendant votre séjour, votre retour est pris en charge." },
  { icone: "\u{1F4B0}", titre: "Fonds sécurisés", desc: "Vos paiements sont séparés des comptes de l'entreprise et protégés par l'APST." },
  { icone: "\u2705", titre: "Conformité totale", desc: "Eventy Life respecte toutes les obligations du Code du tourisme français." },
];

const etapes = [
  { num: "1", titre: "Constatation", desc: "En cas de défaillance de l'opérateur, l'APST est automatiquement saisie." },
  { num: "2", titre: "Instruction", desc: "L'APST vérifie les créances et contacte les voyageurs concernés." },
  { num: "3", titre: "Indemnisation", desc: "Les voyageurs sont remboursés ou rapatriés selon la situation." },
];

export default function GarantieFinancierePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Protection voyageur"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>
            {"Garantie financi\u00e8re"}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Vos fonds sont prot\u00e9g\u00e9s \u00e0 100 %. D\u00e9couvrez comment notre garantie financi\u00e8re vous assure une s\u00e9curit\u00e9 totale."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 50 }}>
          {protections.map(p => (
            <div key={p.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{p.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Comprendre la garantie"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {infos.map(i => (
            <div key={i.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{i.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{i.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Comment \u00e7a fonctionne ?"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Le processus d'indemnisation en cas de d\u00e9faillance"}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {etapes.map(e => (
            <div key={e.num} style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#FFFFFF', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', color: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 }}>{e.num}</div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{e.titre}</div>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"APST \u2014 Notre garant"}</div>
          <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{"Association Professionnelle de Solidarit\u00e9 du Tourisme"}</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
            {"15 avenue Carnot \u2014 75017 Paris | T\u00e9l : 01 44 09 25 35"}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>
            {"N\u00b0 d'immatriculation Atout France : IM075XXXXXX"}
          </p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{"R\u00e9f\u00e9rences l\u00e9gales"}</h3>
          <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {"Articles L211-18 et R211-26 \u00e0 R211-35 du Code du tourisme. La garantie financi\u00e8re est une obligation pr\u00e9vue par la loi pour tout op\u00e9rateur de voyages et de s\u00e9jours immatricul\u00e9 au registre d'Atout France. Elle assure aux voyageurs le remboursement des fonds vers\u00e9s et le rapatriement en cas de d\u00e9faillance de l'op\u00e9rateur."}
          </p>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Derni\u00e8re mise \u00e0 jour : 1er mars 2026 \u2014 Version 1.0"}
        </p>
      </div>
    </div>
  );
}
