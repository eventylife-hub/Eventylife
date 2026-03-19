# COWORK BACKEND SESSION 1 — FONDATIONS

> **Scope** : LOT 0 + LOT 1 + LOT 2 + LOT 3
> **Durée estimée** : ~10h Cowork
> **Dépendances** : AUCUNE — c'est la première brique
> **Les 2 autres sessions backend dépendent de celle-ci.**

---

## CONTEXTE

Tu es le développeur backend d'Eventy Life. Ton rôle : implémenter la logique métier réelle.

**AVANT TOUTE CHOSE**, lis ces fichiers :
1. `AME-EVENTY.md` — L'âme du produit
2. `PROGRAMME-BACKEND.md` — Le plan complet (13 LOTs)
3. `backend/prisma/schema.prisma` — 120 modèles, 125 enums, 3 486 lignes

**Stack** : NestJS 10 · Prisma 5 · PostgreSQL 15 · TypeScript strict
**Port** : 4000, prefix `/api` (dans `main.ts`)
**Le code existant** : le squelette est complet (services, controllers, guards, DTOs). Ta mission = compléter la logique métier.

---

## LOT 0 — INFRA & PRISMA (~1-2h)

### Objectif
S'assurer que la DB tourne, les migrations passent, le seed fonctionne.

### Tâches

**0.1 — Docker PostgreSQL**
```bash
docker compose up db -d
```
Vérifier la connexion avec `DATABASE_URL` dans `.env`.

**0.2 — Prisma generate + migrate**
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```
Si erreurs schema → les fixer. Le schema a 120 modèles + 125 enums.

**0.3 — Seed réaliste**
Fichier : `prisma/seed.ts`
Créer un seed avec :
- 5 users (1 admin, 2 pros, 2 clients)
- 2 ProProfiles (types AE et SARL)
- 3 voyages (1 DRAFT, 1 PUBLISHED, 1 COMPLETED)
- 5 bus stops
- 2 hôtels + 1 restaurant + 1 activité (HRA)
- 10 réservations (BookingGroup + RoomBooking)
- 5 paiements (PaymentContribution)
- Données financières cohérentes (TVA marge calculée)

Tester : `npx prisma db seed`

**0.4 — Supprimer les `as any` Prisma**
Après `prisma generate`, les casts `as any` dans ces fichiers ne sont plus nécessaires :
- `src/modules/client/client.service.ts` (lignes creditVoucher)
- `src/modules/pro/travels/pro-travels.controller.ts` (travelTeamMember, assignedRoomNumber)
- `src/modules/pro/pro.controller.ts` (travelTeamMember)
- `src/modules/public/public.controller.ts` (proFollower)
- `src/prisma/prisma.service.ts` ($on, $executeRawUnsafe)

Supprimer les `as any` et vérifier : `npx tsc --noEmit`

**0.5 — Installer supertest**
```bash
npm install --save-dev supertest @types/supertest
```

### Validation LOT 0
- [ ] `npx prisma validate` → 0 erreurs
- [ ] `npx prisma migrate dev` → migration OK
- [ ] `npx prisma db seed` → seed OK
- [ ] `npx tsc --noEmit` → 0 erreurs (sans --skipLibCheck)
- [ ] `npm run test` → tests passent

---

## LOT 1 — AUTH & RBAC (~3-4h)

### Objectif
Auth complète avec 2FA TOTP, refresh rotatif, RBAC 3 niveaux.

### Ce qui existe (2 006 lignes)
- `auth.service.ts` (819 lignes) : register, login, refresh, Argon2id ✅
- `auth.controller.ts` (631 lignes) : endpoints déclarés ✅
- `admin/rbac/rbac.service.ts` (205 lignes) : matrice RBAC ✅
- Guards : JwtAuthGuard, RolesGuard ✅
- DTOs : 8 fichiers ✅

### Ce qui manque

**1.1 — 2FA TOTP (Priorité haute)**
Fichiers : `auth/two-factor/`
- Générer secret TOTP (otpauth:// URI → QR code)
- Vérifier code TOTP (6 digits, window ±1)
- Activer/désactiver 2FA
- Chiffrer le secret en DB avec `TOTP_ENCRYPTION_KEY` (AES-256)
- Backup codes (10 codes one-time)
- Endpoints : `POST /auth/2fa/setup`, `POST /auth/2fa/verify`, `POST /auth/2fa/disable`
- Packages : `otplib`, `qrcode`

**1.2 — Refresh token rotatif**
- À chaque refresh, invalider l'ancien token et en émettre un nouveau
- Si un token déjà invalidé est réutilisé → révoquer toute la famille (sécurité)
- Stocker dans la table `RefreshToken` (Prisma model existant)

**1.3 — Rate limiting granulaire**
- `/auth/login` : 5 tentatives / 15 min par IP
- `/auth/register` : 3 / heure par IP
- `/auth/forgot-password` : 3 / heure par email
- Utiliser `@nestjs/throttler` déjà installé + décorateurs custom

**1.4 — Session management**
- Lister les sessions actives d'un user
- Révoquer une session spécifique
- Révoquer toutes les sessions (logout global)

**1.5 — IP allowlist admin (optionnel)**
- Guard qui vérifie l'IP pour les routes `/admin/*`
- Configurable via table `AdminSetting`

### Diagrammes draw.io
- `DEV_010_Auth_Flow_JWT_Refresh_2FA`
- `DEV_006_RBAC_Matrice_Endpoint_Complete`
- `96-98` (EmailVerify, ResetPw)

### Validation LOT 1
- [ ] Register → email de vérification
- [ ] Login → access token + refresh token (cookies httpOnly)
- [ ] Refresh → nouveau token + ancien invalidé
- [ ] 2FA setup → QR code → verify → login avec TOTP
- [ ] Rate limit → 429 après 5 tentatives
- [ ] RBAC → CLIENT ne peut pas accéder aux routes PRO/ADMIN
- [ ] `npm run test -- auth` → tous les tests passent

---

## LOT 2 — USERS & PROFILS (~1-2h)

### Objectif
CRUD utilisateur complet + préférences.

### Ce qui existe (543 lignes)
- `users.service.ts` (330 lignes)
- `users.controller.ts` (129 lignes)
- DTOs : 2 fichiers

### Ce qui manque

**2.1 — CRUD complet**
- GET /users/me → profil complet
- PUT /users/me → mise à jour profil
- PUT /users/me/password → changer mot de passe
- DELETE /users/me → soft delete (RGPD)

**2.2 — Upload avatar**
- POST /users/me/avatar → upload image
- Utiliser `uploads/s3.service.ts` (158 lignes existantes) → presigned URL
- Redimensionner (max 500x500, format WebP)

**2.3 — Préférences notifications**
Modèle Prisma : `NotificationPreference`
- Canaux : email, push, in-app
- Types : réservation, paiement, marketing, voyage
- Endpoint : PUT /users/me/notification-preferences

**2.4 — Préférences marketing**
- Opt-in/opt-out conformément RGPD
- Endpoint : PUT /users/me/marketing-preferences

### Validation LOT 2
- [ ] GET /users/me → profil complet
- [ ] PUT /users/me → mise à jour OK
- [ ] Upload avatar → URL S3 retournée
- [ ] Préférences sauvegardées en DB

---

## LOT 3 — ONBOARDING PRO (~3-4h)

### Objectif
Inscription Pro 5 types + workflow validation admin.

### Ce qui existe (657 lignes onboarding + 5 472 lignes pro total)
- `pro/onboarding/onboarding.service.ts` (554 lignes)
- `pro/pro.controller.ts` (2 314 lignes)
- DTOs : 12 fichiers

### Ce qui manque

**3.1 — 5 types de Pro**
Types dans `ProType` enum : `AUTO_ENTREPRENEUR`, `SARL_EURL`, `SAS_SASU`, `ASSOCIATION`, `COMITE_ENTREPRISE`
Chaque type a des documents obligatoires différents :
- AE : Kbis ou attestation, pièce identité
- SARL/SAS : Kbis, statuts, pièce identité dirigeant
- Association : récépissé JO, statuts, PV AG
- CE : attestation CE, PV désignation

**3.2 — Vérification SIRET**
- Appeler l'API INSEE (api.insee.fr/entreprises/sirene/V3)
- Vérifier que le SIRET correspond au type déclaré
- Fallback : accepter sans vérification si API down (log warning)

**3.3 — Upload documents Pro**
- Utiliser `uploads/` pour les fichiers
- Associer à `Document` model (type: PIECE_IDENTITE, CONTRAT, KBIS, etc.)
- Statut document : PENDING → VALIDATED / REJECTED

**3.4 — Workflow validation Admin**
Lifecycle ProProfile : `PENDING_REVIEW → APPROVED / REJECTED / CHANGES_REQUESTED`
- Admin voit la liste des Pros en attente
- Admin peut : approuver, rejeter, demander des modifications
- Chaque action → notification au Pro
- Endpoint admin : PUT /admin/pros/:id/validate

**3.5 — Email bienvenue Pro**
- Template Resend/Brevo
- Envoyé après approbation
- Contenu : bienvenue + lien vers formation + checklist

### Diagrammes draw.io
- `DEV_009_Pro_Onboarding_5_Types_Flow`
- `20-24` (Pro Auth SIRET Exécution)
- `26-32` (Onboarding ValidationPro)

### Validation LOT 3
- [ ] Inscription Pro AE → documents demandés
- [ ] Inscription Pro SAS → documents différents
- [ ] SIRET vérifié via API INSEE
- [ ] Admin valide → Pro passe APPROVED → email envoyé
- [ ] Admin rejette → Pro notifié
- [ ] `npm run test -- pro` → tests passent

---

## INVARIANTS À RESPECTER (TOUS LES LOTS)

```
1. pricingParts = occupancyCount (JAMAIS capacity)
2. perPersonTTC × occupancyCount + roundingRemainder == roomTotalTTC
3. Money = centimes Int (JAMAIS Float)
4. Idempotency sur tout (webhooks, uploads, opérations financières)
5. Lock post-paiement (chambre/occupation/assurance verrouillés)
6. TVA marge = (CA_TTC − coûts_TTC) × 20/120
7. Paiement reçu ≠ annulé par hold expiré
8. TravelGroupMember JOINED ≠ place consommée
```

## FIN DE SESSION

Quand tu as terminé :
1. `npx tsc --noEmit` → 0 erreurs
2. `npm run test` → tous les tests passent
3. Mettre à jour `PROGRESS.md` avec ce qui a été fait
4. Lister ce qui reste pour les sessions 2 et 3

---

*Session Backend 1/3 — Fondations*
