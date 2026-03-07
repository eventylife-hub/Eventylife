'use client';
import { useState } from 'react';

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [voyageurs, setVoyageurs] = useState(1);
  const [assurance, setAssurance] = useState(false);

  const voyage = {
    titre: "Santorin, Gr\u00e8ce",
    date: "15 - 22 avril 2026",
    duree: "7 jours / 6 nuits",
    prix: 1299,
    image: "\uD83C\uDDEC\uD83C\uDDF7",
    places: 7,
    depart: "Paris Gare de Lyon",
    accompagnateur: "Sophie M.",
  };

  const total = voyage.prix * voyageurs + (assurance ? 49 * voyageurs : 0);

  const steps = [
    { num: 1, label: "Voyageurs" },
    { num: 2, label: "Options" },
    { num: 3, label: "Paiement" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <a href="/" style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic', textDecoration: 'none' }}>Eventy Life</a>
        <a href="/voyages" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          {"\u2190 Retour aux voyages"}
        </a>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
          {`R\u00e9servation : ${voyage.titre}`}
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: step >= s.num ? '#D4A853' : 'rgba(255,255,255,0.15)', color: step >= s.num ? '#1A1A2E' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                  {step > s.num ? "\u2713" : s.num}
                </div>
                <span style={{ color: step >= s.num ? '#FFFFFF' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500 }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 60, height: 2, background: step > s.num ? '#D4A853' : 'rgba(255,255,255,0.15)', margin: '0 12px' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div>
            {step === 1 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px' }}>
                <h2 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
                  {"Nombre de voyageurs"}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <button onClick={() => setVoyageurs(Math.max(1, voyageurs - 1))} style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #E8E4DE', background: '#FFFFFF', color: '#1A1A2E', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                  <span style={{ color: '#1A1A2E', fontSize: 32, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{voyageurs}</span>
                  <button onClick={() => setVoyageurs(Math.min(voyage.places, voyageurs + 1))} style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #D4A853', background: '#D4A853', color: '#1A1A2E', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
                  {`${voyage.places} places restantes sur ce voyage`}
                </p>
                <div style={{ marginTop: 24, padding: '16px 20px', background: '#FAF7F2', borderRadius: 10 }}>
                  <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    {"Informations voyageur principal"}
                  </div>
                  {[
                    { label: "Pr\u00e9nom", placeholder: "Votre pr\u00e9nom" },
                    { label: "Nom", placeholder: "Votre nom" },
                    { label: "Email", placeholder: "votre@email.com" },
                    { label: "T\u00e9l\u00e9phone", placeholder: "06 12 34 56 78" },
                  ].map((f, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <label style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>{f.label}</label>
                      <input type="text" placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} style={{ marginTop: 20, width: '100%', padding: '14px', background: '#C75B39', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {"Continuer \u2192"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px' }}>
                <h2 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
                  {"Options & assurance"}
                </h2>
                <div onClick={() => setAssurance(!assurance)} style={{ display: 'flex', gap: 16, padding: '20px', border: assurance ? '2px solid #D4A853' : '2px solid #E8E4DE', borderRadius: 12, cursor: 'pointer', marginBottom: 16, background: assurance ? '#FAF7F2' : '#FFFFFF' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, border: assurance ? '2px solid #D4A853' : '2px solid #D1D5DB', background: assurance ? '#D4A853' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 14, flexShrink: 0, marginTop: 2 }}>
                    {assurance ? "\u2713" : ""}
                  </div>
                  <div>
                    <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                      {"Assurance annulation"}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>
                      {"Remboursement int\u00e9gral en cas d\u2019annulation jusqu\u2019\u00e0 48h avant le d\u00e9part. Couvre maladie, accident et emp\u00eachement professionnel."}
                    </div>
                    <div style={{ color: '#C75B39', fontSize: 16, fontWeight: 700 }}>{"49\u20ac / pers."}</div>
                  </div>
                </div>
                <div style={{ padding: '20px', border: '2px solid #E8E4DE', borderRadius: 12, opacity: 0.6 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, border: '2px solid #D1D5DB', background: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 14, flexShrink: 0, marginTop: 2 }}>{"\u2713"}</div>
                    <div>
                      <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{"Accompagnement porte-\u00e0-porte"}</div>
                      <div style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5 }}>{"Un accompagnateur d\u00e9di\u00e9 vous guide de votre domicile au lieu de s\u00e9jour et retour."}</div>
                      <div style={{ color: '#059669', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{"Inclus"}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', background: '#FFFFFF', color: '#6B7280', border: '1px solid #E8E4DE', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {"\u2190 Retour"}
                  </button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: '14px', background: '#C75B39', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                    {"Continuer \u2192"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px' }}>
                <h2 style={{ color: '#1A1A2E', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
                  Paiement
                </h2>
                <div style={{ padding: '16px 20px', background: '#FAF7F2', borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>{"Mode de paiement"}</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, padding: '14px', border: '2px solid #D4A853', borderRadius: 10, textAlign: 'center', background: '#FFFFFF', cursor: 'pointer' }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{"\uD83D\uDCB3"}</div>
                      <div style={{ color: '#1A1A2E', fontSize: 13, fontWeight: 600 }}>{"Carte bancaire"}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px', border: '2px solid #E8E4DE', borderRadius: 10, textAlign: 'center', background: '#FFFFFF', cursor: 'pointer' }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{"\uD83D\uDD04"}</div>
                      <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 600 }}>{"3x sans frais"}</div>
                    </div>
                  </div>
                </div>
                {[
                  { label: "Num\u00e9ro de carte", placeholder: "1234 5678 9012 3456" },
                  { label: "Date d\u2019expiration", placeholder: "MM/AA" },
                  { label: "CVV", placeholder: "123" },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <label style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input type="text" placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ padding: '12px 16px', background: '#F0FDF4', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 14 }}>{"\uD83D\uDD12"}</span>
                  <span style={{ color: '#059669', fontSize: 12 }}>{"Paiement s\u00e9curis\u00e9 par Stripe. Vos donn\u00e9es sont chiffr\u00e9es."}</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', background: '#FFFFFF', color: '#6B7280', border: '1px solid #E8E4DE', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    {"\u2190 Retour"}
                  </button>
                  <button style={{ flex: 2, padding: '14px', background: '#C75B39', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                    {`Payer ${total}\u20ac`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', position: 'sticky', top: 20 }}>
              <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 12 }}>{voyage.image}</div>
              <h3 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>{voyage.titre}</h3>
              <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 16 }}>{voyage.date}</div>
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: "\uD83D\uDCC5", text: voyage.duree },
                  { icon: "\uD83D\uDE8C", text: voyage.depart },
                  { icon: "\uD83D\uDC64", text: `Accompagnateur : ${voyage.accompagnateur}` },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{d.icon}</span>
                    <span style={{ color: '#6B7280', fontSize: 13 }}>{d.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #F3F4F6', marginTop: 16, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#6B7280', fontSize: 13 }}>{`${voyage.prix}\u20ac \u00d7 ${voyageurs} voyageur${voyageurs > 1 ? 's' : ''}`}</span>
                  <span style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 600 }}>{`${voyage.prix * voyageurs}\u20ac`}</span>
                </div>
                {assurance && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#6B7280', fontSize: 13 }}>{`Assurance \u00d7 ${voyageurs}`}</span>
                    <span style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 600 }}>{`${49 * voyageurs}\u20ac`}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #1A1A2E', paddingTop: 12, marginTop: 8 }}>
                  <span style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700 }}>Total</span>
                  <span style={{ color: '#C75B39', fontSize: 22, fontWeight: 700 }}>{`${total}\u20ac`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
