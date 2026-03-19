# COWORK 8 — Features avancées manquantes (Backend + Frontend)

> **STATUT : ✅ TERMINÉ** — Complété via Cowork-5 (19 mars 2026)
> LOT 8.1 Quality Gate ✅, LOT 8.2 Runbook J0 ✅, LOT 8.3 Safety Sheets ✅, LOT 8.4 Duplicate Season ✅
> LOT 8.5 Email automation: partiellement fait (10/14 templates)
> LOT 8.6 NoGo Board: partiellement fait

> **Scope** : Runbook J0, Duplicate Season, Safety Sheets, Quality Gate, Email automation
> **Durée estimée** : ~12-16 jours Cowork
> **Dépendances** : Aucune — ces features sont indépendantes du code existant
> **Source** : MEGA-AUDIT-19-MARS-2026.md — Section 3 (Features non implémentées)

---

## CONTEXTE

Le draw.io v53 prévoit plusieurs features avancées qui n'existent pas encore dans le code. Cette session les implémente par ordre de priorité.

**AVANT TOUTE CHOSE**, lis ces fichiers :
1. `AME-EVENTY.md` — L'âme du produit
2. `MEGA-AUDIT-19-MARS-2026.md` — Section 3
3. `backend/prisma/schema.prisma` — Modèles existants
4. `backend/src/modules/` — Structure actuelle

---

## LOT 8.1 — Quality Gate Scoring (~1-2 jours)

### Objectif
Avant de publier un voyage, le système calcule un score de qualité. Le Pro voit ce score et les améliorations suggérées. L'Admin peut bloquer la publication si le score est trop bas.

### Backend
- Nouveau service `TravelQualityService` dans `src/modules/travels/`
- Critères de scoring (10 points chacun) :
  - Photos ≥ 5 → 10pts
  - Description ≥ 200 chars → 10pts
  - Programme jour par jour rempli → 10pts
  - Au moins 1 chambre type défini → 10pts
  - Au moins 1 arrêt bus défini → 10pts
  - Prix calculé → 10pts
  - Inclusion/exclusion remplies → 10pts
  - Équipe assignée (≥1 membre) → 10pts
  - Fiche sécurité remplie → 10pts
  - Photos hébergement → 10pts
- Score total sur 100, seuil publication = 70/100
- Endpoint : GET /pro/travels/:id/quality-score
- Admin override possible

### Frontend
- Widget score dans la page Pro création voyage
- Liste des améliorations suggérées avec liens directs
- Badge score dans la liste des voyages Pro

---

## LOT 8.2 — Runbook J0 (Jour du départ) (~3-5 jours)

### Objectif
Le jour du départ, le Pro terrain a une checklist structurée avec les procédures à suivre. C'est le "manuel de vol" de chaque voyage.

### Backend
- Nouveau module `src/modules/runbook/`
- Modèle Prisma `RunbookTemplate` (admin créé) + `RunbookInstance` (par voyage)
- Sections standard :
  - Pré-départ (J-1) : vérification bus, comptage passagers, distribution documents
  - Départ (J) : accueil au point de ramassage, appel nominatif, briefing sécurité
  - En route : timing arrêts, pauses, activités
  - Arrivée : check-in hôtel, distribution clés, briefing programme
  - Incidents : procédures urgence, contacts, escalation
- Endpoints CRUD + assignation par voyage
- Notes terrain en temps réel (mobile-first)

### Frontend
- Page Pro : `/pro/voyages/[id]/runbook`
- Vue mobile-first (l'indépendant est sur le terrain)
- Checklist cochable avec horodatage
- Section incidents avec upload photo

---

## LOT 8.3 — Safety Sheets / Fiches Sécurité (~2-3 jours)

### Objectif
Chaque voyage a une fiche sécurité spécifique. L'Admin peut créer des templates, le Pro les remplit.

### Backend
- Nouveau service dans `src/modules/documents/safety-sheet.service.ts`
- Modèle Prisma `SafetySheet` lié à Travel
- Sections : contacts urgence, hôpital le plus proche, pharmacie, procédures évacuation, assurance info, numéros SAMU/pompiers par étape
- Génération PDF automatique
- Templates Admin réutilisables

### Frontend
- Page Pro : section dans `/pro/voyages/[id]/securite`
- Page Admin : builder de templates dans `/admin/securite/templates`
- PDF downloadable pour impression terrain

---

## LOT 8.4 — Duplicate Season Wizard (~2-3 jours)

### Objectif
Un Pro peut cloner un voyage existant pour créer la saison suivante. Le wizard copie tout sauf les dates et réservations.

### Backend
- Endpoint : POST /pro/travels/:id/duplicate
- Copie : infos générales, programme, chambres, bus stops, équipe, photos
- Ne copie PAS : réservations, paiements, dates, statut (reset à DRAFT)
- Incrémente le nom : "Amsterdam Printemps 2026" → "Amsterdam Printemps 2027"

### Frontend
- Bouton "Dupliquer pour la saison suivante" dans la page détail voyage Pro
- Wizard 3 étapes : choisir les dates → vérifier les infos copiées → confirmer

---

## LOT 8.5 — Email Automation Complète (~2-3 jours)

### Objectif
Compléter les flows email automatisés qui manquent.

### Flows à implémenter
1. **Credit Issued** : quand un crédit est attribué (NoGo refund, geste commercial)
2. **NoGo Notification** : quand un voyage est annulé (min pax non atteint)
3. **Credit Expiry Reminder** : J-30 et J-7 avant expiration d'un crédit
4. **Waitlist Notification** : quand une place se libère sur un voyage complet
5. **Safety Sheet Ready** : quand la fiche sécurité est complétée (pour le Pro terrain)

### Backend
- Ajouter les triggers dans les services existants (cancellation, cron, documents)
- Templates email en français, ton chaleureux (AME-EVENTY)
- Outbox pattern existant réutilisé

---

## LOT 8.6 — NoGo Decision Board Admin (~1-2 jours)

### Objectif
Dashboard admin dédié pour gérer les décisions NoGo (annulation quand min pax non atteint).

### Frontend
- Page Admin : `/admin/nogo`
- Vue des 52 occurrences (planning annuel)
- Pour chaque voyage proche du deadline : pax actuel, min pax, deadline, décision (Go/NoGo/Extended)
- Historique des décisions avec audit log

---

## VALIDATION

Après chaque LOT :
```bash
cd backend && npx tsc --noEmit --skipLibCheck   # 0 erreur backend
cd frontend && npx tsc --noEmit --skipLibCheck   # 0 erreur frontend
cd backend && npm test                            # Tests passent
```

---

*Créé le 19 mars 2026 — Source : MEGA-AUDIT*
