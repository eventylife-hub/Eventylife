'use client';
import { useState } from 'react';

export default function ParametresPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [rappels, setRappels] = useState(true);
  const [promos, setPromos] = useState(true);
  const [langue, setLangue] = useState('fr');
  const [devise, setDevise] = useState('eur');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #E8E4DE' }}>
      <span style={{ color: '#1A1A2E', fontSize: 14 }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{ width: 48, height: 26, borderRadius: 13, border: 'none', background: value ? '#059669' : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
        <span style={{ position: 'absolute', top: 3, left: value ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2D3436 0%, #1A1A2E 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>Eventy Life</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          {"Param\u00e8tres"}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32 }}>
          {"G\u00e9rez vos pr\u00e9f\u00e9rences et param\u00e8tres de compte"}
        </p>

        {saved && (
          <div style={{ background: '#ECFDF5', border: '1px solid #059669', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#059669', fontSize: 14, fontWeight: 500 }}>
            {"Param\u00e8tres sauvegard\u00e9s avec succ\u00e8s !"}
          </div>
        )}

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>Notifications</h2>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16, marginTop: 0 }}>
            {"Choisissez comment vous souhaitez \u00eatre notifi\u00e9"}
          </p>
          <Toggle value={notifEmail} onChange={setNotifEmail} label="Notifications par email" />
          <Toggle value={notifSms} onChange={setNotifSms} label="Notifications par SMS" />
          <Toggle value={rappels} onChange={setRappels} label={"Rappels avant d\u00e9part"} />
          <Toggle value={promos} onChange={setPromos} label="Offres promotionnelles" />
          <Toggle value={newsletter} onChange={setNewsletter} label="Newsletter Eventy Life" />
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>
            {"Pr\u00e9f\u00e9rences r\u00e9gionales"}
          </h2>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16, marginTop: 0 }}>
            {"Langue et devise d\u2019affichage"}
          </p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#374151', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Langue</label>
            <select value={langue} onChange={e => setLangue(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E4DE', fontSize: 14, color: '#1A1A2E', background: '#FAFAFA' }}>
              <option value="fr">{"Fran\u00e7ais"}</option>
              <option value="en">English</option>
              <option value="es">{"Espa\u00f1ol"}</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#374151', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Devise</label>
            <select value={devise} onChange={e => setDevise(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E4DE', fontSize: 14, color: '#1A1A2E', background: '#FAFAFA' }}>
              <option value="eur">{"Euro (\u20ac)"}</option>
              <option value="gbp">{"Livre sterling (\u00a3)"}</option>
              <option value="chf">{"Franc suisse (CHF)"}</option>
            </select>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
          <h2 style={{ color: '#1A1A2E', fontSize: 18, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>
            {"S\u00e9curit\u00e9"}
          </h2>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16, marginTop: 0 }}>
            {"G\u00e9rez la s\u00e9curit\u00e9 de votre compte"}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #E8E4DE' }}>
            <div>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>Mot de passe</div>
              <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{"Derni\u00e8re modification il y a 30 jours"}</div>
            </div>
            <a href="/profil" style={{ color: '#C75B39', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Modifier</a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <div>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>{"Authentification \u00e0 deux facteurs"}</div>
              <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{"Non activ\u00e9e"}</div>
            </div>
            <span style={{ color: '#D97706', fontSize: 13, fontWeight: 500 }}>{"Bient\u00f4t disponible"}</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', marginBottom: 32 }}>
          <h2 style={{ color: '#DC2626', fontSize: 18, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>Zone de danger</h2>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16, marginTop: 0 }}>Actions irr\u00e9versibles</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <div>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 500 }}>Supprimer mon compte</div>
              <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{"Cette action est d\u00e9finitive"}</div>
            </div>
            <button style={{ background: 'none', border: '1px solid #DC2626', color: '#DC2626', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
              Supprimer
            </button>
          </div>
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '14px', background: '#C75B39', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {"Sauvegarder les param\u00e8tres"}
        </button>
      </div>
    </div>
  );
}
