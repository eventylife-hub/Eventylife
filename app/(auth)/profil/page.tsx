'use client';
import { useState } from 'react';

export default function ProfilPage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    prenom: 'David',
    nom: 'Martin',
    email: 'david.martin@email.com',
    telephone: '+33 6 12 34 56 78',
    dateNaissance: '1990-05-15',
    adresse: '12 rue de la Paix',
    codePostal: '75002',
    ville: 'Paris',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = (disabled: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #E8E4DE',
    borderRadius: 8,
    fontSize: 15,
    color: '#1A1A2E',
    background: disabled ? '#F9FAFB' : 'white',
    outline: 'none',
    boxSizing: 'border-box' as const,
  });

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600 as const,
    color: '#6B7280',
    marginBottom: 6,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <header style={{ background: '#1A1A2E', padding: '16px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'white', fontSize: 22, fontWeight: 800 }}>Eventy Life</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
            <a href="/connexion" style={{ color: '#FAF7F2', textDecoration: 'none', fontSize: 14, opacity: 0.8 }}>D&#233;connexion</a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px' }}>Mon profil</h1>
            <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>G&#233;rez vos informations personnelles</p>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ padding: '10px 24px', background: '#C75B39', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Modifier</button>
          )}
        </div>

        {saved && (
          <div style={{ background: '#ECFDF5', border: '1px solid #059669', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#059669', fontSize: 14, fontWeight: 500 }}>
            Vos informations ont &#233;t&#233; mises &#224; jour avec succ&#232;s.
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 12, padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #E8E4DE' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#C75B39', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 700 }}>
              {form.prenom[0]}{form.nom[0]}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px' }}>{form.prenom} {form.nom}</h2>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Membre depuis janvier 2026</p>
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', marginBottom: 20 }}>Informations personnelles</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Pr&#233;nom</label>
              <input type="text" value={form.prenom} disabled={!editing} onChange={e => handleChange('prenom', e.target.value)} style={inputStyle(!editing)} />
            </div>
            <div>
              <label style={labelStyle}>Nom</label>
              <input type="text" value={form.nom} disabled={!editing} onChange={e => handleChange('nom', e.target.value)} style={inputStyle(!editing)} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} disabled={!editing} onChange={e => handleChange('email', e.target.value)} style={inputStyle(!editing)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>T&#233;l&#233;phone</label>
              <input type="tel" value={form.telephone} disabled={!editing} onChange={e => handleChange('telephone', e.target.value)} style={inputStyle(!editing)} />
            </div>
            <div>
              <label style={labelStyle}>Date de naissance</label>
              <input type="date" value={form.dateNaissance} disabled={!editing} onChange={e => handleChange('dateNaissance', e.target.value)} style={inputStyle(!editing)} />
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', marginBottom: 20, marginTop: 32 }}>Adresse</h3>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Adresse</label>
            <input type="text" value={form.adresse} disabled={!editing} onChange={e => handleChange('adresse', e.target.value)} style={inputStyle(!editing)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Code postal</label>
              <input type="text" value={form.codePostal} disabled={!editing} onChange={e => handleChange('codePostal', e.target.value)} style={inputStyle(!editing)} />
            </div>
            <div>
              <label style={labelStyle}>Ville</label>
              <input type="text" value={form.ville} disabled={!editing} onChange={e => handleChange('ville', e.target.value)} style={inputStyle(!editing)} />
            </div>
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #E8E4DE' }}>
              <button onClick={() => setEditing(false)} style={{ padding: '10px 24px', background: 'white', color: '#6B7280', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleSave} style={{ padding: '10px 24px', background: '#C75B39', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Enregistrer</button>
            </div>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', marginBottom: 16 }}>S&#233;curit&#233;</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, color: '#1A1A2E', margin: '0 0 4px', fontWeight: 500 }}>Mot de passe</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Derni&#232;re modification il y a 3 mois</p>
            </div>
            <a href="/mot-de-passe-oublie" style={{ padding: '8px 16px', background: '#FAF7F2', color: '#C75B39', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Changer</a>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', marginBottom: 16 }}>Pr&#233;f&#233;rences</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, color: '#1A1A2E', margin: '0 0 4px', fontWeight: 500 }}>Notifications par email</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Recevez des alertes sur vos voyages</p>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: '#059669', position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute' as const, top: 2, right: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, color: '#1A1A2E', margin: '0 0 4px', fontWeight: 500 }}>Newsletter Eventy Life</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>D&#233;couvrez nos nouvelles destinations</p>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: '#059669', position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute' as const, top: 2, right: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
