# PROGRAMME DE DÉVELOPPEMENT — Eventy Life

> **Date** : 19 mars 2026 (post-audit draw.io v53)
> **État réel** : Backend 78% (audit draw.io corrigé — Transport Quotes = gap majeur), Frontend 87% (165 pages, 30+ pages admin manquantes)
> **Sessions COWORK** : 1-9 terminées. COWORK-9 = audit draw.io complet (7 agents, 1 798 pages)
> **Objectif** : Atteindre 100% en 3 sprints finaux (~4-6 semaines)

---

## ÉTAT DES LIEUX — CE QUI EXISTE

### Frontend — **87% COMPLET** (corrigé post-audit)
| Portail | Pages | API calls | Tests | État |
|---------|-------|-----------|-------|------|
| Public/Client | 48 | 65 | ✅ | 95% complet |
| Pro | 47 | 78 | ✅ | 92% complet |
| Admin | 27 | 38 | ✅ | 78% (30+ pages draw.io manquantes) |
| Auth | 11 | 12 | ✅ | 100% complet |
| Checkout | 5 | 7 | ✅ | 90% (waitlist + dynamic pricing absents) |
| **TOTAL** | **165 pages** | **203 API calls** | **3 300+ tests** | **87% complet** |

**État technique** : 290,477 lignes de code, 0 erreurs TypeScript, Sprints voyages 77/78 tâches DONE

### Backend — **78% COMPLET** (corrigé après audit draw.io v53)

| Module | Complétude | Caractéristiques | Écarts draw.io |
|--------|-----------|------------------|----------------|
| **Auth** | 95% | Argon2id, JWT, 2FA, OWASP 2024 | — |
| **Travels** | 90% | State machine, audit logging | — |
| **Bookings** | 85% | Lifecycle, idempotency, TVA marge | Waitlist, PREANNOUNCE, paniers abandonnés |
| **Checkout** | 85% | 5 stages, Stripe, split payment | Dynamic pricing UI manquant |
| **Payments** | 90% | Stripe, webhooks, refunds | — |
| **Finance** | 82% | TVA marge 20/120, CA_TTC, exports | FEC export, audit trail, rapprochement bancaire |
| **Legal/RGPD** | 90% | DSAR, rétention auto, CMP | — |
| **Notifications** | 92% | WebSocket, rate limiting | — |
| **Support** | 95% | Tickets, SLA, escalade | — |
| **Marketing** | 84% | Campaigns, QR, leads | — |
| **Documents** | 85% | PDF Puppeteer, invoices, signatures | — |
| **Admin** | 82% | Feature flags, RBAC, audit logs | Bulk actions, undo/rollback, planning API |
| **Transport** | **55%** | Bus stops, manifests | **QUOTES 0%, multi-bus 0%, Google Maps 0%** |
| **Rooming** | 82% | Room assignment, PDF generation | — |
| **Pro Onboarding** | 78% | 6 étapes, SIRET, IBAN validation | Runbook J0, Duplicate Season, Safety Sheets, Quality Gate |
| **Email** | 88% | 10/14 templates done | 4 templates manquants |
| **Insurance** | 80% | Packs, pricing, dossiers | — |
| **Groups** | 75% | Smart invite, partage | — |
| **Cancellation** | 78% | Remboursements, frais | — |
| **HRA** | 65% | Hôtels/restaurants/activités | — |
| **SEO** | 60% | Slugs dynamiques, JSON-LD | — |
| **Restauration** | 70% | Meal management | — |
| **Client** | 65% | Favoris, edge cases | — |
| **Post-sale** | 70% | Post-trip services | — |

> **Note** : Transport réévalué de 80% → 55%. Les modèles Prisma (TransportQuote, QuoteSnapshot) existent mais la logique métier devis/quotes est à 0%. C'est le plus gros gap du projet.

---

## CE QUI RESTE À FAIRE (~22% backend + ~13% frontend)

### Tâches Backend — ÉCARTS DRAW.IO (NOUVELLES, découvertes par audit)

| # | Tâche | Module | État | Priorité |
|---|-------|--------|------|----------|
| D1 | **Transport Quotes workflow complet** | Transport | 0% logique | **P0** |
| D2 | **Snapshot immutabilité** (devis gelés après envoi) | Transport | 0% | P0 |
| D3 | Multi-bus / multi-segment | Transport | 0% | P1 |
| D4 | Charter editor | Transport | 0% | P2 |
| D5 | Google Maps integration stops | Transport | 0% | P2 |
| D6 | Vehicle/driver management | Transport | 0% | P2 |
| D7 | Flight management automation | Transport | 30% | P2 |
| D8 | Dashboard transport admin (5 KPI tiles) | Transport | 20% | P1 |
| D9 | Waitlist automation | Bookings | 0% | P1 |
| D10 | PREANNOUNCE gating | Bookings | 0% | P1 |
| D11 | Relance paniers abandonnés | Checkout | 0% | P1 |
| D12 | Export comptable FEC | Finance | 0% | P1 |
| D13 | Rapprochement bancaire auto | Finance | 0% | P2 |
| D14 | TVA audit trail complet | Finance | 0% | P1 |
| D15 | Runbook J0 | Pro | 0% | P1 |
| D16 | Duplicate Season | Pro | 0% | P1 |
| D17 | Safety Sheets | Pro | 0% | P1 |
| D18 | Quality Gate | Pro | 0% | P1 |
| D19 | Admin bulk actions | Admin | 0% | P1 |
| D20 | Admin undo/rollback | Admin | 0% | P2 |
| D21 | Admin planning API | Admin | 0% | P2 |

### Tâches Backend — MODULES EXISTANTS (déjà identifiées)

| # | Tâche | Module | État actuel | Priorité |
|---|-------|--------|------------|----------|
| B1 | HRA Hub completion (65% → 100%) | HRA | 65% | P0 |
| B2 | SEO module (60% → 100%) | SEO | 60% | P1 |
| B3 | Restauration module (70% → 100%) | Restauration | 70% | P1 |
| B4 | Client module polish (65% → 100%) | Client | 65% | P1 |
| B5 | Post-sale completion (70% → 100%) | Post-sale | 70% | P2 |
| B6 | Cron jobs métier | Admin | Partiel | P1 |
| B7 | Email templates (10/14 → 14/14) | Email | 88% | P0 |
| B8 | Groups module (75% → 100%) | Groups | 75% | P1 |
| B9 | Cancellation module (78% → 100%) | Cancellation | 78% | P1 |
| B10 | CI/CD pipeline | DevOps | 0% | P1 |
| B11 | Prisma production migration | DB | 0% | P0 |
| B12 | Performance optimization | Infra | Baseline | P2 |

### Tâches Frontend (13%)

| # | Tâche | Pages | Priorité |
|---|-------|-------|----------|
| F1 | Tests E2E Playwright (3 portails) | Toutes | P0 |
| F2 | **30+ pages admin manquantes** (archives, audit timeline, finance planner, ops) | /admin/* | P1 |
| F3 | Pages Waitlist UI | /client/bookings | P1 |
| F4 | Pages Dynamic room pricing UI | /pro/voyages | P1 |
| F5 | WCAG 2.1 AA accessibility | Toutes | P1 |
| F6 | Lighthouse performance | Toutes | P1 |
| F7 | Update pages HRA | /admin/hra, /pro/hra | P1 |
| F8 | Update pages Restauration | /admin/restauration | P1 |
| F9 | Micro-interactions polish | UI globale | P2 |
| F10 | Sprint Voyages final (1 tâche restante) | Voyages | P0 |

---

## PROGRAMME FINAL EN 3 SPRINTS

### ═══════════════════════════════════════════
### SPRINT FINAL 1 — Transport + Écarts critiques (2 semaines)
### "Combler les gaps draw.io critiques"
### ═══════════════════════════════════════════

**Objectif** : Implémenter le workflow Transport Quotes (plus gros gap) + écarts P0/P1 draw.io.

| Sem. | Tâche | Module | Détail |
|------|-------|--------|--------|
| S1 | **Transport Quotes workflow** | Transport | Création devis, envoi prestataires, comparaison, validation |
| S1 | **Snapshot immutabilité** | Transport | Devis gelés après envoi, versioning |
| S1 | **Email templates x4** | Email | 4 templates restants |
| S1 | **HRA Hub completion** | HRA | Hotels, restaurants, activities → 100% |
| S2 | **Multi-bus / multi-segment** | Transport | Plusieurs bus par voyage |
| S2 | **Dashboard transport admin** | Transport | 5 KPI tiles spécifiés draw.io |
| S2 | **Waitlist automation** | Bookings | File d'attente + notifications |
| S2 | **PREANNOUNCE gating** | Bookings | Blocage réservation pré-annonce |

**Livrable** : Transport de 55% → 90%, Bookings gaps comblés, HRA complet.

---

### ═══════════════════════════════════════════
### SPRINT FINAL 2 — Modules restants + Features (2 semaines)
### "Compléter tous les modules et fonctionnalités"
### ═══════════════════════════════════════════

**Objectif** : Tous les modules backend à 100%.

| Sem. | Tâche | Module | Détail |
|------|-------|--------|--------|
| S1 | **Export FEC + TVA audit trail** | Finance | Comptabilité légale complète |
| S1 | **Runbook J0 + Quality Gate** | Pro | Outils organisateur pré-départ |
| S1 | **Duplicate Season + Safety Sheets** | Pro | Clonage voyage + fiches sécurité |
| S1 | **SEO module** | SEO | Slugs, JSON-LD → 100% |
| S2 | **Restauration + Client + Post-sale** | Multi | Modules 70% → 100% |
| S2 | **Groups + Cancellation** | Multi | Modules 75-78% → 100% |
| S2 | **Cron jobs + Relance paniers** | Admin+Checkout | Automatisations métier |
| S2 | **Prisma migration + CI/CD** | Infra | Migration prod + pipeline |

**Livrable** : Backend 100%, tous modules complétés, CI/CD opérationnel.

---

### ═══════════════════════════════════════════
### SPRINT FINAL 3 — Polish + Deploy (1-2 semaines)
### "Tests, accessibilité, performance, déploiement"
### ═══════════════════════════════════════════

**Objectif** : Frontend 87% → 100%, tests E2E, accessibilité, production-ready.

| Sem. | Tâche | Détail | Métrique |
|------|-------|--------|----------|
| S1 | **30+ pages admin manquantes** | Archives, audit timeline, finance planner | Pages draw.io |
| S1 | **Tests E2E Playwright** | Full end-to-end test suite | 100% critical paths |
| S1 | **WCAG 2.1 AA accessibility** | Audit + fixes complètes | AA compliance |
| S2 | **Lighthouse performance** | Optimization + audit | 90+ scores |
| S2 | **Production environment** | DB, cache, CDN, monitoring | Infra ready |
| S2 | **Go-live checklist + dry-run** | Sécurité, compliance, simulation | Production ready |

**Livrable** : Frontend 100%, all tests passing, AA compliant, production deployed.

---

## RÉSUMÉ FINAL DES SESSIONS COWORK

| Session | État | Tâches |
|---------|------|--------|
| COWORK 1-8 | ✅ TERMINÉES | Foundation, Core features, Advanced features |
| COWORK-9-AUDIT | ✅ TERMINÉE | Audit draw.io v53 complet (7 agents, 1 798 pages) |
| Sprint Final 1 | ⏳ SUIVANT | Transport Quotes, écarts critiques draw.io |
| Sprint Final 2 | ⏳ PUIS | Modules restants, features, CI/CD |
| Sprint Final 3 | ⏳ ENFIN | Polish UX, E2E tests, Deploy |

---

## MÉTRIQUES FINALES (Cibles 100%)

| Métrique | Actuellement | Cible | Reste |
|----------|-------------|-------|-------|
| **Backend Complétion** | 78% | 100% | 22% (~4 sem) |
| **Frontend Complétion** | 87% | 100% | 13% (~2 sem) |
| **Pages Frontend** | 165 | 195+ | +30 pages admin |
| **API calls connectées** | 203 | 250+ | Transport quotes + admin |
| **Tests unitaires+E2E** | 3300+ | 4000+ | E2E expansion |
| **TypeScript errors** | 0 | 0 | Maintain 0 |
| **WCAG 2.1 AA** | Baseline | 100% | Full audit |
| **Lighthouse** | Baseline | 90+ | Optimization |
| **Code lines** | 290,477 | Final | ~340k |

---

## DÉPENDANCES CRITIQUES

```
Sprint Final 1 (Transport + Écarts critiques)
       │
       ├──→ Transport Quotes workflow (P0)
       ├──→ HRA Hub completion (P0)
       ├──→ Email templates x4 (P0)
       ├──→ Multi-bus / multi-segment
       └──→ Waitlist + PREANNOUNCE
              │
              └──→ Sprint Final 2 (Modules restants)
                     │
                     ├──→ Finance FEC + audit trail
                     ├──→ Pro features (Runbook, Quality Gate, etc.)
                     ├──→ Modules 60-75% → 100%
                     └──→ Prisma migration + CI/CD
                            │
                            └──→ Sprint Final 3 (Polish + Deploy)
                                   │
                                   ├──→ 30+ pages admin
                                   ├──→ E2E Playwright
                                   ├──→ WCAG 2.1 AA
                                   ├──→ Lighthouse perf
                                   └──→ Production deployment
```

---

## RÈGLE D'EXÉCUTION

> **Fin de ligne avec corrections post-audit.** On fait Sprint Final 1 → 2 → 3.
> Pas d'ajouts scope. Terminer ce qui existe + combler écarts draw.io, polir, tester, déployer.
>
> **Calendrier prévisionnel** :
> - Sprint Final 1 : 2 semaines (Transport Quotes + écarts critiques)
> - Sprint Final 2 : 2 semaines (modules restants + CI/CD)
> - Sprint Final 3 : 1-2 semaines (polish + deploy)
> - **Total** : 5-6 semaines pour 100% production-ready
>
> **Prochaines étapes** : Sprint Final 1, Semaine 1 — TRANSPORT QUOTES EN PRIORITÉ

---

*Document rewritten 19 mars 2026 — Post-audit draw.io v53 complet (7 agents, 1 798 pages). Backend corrigé 82% → 78% (Transport réévalué 80% → 55%). Frontend corrigé 90% → 87% (30+ pages admin manquantes).*
