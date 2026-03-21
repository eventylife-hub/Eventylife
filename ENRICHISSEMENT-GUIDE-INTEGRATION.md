# Guide d'Intégration — Composants Bonus Client

**Date** : 2026-03-20
**Version** : 1.0

---

## Vue d'ensemble

Vous trouvez ici **4 nouveaux composants** créés pour enrichir le portail client avec des features suggestionnées. Ces composants sont optionnels mais recommandés pour une expérience client maximale.

---

## Composants Créés

### 1. `AccompanistCard` — Profil de l'accompagnateur

**Fichier** : `frontend/components/client/accompanist-card.tsx`

#### Utilisation
À insérer **après la section "Prochain voyage"** sur la page dashboard (`/client`).

#### Code d'Intégration

```tsx
// Dans frontend/app/(client)/client/page.tsx, après la section "Prochain voyage"

import { AccompanistCard } from '@/components/client/accompanist-card';

// Dans le JSX, ajouter après le bloc {data.nextTravel && days !== null && (...)} :

{data.nextTravel && data.accompanist && (
  <AccompanistCard
    name={data.accompanist.name}
    role={data.accompanist.role}
    phone={data.accompanist.phone}
    photoUrl={data.accompanist.photoUrl}
    bio={data.accompanist.bio}
    experience={data.accompanist.experience}
    languages={data.accompanist.languages}
  />
)}
```

#### Données à Ajouter (Interface)

```tsx
// Ajouter à l'interface DashboardData :

interface Accompanist {
  name: string;
  role: string;
  phone: string;
  photoUrl?: string;
  bio: string;
  experience: string;
  languages: string[];
}

interface DashboardData {
  // ... existing fields
  accompanist?: Accompanist;
}
```

#### Mock Data

```tsx
// Dans buildFallbackData() :

accompanist: {
  name: 'Karim El Mansouri',
  role: 'Guide Expert — Maroc',
  phone: '+212 6 12 34 56 78',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  bio: 'Passionné par l\'authenticité marocaine depuis 15 ans. Guide reconnu pour sa chaleur et ses histoires fascinantes.',
  experience: '15 ans d\'expérience, 500+ clients ravis',
  languages: ['Français', 'Anglais', 'Arabe'],
}
```

#### Styling
- Dégradé : navy → navy
- Hover : shadow-lg, scale image +5%
- Responsive : image full-width mobile, side mobile-lg
- A11y : aria-label sur bouton contact

---

### 2. `GroupChatPreview` — Chat groupe

**Fichier** : `frontend/components/client/group-chat-preview.tsx`

#### Utilisation
À insérer dans les **cartes de groupe** sur `/client/groupes` ou dans le détail groupe `/client/groupes/[id]`.

#### Code d'Intégration

```tsx
// Sur /client/groupes/page.tsx, dans la grille des groupes, ajouter après footer :

import { GroupChatPreview } from '@/components/client/group-chat-preview';

{/* Dans la map des groupes, ajouter avant le footer */}

{/* Chat preview */}
<GroupChatPreview
  groupId={group.id}
  groupName={group.name}
  messages={mockMessages} // À fournir
  totalMessages={group.messageCount || 0}
/>
```

#### Mock Data

```tsx
const mockMessages = [
  {
    id: 'msg_1',
    author: 'Sophie Martin',
    content: 'Vivement le départ ! Qui a des idées pour les activités ?',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 'msg_2',
    author: 'Jean Dupont',
    content: 'Moi je propose le souk. C\'est incontournable à Marrakech.',
    timestamp: new Date(Date.now() - 1 * 3600_000).toISOString(),
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: 'msg_3',
    author: 'Karim Mansouri',
    content: 'Excellente idée ! Je vous ferai découvrir les meilleures ruelles. 🎭',
    timestamp: new Date(Date.now() - 30 * 60_000).toISOString(),
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
];
```

#### Styling
- Header : cream bg, terra icon
- Messages : scrollable max-h-64
- Timeline : relative times ("2m", "1h", "3j")
- Input : disabled (mock only)

---

### 3. `PaymentTimeline` — Timeline échéanciers

**Fichier** : `frontend/components/client/payment-timeline.tsx`

#### Utilisation
À insérer sur `/client/paiements` pour voyages avec paiement échelonné.

#### Code d'Intégration

```tsx
// Sur /client/paiements/page.tsx, après la liste des paiements normaux, ajouter :

import { PaymentTimeline } from '@/components/client/payment-timeline';

{/* Pour les paiements échelonnés */}
{payments.filter(p => p.hasSchedule).map(p => (
  <PaymentTimeline
    key={p.id}
    bookingTitle={p.travelTitle}
    schedules={p.paymentSchedules}
  />
))}
```

#### Mock Data

```tsx
const schedules: PaymentSchedule[] = [
  {
    id: 'sch_1',
    label: 'Acompte obligatoire',
    date: '2026-03-20',
    amountCents: 30000,
    status: 'COMPLETED',
    description: 'Réservation confirmée',
  },
  {
    id: 'sch_2',
    label: 'Solde intermédiaire',
    date: '2026-04-15',
    amountCents: 30000,
    status: 'PENDING',
    description: '2 mois avant le départ',
  },
  {
    id: 'sch_3',
    label: 'Dernier versement',
    date: '2026-05-10',
    amountCents: 29900,
    status: 'UPCOMING',
    description: '5 jours avant le départ',
  },
];
```

#### Styling
- Timeline : vertical line gradient terra→gold
- Dots : checkmark (completed), clock (pending), lightning (upcoming)
- Progress : bottom bar gradient
- Colors : emerald/amber/grey

---

### 4. `ReferralPromo` — Parrainage

**Fichier** : `frontend/components/client/referral-promo.tsx`

#### Utilisation
À insérer sur `/client/favoris` (bottom) ou `/client` (bottom) pour promouvoir le parrainage.

#### Code d'Intégration

```tsx
// Sur /client/favoris/page.tsx, avant le footer, ajouter :

import { ReferralPromo } from '@/components/client/referral-promo';

{sorted.length > 0 && (
  <ReferralPromo
    referralCode={user.referralCode || 'ABC123'}
    totalReferrals={user.totalReferrals || 0}
    totalBonusEarnedCents={user.totalBonusEarnedCents || 0}
    referralBonusPerPersonCents={5000} // 50€
  />
)}
```

#### Mock Data

```tsx
{
  referralCode: 'ABC123DEF',
  totalReferrals: 3,
  totalBonusEarnedCents: 15000, // 150€
  referralBonusPerPersonCents: 5000, // 50€ par ami
}
```

#### Styling
- Background : dégradé navy avec accents gold/terra
- Stats : white/10 cards avec backdrop-blur
- CTA : terra button + white/10 secondary
- Copy : terra on success

---

## Intégration Étape par Étape

### Phase 1 : Setup (5 min)
1. Copier les 4 fichiers `.tsx` dans `frontend/components/client/`
2. Vérifier les imports (Lucide, Next, custom components)
3. Compiler & vérifier zéro erreurs TypeScript

### Phase 2 : Dashboard (10 min)
1. Ajouter interface `Accompanist` à `DashboardData`
2. Ajouter mock accompanist à `buildFallbackData()`
3. Importer `AccompanistCard` dans `page.tsx`
4. Insérer après section "Prochain voyage"
5. Tester sur `/client`

### Phase 3 : Groupes (8 min)
1. Ajouter mock messages aux groupes
2. Importer `GroupChatPreview`
3. Insérer dans carte groupe avant footer
4. Tester sur `/client/groupes`

### Phase 4 : Paiements (8 min)
1. Ajouter propriété `paymentSchedules` au type `Payment`
2. Importer `PaymentTimeline`
3. Ajouter mock schedules à fallback
4. Insérer sur `/client/paiements`
5. Tester

### Phase 5 : Favoris (5 min)
1. Importer `ReferralPromo`
2. Insérer bottom `/client/favoris`
3. Tester sur `/client/favoris`

---

## Données API Requises

Pour production, ces données doivent être fetch depuis les APIs :

### Dashboard
```
GET /client/profile
Response: { ..., accompanist?: Accompanist }
```

### Groupes
```
GET /client/groups
Response: { ..., messages?: ChatMessage[], messageCount?: number }
```

### Paiements
```
GET /client/payments
Response: { ..., paymentSchedules?: PaymentSchedule[] }
```

### User/Wallet
```
GET /client/profile
Response: { ..., referralCode, totalReferrals, totalBonusEarnedCents }
```

---

## Checklist de Tests

- [ ] AccompanistCard affiche profil complet
- [ ] Photo responsive (mobile/desktop)
- [ ] Bouton contact cliquable
- [ ] GroupChatPreview scrollable, input mock
- [ ] PaymentTimeline affiche statuts corrects
- [ ] ReferralPromo copy link fonctionne
- [ ] Tous les components responsive (mobile/tablet/desktop)
- [ ] Accessibilité OK (aria-labels, contrast, focus)
- [ ] Performance OK (Lighthouse > 90)
- [ ] Mode démo OK (pas d'erreurs API)

---

## Notes de Design

### Cohérence
- ✅ Couleurs : terra (#C75B39), gold (#D4A853), navy (#1A1A2E)
- ✅ Animations : fade-up cascadée
- ✅ Spacing : 4px grid (p-4, p-5, p-6, p-8)
- ✅ Border radius : 2xl (rounded-2xl) pour cards

### Accessibility
- ✅ min-height/min-width : 44px pour clickables
- ✅ aria-labels sur boutons
- ✅ aria-hidden sur icons pures
- ✅ Focus visible : ring-2 ring-terra

### Performance
- ✅ Images lazy loaded
- ✅ Animations GPU (transform, opacity)
- ✅ No inline styles (sauf dynamic width/colors)

---

## FAQ

**Q: Puis-je utiliser ces composants sans les autres ?**
R: Oui, chaque composant est indépendant. Importez seulement ce dont vous avez besoin.

**Q: Comment ajouter les vraies données API ?**
R: Remplacez le fallback dans chaque page par un vrai fetch `/client/...` et passez les données en props.

**Q: Les composants sont-ils responsifs ?**
R: Oui, testés mobile/tablet/desktop avec Tailwind breakpoints (sm, md, lg).

**Q: Puis-je changer les couleurs ?**
R: Oui, utilisez les CSS variables `--terra`, `--gold`, `--navy`, `--cream`, `--border`.

**Q: Les animations ralentissent-elles ?**
R: Non, elles utilisent GPU (transform, opacity) et sont optimisées pour performance.

---

## Supports & Ressources

- **Icons** : lucide-react (lucide.dev)
- **Images** : unsplash + custom
- **Utilities** : formatPrice, formatDate, getRelativeTime
- **Styles** : Tailwind + CSS variables

---

**Auteur** : Agent Frontend — Eventy
**Last Updated** : 2026-03-20
