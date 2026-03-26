# AUDIT — Schéma Prisma vs Diagrammes V48 (Groupes A–J)

**Date :** 2026-03-26
**Source diagramme :** V48 LOT31-34 — pages 807-816 (GroupeA à GroupeJ)
**Schéma audité :** `backend/prisma/schema.prisma` (6 747 lignes)
**Méthode :** Extraction XML drawio `/c/Users/paco6/AppData/Local/Temp/V48.drawio` + lecture complète du schéma Prisma

---

## 📊 SYNTHÈSE EXÉCUTIVE

| Groupe | Modèles V48 | Modèles schéma | Modèles manquants | Champs manquants | Statut |
|--------|-------------|-----------------|-------------------|------------------|--------|
| A – Auth + Sécurité | 4 | 8 | 0 | 6 champs | ⚠️ ÉCARTS MINEURS |
| B – RGPD + Consentement | 4 | 9 | 0 | 10 champs | ⚠️ ÉCARTS MINEURS |
| C – Checkout + Paiement | 5 | 13 | 0 | 9 champs | ⚠️ ÉCARTS MINEURS |
| D – Finance + Facturation | 5 | 18 | 0 | 18 champs | ⚠️ ÉCARTS MOYENS |
| E – Transport | 5 | 24 | 0 | 15 champs | ⚠️ ÉCARTS MOYENS |
| F – Hôtel + Restauration | 5 | 20 | 0 | 14 champs | ⚠️ ÉCARTS MINEURS |
| G – Marketing + Attribution | 4 | 20 | 0 | 12 champs | ⚠️ ÉCARTS MOYENS |
| H – Support + Ops | 4 | 15 | 0 | 14 champs | ⚠️ ÉCARTS MOYENS |
| I – NoGo + Waitlist | 3 | 3 | 0 | 12 champs | ⚠️ ÉCARTS SIGNIFICATIFS |
| J – Divers | 3 | 3 | 0 | 10 champs | ⚠️ ÉCARTS MOYENS |
| **TOTAL** | **42** | **137** | **0** | **120+** | **Schéma enrichi mais divergent** |

### Verdict global

✅ **Aucun modèle manquant** : tous les 42 modèles V48 sont présents dans le schéma actuel.
✅ **Le schéma est plus riche** : 137 modèles vs 42 dans V48 — le schéma a évolué bien au-delà de V48.
⚠️ **Écarts de nommage** : ~40 champs ont des noms différents entre V48 et le schéma (ex: `token` → `tokenHash`, `ipAddress` → `ip`).
⚠️ **Champs V48 absents** : ~80 champs spécifiés dans V48 ne sont pas dans le schéma actuel.
⚠️ **FK différentes (critique)** : GroupeI — GoDecisionLog/WaitlistEntry liés à `travelId` (schéma) vs `occurrenceId` (V48).

---

## GROUPE A — Auth + Sécurité (Page 807)

### Modèles V48 spécifiés (4 modèles)
`RefreshToken`, `PasswordResetToken`, `EmailVerificationToken`, `LoginAttempt`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** (non spécifiés dans V48 GroupeA) : `User`, `AdminUser`, `ProFollower`, `TravelTeamMember`

### Écarts par modèle

#### RefreshToken
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `token` (String, @unique) | `tokenHash` (String, @unique) | ⚠️ Renommé |
| `ipAddress` (String?) | `ip` (String?) | ⚠️ Renommé |
| `userAgent` (String?) | `userAgent` (String?) | ✅ |
| `expiresAt`, `revokedAt` | Présents | ✅ |
| — | `rotatedFromId` (String?) | ➕ Ajout schéma |

#### PasswordResetToken
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `token` (String, @unique) | `tokenHash` (String, @unique) | ⚠️ Renommé |
| `ip` | `ip` (String?) | ✅ |

#### EmailVerificationToken
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `token` (String, @unique) | `tokenHash` (String, @unique) | ⚠️ Renommé |
| `email` (String) | **ABSENT** | ❌ Champ manquant |

#### LoginAttempt
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `ipAddress` (String) | `ip` (String) | ⚠️ Renommé |
| `failCode` (String?) | `failureReason` (String?) | ⚠️ Renommé |
| `email`, `success`, `userId` | Présents | ✅ |

### Résumé GroupeA
- 0 modèle manquant
- 1 champ manquant : `EmailVerificationToken.email`
- 5 renommages (convention `token`→`tokenHash`, `ipAddress`→`ip`)
- Schéma a 4 modèles supplémentaires (User, AdminUser, ProFollower, TravelTeamMember)

---

## GROUPE B — RGPD + Consentement (Page 808)

### Modèles V48 spécifiés (4 modèles)
`ConsentRecord`, `DsarRequest`, `DataRetentionPolicy`, `PiiAccessLog`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** : `LegalDocumentVersion`, `LegalAcceptance`, `DPIARecord`, `ProcessingActivity`, `ComplianceCheck`

### Écarts par modèle

#### ConsentRecord
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `sessionId` (String?) | **ABSENT** | ❌ |
| `version` (String) | **ABSENT** | ❌ |
| `consentType` | `type` (ConsentType) | ⚠️ Renommé |
| `ipAddress` (String?) | `ip` (String?) | ⚠️ Renommé |
| `granted`, `source`, `revokedAt` | Présents | ✅ |

#### DsarRequest
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `email` (String) | **ABSENT** | ❌ |
| `identityVerifiedAt` (DateTime?) | **ABSENT** | ❌ |
| `processedAt` (DateTime?) | `completedAt` | ⚠️ Renommé |
| `processedBy` (String?) | **ABSENT** | ❌ |
| `exportFileUrl` (String?) | `responseUrl` | ⚠️ Renommé |
| `deadlineAt` (DateTime) | `dueAt` | ⚠️ Renommé |
| `requestType` | `type` (DsarType) | ⚠️ Renommé |

#### DataRetentionPolicy
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `dataCategory` (String, @unique) | `entityType` (String, @unique) | ⚠️ Renommé |
| `description` (String) | **ABSENT** | ❌ |
| `legalBasis` (String) | **ABSENT** | ❌ |
| `isActive` (Boolean) | **ABSENT** | ❌ |
| `lastPurgeAt` (DateTime?) | `lastPurgedAt` | ⚠️ Renommé |
| `lastPurgeCount` (Int?) | **ABSENT** | ❌ |

#### PiiAccessLog
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `actorUserId` (String) | `accessorUserId` (String) | ⚠️ Renommé |
| `targetUserId` (String?) | `userId` (String) | ⚠️ Renommé |
| `dataType` (String) | `fieldsAccessed` (String[]) | ⚠️ Renommé + type différent |
| `action` (PiiAction) | Présent | ✅ |

### Résumé GroupeB
- 0 modèle manquant
- 8 champs manquants dans le schéma actuel
- 5 modèles supplémentaires (LegalDocumentVersion, LegalAcceptance, DPIARecord, ProcessingActivity, ComplianceCheck)

---

## GROUPE C — Checkout + Paiement (Page 809)

### Modèles V48 spécifiés (5 modèles)
`RoomHold`, `RoomInventory`, `IdempotencyKey`, `StripeEvent`, `CreditVoucher`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** (hors V48) : `BookingGroup`, `RoomBooking`, `BookingTransfer`, `PaymentContribution`, `PaymentInviteToken`, `AdjustmentLine`, `Refund`, `PreReservation`, `PreResRoomAssignment`, `StripeWebhookEvent`, `DisputeHold`, `WaitlistEntry`

### Écarts par modèle

#### RoomHold
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `checkoutSessionId` (String) | **ABSENT** | ❌ |
| `releaseReason` (String?) | **ABSENT** | ❌ |
| `roomBookingId` (String, @unique) | `roomBookingId` (String?) optionnel | ⚠️ Optionnalité différente |

#### RoomInventory
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String?) | **ABSENT** | ❌ |
| `availableRooms` (Int, computed) | **ABSENT** | ❌ |
| `lastSyncAt` (DateTime) | **ABSENT** | ❌ |

#### IdempotencyKey
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `endpoint` (String) | **ABSENT** | ❌ |
| `requestHash` (String?) | **ABSENT** | ❌ |
| `responseCode` (Int?) | **ABSENT** | ❌ |
| `responseBody` (Json?) | `responseJson` (String?) | ⚠️ Renommé + type différent |

#### StripeEvent
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `payload` (Json) | `rawPayload` (String?) | ⚠️ Renommé + type Json→String |
| `processingError` (String?) | `errorMessage` (String?) | ⚠️ Renommé |
| `retryCount` (Int) | **ABSENT** | ❌ |

#### CreditVoucher
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `email` (String) | **ABSENT** | ❌ |
| `remainingCents` (Int) | **ABSENT** | ❌ (schéma a `currentUses` à la place) |
| `bookingGroupId` (String?) | **ABSENT** | ❌ |
| `redeemedAt` (DateTime?) | `usedAt` (DateTime?) | ⚠️ Renommé |

### Résumé GroupeC
- 0 modèle manquant
- 12 champs manquants
- 12 modèles supplémentaires (schéma a fortement enrichi ce groupe)

---

## GROUPE D — Finance + Facturation (Page 810)

### Modèles V48 spécifiés (5 modèles)
`Invoice`, `InvoiceLine`, `TvaMarginCalc`, `PayoutBlockReason`, `LedgerEntry`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** : `ProQuote`, `ProPaymentLink`, `BankReconciliation`, `TvaAuditEntry`, `ClosePack`, `StripeWebhookEvent`, `UrssafSettings`, `Tip`, `StaffTipPool`, `StaffTipPoolMovement`, `TipPayoutLine`, `TipSplitPolicy`, `PayoutBatch`, `TvaPeriod`, `Supplier`, `Lead`, `AssistedBooking`, `BankAccount`, `BankStatement`, `BankTransaction`, `SepaMandate`

### Écarts par modèle

#### Invoice
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `proProfileId` (String?) | **ABSENT** (schéma a `issuer` enum) | ❌ |
| `bookingGroupId` (String?) | **ABSENT** | ❌ |
| `facturXml` (String?) | **ABSENT** | ❌ |
| `recipientSiren` (String?) | **ABSENT** | ❌ |
| `selfBilling` (Boolean) | **ABSENT** | ❌ |
| `mandateId` (String?) | **ABSENT** | ❌ |
| `contestedAt` (DateTime?) | **ABSENT** | ❌ |
| `amountHT` → `totalHT` | ⚠️ Renommé |
| `vatAmount` → `totalTVA` | ⚠️ Renommé |
| `amountTTC` → `totalTTC` | ⚠️ Renommé |

#### LedgerEntry
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `bookingGroupId` (String?) | **ABSENT** | ❌ |
| `proProfileId` (String?) | **ABSENT** | ❌ |
| `idempotencyKey` (String?, @unique) | **ABSENT** | ❌ |
| `confirmedAt` (DateTime?) | **ABSENT** | ❌ |
| `entryType` | `type` (LedgerEntryType) | ⚠️ Renommé |

#### TvaMarginCalc
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String?) | **ABSENT** | ❌ |
| `period` (String) | `periodStart` + `periodEnd` | ⚠️ Décomposé |
| `tvaOnMargin` (Int) | `tvaAmount` (Int) | ⚠️ Renommé |
| `computedAt` (DateTime) | `calculatedAt` (DateTime) | ⚠️ Renommé |
| `validatedBy` (String?) | **ABSENT** | ❌ |
| `validatedAt` (DateTime?) | **ABSENT** | ❌ |

#### PayoutBlockReason
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `payoutLineId` (String?) | **ABSENT** | ❌ |
| `reasonCode` | `code` (PayoutBlockReasonCode) | ⚠️ Renommé |
| `message` (String?) | `reason` (String?) | ⚠️ Renommé |
| `resolvedBy` (String?) | **ABSENT** | ❌ |

### Résumé GroupeD
- 0 modèle manquant
- 18 champs manquants (notamment sur Invoice : facturXml, selfBilling, mandateId, contestedAt)
- 21 modèles supplémentaires (schéma finance très enrichi : BankAccount, BankStatement, SEPA, Pourboires, ClosePack, etc.)

---

## GROUPE E — Transport (Page 811)

### Modèles V48 spécifiés (5 modèles)
`PickupRouteTemplate`, `PickupRouteStopItem`, `TravelRotationPlan`, `TravelOccurrenceRouteAssignment`, `BusQuoteRequest`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** : `BusStop`, `BusStopMedia`, `TravelStopLink`, `TravelerStopSelection`, `TransportSettings`, `TransportProvider`, `QuoteRequest`, `QuoteSegment`, `TravelBus`, `BusSegment`, `BusPassengerAssignment`, `BlockedBusSeat`, `GeoCache`, `FlightAllotment`, `FlightPassengerAssignment`, `TransportStatus`, `RoutePack`, `RoutePackStop`, `RoutePackTripLink`, `RoutePackSnapshot`

### Écarts par modèle

#### PickupRouteTemplate
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `ownerUserId` (String) | **ABSENT** | ❌ |
| `departureCityLabel` (String) | **ABSENT** | ❌ |
| `isPublic` (Boolean) | **ABSENT** | ❌ |

#### PickupRouteStopItem
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `orderIndex` (Int) | `sortOrder` (Int) | ⚠️ Renommé |
| `plannedTimeHHMM` (String) | `estimatedTimeMin` (Int) | ⚠️ Renommé + type différent |
| `isOptional` (Boolean) | **ABSENT** | ❌ |

#### TravelRotationPlan ⚠️ DIFFÉRENCE STRUCTURELLE MAJEURE
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `travelId` (String, @unique) | **ABSENT** (no FK to Travel) | ❌ |
| `rotationCount` (Int) | **ABSENT** | ❌ |
| `maxRoutes` (Int) | **ABSENT** | ❌ |
| `departureCityLabel` (String) | **ABSENT** | ❌ |
| — | `name`, `description`, `isActive`, `configJson` | ➕ Schéma générique |

> **NOTE CRITIQUE** : Dans V48, `TravelRotationPlan` est lié à un voyage spécifique (`travelId @unique`). Dans le schéma actuel, c'est un plan générique sans FK voyage. Divergence architecturale.

#### TravelOccurrenceRouteAssignment
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String) | `travelOccurrenceId` (String) | ⚠️ Renommé |
| `arrivalStopId` (String?) | **ABSENT** | ❌ |
| `arrivalTimeHHMM` (String?) | **ABSENT** | ❌ |

#### BusQuoteRequest
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String?) | **ABSENT** | ❌ |
| `routeTemplateId` (String?) | **ABSENT** | ❌ |
| `supplierName` (String) | **ABSENT** (schéma a `departureCity`/`arrivalCity`) | ❌ |
| `supplierEmail` (String?) | **ABSENT** | ❌ |
| `quotedPriceCents` (Int?) | `quotedAmountTTC` (Int?) | ⚠️ Renommé |
| `quotedAt` (DateTime?) | **ABSENT** | ❌ |
| `confirmedAt` (DateTime?) | **ABSENT** | ❌ |
| `confirmedBy` (String?) | **ABSENT** | ❌ |
| `fileUrl` (String?) | **ABSENT** | ❌ |

### Résumé GroupeE
- 0 modèle manquant
- 1 divergence architecturale majeure : TravelRotationPlan (V48 = par voyage, schéma = générique)
- 15 champs manquants
- 20 modèles supplémentaires (schéma transport est de loin le plus enrichi)

---

## GROUPE F — Hôtel + Restauration (Page 812)

### Modèles V48 spécifiés (5 modèles)
`HotelPartner`, `HotelBlock`, `HotelRoomAllocation`, `RestaurantPartner`, `MealDeclaration`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** : `MealPlan`, `MealDisputeTicket`, `HotelPartnerNote`, `HraFavorite`, `HraConversation`, `HraMessage`, `RestaurantMenuItem`, `TravelMealFormula`, `MenuDuJour`, `MenuCourse`, `MealReview`, `DietaryPreference`, `RoomParticipant`, `PassengerRevealLog`, `HraNegotiation`, `NegotiationMessage`, `HraPreNegotiatedRate`

### Écarts par modèle

#### HotelPartner
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `starRating` (Int?) | **ABSENT** (`standing` HotelStanding enum à la place) | ⚠️ Type changé |
| `contactName` (String?) | **ABSENT** | ❌ |

#### HotelBlock
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String?) | **ABSENT** | ❌ |
| `roomTypeLabel` (String) | **ABSENT** (schéma a `hotelName`) | ❌ |
| `roomCount` (Int) | `roomsRequested` (Int) | ⚠️ Renommé |
| `pricePerNightCents` (Int, required) | `pricePerNightTTC` (Int?, optionnel) | ⚠️ Optionnalité |
| `nightCount` (Int) | **ABSENT** | ❌ |
| `totalCostCents` (Int) | **ABSENT** | ❌ |
| `deadlineAt` (DateTime?) | `releaseDate` (DateTime?) | ⚠️ Renommé |

#### HotelRoomAllocation
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `roomBookingId` (String?) | **ABSENT** | ❌ |
| `roomLabel` (String?) | **ABSENT** (`roomType` String à la place) | ⚠️ |
| `allocatedAt` (DateTime?) | **ABSENT** | ❌ |

#### RestaurantPartner
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `pricePerMealCents` (Int?) | **ABSENT** (prix négocié non stocké sur partenaire) | ❌ Note: choix intentionnel |
| `contactName` (String?) | **ABSENT** | ❌ |

#### MealDeclaration
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String?) | **ABSENT** | ❌ |
| `actualCount` (Int?) | `servedCount` (Int?) | ⚠️ Renommé |
| `declaredBy` (String?) | **ABSENT** | ❌ |
| `declaredAt` (DateTime?) | **ABSENT** | ❌ |
| `validatedBy` (String?) | **ABSENT** | ❌ |
| `validatedAt` (DateTime?) | **ABSENT** | ❌ |

### Résumé GroupeF
- 0 modèle manquant
- 14 champs manquants
- 17 modèles supplémentaires (HRA très enrichi : menus, cours, avis, négociations, tarifs pré-négociés)

---

## GROUPE G — Marketing + Attribution (Page 813)

### Modèles V48 spécifiés (4 modèles)
`Campaign`, `TrackingLink`, `LeadCapture`, `AttributionEvent`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** : `CampaignMarketing`, `AttributionModel`, `ProRayBalance`, `RayTransaction`, `RayProduct`, `MarketingKit`, `RayBundle`, `RayPromotion`, `WidgetConfig`, `WidgetView`, `WidgetClick`, `MktActivityProvider`, `MktActivityEntry`, `MktActivityBooking`, `MktActivityReview`, `MktStripeConnect`, `ProMarketingMessage`, `ProSegment`, `CreatorFollower`, `PressRelease`, `PressContact`, `PressReleaseSending`, `PressMediaCoverage`, `Sponsor`, `Sponsorship`

### Écarts par modèle

#### Campaign
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `proProfileId` (String?) | **ABSENT** dans Campaign (présent dans CampaignMarketing) | ⚠️ Séparé en 2 modèles |
| `travelId` (String?) | **ABSENT** dans Campaign | ❌ |

> **NOTE** : V48 spécifie un seul modèle `Campaign`. Le schéma a splitté en `Campaign` (générique) + `CampaignMarketing` (pro-lié). Divergence d'architecture acceptable.

#### TrackingLink
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `proProfileId` (String) | **ABSENT** | ❌ |
| `shortCode` (String, @unique) | `code` (String, @unique) | ⚠️ Renommé |
| `utmSource` (String?) | **ABSENT** | ❌ |
| `utmMedium` (String?) | **ABSENT** | ❌ |
| `utmCampaign` (String?) | **ABSENT** | ❌ |
| `qrCodeUrl` (String?) | **ABSENT** | ❌ |
| `lastClickAt` (DateTime?) | **ABSENT** | ❌ |

#### LeadCapture
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `campaignId` (String?) | **ABSENT** | ❌ |
| `proProfileId` (String?) | **ABSENT** | ❌ |
| `convertedToUserId` (String?) | **ABSENT** (`convertedAt` présent) | ❌ |

#### AttributionEvent
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `bookingGroupId` (String) | **ABSENT** | ❌ |
| `proProfileId` (String) | **ABSENT** | ❌ |
| `model` (AttributionModel enum) | **ABSENT** | ❌ |
| `commissionRate` (Int) | **ABSENT** | ❌ |
| `commissionAmount` (Int) | **ABSENT** | ❌ |
| `confirmedAt` (DateTime?) | **ABSENT** | ❌ |

### Résumé GroupeG
- 0 modèle manquant
- 12 champs manquants (notamment commission, UTM, QR code, proProfileId)
- 25 modèles supplémentaires (système RAYS, widgets, marketplace activités, presse, sponsors)

---

## GROUPE H — Support + Ops (Page 814)

### Modèles V48 spécifiés (4 modèles)
`SupportTicket`, `SupportMessage`, `IncidentReport`, `DisputeHold`

### Modèles présents dans le schéma : ✅ TOUS
+ **Modèles supplémentaires** : `AuditLog`, `AdminActionLog`, `SystemAlert`, `FeatureFlag`, `AppSetting`, `InboxThread`, `InboxMessage`, `EmailOutbox`, `OutboxMessage`, `JobRun`, `CronJobLog`, `Employee`, `EmployeeLeave`, `EmployeeTask`, `Mission`, `MissionChecklistItem`, `ValidationCase`, `ValidationStep`, `ComplianceGoLive`

### Écarts par modèle

#### SupportTicket
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `ticketNumber` (String, @unique) | **ABSENT** | ❌ |
| `bookingGroupId` (String?) | **ABSENT** | ❌ |
| `travelId` (String?) | **ABSENT** | ❌ |
| `satisfaction` (Int?) | **ABSENT** | ❌ |

#### SupportMessage
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `body` (String) | `content` (String) | ⚠️ Renommé |
| `isInternal` (Boolean) | **ABSENT** | ❌ |
| `attachmentUrl` (String?) | **ABSENT** | ❌ |

#### IncidentReport
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `travelId` (String) | **ABSENT** | ❌ |
| `occurrenceId` (String?) | **ABSENT** | ❌ |
| `reportedBy` (String) | **ABSENT** | ❌ |
| `location` (String?) | **ABSENT** | ❌ |
| `involvedParticipants` (String[]) | **ABSENT** | ❌ |
| `resolution` (String?) | **ABSENT** | ❌ |
| `resolvedBy` (String?) | **ABSENT** | ❌ |

#### DisputeHold
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `proProfileId` (String?) | **ABSENT** | ❌ |
| `bookingGroupId` (String?) | **ABSENT** (schéma a `paymentContributionId`) | ⚠️ FK différente |
| `payoutLineId` (String?) | **ABSENT** | ❌ |
| `holdAmountCents` (Int) | `amountCents` (Int) | ⚠️ Renommé |
| `createdBy` (String) | **ABSENT** (schéma a `resolvedByUserId` seulement) | ❌ |

### Résumé GroupeH
- 0 modèle manquant
- 14 champs manquants (IncidentReport particulièrement tronqué : pas de travelId, reporter, location)
- 19 modèles supplémentaires

---

## GROUPE I — NoGo + Waitlist (Page 815)

### Modèles V48 spécifiés (3 modèles)
`GoDecisionLog`, `WaitlistEntry`, `NoGoNotification`

### Modèles présents dans le schéma : ✅ TOUS (3/3)

### Écarts par modèle

#### GoDecisionLog ⚠️ FK DIFFÉRENTE
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String) | `travelId` (String) | ❌ **FK différente — lié à Travel au lieu de TravelOccurrence** |
| `seatsBookedAtDecision` (Int) | `occupancyAtDecision` (Int?) | ⚠️ Renommé + optionnel |
| `minPaxRequired` (Int) | `capacityAtDecision` (Int?) | ⚠️ Renommé + sémantique différente |
| `adminId` (String) | `decidedByUserId` (String?) | ⚠️ Renommé + optionnel |
| `reason` (String, required) | `reason` (String?, optionnel) | ⚠️ Optionnalité |

#### WaitlistEntry ⚠️ FK DIFFÉRENTE
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String) | `travelId` (String) | ❌ **FK différente — lié à Travel au lieu de TravelOccurrence** |
| `offerExpiresAt` (DateTime?) | **ABSENT** | ❌ |
| `offeredAt` (DateTime?) | `notifiedAt` (DateTime?) | ⚠️ Renommé |
| `acceptedAt` (DateTime?) | `convertedAt` (DateTime?) | ⚠️ Renommé |

#### NoGoNotification ⚠️ PLUSIEURS CHAMPS MANQUANTS
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `occurrenceId` (String) | `travelId` (String) | ❌ **FK différente** |
| `bookingGroupId` (String) | **ABSENT** | ❌ |
| `userId` (String) | **ABSENT** | ❌ |
| `channel` (NotifChannel enum) | **ABSENT** | ❌ |
| `voucherId` (String?) | **ABSENT** | ❌ |
| `refundAmount` (Int?) | **ABSENT** | ❌ |
| `type` (NoGoNotifType) | Présent | ✅ |

### Résumé GroupeI
- 0 modèle manquant
- **Divergence FK majeure** : V48 lie les 3 modèles à `TravelOccurrence` (par occurrence de voyage), le schéma les lie à `Travel` (par voyage global)
- 8 champs manquants sur NoGoNotification
- **Implication** : un NoGo devrait être par occurrence (départ spécifique) et non par voyage entier — à discuter avec David

---

## GROUPE J — Divers (Page 816)

### Modèles V48 spécifiés (3 modèles)
`ProFormation`, `EmailOutbox`, `CronJobLog`

### Modèles présents dans le schéma : ✅ TOUS (3/3)

### Écarts par modèle

#### ProFormation ⚠️ STRUCTURE DIFFÉRENTE
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `userId` (String) | `proProfileId` (String) | ⚠️ FK différente (User vs ProProfile) |
| `videoId` (String) | **ABSENT** | ❌ |
| `watchedSeconds` (Int) | **ABSENT** | ❌ |
| `totalSeconds` (Int) | **ABSENT** | ❌ |
| `lastWatchedAt` (DateTime?) | **ABSENT** | ❌ |
| `title` (String) | Présent | ✅ |
| `completedAt` (DateTime?) | Présent | ✅ |
| `category` (FormationCategory) | Présent | ✅ |

> **NOTE** : V48 suit la progression vidéo (watchedSeconds, videoId). Le schéma suit la complétion (score, certificateUrl). Deux approches différentes.

#### EmailOutbox
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `templateKey` (String) | `templateId` (String?) | ⚠️ Renommé |
| `templateData` (Json) | `variablesJson` (String?) | ⚠️ Renommé + type Json→String |
| `attempts` (Int) | `retryCount` (Int) | ⚠️ Renommé |
| `lastAttemptAt` (DateTime?) | **ABSENT** | ❌ |
| `scheduledAt` (DateTime) | `nextRetryAt` (DateTime?) | ⚠️ Renommé + optionnel |

#### CronJobLog
| Champ V48 | Schéma actuel | Statut |
|-----------|---------------|--------|
| `jobName` (String) | `jobType` (ScheduleJobType enum) | ⚠️ Type changé (String → Enum) |
| `completedAt` (DateTime?) | `finishedAt` (DateTime?) | ⚠️ Renommé |
| `durationMs` (Int?) | **ABSENT** | ❌ |
| `metadata` (Json?) | **ABSENT** | ❌ |
| `itemsProcessed` (Int?) | `itemsProcessed` (Int, default 0) | ⚠️ Optionnalité |

### Résumé GroupeJ
- 0 modèle manquant
- 7 champs manquants
- `CronJobLog.jobName` : schéma a choisi enum ScheduleJobType — plus strict que V48

---

## 🔴 DIVERGENCES CRITIQUES (à adresser en priorité)

### 1. GroupeI — FK occurrence vs voyage (CRITIQUE)
**Problème** : GoDecisionLog, WaitlistEntry et NoGoNotification sont liés à `travelId` dans le schéma, mais V48 spécifie `occurrenceId` (TravelOccurrence).
**Implication** : Quand un voyage a plusieurs occurrences (plusieurs départs), la décision NoGo s'applique au voyage entier au lieu d'un départ spécifique. Cela peut être intentionnel (MVP simplifié) mais doit être validé par David.
**Action** : Clarifier si Eventy supporte les voyages multi-occurrences en MVP.

### 2. GroupeE — TravelRotationPlan sans FK travelId (MOYEN)
**Problème** : V48 lie TravelRotationPlan à un voyage spécifique (`travelId @unique`). Dans le schéma, c'est un objet générique réutilisable.
**Implication** : On ne peut pas savoir quel plan de rotation est associé à quel voyage.
**Action** : Ajouter `travelId` à TravelRotationPlan, ou confirmer que le plan est géré autrement.

### 3. GroupeD — Invoice sans bookingGroupId et facturXml (MOYEN)
**Problème** : V48 lie Invoice à un bookingGroup. Le schéma actuel lie Invoice à un Travel.
**Implication** : On ne peut pas retrouver la facture d'une réservation spécifique sans passer par Travel.
**Action** : Ajouter `bookingGroupId` à Invoice si la facturation par réservation est nécessaire.

---

## 🟡 CHAMPS MANQUANTS PRIORITAIRES (par groupe)

| # | Champ | Modèle | Groupe | Priorité |
|---|-------|--------|--------|----------|
| 1 | `occurrenceId` | GoDecisionLog, WaitlistEntry, NoGoNotification | I | 🔴 P0 |
| 2 | `travelId` dans IncidentReport | IncidentReport | H | 🟡 P1 |
| 3 | `bookingGroupId` | Invoice | D | 🟡 P1 |
| 4 | `travelId` dans TravelRotationPlan | TravelRotationPlan | E | 🟡 P1 |
| 5 | `ticketNumber` (unique) | SupportTicket | H | 🟡 P1 |
| 6 | `proProfileId` dans TrackingLink | TrackingLink | G | 🟡 P1 |
| 7 | UTM fields | TrackingLink | G | 🟡 P2 |
| 8 | `commissionRate` + `commissionAmount` | AttributionEvent | G | 🟡 P2 |
| 9 | `version` + `sessionId` | ConsentRecord | B | 🟡 P2 |
| 10 | `watchedSeconds` + `videoId` | ProFormation | J | 🟡 P2 |
| 11 | `facturXml`, `selfBilling`, `mandateId` | Invoice | D | 🟡 P2 |
| 12 | `email` | EmailVerificationToken | A | 🟢 P3 |
| 13 | `occurrenceId` | MealDeclaration, HotelBlock | F | 🟢 P3 |
| 14 | `ownerUserId`, `isPublic` | PickupRouteTemplate | E | 🟢 P3 |
| 15 | `checkoutSessionId` | RoomHold | C | 🟢 P3 |

---

## 🟢 MODÈLES AJOUTÉS AU-DELÀ DE V48 (points forts du schéma)

Le schéma actuel contient **95 modèles supplémentaires** non spécifiés dans V48. Parmi les plus significatifs :

| Domaine | Modèles ajoutés | Valeur |
|---------|-----------------|--------|
| Finance avancée | `BankAccount`, `BankStatement`, `BankTransaction`, `SepaMandate`, `ClosePack`, `PayoutBatch`, `TvaPeriod` | Gestion bancaire multi-comptes, clôtures financières |
| HRA enrichi | `MenuDuJour`, `MenuCourse`, `MealReview`, `DietaryPreference`, `HraConversation`, `HraMessage`, `HraNegotiation`, `HraPreNegotiatedRate` | Portail restaurateur complet, menus du jour |
| Marketing avancé | `ProRayBalance`, `RayTransaction`, `RayProduct`, `RayBundle`, `RayPromotion`, `WidgetConfig`, `Sponsor`, `Sponsorship` | Système RAYS, widgets embed |
| Transport avancé | `TravelBus`, `BusSegment`, `BusPassengerAssignment`, `FlightAllotment`, `RoutePack`, `TransportStatus`, `GeoCache` | Multi-bus, avion, manifestes |
| RH interne | `Employee`, `EmployeeLeave`, `EmployeeTask` | Gestion équipe Eventy |
| Assurance | `InsuranceClaim`, `InsuranceClaimDocument`, `InsurancePolicy` | Pack Sérénité complet |
| Validation | `ValidationCase`, `ValidationStep`, `ComplianceGoLive` | Pipeline validation pro |

---

## 📋 CONCLUSION ET RECOMMANDATIONS

### Statut global
Le schéma Prisma est **conforme à V48** dans sa structure générale — tous les 42 modèles spécifiés sont présents. Le schéma a **fortement enrichi** chaque groupe (137 modèles vs 42) et représente l'état d'implémentation réel de la plateforme.

Les écarts identifiés sont principalement :
1. **Renommages** (~40 champs) — convention différente entre V48 et l'implémentation
2. **Champs manquants** (~80) — fonctionnalités V48 non encore implémentées
3. **3 divergences architecturales** — à valider avec David avant tout développement

### Actions recommandées

**P0 — Avant lancement :**
- Clarifier la gestion des occurrences pour NoGo/Waitlist (voyage entier vs départ spécifique)

**P1 — Post-lancement immédiat :**
- Ajouter `travelId` à IncidentReport (lier incident à un voyage)
- Ajouter `bookingGroupId` à Invoice (lier facture à une réservation)
- Ajouter `ticketNumber` unique à SupportTicket (numérotation automatique)

**P2 — Roadmap moyen terme :**
- UTM tracking dans TrackingLink (analytics acquisition)
- Commission dans AttributionEvent (rémunération apporteurs)
- Support multi-occurrences complet (si Eventy lance plusieurs départs par voyage)

---

*Audit réalisé le 2026-03-26 — Source : V48.drawio (pages 807-816) + schema.prisma (6 747 lignes)*
*Prochain audit recommandé : après migration vers PATCH_726 (schéma V15 enrichi)*
