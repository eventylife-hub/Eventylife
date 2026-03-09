# SUIVI REFONTE DESIGN — Eventy Life
> Dernière mise à jour : 2026-03-09

---

## 🎨 Deux Design Systems distincts

### Design System CLIENT (Parcours client + pages publiques)
- **Fonts** : DM Sans (body) + Playfair Display (headings)
- **Couleurs** : Navy #1A1A2E, Cream #FAF7F2, Terra #C75B39, Gold #D4A853, Forest #166534
- **CSS** : `globals.css` (variables, animations fadeUp/fadeIn/pulse/float/slideInRight, `.rv`/`.vis` reveal)
- **Tailwind** : Tokens `navy`, `cream`, `terra`, `gold` dans `tailwind.config.ts`

### Design System ADMIN/PRO (Portails professionnels)
- **Fichier HTML de référence** : `admin-home-v4.html`, `pro-dashboard.html`, `hra-dashboard.html`
- **Fonts mockup** : Outfit (body) + Fraunces (display)
- **Couleurs mockup** : Sun #FF6B35, Ocean #0077B6, Dark #0A1628, Sand #FEFCF3, Coral #E63946, Mint #06D6A0, Violet #7B2FF7
- **⚠️ ATTENTION** : Le CSS actuel (`admin.css`) utilise Forest Green #2D5A27 comme accent — c'est DIFFÉRENT du mockup qui utilise Sun #FF6B35 / Ocean #0077B6

---

## ✅ PHASE 1 — Parcours Client (TERMINÉ)
> Commit : `d69a507` — 57 fichiers, +14458 -9451

| Catégorie | Fichiers | Statut |
|-----------|----------|--------|
| **Layout global** | `layout.tsx`, `globals.css`, `tailwind.config.ts` | ✅ Done |
| **Header/Footer** | `header.tsx`, `footer.tsx` | ✅ Done |
| **Pages publiques** | Homepage, voyages, à-propos, blog, brochure, contact, FAQ, partenaires, suivi-commande | ✅ Done |
| **Auth** | connexion, inscription, mot-de-passe-oublié, réinitialiser, vérification-email | ✅ Done |
| **Checkout** | 5 pages (start → confirmation) | ✅ Done |
| **Client portal** | layout + dashboard + réservations, groupes, profil, paiements, avis, wallet, documents, notifications, support, assurance + sous-pages | ✅ Done |
| **Pages légales** | CGV, confidentialité, mentions-légales, cookies | ✅ Done |
| **Voyage sous-pages** | avis, groupes | ✅ Done |
| **Pages publiques PRO** | p/[proSlug], depart/[ville] | ✅ Done |

---

## 🔧 PHASE 2 — Portail Admin (EN COURS)

### Ce qui est FAIT (par autre Cowork) :
| Fichier | Statut | Détails |
|---------|--------|---------|
| `admin/layout.tsx` | ✅ Refait | Sidebar dark + Fraunces + sections groupées, CSS dans admin.css |
| `admin/admin.css` | ✅ Créé | 15.9 KB — Design system complet (Forest Green #2D5A27) |
| `admin/page.tsx` (Home) | ✅ Refait | Dashboard complet avec modules, KPIs, audit log |
| `admin/dashboard/page.tsx` | ✅ Redirect | Simple redirect vers /admin |

### Ce qui est PARTIELLEMENT modifié (petits cleanup imports) :
| Fichier | Statut | Détails |
|---------|--------|---------|
| `admin/alertes/page.tsx` | ⚠️ Cassé | Import brisé ligne 10-11 (deux imports fusionnés) |
| `admin/annulations/page.tsx` | 🔸 Minor | -6/+3 lignes — cleanup imports |
| `admin/annulations/[id]/page.tsx` | 🔸 Minor | -2/+4 lignes |
| `admin/audit/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/bookings/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/documents/page.tsx` | 🔸 Minor | -8/+3 lignes |
| `admin/exports/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/finance/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/finance/payouts/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/marketing/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/notifications/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/parametres/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/pros/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/rooming/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/support/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/transport/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/utilisateurs/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/utilisateurs/[id]/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/voyages/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/voyages/creer/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/voyages/[id]/page.tsx` | 🔸 Minor | cleanup imports |
| `admin/voyages/[id]/lifecycle/page.tsx` | 🔸 Minor | cleanup imports |

### ❌ Redesign complet MANQUANT (21 pages admin) :
Toutes les pages ci-dessus marquées "Minor" n'ont PAS été redesignées avec le nouveau design system. Elles utilisent encore les anciens composants shadcn/Tailwind basiques.

---

## 🔧 PHASE 3 — Portail Pro (PAS COMMENCÉ)

### Layout Pro : ❌ PAS modifié
Utilise encore l'ancien design (bg-gray-50, sidebar blanche, orange-600 basique).

### Pages Pro modifiées (whitespace/EOL seulement, PAS de redesign) :
| Fichier | Statut |
|---------|--------|
| `pro/page.tsx` (Dashboard) | 🔸 Whitespace only |
| `pro/arrets/page.tsx` | 🔸 Whitespace only |
| `pro/finance/page.tsx` | 🔸 Whitespace only |
| `pro/inscription/page.tsx` | 🔸 Whitespace only |
| `pro/onboarding/page.tsx` | 🔸 Whitespace only |
| `pro/revenus/page.tsx` | 🔸 Whitespace only |
| `pro/voyages/[id]/page.tsx` | 🔸 Whitespace only |
| `pro/voyages/[id]/bilan/page.tsx` | 🔸 Whitespace only |
| `pro/voyages/[id]/factures/page.tsx` | 🔸 Whitespace only |
| `pro/voyages/[id]/rooming/page.tsx` | 🔸 Whitespace only |
| `pro/voyages/nouveau/page.tsx` | 🔸 Whitespace only |

### ❌ Pages Pro NON touchées du tout :
- `pro/layout.tsx` — Ancien design
- `pro/dashboard/page.tsx`
- `pro/arrets/nouveau/page.tsx`
- `pro/documents/page.tsx`
- `pro/forgot-password/page.tsx`
- `pro/formation/page.tsx`
- `pro/login/page.tsx`
- `pro/marketing/page.tsx` + `[id]/page.tsx` + `creer/page.tsx`
- `pro/reservations/page.tsx`
- `pro/revenus/releve/page.tsx`
- `pro/vendre/page.tsx`
- `pro/voyages/[id]/equipe/page.tsx`
- `pro/voyages/[id]/finance/page.tsx`
- `pro/voyages/[id]/reservations/page.tsx`
- `pro/voyages/[id]/restauration/page.tsx`
- `pro/voyages/[id]/rooming/hotel-blocks/page.tsx`
- `pro/voyages/[id]/transport/page.tsx`
- `pro/voyages/[id]/transport/manifest/page.tsx`

---

## ⚠️ AUTRES MODIFICATIONS DÉTECTÉES (probablement autre Cowork)

| Fichier | Changements |
|---------|-------------|
| `middleware.ts` | +284 lignes modifiées |
| `next.config.js` | +64 lignes modifiées |
| `package.json` | +114 lignes modifiées |
| `vercel.json` | +12 lignes modifiées |
| `app/global-error.tsx` | Modifié |
| `app/page.tsx` | Modifié |
| `components/cancellation/refund-calculator.tsx` | Modifié |
| `components/cookie-banner/CookieBanner.tsx` | Modifié |
| `components/finance/finance-summary.tsx` | Modifié |
| `components/post-sale/travel-report-preview.tsx` | Modifié |

---

## ⚠️ POINT DE DÉCISION : Design Admin/Pro

Le design actuel (`admin.css`) utilise **Forest Green #2D5A27** comme couleur d'accent.
Les mockups HTML uploadés (`admin-home-v4.html`) utilisent **Sun #FF6B35 / Ocean #0077B6**.

**→ Question : On garde le Forest Green actuel OU on passe au Sun/Ocean du mockup v4 ?**

---

## 🚀 PROCHAINES ÉTAPES

1. **Décider** la palette Admin/Pro définitive (Forest Green vs Sun/Ocean)
2. **Corriger** le bug import dans `admin/alertes/page.tsx`
3. **Redesigner** les 21 pages admin sub-pages
4. **Redesigner** le layout Pro + toutes les 32 pages Pro
5. **Commit** tout
6. **Push** depuis le terminal local (`git push origin main`)
