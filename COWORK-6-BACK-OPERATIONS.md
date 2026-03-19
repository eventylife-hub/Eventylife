# COWORK BACKEND SESSION 3 — OPÉRATIONS & SÉCURITÉ

> **Scope** : LOT 8 + LOT 9 + LOT 10 + LOT 11 + LOT 12 + LOT 13
> **Durée estimée** : ~17-22h Cowork
> **Dépendance** : Session 1 terminée (Auth + Prisma). Peut tourner EN PARALLÈLE avec Session 2.
> **Modules indépendants du flux Voyage/Booking.**

---

## CONTEXTE

Tu es le développeur backend d'Eventy Life. Cette session = tout ce qui fait tourner la plateforme au quotidien.

**LIRE EN PREMIER** :
1. `AME-EVENTY.md` — L'âme du produit
2. `PROGRAMME-BACKEND.md` — LOTs 8 à 13
3. `backend/prisma/schema.prisma`

**Stack** : NestJS 10 · Prisma 5 · PostgreSQL 15 · TypeScript strict

---

## LOT 8 — NOTIFICATIONS & EMAILS (~3-4h)

### Ce qui existe (1 333 lignes notifications + 1 750 lignes email + 1 213 lignes cron)

### Tâches

**8.1 — Système notifications multi-canal**
Canaux : email, push (future), in-app
- Créer `NotificationDispatcher` qui route vers le bon canal
- Respecter les préférences utilisateur (LOT 2)
- In-app : stocker dans table `Notification`, marquer lu/non-lu
- Endpoints : `GET /notifications`, `PUT /notifications/:id/read`, `PUT /notifications/read-all`

**8.2 — 14 templates emails**
Utiliser Resend ou Brevo (configurable via `EMAIL_PROVIDER`).
Templates à implémenter :
1. Bienvenue client
2. Vérification email
3. Reset mot de passe
4. Confirmation réservation
5. Facture PDF
6. Rappel paiement
7. Rappel départ J-7
8. Rappel départ J-1
9. Post-voyage (demande avis)
10. Bienvenue Pro
11. Pro approuvé
12. Pro rejeté
13. NoGo voyage
14. Annulation + avoir

Chaque template = HTML responsive + version texte.

**8.3 — Outbox pattern**
- Table `OutboxMessage` (déjà dans schema?)
- Cron qui dépile les messages non envoyés
- Retry avec backoff exponentiel (3 tentatives)
- Garantie : chaque email envoyé exactement 1 fois

**8.4 — Cron jobs métier**
Vérifier/compléter dans `cron.service.ts` (1 213 lignes) :
- Rappel paiement (J-3 avant expiration)
- Expiration holds 24h
- Rappel départ J-7 et J-1
- Post-voyage J+2 (demande avis)
- Purge sessions expirées
- Expiration crédits/avoirs
- Nettoyage uploads orphelins
- Recalcul stats dashboard

### Diagrammes draw.io
- `DEV_005_Email_Templates_14_Complets`
- `DEV_013_Cron_Jobs_9_Details_Complets`
- `45-47` (Notifications Templates)

### Validation LOT 8
- [ ] Email envoyé via Resend/Brevo (au moins 3 templates testés)
- [ ] Notification in-app créée + listée + marquée lue
- [ ] Outbox : message en queue → envoyé par cron → marqué SENT
- [ ] Crons : simuler expiration hold → booking annulé
- [ ] `npm run test -- notifications email cron` → OK

---

## LOT 9 — DOCUMENTS & LEGAL (~3-4h)

### Ce qui existe (1 216 lignes documents + 2 037 lignes legal)

### Tâches

**9.1 — Génération PDF**
Utiliser `pdf-generator.service.ts` (346 lignes existantes).
PDFs à générer :
- Facture client (après paiement)
- Confirmation réservation
- Contrat Pro (après approbation)
- Attestation voyage (après COMPLETED)
- Export données RGPD (ZIP)

**9.2 — Signature électronique Pro**
- Le Pro signe son contrat numériquement
- Hash SHA-256 du document + timestamp = signature
- Stocké dans Document (signedAt, signatureHash)
- Pas besoin de tiers comme DocuSign (signature simple)

**9.3 — RGPD DSAR complet**
Fichier : `legal/dsar.service.ts` (673 lignes existantes)
- GET /legal/my-data → export JSON de toutes les données du user
- DELETE /legal/my-data → anonymisation (soft delete + purge PII)
- Délai légal : 30 jours max
- Log chaque demande DSAR dans AuditLog

**9.4 — Data Erasure**
Fichier : `legal/data-erasure.service.ts` (563 lignes existantes)
- Anonymiser : firstName → "***", email → hash, phone → null
- Conserver les données financières (obligation légale 10 ans)
- Supprimer : avatar, documents perso, préférences

**9.5 — Rétention données automatique**
Cron mensuel :
- Comptes inactifs > 3 ans → notification de suppression
- Comptes inactifs > 3 ans + 30 jours → anonymisation auto
- Logs d'audit > 5 ans → purge

**9.6 — CGV versionnées**
- Chaque version des CGV a un numéro + date
- L'utilisateur accepte une version spécifique
- Historique des acceptations conservé

### Diagrammes draw.io
- `29` (Centre Documents Signatures)
- `48-50` (Pro Docs Signatures)
- `A-015` (DSAR Export RGPD)

### Validation LOT 9
- [ ] PDF facture généré avec bonnes données
- [ ] DSAR : export JSON complet
- [ ] Data erasure : PII anonymisées, données financières conservées
- [ ] CGV : version acceptée stockée
- [ ] `npm run test -- documents legal` → OK

---

## LOT 10 — SUPPORT & COMMUNICATION (~2-3h)

### Ce qui existe (392 lignes support)

### Tâches

**10.1 — Tickets support**
- Création : `POST /support/tickets` (client ou pro)
- Catégories : RESERVATION, PAYMENT, TECHNICAL, CANCELLATION, OTHER
- Priorité : LOW, MEDIUM, HIGH, URGENT
- Assignation auto à un admin (round-robin ou par catégorie)
- Statut : OPEN → IN_PROGRESS → WAITING_RESPONSE → RESOLVED → CLOSED

**10.2 — SLA (Service Level Agreement)**
- URGENT : réponse < 1h
- HIGH : réponse < 4h
- MEDIUM : réponse < 24h
- LOW : réponse < 72h
- Cron qui vérifie les SLA dépassés → alerte admin

**10.3 — Messagerie Pro ↔ Client**
- Conversation liée à une réservation
- Messages texte + pièces jointes
- Endpoints : `POST /messages/:bookingId`, `GET /messages/:bookingId`
- Notification quand nouveau message

**10.4 — Escalade auto**
- Si SLA dépassé → escalade au niveau supérieur
- Si 3 messages sans réponse admin → alerte Slack/email

### Validation LOT 10
- [ ] Ticket créé → assigné → résolu → fermé
- [ ] SLA dépassé → alerte envoyée
- [ ] Message Pro→Client → notification
- [ ] `npm run test -- support` → OK

---

## LOT 11 — MARKETING & GROUPES (~3-4h)

### Ce qui existe (1 343 lignes marketing + 1 476 lignes groups)

### Tâches

**11.1 — Campagnes marketing Pro**
- Créer campagne : nom, dates, budget, cible
- Types : email, QR code, affiche, réseaux sociaux
- Tracking : impressions, clics, conversions
- Endpoints CRUD : `/pro/marketing/campaigns`

**11.2 — QR codes + shortlinks**
- Générer QR code pour un voyage (PNG/SVG)
- Shortlink trackable (eventy.life/v/xyz)
- Compteur de scans/clics
- Package : `qrcode`

**11.3 — Leads capture**
- Formulaire de pré-inscription (avant publication voyage)
- Capturer : nom, email, téléphone, voyage intéressé
- Statut : NEW → CONTACTED → CONVERTED → LOST
- Endpoints Pro : `GET /pro/leads`, `PUT /pro/leads/:id`

**11.4 — Travel Groups social**
- Créer un groupe de voyage (entité sociale)
- Inviter par email ou lien
- Statut membre : INVITED → JOINED → LEFT
- Smart invite : suggestion de membres
- Partage de photos, messages dans le groupe
- **INVARIANT 8** : TravelGroupMember JOINED ≠ place consommée (la place est consommée au BOOKING, pas au JOIN)

**11.5 — SEO**
- JSON-LD pour chaque voyage (schema.org/TravelAction)
- Sitemap XML auto-généré
- Meta descriptions dynamiques
- Slug SEO-friendly

### Diagrammes draw.io
- `03_Marketing_Hub_V15`
- `V300-V323` (Travel Groups)
- `440-476` (Marketing Hub complet)

### Validation LOT 11
- [ ] Campagne créée → QR code généré → tracking OK
- [ ] Lead capturé → Pro le voit → statut mis à jour
- [ ] Groupe créé → invitation → membre rejoint
- [ ] JSON-LD correct sur page voyage
- [ ] `npm run test -- marketing groups seo` → OK

---

## LOT 12 — ADMIN AVANCÉ (~2-3h)

### Ce qui existe (4 263 lignes admin)

### Tâches

**12.1 — Dashboard admin KPIs**
Enrichir les agrégats temps réel :
- CA total / CA mois / CA jour
- Nb réservations (par statut)
- Nb Pros (par statut validation)
- Nb voyages (par lifecycle)
- Taux de conversion (visiteurs → réservation)
- Top 5 voyages par CA

**12.2 — Feature Flags**
- CRUD feature flags : nom, description, enabled, rollout %
- Break-glass : toggle d'urgence (bypass les checks normaux)
- 4-eyes : certaines features nécessitent 2 admins pour activer
- Audit log sur chaque changement

**12.3 — Exports admin**
- CSV : utilisateurs, réservations, finance
- Excel : rapports mensuels
- PDF : résumé exécutif
- Tous filtables par date, statut

**12.4 — Monitoring métier**
- Endpoint health enrichi : DB, Redis, Stripe, email, S3
- Alertes si un service down
- Métriques : temps réponse moyen, erreurs 5xx, queue emails

### Diagrammes draw.io
- `DEV_004_Admin_Parametres_Centralisé`
- `DEV_019_Admin_Dashboard_Home_UI_Exact`
- `285` (Feature Flags Changelog Audit)

### Validation LOT 12
- [ ] Dashboard : tous les KPIs retournés
- [ ] Feature flag : créer → toggle → audit log
- [ ] Export CSV : données correctes
- [ ] Health check : tous les services vérifiés
- [ ] `npm run test -- admin exports health` → OK

---

## LOT 13 — SÉCURITÉ & HARDENING (~3-4h)

### Tâches

**13.1 — OWASP Top 10 check**
- [ ] Injection SQL → Prisma paramétré ✅ (vérifier)
- [ ] XSS → sanitize inputs (class-validator + class-transformer)
- [ ] CSRF → Double Submit Cookie ✅ (vérifier)
- [ ] Auth broken → refresh rotatif ✅ (LOT 1)
- [ ] Security misconfiguration → Helmet headers
- [ ] Sensitive data exposure → pas de secrets en logs
- [ ] Missing access control → RBAC ✅ (LOT 1)

**13.2 — CSP headers**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    }
  }
}));
```

**13.3 — Input sanitization**
- Vérifier que TOUS les DTOs utilisent class-validator
- @IsString(), @IsEmail(), @IsInt(), @MinLength(), @MaxLength()
- @Transform() pour trim et sanitize

**13.4 — Rate limiting production**
- Global : 100 req/min par IP
- Auth : 5/15min par IP
- Checkout : 10/min par user
- Upload : 5/min par user
- Admin : 200/min (plus permissif)

**13.5 — CORS production**
- Seuls les domaines dans `CORS_ORIGINS` autorisés
- Pas de wildcard en production
- Credentials: true pour les cookies

**13.6 — Compliance EU/FR (77 points)**
Checklist draw.io `803-806` :
- RGPD : consentement, droit à l'oubli, portabilité
- Directive voyages à forfait (UE 2015/2302)
- TVA marge (Article 267 CGI)
- Mentions légales conformes
- CGV conformes tourisme

**13.7 — Tests de charge (optionnel)**
- k6 scénarios : 100 users concurrent, checkout flow
- Identifier bottlenecks

### Diagrammes draw.io
- `DEV_017_API_Endpoints_Complets_MVP`
- `DEV_018_Go_Live_Checklist_Complète`
- `T-075` (Protection XSS)
- `T-076` (Protection SQL Injection)

### Validation LOT 13
- [ ] OWASP Top 10 : tous les points vérifiés
- [ ] CSP headers : actifs en production
- [ ] Rate limiting : 429 sur dépassement
- [ ] CORS : seuls les domaines autorisés
- [ ] `npm run test` → TOUS les tests passent
- [ ] `npx tsc --noEmit` → 0 erreurs

---

## FIN DE SESSION

1. `npx tsc --noEmit` → 0 erreurs
2. `npm run test` → tous les tests passent
3. Mettre à jour `PROGRESS.md`
4. La plateforme est **production-ready** côté backend

---

*Session Backend 3/3 — Opérations & Sécurité*
