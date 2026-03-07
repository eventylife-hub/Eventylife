'use client';
import { useState } from 'react';

export default function MessagesPage() {
  const [selected, setSelected] = useState(0);
  const [newMsg, setNewMsg] = useState('');

  const conversations = [
    {
      id: 1, nom: "Support Eventy", avatar: "\uD83D\uDC69\u200D\uD83D\uDCBB", dernier: "Votre r\u00e9servation Santorin est confirm\u00e9e ! N\u2019h\u00e9sitez pas si vous avez des questions.", date: "Aujourd\u2019hui", nonLu: 1, messages: [
        { de: "support", texte: "Bonjour David ! Bienvenue sur Eventy Life. Je suis votre conseill\u00e8re d\u00e9di\u00e9e.", heure: "10:00" },
        { de: "support", texte: "Votre r\u00e9servation pour Santorin (15 avril) est bien confirm\u00e9e. Vous recevrez votre carnet de voyage 7 jours avant le d\u00e9part.", heure: "10:02" },
        { de: "moi", texte: "Super merci ! Est-ce que je peux ajouter une personne au voyage ?", heure: "10:15" },
        { de: "support", texte: "Bien s\u00fbr ! Il reste 7 places. Vous pouvez ajouter un voyageur depuis votre espace \u00ab Mes r\u00e9servations \u00bb ou me donner ses coordonn\u00e9es ici.", heure: "10:18" },
        { de: "moi", texte: "Parfait, je vais le faire depuis mon espace. Merci !", heure: "10:20" },
        { de: "support", texte: "Votre r\u00e9servation Santorin est confirm\u00e9e ! N\u2019h\u00e9sitez pas si vous avez des questions.", heure: "10:25" },
      ]
    },
    {
      id: 2, nom: "Groupe Santorin", avatar: "\uD83C\uDDEC\uD83C\uDDF7", dernier: "Marie : Trop h\u00e2te d\u2019y \u00eatre ! Quelqu\u2019un conna\u00eet un bon resto \u00e0 Oia ?", date: "Hier", nonLu: 3, messages: [
        { de: "groupe", auteur: "Marie L.", texte: "Bonjour tout le monde ! Ravie de faire partie du groupe Santorin \uD83C\uDF1E", heure: "14:00" },
        { de: "moi", texte: "Salut Marie ! Moi aussi, j\u2019ai trop h\u00e2te !", heure: "14:05" },
        { de: "groupe", auteur: "Pierre D.", texte: "Hello ! C\u2019est mon premier voyage en groupe, des conseils ?", heure: "14:30" },
        { de: "groupe", auteur: "Marie L.", texte: "Trop h\u00e2te d\u2019y \u00eatre ! Quelqu\u2019un conna\u00eet un bon resto \u00e0 Oia ?", heure: "15:10" },
      ]
    },
    {
      id: 3, nom: "Accompagnateur Sahara", avatar: "\uD83C\uDDF2\uD83C\uDDE6", dernier: "N\u2019oubliez pas d\u2019apporter une lampe frontale et de la cr\u00e8me solaire.", date: "3 mars", nonLu: 0, messages: [
        { de: "accomp", texte: "Bonjour David ! Je suis Karim, votre accompagnateur pour le voyage Sahara. Ravi de vous conna\u00eetre !", heure: "09:00" },
        { de: "accomp", texte: "Petit rappel : n\u2019oubliez pas d\u2019apporter une lampe frontale et de la cr\u00e8me solaire. Le d\u00e9sert est magnifique mais exigeant !", heure: "09:05" },
        { de: "moi", texte: "Merci Karim ! C\u2019est not\u00e9. On a un programme d\u00e9taill\u00e9 ?", heure: "09:30" },
        { de: "accomp", texte: "Je vous envoie le programme complet dans votre carnet de voyage d\u2019ici vendredi.", heure: "09:35" },
      ]
    },
  ];

  const conv = conversations[selected];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #0F3460 100%)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>Eventy Life</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/tableau-de-bord" style={{ color: '#D4A853', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Tableau de bord</a>
          <a href="/connexion" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {"D\u00e9connexion"}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{"\uD83D\uDCAC"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
            Messages
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 0 }}>
            {"Vos conversations avec l\u2019\u00e9quipe et les groupes de voyage"}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0, background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', height: 520 }}>
          <div style={{ borderRight: '1px solid #E8E4DE', overflowY: 'auto' }}>
            {conversations.map((c, i) => (
              <div key={c.id} onClick={() => setSelected(i)} style={{ display: 'flex', gap: 12, padding: '16px 20px', cursor: 'pointer', background: selected === i ? '#FAF7F2' : '#FFFFFF', borderBottom: '1px solid #F3F4F6', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: selected === i ? '#D4A853' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {c.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 600 }}>{c.nom}</span>
                    <span style={{ color: '#9CA3AF', fontSize: 11 }}>{c.date}</span>
                  </div>
                  <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.dernier}
                  </div>
                </div>
                {c.nonLu > 0 && (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#C75B39', color: '#FFFFFF', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    {c.nonLu}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8E4DE', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {conv.avatar}
              </div>
              <div>
                <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 600 }}>{conv.nom}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12 }}>
                  {conv.id === 1 ? "Conseill\u00e8re d\u00e9di\u00e9e" : conv.id === 2 ? "8 participants" : "Accompagnateur"}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, background: '#FAFAFA' }}>
              {conv.messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.de === 'moi' ? 'flex-end' : 'flex-start', maxWidth: '80%', alignSelf: m.de === 'moi' ? 'flex-end' : 'flex-start' }}>
                  {m.auteur && (
                    <span style={{ color: '#C75B39', fontSize: 11, fontWeight: 600, marginBottom: 2, marginLeft: 12 }}>{m.auteur}</span>
                  )}
                  <div style={{ padding: '10px 16px', borderRadius: m.de === 'moi' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.de === 'moi' ? '#1A1A2E' : '#FFFFFF', color: m.de === 'moi' ? '#FFFFFF' : '#1A1A2E', fontSize: 13, lineHeight: 1.5, boxShadow: m.de !== 'moi' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                    {m.texte}
                  </div>
                  <span style={{ color: '#9CA3AF', fontSize: 10, marginTop: 4, marginLeft: m.de === 'moi' ? 0 : 12, marginRight: m.de === 'moi' ? 12 : 0 }}>
                    {m.heure}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #E8E4DE', display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder={"Votre message\u2026"}
                style={{ flex: 1, padding: '12px 16px', border: '1px solid #E8E4DE', borderRadius: 12, fontSize: 14, outline: 'none', background: '#FAFAFA' }}
              />
              <button style={{ width: 44, height: 44, borderRadius: 12, background: '#C75B39', border: 'none', color: '#FFFFFF', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {"\u27A4"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
