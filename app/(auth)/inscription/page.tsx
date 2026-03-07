'use client';
import { useState } from 'react';

export default function InscriptionPage() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', tel: '', password: '', confirm: '' });
  const [cgv, setCgv] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.prenom.trim()) e.prenom = 'Le pr\u00e9nom est requis';
    if (!form.nom.trim()) e.nom = 'Le nom est requis';
    if (!form.email.trim()) e.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.password) e.password = 'Le mot de passe est requis';
    else if (form.password.length < 8) e.password = '8 caract\u00e8res minimum';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    if (!cgv) e.cgv = 'Vous devez accepter les CGV';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const fieldStyle = { width: '100%', padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 8, fontSize: 15, outline: 'none', background: 'white', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 };
  const errStyle = { fontSize: 12, color: '#DC2626', marginTop: 4 };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#FAF7F2', borderRadius: 16, padding: '40px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>Eventy Life</h1>
          </a>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A2E', margin: '8px 0 0' }}>Cr&#233;er un compte</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Pr&#233;nom</label>
              <input type="text" value={form.prenom} onChange={(e) => update('prenom', e.target.value)} placeholder="Jean" style={fieldStyle} />
              {errors.prenom && <p style={errStyle}>{errors.prenom}</p>}
            </div>
            <div>
              <label style={labelStyle}>Nom</label>
              <input type="text" value={form.nom} onChange={(e) => update('nom', e.target.value)} placeholder="Dupont" style={fieldStyle} />
              {errors.nom && <p style={errStyle}>{errors.nom}</p>}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jean@exemple.fr" style={fieldStyle} />
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>T&#233;l&#233;phone <span style={{ fontWeight: 400, color: '#6B7280' }}>(optionnel)</span></label>
            <input type="tel" value={form.tel} onChange={(e) => update('tel', e.target.value)} placeholder="06 12 34 56 78" style={fieldStyle} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="8 caract&#232;res minimum" style={{ ...fieldStyle, paddingRight: 60 }} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B7280' }}>
                {showPwd ? 'Masquer' : 'Voir'}
              </button>
            </div>
            {errors.password && <p style={errStyle}>{errors.password}</p>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Confirmer mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={(e) => update('confirm', e.target.value)} placeholder="Confirmez votre mot de passe" style={{ ...fieldStyle, paddingRight: 60 }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B7280' }}>
                {showConfirm ? 'Masquer' : 'Voir'}
              </button>
            </div>
            {errors.confirm && <p style={errStyle}>{errors.confirm}</p>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={cgv} onChange={(e) => { setCgv(e.target.checked); setErrors(prev => { const n = { ...prev }; delete n.cgv; return n; }); }} style={{ marginTop: 3, width: 18, height: 18, accentColor: '#C75B39' }} />
              <span style={{ fontSize: 14, color: '#374151' }}>
                J&apos;accepte les <a href="/cgv" target="_blank" style={{ color: '#C75B39', textDecoration: 'none', fontWeight: 600 }}>Conditions G&#233;n&#233;rales de Vente</a> et la <a href="/politique-confidentialite" target="_blank" style={{ color: '#C75B39', textDecoration: 'none', fontWeight: 600 }}>Politique de confidentialit&#233;</a>
              </span>
            </label>
            {errors.cgv && <p style={errStyle}>{errors.cgv}</p>}
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#D4A853' : '#C75B39', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Cr\u00e9ation en cours...' : 'Cr\u00e9er mon compte'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#E8E4DE' }} />
          <span style={{ fontSize: 13, color: '#6B7280' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: '#E8E4DE' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', margin: 0 }}>
          D&#233;j&#224; un compte ? <a href="/connexion" style={{ color: '#C75B39', fontWeight: 600, textDecoration: 'none' }}>Se connecter</a>
        </p>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'underline' }}>Retour &#224; l&apos;accueil</a>
        </div>
      </div>
    </div>
  );
}
