# COWORK 3 — Portail CLIENT + PUBLIC
> Mis à jour : 18 mars 2026

## 🎯 Objectif
Compléter toutes les pages et features des portails Client et Public d'Eventy.

---

## 📊 Avancement Global : 48 pages existantes + 2 nouvelles = 50 pages

### ✅ Pages Client EXISTANTES (fonctionnelles)
| # | Page | Route | Statut |
|---|------|-------|--------|
| 1 | Dashboard | `/client/dashboard` | ✅ OK |
| 2 | Réservations | `/client/reservations` | ✅ OK |
| 3 | Profil | `/client/profil` | ✅ OK |
| 4 | Paiements | `/client/paiements` | ✅ OK |
| 5 | Groupes | `/client/groupes` | ✅ OK |
| 6 | Documents | `/client/documents` | ✅ OK |
| 7 | Notifications | `/client/notifications` | ✅ OK |
| 8 | Support | `/client/support` | ✅ OK |
| 9 | Wallet | `/client/wallet` | ✅ OK |
| 10 | Assurance | `/client/assurance` | ✅ OK |
| 11 | Avis | `/client/avis` | ✅ OK |

### ✅ Pages Public EXISTANTES
| # | Page | Route | Statut |
|---|------|-------|--------|
| 12 | Homepage | `/` | ✅ OK |
| 13 | Catalogue Voyages | `/voyages` | ✅ OK |
| 14 | Voyage Détail | `/voyages/[slug]` | ✅ OK |
| 15 | FAQ | `/faq` | ✅ OK |
| 16 | À propos | `/a-propos` | ✅ OK |
| 17 | Comment ça marche | `/comment-ca-marche` | ✅ OK |
| 18 | Contact | `/contact` | ✅ OK |
| 19 | Devenir Partenaire | `/devenir-partenaire` | ✅ OK |
| 20 | Blog | `/blog` | ✅ OK |
| 21 | Blog Article | `/blog/[slug]` | ✅ OK |
| 22 | CGV | `/cgv` | ✅ OK |
| 23 | Mentions Légales | `/mentions-legales` | ✅ OK |
| 24 | Confidentialité | `/confidentialite` | ✅ OK |
| 25 | Cookies | `/cookies` | ✅ OK |
| 26 | Départ ville | `/depart/[ville]` | ✅ OK |
| 27 | Brochure | `/brochure` | ✅ OK |
| 28 | Suivi commande | `/suivi-commande` | ✅ OK |
| 29 | Page Pro publique | `/p/[proSlug]` | ✅ OK |
| 30 | Partenaires | `/partenaires` | ✅ OK |

### ✅ Pages Auth EXISTANTES
| # | Page | Route | Statut |
|---|------|-------|--------|
| 31 | Connexion | `/connexion` | ✅ OK |
| 32 | Inscription | `/inscription` | ✅ OK |
| 33 | Mot de passe oublié | `/mot-de-passe-oublie` | ✅ OK |
| 34 | Réinitialiser MDP | `/reinitialiser-mot-de-passe` | ✅ OK |
| 35 | Vérification email | `/verification-email` | ✅ OK |

### ✅ Pages Checkout EXISTANTES
| # | Page | Route | Statut |
|---|------|-------|--------|
| 36 | Checkout Start | `/checkout/start` | ✅ OK |
| 37 | Checkout Step 1 | `/checkout/step-1` | ✅ OK |
| 38 | Checkout Step 2 | `/checkout/step-2` | ✅ OK |
| 39 | Checkout Step 3 | `/checkout/step-3` | ✅ OK |
| 40 | Checkout Confirm | `/checkout/confirmation` | ✅ OK |

### 🆕 Pages CRÉÉES ce 18 mars 2026
| # | Page | Route | Statut | Notes |
|---|------|-------|--------|-------|
| 41 | Favoris | `/client/favoris` | ✅ CRÉÉE | Wishlist, cards voyages, suppression, CTA |
| 42 | Urgence / Assistance | `/client/urgence` | ✅ CRÉÉE | Contacts urgence, situations couvertes, Pack Sérénité |

### ❌ Pages RESTANTES à créer
| # | Page | Route | Priorité | Heures estimées |
|---|------|-------|----------|----------------|
| 43 | Préférences Notifications | `/client/preferences-notifications` | P1 | ~3h |
| 44 | Préférences Marketing | `/client/preferences-marketing` | P1 | ~3h |
| 45 | Credit Wallet avancé | `/client/wallet` (enrichir) | P1 | ~5h |
| 46 | Pourboire / Merci Voyage | `/client/pourboire` | P2 | ~3h |

### ⚡ Features à AMÉLIORER sur pages existantes
| Page | Feature manquante | Priorité | Heures |
|------|-------------------|----------|--------|
| Wallet | Crédits/avoirs avancés (draw.io 237-251) | P1 | ~5h |
| Checkout | Hold 24h + timer amélioré | P1 | ~4h |
| Réservations | Annulation self-service + remboursement | P0 | ~8h |
| Groupes | Travel Groups social (smart invite) | P1 | ~10h |
| Homepage | SEO JSON-LD amélioré, viral share | P2 | ~4h |
| Catalogue | Filtres avancés (budget, dates, départ) | P1 | ~6h |

---

## 🔧 À faire dans COWORK 3

### Session suivante (priorité P0)
1. [ ] Préférences Notifications — centre préférences canaux
2. [ ] Préférences Marketing — opt-in/out, DNC
3. [ ] Améliorer Réservations — lifecycle complet avec annulation

### Sessions ultérieures
4. [ ] Credit Wallet avancé (avoirs, crédits)
5. [ ] Pourboire / Merci Voyage post-séjour
6. [ ] Travel Groups social (smart invite)
7. [ ] Checkout Hold 24h amélioré
8. [ ] SEO + filtres catalogue
9. [ ] Tests E2E pages client

---

## 📁 Fichiers modifiés/créés
```
frontend/app/(client)/client/favoris/page.tsx     ← NOUVEAU
frontend/app/(client)/client/urgence/page.tsx      ← NOUVEAU
```
