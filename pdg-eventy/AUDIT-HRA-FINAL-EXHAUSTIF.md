# AUDIT HRA FINAL EXHAUSTIF
**Date :** 2026-03-27
**Auteur :** Claude Sonnet 4.6 — mandate PDG David

**Drawio analysés :**
- `T050.drawio` (8,3 Mo — 1 702 pages) — `/C/Users/paco6/AppData/Local/Temp/T050.drawio`
- `V48.drawio` (9,8 Mo — 1 693 pages) — `/C/Users/paco6/AppData/Local/Temp/V48.drawio`
- `PATCH726.drawio` (8,3 Mo — 1 766 pages) — `/C/Users/paco6/AppData/Local/Temp/PATCH726.drawio`
- `eventy_v52_FINAL_COMPLET.drawio` (225 pages) — sessions Claude local uploads
- `eventy_v53_COMPLET_PRET_CODAGE.drawio` (225 pages — identique à V52) — sessions Claude local uploads

**Audits précédents lus :**
- `AUDIT-CREATION-VOYAGE-HRA-T050.md` (2026-03-25) — Création voyage 2 phases + HRA wizard
- `AUDIT-HRA-COMPLET-OPTIONS-EMPLOYES.md` (2026-03-26) — Architecture HRA backend + drawio V53
- `AUDIT-FINAL-RIEN-OUBLIE.md` (2026-03-26) — Inventaire global des 3 drawio + gaps non couverts

---

## RÉSUMÉ EXÉCUTIF

**Mis à jour le 2026-03-26 — Approfondissement V48.drawio + Backend + Routes manquantes + Prisma Schema + Checkout + Portail Client + Tests**

| Métrique | Valeur |
|----------|--------|
| Pages drawio HRA identifiées (T050 + PATCH726 + V48) | ~136 pages HRA (V48 seul) |
| Pages V48 HRA-related (total grep) | 136 pages uniques (HRA + Hotel + Resto + Activités + Rooming) |
| Pages EXCLUSIVEMENT dans V48 (absentes de T050 et PATCH726) | **2 pages nouvelles** : V3_ACTD_04 + V3_ACTD_05 |
| Pages V48 présentes dans T050 mais pas PATCH726 | PATCH_COMMS_003, PATCH_V505 |
| Pages restaurant/portail restaurateur | ~15 pages |
| Pages activités (V3_ACTD série) | 5 pages (ACTD-01 à ACTD-05) — ACTD-04/05 V48 exclusifs |
| Pages rooming/chambre | ~12 pages |
| Pages HRA Rate Cards (PATCH726 1126-1219) | 94 pages |
| Pages déjà couvertes dans audits précédents | ~60% |
| NOUVELLES pages non auditées en détail | ~48 pages (1135-1219 range) + 2 V48-exclusives |
| Backend HRA — routes controller `/hra` | **49 routes** (GET/POST/PATCH/DELETE) |
| Backend Restauration — routes controller | **22 routes** |
| Backend Rooming — routes controller | **11 routes** |
| Backend HRA — méthodes service `hra.service.ts` | **47 méthodes publiques/async** |
| Frontend HRA implémenté | ~6 000 lignes (pro + admin + restaurateur + hotel-invite) |
| Fonctionnalités manquantes dans le code | 18+ gaps identifiés (inchangé) |
| Routes frontend manquantes confirmées | **6 routes absentes** : invitations, blocs/[id], comparison, validation-queue, hotel/magic/[token], hra-console |
| Routes frontend existantes confirmées | `/admin/hra/rate-cards` (892 lignes), `/admin/restauration` (370 lignes), `/admin/rooming` (613 lignes) |
| **[NOUVEAU S.17] Tables Prisma HRA identifiées (réel)** | **22 tables** HRA/rooming/activités + 3 tables négociation |
| **[NOUVEAU S.17] Tables absentes du rapport précédent** | **7 tables nouvelles** : RestaurantMenuItem, TravelMealFormula, MenuDuJour, MenuCourse, MealReview, DietaryPreference, PassengerRevealLog |
| **[NOUVEAU S.17] Tables négociation HRA (découvertes)** | **3 tables** : HraNegotiation, NegotiationMessage, HraPreNegotiatedRate |
| **[NOUVEAU S.17] `HraRateCard` dans schema** | ❌ TOUJOURS ABSENTE — confirme gap frontend DemoBanner |
| **[NOUVEAU S.17] Enums HRA complets** | **36 enums** HRA-liés inventoriés |
| **[NOUVEAU S.18] Checkout — intégrations HRA présentes** | Sélection chambre (step-1), assignation participants/chambre (step-2), activités marketing (activites/) |
| **[NOUVEAU S.18] Checkout — intégrations HRA manquantes** | Formule repas, préférences alimentaires, vue chambre, hôtel visible, suppléments |
| **[NOUVEAU S.19] Portail client — pages HRA** | 4 pages : rooming (542L), preferences (247L), reservations/[id] onglet hébergement (804L), voyage/activites (297L) |
| **[NOUVEAU S.19] Anomalie portail client** | `/client/voyage/[id]/activites` appelle endpoint PRO (`/pro/travels/{id}/available-activities`) |
| **[NOUVEAU S.20] Fichiers spec HRA/Restauration/Rooming** | **9 fichiers spec** — 6 404 lignes |
| **[NOUVEAU S.20] Total tests HRA (it() blocks)** | **319 tests** (159 HRA + 100 Restauration + 60 Rooming) |
| **[NOUVEAU S.20] Scénarios non couverts par tests** | HraNegotiation, HraPreNegotiatedRate, MenuDuJour/MenuCourse, MealReview |

---

## PAR DOMAINE

---

### 1. HÔTELLERIE / HÉBERGEMENT

#### Pages drawio T050 fondatrices (V32-V59)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Portail Hôtel (Supplier Portal) — consultation rooming list | `63_Portail_Hotel_Supplier_V32` | ✅ `/hotel-invite/[token]/page.tsx` (274 lignes) | Oui (AUDIT-CREATION-VOYAGE-HRA-T050.md) | ✅ OK | — |
| DB Supplier, SupplierUser, SupplierRole | `64_DB_Portail_Hotel_V32` | ✅ Prisma HotelPartner + HotelBlock tables | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| API GET/POST /supplier/hotel/trips + /rooming-list | `65_Exécution_Portail_Hotel_V32` | ✅ `hotel-portal.service.ts` (326 lignes) + `GET/POST /hra/hotel-blocks/respond/:token` | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Plan Hébergement + Invitation hôtels (extranet MVP) | `120_UI_HotelConnectivity_InviteHotels_V55` | ✅ `/pro/voyages/[id]/hotellerie/page.tsx` (331 lignes) | Oui (AUDIT-HRA-COMPLET) | ✅ OK | Channel manager futur (SiteMinder, Bedbank) |
| DB TripAccommodation + HotelBlocks + intégrations future-proof | `121_DB_HotelConnectivity_Blocks_Integrations_V55` | ✅ HotelBlock (35+ champs), HotelRoomAllocation | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| EXEC HotelConnectivity StateMachine (5 états) | `122_EXEC_HotelConnectivityLayer_StateMachine_V55` | ✅ `hra.service.ts` — transitions INVITE_SENT→HOTEL_SUBMITTED→BLOCK_ACTIVE | Oui | ✅ OK | — |
| Pro Module Hébergement Dashboard Voyage : 5 rubriques | `123_Pro_Voyage_Hotellerie_Module_UI_V56` | ✅ `/pro/voyages/[id]/hotellerie` + `/rooming/hotel-blocks` | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Routes `/hotellerie/blocs/[blockId]` + `/hotellerie/invitations` manquent |
| Admin Phase1 Validation UI — onglet Hébergement | `124_Admin_Phase1_Hotellerie_Validation_UI_V56` | ⚠️ `/admin/voyages/[id]/lifecycle/page.tsx` existe mais générique | Oui (AUDIT-CREATION-VOYAGE) | ⚠️ Partiel | Onglet spécifique Hébergement dans Phase1, 3 feux Admin absents |
| Pro Hotels Invites Relances UI | `127_Pro_Hotels_Invites_Relances_UI_V57` | ❌ Pas de route `/pro/voyages/[id]/hotellerie/invitations` | Non | ❌ Manque | Route invitations + relances auto J+2/J+5 + alerte admin J+7 |
| Portail Hôtel MVP Extranet — Répondre invitation, soumettre quotas | `128_Hotel_Portal_MVP_UI_V57` | ✅ `/hotel-invite/[token]/page.tsx` (274 lignes) | Oui (AUDIT-HRA-COMPLET) | ✅ OK | Connexion Ecran 4 (CHANGES_REQUESTED ↔ modifier/re-soumettre) |
| Rooming List + Exports + OK/Anomalie + Relances | `131_UI_RoomingList_Exports_OK_Anomalie_V58` | ✅ `/rooming/hotel-blocks/page.tsx` (285 lignes) + `/admin/rooming/page.tsx` | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Relances auto J+1/J+3, exports signés, alerte J-5 |
| DB RoomingList Exports | `132_DB_RoomingList_Exports_OK_Anomalie_V58` | ✅ HotelBlock.status + rooming module | Oui | ✅ OK | — |
| EXEC RoomingList OK/Anomalie Relances | `133_Exécution_RoomingList_OK_Anomalie_Relances_V58` | ⚠️ rooming.service.ts (624 lignes) — relances partielles | Oui | ⚠️ Partiel | Relances auto non confirmées |
| Rooming Deadline Configurable | `134_RoomingDeadline_Configurable_V59` | ❌ Non implémenté (STUB drawio) | Oui (AUDIT-FINAL-RIEN-OUBLIE) | ❌ Manque | Setting admin deadline par voyage |
| Pro Dashboard Voyage: 5 sections (Clients/Chambres/Hôtel Anomalies/Ramassage/Médias) | `17_Pro_Dashboard_Voyage_Chambres_Hotel_V18` | ⚠️ Routes existent mais pas toutes connectées | Oui (AUDIT-CREATION-VOYAGE) | ⚠️ Partiel | Contrôle Anomalies Hôtel non câblé frontend |
| DB Videos + RoomBooking + HotelConfirm | `18_DB_Videos_RoomBooking_HotelConfirm_V18` | ✅ Prisma schemas | Oui | ✅ OK | — |
| EXEC Videos RoomBooking MVP | `19_Exécution_Videos_RoomBooking_MVP_V18` | ✅ Backend implémenté | Oui | ✅ OK | — |

#### Pages drawio V3_ACTD / QA_PATCH Hotel

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Sélection HRA Phase 1 : liste HRA actifs filtrables | `QA_PATCH_616_HRA_SELECTION_FLOW_PHASE1_MVP_FR` | ⚠️ API call `/api/pro/hra/favorites?type=HOTEL` existe avec fallback mock | Oui (AUDIT-CREATION-VOYAGE) | ⚠️ Partiel | Événement HRA_SELECTED + audit actor=CREATOR + auto-status APPROVED/PENDING |
| Gate Phase 1 : Hébergement obligatoire + Repas obligatoire | `QA_PATCH_621_PHASE1_HRA_GATE_MVP_FR` | ✅ `hebergementOk` + BLOCKING error dans wizard `page.tsx` ligne 431-434 | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | — |
| HRA principal + jusqu'à 2 backups | `QA_PATCH_616` (spec) | ❌ Un seul sélectionné, pas de système backup | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | Sélection principale + 2 backups, commentaire créateur |
| Changement HRA avant validation Phase 1 | `QA_PATCH_617_HRA_CHANGE_BEFORE_VALIDATE_MVP_FR` | ❌ Non spécifiquement implémenté | Non | ❌ Manque | Règle: modification HRA possible avant soumission Phase 1 seulement |
| QA vérification sélection HRA isolation | `QA_PATCH_619_QA_HRA_SELECTION_MVP_FR` | ⚠️ Isolation partielle | Non | ⚠️ Partiel | — |
| HRA changement sans justification (règle) | `QA_PATCH_623_HRA_CHANGE_NOJUSTIF_MVP_FR` | ❌ Non implémenté | Non | ❌ Manque | Règle: changement HRA post-validation → rediriger vers Hub HRA |
| Date change autosync HRA | `QA_PATCH_612_DATE_CHANGE_AUTOSYNC_HRA_MVP_FR` | ❌ Non implémenté | Non | ❌ Manque | Si dates voyage changent → HRA blocks à re-synchroniser |

#### Pages drawio QA_PATCH_36 / HRA Hotel P0

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| HOTEL_HRA P0 — validation bloquante hôtel | `QA_PATCH_36_HOTEL_HRA_P0` | ✅ BLOCKING error hébergement en wizard | Oui | ✅ OK | — |

#### Pages drawio PATCH726 - Hotel Profiles (640-653)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| HRA Profile Advanced (profil partenaire avancé) | `640_PATCH_V388_HRA_Profile_Advanced_MVP_FR` | ✅ HotelPartner (30+ champs) dans Prisma + `GET/PATCH /hra/hotel-partners/:id` | Oui (AUDIT-HRA-COMPLET) | ✅ OK | ROUTE TODO/ON HOLD dans drawio — besoin page frontend dédiée |
| HRA Room Types Catalog (types chambres) | `641_PATCH_V389_HRA_Room_Types_Catalog_MVP_FR` | ✅ HotelRoomAllocation (SINGLE/DOUBLE/TRIPLE/SUITE) | Oui (AUDIT-HRA-COMPLET) | ✅ OK | ROUTE TODO/ON HOLD |
| HRA Pricing Grid (grille tarifaire) | `642_PATCH_V390_HRA_Pricing_Grid_MVP_FR` | ✅ HotelBlock.pricePerNightTTC + marginType + supplements | Oui (AUDIT-HRA-COMPLET) | ✅ OK | ROUTE TODO/ON HOLD |
| HRA Availability Capacity (disponibilité/capacité) | `643_PATCH_V391_HRA_Availability_Capacity_MVP_FR` | ✅ HotelBlock.roomsRequested/Confirmed + status | Oui (AUDIT-HRA-COMPLET) | ✅ OK | ROUTE TODO/ON HOLD |
| Creator HRA Browser (navigateur partenaires) | `644_PATCH_V392_Creator_HRA_Browser_MVP_FR` | ✅ `/pro/hra/page.tsx` (538 lignes) + `GET /hra/catalog/hotels` | Oui (AUDIT-HRA-COMPLET) | ✅ OK | Route frontend active |
| Creator HRA Comparison (comparaison côte à côte) | `645_PATCH_V393_Creator_HRA_Comparison_MVP_FR` | ❌ Aucune page comparaison | Oui (AUDIT-HRA-COMPLET via AUDIT-FINAL) | ❌ Manque | Interface comparaison prix/unités côte à côte |
| Creator HRA PreSelection (pré-sélection + backups) | `646_PATCH_V394_Creator_HRA_PreSelection_MVP_FR` | ❌ Pas de système backup/pré-sélection | Oui | ❌ Manque | Sélection principale + 2 backups + coût estimé + badge Premium |
| Admin HRA Validation For Trip (validation admin pour voyage) | `647_PATCH_V395_Admin_HRA_Validation_For_Trip_MVP_FR` | ⚠️ `/admin/voyages/[id]/lifecycle/page.tsx` mais pas spécifique HRA | Non | ❌ Manque | Queue admin: auto-validé si HRA actif, PENDING si inactif, message équipe HRA |
| Creator Invite Hotel (inviter un hôtel) | `650_PATCH_V398_Creator_Invite_Hotel_MVP_FR` | ⚠️ `POST /hra/hotel-blocks` existe backend, UI partielle dans `/hotellerie` | Oui (AUDIT-HRA-COMPLET) — STUB drawio | ⚠️ Partiel | UI dédiée d'invitation (STUB à compléter) |
| Hotel Onboarding Light (onboarding simplifié hôtel) | `651_PATCH_V399_Hotel_Onboarding_Light_MVP_FR` | ⚠️ `/hotel-invite/[token]` partiel | Oui — STUB drawio | ⚠️ Partiel | STUB drawio — contenu à compléter |
| Creator Negotiated Pricing Hotel (pricing négocié) | `652_PATCH_V400_Creator_Negotiated_Pricing_Hotel_MVP_FR` | ❌ Non implémenté en frontend | Oui — STUB drawio | ❌ Manque | STUB drawio — interface négociation prix hôtel |
| Admin Validate Hotel Pricing (validation prix admin) | `653_PATCH_V401_Admin_Validate_Hotel_Pricing_MVP_FR` | ❌ Non implémenté | Oui — STUB drawio | ❌ Manque | STUB drawio — queue validation prix |

#### Pages drawio PATCH726 — HRA Rate Cards (1126-1175)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Priorisation HRA + estimation totale Phase 1 | `QA_PATCH_1126` | ❌ STUB | Oui (AUDIT-FINAL mentionné) | ❌ Manque | Logique estimation totale voyage |
| Admin HRA Rate Card Chambres | `QA_PATCH_1127` | ✅ `/admin/hra/rate-cards/page.tsx` (892 lignes) — HotelRateCard interface | Non (STUB drawio, nouveau) | ✅ OK | Backend API non connecté (DemoBanner visible) |
| Phase1 HRA Estimate et total voyage | `QA_PATCH_1128` | ❌ Non implémenté | Non | ❌ Manque | Widget estimation coûts HRA dans Phase 1 |
| Verify HRA Estimate no dupes + links | `QA_PATCH_1129` | N/A — vérification QA | Non | N/A | — |
| Admin HRA Rate Card Restauration | `QA_PATCH_1130` | ✅ `/admin/hra/rate-cards/page.tsx` — RestaurantRateCard interface | Non (STUB drawio, nouveau) | ✅ OK | Backend API non connecté |
| Admin HRA Rate Card Activités | `QA_PATCH_1131` | ✅ `/admin/hra/rate-cards/page.tsx` — ActivityRateCard interface | Non (STUB drawio, nouveau) | ✅ OK | Backend API non connecté |
| Phase1 HRA Sélection + auto-split chambres | `QA_PATCH_1132` | ❌ STUB | Non | ❌ Manque | Auto-calcul répartition chambres selon nb participants |
| HRA Estimate liens vers Admin et readonly summary | `QA_PATCH_1133` | ❌ STUB | Non | ❌ Manque | — |
| Verify HRA rooms/meals/activities total | `QA_PATCH_1134` | N/A — vérification QA | Non | N/A | — |
| HRA Pricing Model : prix TTC négocié + marge + TVA | `QA_PATCH_1135_HRA_PRICING_MODEL_NEGOTIATED_TTC_MARGIN_VAT_MVP_FR` | ✅ HotelBlock.marginType + marginValue + taxeSejourType | Non (NOUVEAU) | ✅ OK (backend) | Frontend UI pour afficher prix TTC négocié vs prix public |
| HRA Validation Workflow Block | `QA_PATCH_1136_HRA_VALIDATION_WORKFLOW_BLOCK_HRA_MVP_FR` | ✅ `confirmHotelBlock()`, `requestChangesHotelBlock()`, `rejectHotelBlock()` | Non (NOUVEAU) | ✅ OK | — |
| HRA Staff Free Rooms Trace | `QA_PATCH_1137_HRA_STAFF_FREE_ROOMS_TRACE_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Chambres staff gratuites tracées + audit |
| Meals Daily Rate Uniform + Activities Included | `QA_PATCH_1138_MEALS_DAILY_RATE_UNIFORM_AND_ACTIVITIES_INCLUDED_MVP_FR` | ⚠️ Restauration backend (923 lignes) mais uniforme non validé | Non (NOUVEAU) | ⚠️ Partiel | Tarif repas uniforme/jour + activités incluses dans pack |
| Verify HRA Negotiation Margin VAT Validation | `QA_PATCH_1139` | N/A — vérification QA | Non | N/A | — |
| Finance Admin HRA Params VAT Method | `QA_PATCH_1140_FINANCE_ADMIN_HRA_PARAMS_VAT_METHOD_MVP_FR` | ❌ Non implémenté en frontend | Non (NOUVEAU) | ❌ Manque | Page admin paramètres TVA HRA (méthode TVA sur marge vs brute) |
| Creator Negotiation Staff Rooms Policy | `QA_PATCH_1141_CREATOR_NEGOTIATION_STAFF_ROOMS_POLICY_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Politique chambres staff : combien gratuites selon contrat |
| HRA Automation Roadmap Connectors | `QA_PATCH_1143_HRA_AUTOMATION_ROADMAP_CONNECTORS_MVP_TO_V1_FR` | ❌ Non implémenté (futur V1) | Non (NOUVEAU) | N/A future | — |
| HRA Price Request Workflow : API or Email | `QA_PATCH_1144_HRA_PRICE_REQUEST_WORKFLOW_API_OR_EMAIL_MVP_FR` | ⚠️ Email dans `hotel-portal.service.ts`, API partielle | Non (NOUVEAU) | ⚠️ Partiel | Workflow unifié email + API pour demande de prix |
| Meals MVP : 2 repas/jour + travel meal addon | `QA_PATCH_1145_MEALS_MVP_TWO_PER_DAY_PLUS_TRAVEL_MEAL_ADDON_FR` | ✅ MealType BREAKFAST/LUNCH/DINNER dans backend | Non (NOUVEAU) | ✅ OK | TravelMealAddon non confirmé |
| Activities MVP : INCLUDED only + API hooks | `QA_PATCH_1146_ACTIVITIES_MVP_INCLUDED_ONLY_WITH_API_HOOKS_FR` | ✅ ActivityPurchaseMode EVENTY_BUYS/CREATOR_BUYS | Non (NOUVEAU) | ✅ OK | — |
| HRA Negotiation Request Discount Percent | `QA_PATCH_1148_HRA_NEGOTIATION_REQUEST_DISCOUNT_PERCENT_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Interface créateur pour demander remise % sur prix standard |
| Admin Takeover HRA Asset Reuse Transfer | `QA_PATCH_1149_ADMIN_TAKEOVER_HRA_ASSET_REUSE_TRANSFER_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Admin peut reprendre/réutiliser/transférer un bloc HRA |
| HRA No API Room Block Request Manual | `QA_PATCH_1150_HRA_NO_API_ROOM_BLOCK_REQUEST_MANUAL_MVP_FR` | ✅ Token-based manual invite dans `hra.service.ts` | Non (NOUVEAU) | ✅ OK | — |
| Travel Meals Policy : trip level not occurrence | `QA_PATCH_1151_TRAVEL_MEALS_POLICY_TRIP_LEVEL_NOT_OCCURRENCE_MVP_FR` | ⚠️ MealDeclaration a travelId mais pas de policy globale trip | Non (NOUVEAU) | ⚠️ Partiel | Policy repas au niveau voyage (non occurrence) |
| Notes Guide Creator HRA Negotiation | `QA_PATCH_1152` | N/A — documentation | Non | N/A | — |
| Room Block Standard Cutoff Release RoomingList | `QA_PATCH_1154_ROOM_BLOCK_STANDARD_CUTOFF_RELEASE_ROOMINGLIST_MVP_FR` | ⚠️ HotelBlock.releaseDate existe mais non géré auto | Non (NOUVEAU) | ⚠️ Partiel | Logique cutoff + libération auto chambres |
| HRA Automation One Click Generate Block + Negotiation | `QA_PATCH_1155_HRA_AUTOMATION_ONE_CLICK_GENERATE_BLOCK_AND_NEGOTIATION_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Bouton 1-clic: créer bloc + lancer négociation automatiquement |
| HRA Validation Queue Fast Approval | `QA_PATCH_1156_HRA_VALIDATION_QUEUE_FAST_APPROVAL_MVP_FR` | ❌ Pas de queue rapide | Non (NOUVEAU) | ❌ Manque | File d'approbation rapide admin pour HRA validés |
| Discount Only on HRA Standard Room Price | `QA_PATCH_1157_DISCOUNT_ONLY_ON_HRA_STANDARD_ROOM_PRICE_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Règle: remise appliquée uniquement sur prix chambre standard |
| Defaults Simple Cutoff Rooming Dispo | `QA_PATCH_1159_DEFAULTS_SIMPLE_CUTOFF_ROOMING_DISPO_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Valeurs par défaut cutoff rooming + dispo |
| Negotiation Ladder Creator Admin Employee | `QA_PATCH_1160_NEGOTIATION_LADDER_CREATOR_ADMIN_EMPLOYEE_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Hiérarchie négociation : créateur → admin → employé |
| Hotel Full Buyout Negotiation Option | `QA_PATCH_1161_HOTEL_FULL_BUYOUT_NEGOTIATION_OPTION_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Option achat intégral hôtel (buyout) |
| HRA Negotiation Dashboard Performance | `QA_PATCH_1162_HRA_NEGOTIATION_DASHBOARD_PERFORMANCE_MVP_FR` | ❌ Non implémenté en frontend | Non (NOUVEAU) | ❌ Manque | Dashboard perf négociation (économies, taux acceptation) |
| Buyout Suggestion Rules (53 seats buses) | `QA_PATCH_1164_BUYOUT_SUGGESTION_RULES_BASED_ON_BUSES_53SEATS_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Règle auto-suggestion buyout basée sur nb bus 53 places |
| Negotiation Replace Active Round History Archive | `QA_PATCH_1165_NEGOTIATION_REPLACE_ACTIVE_ROUND_WITH_HISTORY_ARCHIVE_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Archivage rounds de négociation précédents |
| Creator HRA Control Panel Negotiation Validation | `QA_PATCH_1166_CREATOR_HRA_CONTROL_PANEL_NEGOTIATION_VALIDATION_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Panel créateur : voir négociation en cours + valider |
| Admin Buyout Negotiation Quantity Panel | `QA_PATCH_1168_ADMIN_BUYOUT_NEGOTIATION_QUANTITY_PANEL_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Panel admin quantités buyout |
| Finance Margin Override Guardrails HRA | `QA_PATCH_1169_FINANCE_MARGIN_OVERRIDE_GUARDRAILS_HRA_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Garde-fous sur override marge : min/max autorisés |
| Blocking Anomalies Tilt Rules HRA | `QA_PATCH_1170_BLOCKING_ANOMALIES_TILT_RULES_HRA_MVP_FR` | ⚠️ Anomalies détectées en rooming mais pas tilt rules HRA | Non (NOUVEAU) | ⚠️ Partiel | Règles tilt : seuils déclenchant blocage |
| Buyout Partial Quantity NB Rooms Default | `QA_PATCH_1173_BUYOUT_PARTIAL_QUANTITY_NB_ROOMS_DEFAULT_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Buyout partiel : nb chambres par défaut |
| Cutoff Express Override 21D | `QA_PATCH_1174_CUTOFF_EXPRESS_OVERRIDE_21D_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Override deadline cutoff express : 21 jours |
| Rooming List Export and Tracking | `QA_PATCH_1175_ROOMING_LIST_EXPORT_AND_TRACKING_MVP_FR` | ⚠️ Export PDF/CSV partiel dans rooming module | Non (NOUVEAU) | ⚠️ Partiel | Tracking envoi + accusé réception hôtel |
| HRA AutoRemind Cutoff Rooming + Negotiation SLA | `QA_PATCH_1176_HRA_AUTOREMIND_CUTOFF_ROOMING_AND_NEGOTIATION_SLA_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Rappels auto cutoff rooming + SLA négociation |
| HRA Quick Macros Send Block Renegotiate | `QA_PATCH_1177_HRA_QUICK_MACROS_SEND_BLOCK_RENEGOTIATE_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Macros rapides : envoyer bloc + renégocier en 1 clic |

#### Pages drawio PATCH726 — HRA Hubs + Provider (1179-1219)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Hub HRA Staff (hôtel/resto/activités) | `QA_PATCH_1179_HUB_HRA_STAFF_MVP_FR` | ⚠️ `/admin/hra/page.tsx` existe (695 lignes) | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Hub dédié Staff séparé de l'admin — STUB à compléter |
| Hub HRA Admin Settings + Policies | `QA_PATCH_1180_HUB_HRA_ADMIN_SETTINGS_POLICIES_MVP_FR` | ⚠️ Partiellement dans `/admin/hra` | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | STUB drawio — réglages + policies + logs séparés |
| Console HRA par voyage : timeline + checklists | `QA_PATCH_1181_CONSOLE_HRA_TRIP_TIMELINE_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Console HRA par voyage avec timeline checklist |
| Directory Fournisseurs HRA : contacts + SLA + préférences | `QA_PATCH_1183_HRA_PROVIDER_DIRECTORY_CONTACTS_SLA_MVP_FR` | ⚠️ `GET /hra/hotel-partners/search` + `GET /hra/restaurant-partners/search` | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | SLA par fournisseur + préférences créateur |
| HRA Provider Email Templates | `QA_PATCH_1184_HRA_PROVIDER_EMAIL_TEMPLATES_MVP_FR` | ⚠️ Emails dans `hotel-portal.service.ts` mais templates basiques | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Templates emails personnalisables par type fournisseur |
| HRA Outbox Provider Send + Retry + Fallback | `QA_PATCH_1185_HRA_OUTBOX_PROVIDER_SEND_RETRY_FALLBACK_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Outbox dédié HRA avec retry + fallback si email down |
| HRA Nav Links Matrix Hub/Console/Outbox | `QA_PATCH_1186` | N/A — documentation navigation | Non | N/A | — |
| HRA Exports : RoomBlock Pack + RoomingList CSV/PDF | `QA_PATCH_1188_HRA_EXPORTS_ROOMBLOCK_PACK_ROOMINGLIST_MVP_FR` | ⚠️ Export partial dans rooming service | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Pack complet: RoomBlock + RoomingList en 1 export |
| HRA Export Send OneClick Provider | `QA_PATCH_1189_HRA_EXPORT_SEND_ONECLICK_PROVIDER_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Bouton 1-clic : générer + envoyer export au fournisseur |
| Ops Health HRA Tiles Cutoff/Rooming/SLA | `QA_PATCH_1190_OPS_HEALTH_HRA_TILES_CUTOFF_ROOMING_SLA_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Tuiles santé OPS : cutoff/rooming/SLA en temps réel |
| HRA Auto Exports Scheduled Option | `QA_PATCH_1191_HRA_AUTO_EXPORTS_SCHEDULED_OPTION_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Exports HRA planifiés automatiquement |
| Pro HRA Profile Status Selector | `QA_PATCH_1193_PRO_HRA_PROFILE_STATUS_SELECTOR_MVP_FR` | ⚠️ `/pro/hra/page.tsx` (538 lignes) catalogue | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Sélecteur statut hôtel/resto/activité/bar depuis portail pro |
| Pro HRA Dashboard Planning Tables | `QA_PATCH_1194_PRO_HRA_DASHBOARD_PLANNING_TABLES_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Dashboard planning HRA pour voyages futurs |
| Pro HRA Trip Workspace Confirm/Decline/Counter | `QA_PATCH_1195_PRO_HRA_TRIP_WORKSPACE_CONFIRM_DECLINE_COUNTER_MVP_FR` | ⚠️ Dans `/hotellerie` partiellement | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Workspace complet : confirmer/refuser/contre-proposer |
| Pro HRA Declarations Availability Blackouts | `QA_PATCH_1196_PRO_HRA_DECLARATIONS_AVAILABILITY_BLACKOUTS_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Déclaration disponibilité + périodes blackout côté fournisseur |
| HRA Terms Deposit Cancellation Tags | `QA_PATCH_1197_HRA_TERMS_DEPOSIT_CANCELLATION_TAGS_MVP_FR` | ⚠️ HotelBlock a des champs de notes | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Tags conditions : dépôt requis, politique annulation |
| Finance Handoff Provider Docs Payment Placeholder | `QA_PATCH_1198_FINANCE_HANDOFF_PROVIDER_DOCS_PAYMENT_PLACEHOLDER_MVP_FR` | ⚠️ `/admin/finance/supplier-invoices/page.tsx` existe | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Docs fournisseurs + placeholder paiement |
| Pro HRA Verification Fast Approval Autoready | `QA_PATCH_1200_PRO_HRA_VERIFICATION_FAST_APPROVAL_AUTOREADY_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Auto-readiness : HRA vérifié + marqué prêt automatiquement |
| Pro Counter Offer TTC + Terms Optional Defaults | `QA_PATCH_1201_PRO_COUNTER_OFFER_TTC_PLUS_TERMS_OPTIONAL_DEFAULTS_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Contre-offre TTC + conditions avec valeurs par défaut |
| Pro Planning Logic Requested/Confirmed + Forecast | `QA_PATCH_1202_PRO_PLANNING_LOGIC_REQUESTED_CONFIRMED_PLUS_FORECAST_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Logique planning : demandé vs confirmé + prévision |
| Pro HRA Notification Center Provider Side | `QA_PATCH_1205_PRO_HRA_NOTIFICATION_CENTER_PROVIDER_SIDE_MVP_FR` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | Centre notifications côté fournisseur (portail restaurateur/hôtel) |

#### Pages drawio PATCH726 — HRA Matching (1206-1219)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| HRA Matching Simple : suggestions fournisseurs | `QA_PATCH_1206_HRA_MATCHING_SIMPLE_PROVIDER_SUGGESTIONS_MVP_FR` | ❌ Non implémenté (STUB drawio) | Non (NOUVEAU) | ❌ Manque | Algo matching simple : top 3 fournisseurs suggérés par destination |
| Matching Top 3 Transparent Reason + View All | `QA_PATCH_1208_MATCHING_TOP3_TRANSPARENT_REASON_AND_VIEW_ALL_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Top 3 avec raison transparente + bouton "Voir tous" |
| Pro Notifications Requested Only Until Verified | `QA_PATCH_1209_PRO_NOTIFICATIONS_REQUESTED_ONLY_UNTIL_VERIFIED_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Notifs fournisseur : seulement si demandé, jusqu'à vérification |
| Multi Provider RFQ Batch Send Top3 | `QA_PATCH_1211_MULTI_PROVIDER_RFQ_BATCH_SEND_TOP3_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Envoi batch demande de devis aux top 3 simultanément |
| HRA Quotes Comparator Simple Scorecard | `QA_PATCH_1212_HRA_QUOTES_COMPARATOR_SIMPLE_SCORECARD_MVP_FR` | ❌ Non implémenté (STUB drawio) | Non (NOUVEAU) | ❌ Manque | Comparateur devis : scorecard simple |
| HRA Provider Selection Lock + Cancel Others | `QA_PATCH_1213_HRA_PROVIDER_SELECTION_LOCK_AND_CANCEL_OTHERS_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Sélection fournisseur verrouille + annule les autres |
| Creator Invite HRA Provider Flow | `QA_PATCH_1215_CREATOR_INVITE_HRA_PROVIDER_FLOW_MVP_FR` | ⚠️ `POST /hra/favorites` + inviteToken existent | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | UI complète invitation flow (STUB à compléter) |
| Provider Signup from Invite Link Fast | `QA_PATCH_1216_PROVIDER_SIGNUP_FROM_INVITE_LINK_FAST_MVP_FR` | ⚠️ `/hotel-invite/[token]` partiel | Non (NOUVEAU) | ⚠️ Partiel | Signup rapide fournisseur via lien invitation (pas juste hôtel) |
| Min Criteria Config Admin Employee HRA | `QA_PATCH_1217_MIN_CRITERIA_CONFIG_ADMIN_EMPLOYEE_HRA_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Config critères minimums HRA par admin/employé |
| Self-Signup HRA List Secondary Not Priority | `QA_PATCH_1218_SELF_SIGNUP_HRA_LIST_SECONDARY_NOT_PRIORITY_MVP_FR` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Auto-inscription fournisseur : liste secondaire (pas priorité invitation) |

---

### 2. RESTAURATION

#### Pages drawio T050 (V15, V95-V98) — Restauration Core

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Portail Restaurateur : déclaration repas par jour/service | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/declarations/page.tsx` (325 lignes) | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | — |
| Portail Restaurateur : Dashboard vue générale | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/dashboard/page.tsx` (340 lignes) | Oui | ✅ OK | — |
| Portail Restaurateur : Facturation | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/facturation/page.tsx` (403 lignes) | Oui | ✅ OK | — |
| Portail Restaurateur : Incidents | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/incidents/page.tsx` (412 lignes) | Oui | ✅ OK | — |
| Portail Restaurateur : Historique | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/historique/page.tsx` (301 lignes) | Oui | ✅ OK | — |
| Pro Voyage Restauration Options UI | `199_Pro_Voyage_Restauration_Options_UI_V95` | ✅ `/pro/voyages/[id]/restauration/page.tsx` (493 lignes) | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| DB Restauration MealOptions Declaration Invoice | `200_DB_Restauration_MealOptions_Declaration_Invoice_V95` | ✅ MealDeclaration + MealPlanOption dans Prisma | Oui (AUDIT-HRA-COMPLET) | ✅ OK | InvoiceRecord simplifié à vérifier |
| Admin Restauration Payout Declaration Settings | `201_Admin_Restauration_Payout_Declaration_Settings_V95` | ✅ `/admin/restauration/page.tsx` + `/declarations/page.tsx` | Oui (AUDIT-HRA-COMPLET) | ✅ OK | Settings admin defaultMealMode à vérifier |
| TestCases Restauration MVP | `202_TestCases_Restauration_MVP_V95` | ✅ 1 435 lignes tests restauration.service.spec.ts | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| UI Onsite Restauration Declaration MVP (scan bracelet) | `203_UI_Onsite_Restauration_Declaration_MVP_V97` | ⚠️ Déclarations manuelles dans `/restaurateur/declarations` | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Écran scan bracelet/kiosk (NFC OFF MVP, manuel OK) |
| DB API Restauration Declaration Payout | `204_DB_API_Restauration_Declaration_Payout_V97` | ✅ `restauration.service.ts` (923 lignes) | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Workflow Litige Restauration | `205_Workflow_Litige_Restauration_V98` | ✅ MealDisputeTicket + `POST /restauration/:travelId/disputes` | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| TestCases Litige Restauration | `206_TestCases_Litige_Restauration_V98` | ✅ Tests inclus dans restauration.service.spec.ts | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Variance repas → création automatique d'incident | `05_Portail_Restaurateur_V15` | ✅ MealDisputeTicket auto si variance | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | Auto-escalade configurable manquante |
| Anti-surfacturation : servis ≤ voyageurs | `05_Portail_Restaurateur_V15` | ✅ expectedCount vs servedCount dans MealDeclaration | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | — |
| Consolidation mensuelle → SupplierInvoice | `05_Portail_Restaurateur_V15` | ⚠️ `/admin/finance/supplier-invoices/page.tsx` existe | Oui (AUDIT-CREATION-VOYAGE) | ⚠️ Partiel | Export Invoice Consolidated NET30 FDM non confirmé |
| Paiement NET30 FDM (fin de mois + 30 jours) | `05_Portail_Restaurateur_V15` | ⚠️ RestaurantPayoutSchedule.END_OF_TRIP seul | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Payout multi-horaire (NET30/FDM) manquant |
| Régimes alimentaires + allergies | drawio V95 + Prisma GroupeF | ✅ DietaryPreference + DietType + Allergies enum | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Formule Repas (PETIT_DEJEUNER_SEUL → ALL_INCLUSIVE) | drawio V95 | ✅ MealFormula enum + TravelMealFormula table | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| NFC Bracelet Repas | `203_UI_Onsite_Restauration_Declaration_MVP_V97` | ⚠️ `nfcEnabled: false` dans RestaurantPartner | Oui (AUDIT-HRA-COMPLET) | N/A OFF MVP | Prévu V2 — bracelet/scan futur |
| MealDeclaration status : OPEN→CLOSED→INVOICED→PAID | drawio V97 | ✅ MealDeclarationStatus enum + transitions dans service | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |

#### Pages drawio T050 — Restaurant Partner Profiles (654-658)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Restaurant Profile Partner | `654_PATCH_V402_Restaurant_Profile_Partner_MVP_FR` | ✅ RestaurantPartner (20+ champs) + backend CRUD | Oui (AUDIT-HRA-COMPLET) — STUB drawio | ✅ OK | Page frontend dédiée restaurant partner (route TODO) |
| Creator Invite Restaurant | `655_PATCH_V403_Creator_Invite_Restaurant_MVP_FR` | ⚠️ `restaurant-portal.service.ts` (308 lignes) | Oui — STUB drawio | ⚠️ Partiel | UI invitation restaurant depuis créateur (STUB) |
| Restaurant Menu Photos | `656_PATCH_V404_Restaurant_Menu_Photos_MVP_FR` | ✅ `POST/GET /hra/restaurant-partners/:id/menu` | Oui — STUB drawio | ✅ OK | Upload photos menu (STUB) |
| Creator Negotiated Pricing Restaurant | `657_PATCH_V405_Creator_Negotiated_Pricing_Restaurant_MVP_FR` | ❌ Non implémenté | Oui — STUB drawio | ❌ Manque | Négociation prix repas créateur ↔ restaurant |
| Admin Validate Restaurant Pricing | `658_PATCH_V406_Admin_Validate_Restaurant_Pricing_MVP_FR` | ❌ Non implémenté | Oui — STUB drawio | ❌ Manque | Validation admin des prix négociés restaurant |

#### Pages drawio T050 — Portail Restaurant + RestoHotel (703-704)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| RestoHotel Declaration Indé Control | `703_PATCH_V464_RestoHotel_Declaration_IndeControl_MVP_FR` | ⚠️ Dans `/pro/voyages/[id]/restauration` | Non | ⚠️ Partiel | Contrôle indépendant sur déclarations resto/hôtel |
| Payables RestoHotel DayTotal FinanceCheck PayRun EOM | `704_PATCH_V465_Payables_RestoHotel_DayTotal_FinanceCheck_PayRun_EOM_MVP_FR` | ⚠️ Backend finance + restauration.service | Non | ⚠️ Partiel | PayRun end-of-month complet non confirmé |

#### Pages drawio QA_PATCH — Restauration + HRA Automation

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| QA_PATCH_626 — Modèle Restauration HRA (résumé NoDup) | `QA_PATCH_626_HRA_RESTO_MODEL_SUMMARY_NODUP_MVP_FR` | ✅ Hôtel HRA possède restauration par défaut | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | Max 1 restaurant externe par voyage confirmé |
| HRA Automation + Manual API (P363) | `QA_PATCH_363_HRA_AUTOMATION_MANUAL_API` | ⚠️ API manuelle OK, automation partielle | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Automation roadmap (futur V1) |

---

### 3. ACTIVITÉS

#### Pages drawio T050 — V3_ACTD Series

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Modèle Tout Compris + Options MVP | `V3_ACTD_01_Modele_ToutCompris_Options_MVP` | ✅ ActivityPurchaseMode (EVENTY_BUYS/CREATOR_BUYS) + TravelActivityCost | Oui (AUDIT-CREATION-VOYAGE, AUDIT-HRA-COMPLET) | ✅ OK | TravelActivityConfig avec inclusionMode (INCLUDED/OPTIONAL/EXCLUDED) non confirmé |
| UI Client Choix Options (client choisit activité optionnelle) | `V3_ACTD_02_UI_Client_Choix_Options_MVP` | ❌ Non implémenté côté client | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | OptionalActivityBooking côté client |
| Gestion Créateur Options (wizard Phase 1) | `V3_ACTD_03_Gestion_Createur_Options_MVP` | ✅ EtapeActivites.tsx (425 lignes) dans wizard | Oui (AUDIT-CREATION-VOYAGE) | ⚠️ Partiel | MOCK_ACTIVITIES non connecté API — optionalPriceCents/Deadline non implémentés |
| Activités Agenda + Conflits MVP | `V3_ACTD_04_Activites_Agenda_Conflits_MVP` | ❌ Non implémenté | **NOUVEAU V48-exclusif — Section 14** | ❌ Manque | Timeline jour/jour client, détection conflits horaires (API POST check-conflicts), vue Pro drag&drop, export ICS+PDF — Voir Section 14 |
| Analytics Activités MVP | `V3_ACTD_05_Analytics_Activites_MVP` | ❌ Non implémenté | **NOUVEAU V48-exclusif — Section 14** | ❌ Manque | Dashboard `/admin/analytics/activites`, insights créateur, CRON rapport mensuel, export CSV, intégration P&L — Voir Section 14 |
| OptionalActivityBooking model (bookingId + paxCount + totalCents) | `V3_ACTD_01` (spec Prisma) | ❌ Non dans Prisma actuel | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | Table OptionalActivityBooking Prisma |
| Prix catalogue basePriceTTC NE CHANGE JAMAIS | `V3_ACTD_01` | ✅ Règle dans TravelActivityCost.costAmountTTC | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | — |
| maxOptionalPax (null=illimité) | `V3_ACTD_01` | ❌ Non implémenté | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | — |
| optionalDeadlineDaysBefore (défaut=7) | `V3_ACTD_01` | ❌ Non implémenté | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | — |

#### Pages drawio T050 — Activities Providers + Finance

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Activities Providers Management (gestion prestataires) | `618_PATCH_V366_Activities_Providers_Management_MVP_FR` | ✅ `/admin/activites/prestataires/page.tsx` + ActivityPartner | Oui (AUDIT-HRA-COMPLET) | ✅ OK | Admin Integrations Connecteurs futur |
| Activities Quote Register Payment Model | `667_PATCH_V415_Activities_Quote_Register_PaymentModel_MVP_FR` | ⚠️ TravelActivityCost + PROOF_UPLOADED workflow | Non — STUB drawio | ⚠️ Partiel | Modèle devis + registre paiements complet |
| Admin Integrations Activities Connectors | `QA_PATCH_238_ADMIN_Integrations_Activities_Connectors_MVP_FR` | ⚠️ Partiellement dans admin activités | Non | ⚠️ Partiel | Connecteurs API activités (futur) |
| Activités post-création Pro | route `/pro/voyages/[id]/activites` | ✅ `/activites/page.tsx` (421 lignes) | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | — |
| Activités post-création Admin | route `/admin/activites/page.tsx` | ✅ Existe (coûts + approbations) | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Workflow PLANNED→PROOF_UPLOADED→CONFIRMED\|REJECTED | drawio V95 | ✅ ActivityPurchaseStatus enum + transitions | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Suppression activité (PLANNED seulement) | drawio V95 | ✅ `DELETE /hra/activities/:id` garde PLANNED only | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| QA_PATCH_1146 — Activities MVP INCLUDED only | `QA_PATCH_1146_ACTIVITIES_MVP_INCLUDED_ONLY_WITH_API_HOOKS_FR` | ✅ EVENTY_BUYS + CREATOR_BUYS modes | Non (NOUVEAU) | ✅ OK | — |
| Admin Ventes Activités | `/admin/ventes/activites` | ✅ Route existe | Non | ✅ OK | — |

---

### 4. PORTAILS FOURNISSEURS (Hôteliers / Restaurateurs)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Portail Restaurateur — Authentification / Login | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/login/page.tsx` | Oui | ✅ OK | — |
| Portail Restaurateur — Compte | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/compte/page.tsx` | Oui | ✅ OK | — |
| Portail Restaurateur — Dashboard | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/dashboard/page.tsx` (340 lignes) | Oui | ✅ OK | — |
| Portail Restaurateur — Déclarations | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/declarations/page.tsx` (325 lignes) | Oui | ✅ OK | — |
| Portail Restaurateur — Facturation | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/facturation/page.tsx` (403 lignes) | Oui | ✅ OK | — |
| Portail Restaurateur — Historique | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/historique/page.tsx` (301 lignes) | Oui | ✅ OK | — |
| Portail Restaurateur — Incidents | `05_Portail_Restaurateur_V15` | ✅ `/restaurateur/incidents/page.tsx` (412 lignes) | Oui | ✅ OK | — |
| Portail Hôtel — Invitation token (public) | `128_Hotel_Portal_MVP_UI_V57` | ✅ `/hotel-invite/[token]/page.tsx` (274 lignes) | Oui | ✅ OK | Réponse après CHANGES_REQUESTED (re-soumission) |
| Portail Hôtel — Magic link login | `128_Hotel_Portal_MVP_UI_V57` | ❌ Non implémenté | Non | ❌ Manque | `/hotel/magic/[token]` route |
| Portail Hôtel — Rooming list + OK/Anomalie | `128_Hotel_Portal_MVP_UI_V57` écran 5 | ⚠️ Partiellement dans `/hotel-invite/[token]` | Oui | ⚠️ Partiel | Écran dédié rooming list hôtelier |
| Portail Hôtel — Sécurité : token signé + rate-limit + audit | `128_Hotel_Portal_MVP_UI_V57` | ✅ `hotel-portal.service.ts` — LOT 166 sécurité | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| restaurant-portal.service.ts (portail restaurateur backend) | Backend | ✅ 308 lignes | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Hotel-portal.service.ts (portail hôtelier backend) | Backend | ✅ 326 lignes | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |

---

### 5. TARIFS & RATE CARDS

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Admin HRA Rate Card Chambres (CRUD) | `QA_PATCH_1127` | ✅ `/admin/hra/rate-cards/page.tsx` (892 lignes) — interface HotelRateCard | Non (NOUVEAU) | ⚠️ Partiel | Backend API rate-cards non connecté (DemoBanner) |
| Admin HRA Rate Card Restauration (CRUD) | `QA_PATCH_1130` | ✅ `/admin/hra/rate-cards/page.tsx` — interface RestaurantRateCard | Non (NOUVEAU) | ⚠️ Partiel | Backend API non connecté |
| Admin HRA Rate Card Activités (CRUD) | `QA_PATCH_1131` | ✅ `/admin/hra/rate-cards/page.tsx` — interface ActivityRateCard | Non (NOUVEAU) | ⚠️ Partiel | Backend API non connecté |
| Modèle prix HRA : PER_ROOM vs PER_PERSON | `QA_PATCH_382_SOT_HRA_PRICING_UNITS_CONVERSION_MVP_FR` | ✅ PriceType enum dans HotelBlock | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Prix TTC négocié + marge Eventy + TVA | `QA_PATCH_1135` | ✅ HotelBlock.pricePerNightTTC + marginType + marginValue | Non (NOUVEAU) | ✅ OK (backend) | UI admin price negotiation |
| Taxe séjour : INCLUDED vs ADDITIONAL | `QA_PATCH_1135` spec | ✅ TaxeSejourType enum dans HotelBlock | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Suppléments : single, sea view, half board, full board, all-inclusive | drawio V55 | ✅ Dans HotelBlock (5 champs supplementXxxCents) | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Enfants : FULL vs REDUCED + réduction % | drawio V55 | ✅ ChildPriceType + childReductionPercent | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Affichage prix (P388) — display model | `QA_PATCH_388_HRA_PRICING_DISPLAY_MODEL_MVP_FR` | ✅ Privacy client : prix HRA JAMAIS exposé au client | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Handoff Finance Data (P389) | `QA_PATCH_389_HRA_HANDOFF_FINANCE_DATA_MVP_FR` | ⚠️ `/admin/finance/supplier-invoices` existe | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Handoff complet finance ↔ HRA |
| Rate Card Export | mentionné dans AUDIT-HRA-COMPLET | ❌ Non implémenté | Oui (AUDIT-HRA-COMPLET) | ❌ Manque | Export CSV/Excel rate cards |
| Finance Margin Override Guardrails | `QA_PATCH_1169` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Min/max guardrails sur marge override |

---

### 6. MATCHING & SÉLECTION HRA

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Browser HRA — liste partenaires actifs filtrables | `644_PATCH_V392_Creator_HRA_Browser_MVP_FR` | ✅ `/pro/hra/page.tsx` (538 lignes) + `GET /hra/catalog/hotels` | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Filtres : badge premium, type, localisation, prix | `644` spec | ⚠️ Filtres partiels dans `/pro/hra` | Oui | ⚠️ Partiel | Filtre badge Premium, localisation, prix non complet |
| Comparaison côte à côte : prix/unités | `645_PATCH_V393_Creator_HRA_Comparison_MVP_FR` | ❌ Non implémenté | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | Interface comparaison |
| Pré-sélection HRA principal + 2 backups | `646_PATCH_V394_Creator_HRA_PreSelection_MVP_FR` | ❌ Non implémenté | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | trip.hraProviderId principal + backups |
| Matching Simple Top 3 suggestions | `QA_PATCH_1206` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Algo matching par destination |
| Comparateur devis scorecard | `QA_PATCH_1212` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | — |
| Selection Lock + Cancel Others | `QA_PATCH_1213` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Verrouillage sélection + annulation automatique des autres |
| Multi-Provider RFQ Batch Top 3 | `QA_PATCH_1211` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Envoi simultané devis à top 3 |
| HRA Favoris backend (addFavorite, removeFavorite, listFavorites) | drawio spec | ✅ `GET/POST/DELETE /hra/favorites` | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | — |
| Auto-select si HRA actif (hraSelectionStatus=APPROVED) | `QA_PATCH_616` | ❌ Non implémenté | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | Événement HRA_SELECTED + auto-status |
| Hub HRA Isole Autoselect | `QA_PATCH_533_HRA_ISOLE_AUTOSELECT_MVP_FR` | ❌ Non implémenté | Non | ❌ Manque | HRA isolé avec auto-sélection si 1 seul actif |
| HRA Request Redirect Only | `QA_PATCH_577_HRA_REQUEST_REDIRECT_ONLY_MVP_FR` | ❌ Non implémenté | Non | ❌ Manque | Toute demande HRA post-Phase1 redirigée vers Hub HRA |

---

### 7. ONBOARDING PARTENAIRES HRA

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Statuts HRA : INVITED→PENDING→UNDER_REVIEW→APPROVED→ON_HOLD\|REJECTED | `QA_PATCH_371_HRA_ONBOARDING_INSCRIPTION_RAPIDE_CHECKLIST` | ✅ PartnerStatus enum + `PATCH /hra/hotel-partners/:id/status` | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK | — |
| Invitation envoyée par créateur (INVITED) | `QA_PATCH_371` | ✅ HotelBlock.inviteToken + POST create | Oui | ✅ OK | — |
| Inscription rapide partenaire (PENDING_INFO) | `QA_PATCH_371` | ⚠️ `/hotel-invite/[token]` partiel | Oui | ⚠️ Partiel | Statut PENDING_INFO distinct + formulaire complet |
| Contrôle visuel admin + vérifications (UNDER_REVIEW) | `QA_PATCH_371` | ⚠️ `/admin/hra/page.tsx` onglet Hôtels | Oui | ⚠️ Partiel | Queue UNDER_REVIEW dédiée |
| APPROVED → sélectionnable pour voyages | `QA_PATCH_371` | ✅ PartnerStatus.ACTIVE = sélectionnable | Oui | ✅ OK | — |
| ON_HOLD / REJECTED → bloqué | `QA_PATCH_371` | ✅ PartnerStatus enum + statut bloquant | Oui | ✅ OK | — |
| Checklists par type de service (hôtel/resto/activité) | `QA_PATCH_384_HRA_CHECKLISTS_PAR_TYPE_DETAIL_MVP_FR` | ❌ Non implémenté | Non | ❌ Manque | Checklists par type dans onboarding |
| Fiche HRA template (P387) | `QA_PATCH_387_FICHE_HRA_TEMPLATE_MVP_FR` | ⚠️ Profil partenaire dans admin | Non | ⚠️ Partiel | Template fiche HRA standard |
| Pro HRA Onboarding Wizard Fast | `QA_PATCH_1204_PRO_HRA_ONBOARDING_WIZARD_FAST_MVP_FR` | ❌ Non implémenté (STUB drawio) | Oui (AUDIT-FINAL mentionné) | ❌ Manque | Wizard onboarding rapide côté Pro |
| Creator Invite HRA Provider Flow (flow complet) | `QA_PATCH_1215` | ⚠️ `POST /hra/favorites` + inviteToken | Non (STUB drawio) | ⚠️ Partiel | UI flow complet invitation |
| Provider Signup from Invite Link Fast | `QA_PATCH_1216` | ⚠️ `/hotel-invite/[token]` limité aux hôtels | Non (NOUVEAU) | ⚠️ Partiel | Signup rapide pour tous types fournisseurs (pas que hôtel) |

---

### 8. SLA & DÉSACTIVATION

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| SLA désactivation : 12 mois défaut (modifiable admin) | `QA_PATCH_369_GESTION_HRA_PARAMETRES_SLA` | ❌ Non implémenté | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | Setting SLA par type HRA + cron désactivation auto |
| Partenaire inactif = non sélectionnable | `QA_PATCH_369` | ✅ PartnerStatus.INACTIVE → non dans catalogue | Oui | ✅ OK | — |
| Override SLA admin (exceptions) | `QA_PATCH_369` | ❌ Non implémenté | Oui | ❌ Manque | Override admin avec raison auditée |
| Champs & documents requis par type HRA | `QA_PATCH_369` | ⚠️ Champs dans HotelPartner/RestaurantPartner/ActivityPartner | Oui | ⚠️ Partiel | Validation complète documents requis par type |
| HRA Status Lifecycle (P386) — transitions complètes | `QA_PATCH_386_HRA_STATUS_LIFECYCLE_MVP_FR` | ✅ Transitions HotelBlockStatus dans hra.service.ts | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| RBAC Overrides HRA (P383) | `QA_PATCH_383_HRA_RBAC_OVERRIDES_MVP_FR` | ⚠️ `resolveAuthorizedProProfileId()` dans hra.service.ts | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | RBAC override doc complète |
| Standby Comms HRA Unlock | `QA_PATCH_580_STANDBY_COMMS_HRA_UNLOCK_MVP_FR` | ❌ Non implémenté | Non | ❌ Manque | Communication standby + déverrouillage HRA |
| HRA AutoRemind Cutoff + Negotiation SLA | `QA_PATCH_1176` | ❌ Non implémenté | Non (NOUVEAU) | ❌ Manque | Rappels auto SLA négociation + cutoff |
| DEADLINE_CONFIRMATION auto (libération chambres) | drawio V55 | ❌ Non implémenté | Oui (AUDIT-HRA-COMPLET) | ❌ Manque | Cron libération auto chambres si hôtel ne répond pas |

---

### 9. CONTRÔLE ANOMALIES (Variance, Surfacturation)

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Rooming List : OK / ANOMALIE | `131_UI_RoomingList_Exports_OK_Anomalie_V58` | ✅ Dans `rooming.service.ts` — anomaly detection | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Types d'anomalies : OVERBOOKING / UNASSIGNED / SPECIAL_REQUEST / AVAILABILITY_MISMATCH | drawio V58 | ✅ Enum dans rooming service | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Ticket anomalie interne (rooming) | drawio V58 | ✅ `GET /rooming/:travelId/conflicts` | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| MealDisputeTicket (variance repas vs déclarés) | `205_Workflow_Litige_Restauration_V98` | ✅ MealDisputeTicket model + POST /restauration/:travelId/disputes | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Anti-doublon références HRA | `QA_PATCH_594_ANTI_DOUBLON_REFERENCES_HRA_ADMIN_SUPPORT_MVP_FR` | ⚠️ Partiellement par guards | Non | ⚠️ Partiel | Anti-doublon complet références HRA + support |
| ANOMALY_THRESHOLD configurable (seuil %) | drawio V95-V98 | ❌ Non implémenté | Oui (AUDIT-HRA-COMPLET) | ❌ Manque | Setting seuil % écart repas → escalade |
| Auto-Escalade Litiges | drawio V95-V98 | ⚠️ Manuel uniquement | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Auto-escalade si variance > seuil |
| Blocking Anomalies Tilt Rules | `QA_PATCH_1170` | ⚠️ Anomalies rooming OK mais pas tilt rules HRA | Non (NOUVEAU) | ⚠️ Partiel | Règles tilt HRA spécifiques |
| Contrôle hôtel anomalies (dashboard Pro — section 3) | `17_Pro_Dashboard_Voyage_Chambres_Hotel_V18` | ❌ Section non câblée en frontend | Oui (AUDIT-CREATION-VOYAGE) | ❌ Manque | Section "Hôtel — Contrôle Anomalies" dans dashboard Pro |

---

### 10. FACTURATION FOURNISSEURS

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| SupplierInvoice (consolidation mensuelle) | `05_Portail_Restaurateur_V15` | ⚠️ `/admin/finance/supplier-invoices/page.tsx` existe | Oui (AUDIT-CREATION-VOYAGE) | ⚠️ Partiel | Consolidation mensuelle automatique NET30 FDM |
| MealDeclaration → INVOICED → PAID | drawio V95-V98 | ✅ MealDeclarationStatus enum + transitions | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| PayoutMode : AFTER_DECLARATION / AFTER_ADMIN_APPROVAL / FIXED_SCHEDULE | drawio V98 | ⚠️ END_OF_TRIP seul implémenté | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Modes payout multiples |
| Export Invoice Consolidated | drawio mentionné | ❌ Non implémenté | Oui (AUDIT-HRA-COMPLET) | ❌ Manque | Export facture consolidée Eventy → restaurant |
| Payables RestoHotel DayTotal FinanceCheck PayRun EOM | `704_PATCH_V465` | ⚠️ Backend restauration.service partiel | Non | ⚠️ Partiel | PayRun end-of-month complet |
| Finance Handoff Provider Docs Payment | `QA_PATCH_1198` | ⚠️ `/admin/finance/supplier-invoices` | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Docs fournisseurs + workflow paiement |
| HRA Exports RoomBlock Pack + RoomingList | `QA_PATCH_1188` | ⚠️ Export partial | Non (STUB drawio, NOUVEAU) | ⚠️ Partiel | Pack export complet 1 fichier |

---

### 11. PATCHES QA HRA (616, 621, 626, 369, 371)

*Note : Ces 5 patches font l'objet d'un audit dédié dans `AUDIT-CREATION-VOYAGE-HRA-T050.md`. Résumé ici.*

| Patch | Page drawio | Sujet | Code actuel | Statut |
|---|---|---|---|---|
| QA_PATCH_616 | `QA_PATCH_616_HRA_SELECTION_FLOW_PHASE1_MVP_FR` | Flow sélection HRA Phase 1 : liste HRA actifs, trip.hraProviderId, HRA_SELECTED event, auto-status | ⚠️ API call existe avec fallback mock ; événement HRA_SELECTED absent | ⚠️ Partiel |
| QA_PATCH_621 | `QA_PATCH_621_PHASE1_HRA_GATE_MVP_FR` | Gate Phase 1 : hébergement obligatoire + repas obligatoire | ✅ BLOCKING errors dans wizard page.tsx lignes 431-434 | ✅ OK |
| QA_PATCH_626 | `QA_PATCH_626_HRA_RESTO_MODEL_SUMMARY_NODUP_MVP_FR` | Modèle restauration : hôtel possède resto par défaut, max 1 externe | ✅ MVP MealPlan configuré | ✅ OK |
| QA_PATCH_369 | `QA_PATCH_369_GESTION_HRA_PARAMETRES_SLA` | SLA désactivation partenaires (12 mois défaut, modifiable) | ❌ Non implémenté | ❌ Manque |
| QA_PATCH_371 | `QA_PATCH_371_HRA_ONBOARDING_INSCRIPTION_RAPIDE_CHECKLIST` | Onboarding rapide partenaires HRA : statuts + checklists | ⚠️ Statuts backend OK, UI wizard manquant | ⚠️ Partiel |

---

### 12. HRA ADMINISTRATION & HUBS

| Fonctionnalité | Page drawio | Code actuel | Déjà audité ? | Statut | Ce qui manque |
|---|---|---|---|---|---|
| Hub Gestion HRA (P366) — navigation centrale | `QA_PATCH_366_HUB_GESTION_HRA` | ⚠️ `/admin/hra/page.tsx` (695 lignes) onglets | Oui (AUDIT-HRA-COMPLET) | ⚠️ Partiel | Hub navigation avec liens P363/P367/P369/P371/P380 |
| Listing & file d'attente HRA (P367) | `QA_PATCH_367_GESTION_HRA_LISTING_VALIDATION` | ✅ `GET /hra/hotel-partners/search` + admin UI | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| SOT Gestion HRA Guide (P380) | `QA_PATCH_380_SOT_GESTION_HRA_GUIDE` | N/A — documentation | Oui | N/A | — |
| HRA Hub Review (P522) | `QA_PATCH_522_HUB_HRA_REVIEW_MVP_FR` | ⚠️ Dans admin hra | Non | ⚠️ Partiel | Hub review dédié |
| HRA Hub Linkmap NoDup (P527) | `QA_PATCH_527_HRA_HUB_LINKMAP_NODUP_MVP_FR` | N/A — documentation | Non | N/A | — |
| HRA Audit Logging Policy (P101) | `QA_PATCH_101_HRA_AUDIT_LOGGING_POLICY_MVP` | ⚠️ Audit log partiel dans hra.service.ts | Non | ⚠️ Partiel | Audit log complet HRA — chaque décision tracée |
| Dashboard Admin HRA Global | `GET /hra/dashboard/global` | ✅ Route backend existe | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Dashboard HRA par voyage | `GET /hra/dashboard/travel/:travelId` | ✅ Route backend existe | Oui (AUDIT-HRA-COMPLET) | ✅ OK | — |
| Messagerie HRA : conversations + messages | `QA_PATCH_366` + DTOs | ✅ `POST/GET /hra/conversations` + messages | Oui (AUDIT-CREATION-VOYAGE) | ✅ OK (backend) | Non exposé en frontend |
| Console HRA par voyage : timeline + checklists | `QA_PATCH_1181` | ❌ Non implémenté | Non (STUB drawio, NOUVEAU) | ❌ Manque | — |
| SITE_V8_06_HRA (page publique HRA/partenaire) | `SITE_V8_06_HRA` | ⚠️ Partiellement dans pages publiques | Oui (AUDIT-DRAWIO-100-PERCENT) | ⚠️ Partiel | Page HRA publique |

---

### 13. PRISMA SCHEMA HRA

| Table Prisma | drawio référence | Code actuel | Statut |
|---|---|---|---|
| HotelPartner (30+ champs) | `812_Prisma_GroupeF_Hotel_Restauration_V15` | ✅ Implémenté | ✅ OK |
| RestaurantPartner (20+ champs) | `812_Prisma_GroupeF` | ✅ Implémenté | ✅ OK |
| ActivityPartner (13+ champs) | drawio V95 | ✅ Implémenté | ✅ OK |
| HotelPartnerNote | drawio | ✅ Implémenté | ✅ OK |
| HraFavorite | drawio + QA_PATCH_616 | ✅ Implémenté | ✅ OK |
| HotelBlock (35+ champs) | drawio V55-V57 | ✅ Implémenté | ✅ OK |
| HotelRoomAllocation | drawio V55 | ✅ Implémenté | ✅ OK |
| MealDeclaration (13+ champs) | drawio V95-V97 | ✅ Implémenté | ✅ OK |
| MealDisputeTicket (10+ champs) | drawio V98 | ✅ Implémenté | ✅ OK |
| TravelActivityCost (12+ champs) | drawio V95 | ✅ Implémenté | ✅ OK |
| TravelMealFormula (10+ champs) | drawio V95 | ✅ Implémenté | ✅ OK |
| MenuDuJour (12+ champs) | drawio V95 | ✅ Implémenté | ✅ OK |
| MenuCourse (8+ champs) | drawio V95 | ✅ Implémenté | ✅ OK |
| DietaryPreference | drawio V95 | ✅ Implémenté | ✅ OK |
| HraConversation | DTOs + drawio | ✅ Implémenté | ✅ OK |
| HraMessage | DTOs + drawio | ✅ Implémenté | ✅ OK |
| OptionalActivityBooking | `V3_ACTD_01` spec | ❌ Absente de Prisma actuel | ❌ Manque |
| TravelActivityConfig (inclusionMode) | `V3_ACTD_01` spec | ❌ Non confirmée dans Prisma actuel | ❌ Manque |
| HRA Rate Card (table) | `QA_PATCH_1127-1131` | ❌ Non dans Prisma (frontend-only mock) | ❌ Manque |

---

## FONCTIONNALITÉS NOUVELLES (non dans audits précédents)

Ces fonctionnalités apparaissent dans les drawio mais n'avaient **pas** été couvertes dans les 3 audits précédents :

### Groupe HRA Rate Cards 1126-1175 (PATCH726 uniquement — 50 pages)

1. `QA_PATCH_1135` — HRA Pricing Model : prix TTC négocié + marge + TVA (modèle exact)
2. `QA_PATCH_1136` — HRA Validation Workflow Block (workflow confirmation blocs)
3. `QA_PATCH_1137` — HRA Staff Free Rooms Trace (chambres gratuites staff tracées)
4. `QA_PATCH_1138` — Meals Daily Rate Uniform + Activities Included (tarif repas uniforme/jour)
5. `QA_PATCH_1140` — Finance Admin HRA Params VAT Method (méthode TVA admin)
6. `QA_PATCH_1141` — Creator Negotiation Staff Rooms Policy (politique chambres staff)
7. `QA_PATCH_1144` — HRA Price Request Workflow API or Email (workflow demande de prix)
8. `QA_PATCH_1145` — Meals MVP : 2 repas/jour + travel meal addon
9. `QA_PATCH_1146` — Activities MVP INCLUDED only + API hooks
10. `QA_PATCH_1148` — HRA Negotiation Request Discount Percent
11. `QA_PATCH_1149` — Admin Takeover HRA Asset Reuse Transfer
12. `QA_PATCH_1150` — HRA No API Room Block Request Manual
13. `QA_PATCH_1151` — Travel Meals Policy Trip Level Not Occurrence
14. `QA_PATCH_1154` — Room Block Standard Cutoff Release RoomingList
15. `QA_PATCH_1155` — HRA Automation One Click Generate Block + Negotiation
16. `QA_PATCH_1156` — HRA Validation Queue Fast Approval
17. `QA_PATCH_1157` — Discount Only on HRA Standard Room Price
18. `QA_PATCH_1159` — Defaults Simple Cutoff Rooming Dispo
19. `QA_PATCH_1160` — Negotiation Ladder Creator Admin Employee
20. `QA_PATCH_1161` — Hotel Full Buyout Negotiation Option
21. `QA_PATCH_1162` — HRA Negotiation Dashboard Performance
22. `QA_PATCH_1164` — Buyout Suggestion Rules (53 seats buses)
23. `QA_PATCH_1165` — Negotiation Replace Active Round History Archive
24. `QA_PATCH_1166` — Creator HRA Control Panel Negotiation Validation
25. `QA_PATCH_1168` — Admin Buyout Negotiation Quantity Panel
26. `QA_PATCH_1169` — Finance Margin Override Guardrails HRA
27. `QA_PATCH_1170` — Blocking Anomalies Tilt Rules HRA
28. `QA_PATCH_1173` — Buyout Partial Quantity NB Rooms Default
29. `QA_PATCH_1174` — Cutoff Express Override 21D
30. `QA_PATCH_1175` — Rooming List Export and Tracking

### Groupe HRA Hubs + Provider Comms 1179-1219 (PATCH726 uniquement — 41 pages)

31. `QA_PATCH_1179` — Hub HRA Staff (hôtel/resto/activités) — STUB
32. `QA_PATCH_1180` — Hub HRA Admin Settings + Policies — STUB
33. `QA_PATCH_1181` — Console HRA par voyage : timeline + checklists — STUB
34. `QA_PATCH_1183` — Directory Fournisseurs : contacts + SLA + préférences — STUB
35. `QA_PATCH_1184` — HRA Provider Email Templates — STUB
36. `QA_PATCH_1185` — HRA Outbox Provider Send + Retry + Fallback — STUB
37. `QA_PATCH_1188` — HRA Exports RoomBlock Pack + RoomingList — STUB
38. `QA_PATCH_1189` — HRA Export Send OneClick Provider — STUB
39. `QA_PATCH_1190` — Ops Health HRA Tiles Cutoff/Rooming/SLA — STUB
40. `QA_PATCH_1191` — HRA Auto Exports Scheduled Option — STUB
41. `QA_PATCH_1192` — Verify HRA Exports Send Ops Tiles — QA
42. `QA_PATCH_1193` — Pro HRA Profile Status Selector — STUB
43. `QA_PATCH_1194` — Pro HRA Dashboard Planning Tables — STUB
44. `QA_PATCH_1195` — Pro HRA Trip Workspace Confirm/Decline/Counter — STUB
45. `QA_PATCH_1196` — Pro HRA Declarations Availability Blackouts — STUB
46. `QA_PATCH_1197` — HRA Terms Deposit Cancellation Tags — STUB
47. `QA_PATCH_1198` — Finance Handoff Provider Docs Payment — STUB
48. `QA_PATCH_1199` — Verify Pro HRA Status/Dash/Trip/Terms/Finance — QA
49. `QA_PATCH_1200` — Pro HRA Verification Fast Approval Autoready — STUB
50. `QA_PATCH_1201` — Pro Counter Offer TTC + Terms Optional Defaults — STUB
51. `QA_PATCH_1202` — Pro Planning Logic Requested/Confirmed + Forecast — STUB
52. `QA_PATCH_1203` — Verify Pro HRA Logic Fast Not Blocking — QA
53. `QA_PATCH_1204` — Pro HRA Onboarding Wizard Fast — STUB
54. `QA_PATCH_1205` — Pro HRA Notification Center Provider Side — STUB
55. `QA_PATCH_1206` — HRA Matching Simple Provider Suggestions — STUB
56. `QA_PATCH_1207` — QA No Dupes Pro Provider Outbox Links — QA
57. `QA_PATCH_1208` — Matching Top 3 Transparent Reason + View All — STUB
58. `QA_PATCH_1209` — Pro Notifications Requested Only Until Verified — STUB
59. `QA_PATCH_1210` — Verify Matching Transparency + Pro Notify Logic — QA
60. `QA_PATCH_1211` — Multi Provider RFQ Batch Send Top3 — STUB
61. `QA_PATCH_1212` — HRA Quotes Comparator Simple Scorecard — STUB
62. `QA_PATCH_1213` — HRA Provider Selection Lock + Cancel Others — STUB
63. `QA_PATCH_1214` — Verify Batch RFQ Comparator Selection Flow — QA
64. `QA_PATCH_1215` — Creator Invite HRA Provider Flow — STUB
65. `QA_PATCH_1216` — Provider Signup from Invite Link Fast — STUB
66. `QA_PATCH_1217` — Min Criteria Config Admin Employee HRA — STUB
67. `QA_PATCH_1218` — Self-Signup HRA List Secondary Not Priority — STUB
68. `QA_PATCH_1219` — Verify Creator Invite Priority + Admin Accept — QA

### Autres pages nouvelles (T050 + PATCH726)

69. `703_PATCH_V464_RestoHotel_Declaration_IndeControl_MVP_FR` — Contrôle indé sur déclarations
70. `704_PATCH_V465_Payables_RestoHotel_DayTotal_FinanceCheck_PayRun_EOM_MVP_FR` — PayRun EOM
71. `QA_PATCH_612_DATE_CHANGE_AUTOSYNC_HRA_MVP_FR` — Autosync HRA si dates changent
72. `QA_PATCH_617_HRA_CHANGE_BEFORE_VALIDATE_MVP_FR` — Règle changement HRA avant validation
73. `QA_PATCH_623_HRA_CHANGE_NOJUSTIF_MVP_FR` — Changement HRA post-Phase1 = Hub HRA
74. `QA_PATCH_1067_PLAYBOOK_HOTEL_OVERBOOKING_MVP_FR` — Playbook hôtel surbooking (incidents)

### Pages NOUVELLES exclusivement dans V48 (non dans T050 ni PATCH726) — Ajout 2026-03-26

75. `V3_ACTD_04_Activites_Agenda_Conflits_MVP` — Agenda activités client jour/jour + détection conflits horaires — **P1 · 4-6j** — ❌ Non implémenté
76. `V3_ACTD_05_Analytics_Activites_MVP` — Dashboard analytics activités + recommandations créateur — **P2 · 3-5j** — ❌ Non implémenté

### Pages présentes dans V48 + T050 mais absentes de PATCH726 (précisions apportées par V48) — Ajout 2026-03-26

77. `PATCH_COMMS_003_SLA_Escalade_MultiNiveaux_MVP_FR` — Escalade SLA 5 niveaux N1-N5 + SLATracker DB — ❌ Non implémenté
78. `PATCH_V505_Elastic_Rooming_Deadline_LateAdd_MVP` — Rooming élastique + RoomingAddendum + LATE_ADD mode — ❌ Non implémenté

---

## FONCTIONNALITÉS MANQUANTES DANS LE CODE

Liste priorisée de ce qui est spécifié dans les diagrammes mais absent du code :

### PRIORITÉ P0 — Bloquant MVP

| # | Fonctionnalité | Page drawio | Impact |
|---|---|---|---|
| 1 | **HRA principal + 2 backups en pré-sélection** | P644-P646 | Créateur ne peut pas définir backups si partenaire indisponible |
| 2 | **Admin HRA Validation For Trip** (queue auto-validation) | `647_PATCH_V395` | Phase 1 ne peut pas être validée proprement sans cette queue |
| 3 | **SLA désactivation partenaires** (12 mois défaut) | `QA_PATCH_369` | Partenaires inactifs restent sélectionnables sans ce mécanisme |
| 4 | **Rate Card backend API** (les 3 types) | `QA_PATCH_1127/1130/1131` | Rate cards existantes en frontend uniquement (DemoBanner) |
| 5 | **OptionalActivityBooking Prisma table** | `V3_ACTD_01` | Activités optionnelles côté client impossible sans cette table |
| 6 | **Événement HRA_SELECTED + audit actor** | `QA_PATCH_616` | Pas de traçabilité sélection HRA Phase 1 |

### PRIORITÉ P1 — Important

| # | Fonctionnalité | Page drawio | Impact |
|---|---|---|---|
| 7 | **Creator HRA Comparison** (côte à côte) | `645_PATCH_V393` | Créateur ne peut pas comparer les offres HRA |
| 8 | **3 Feux Admin** (FEU 1 Ops / FEU 2 Transport / FEU 3 Finance) dans Phase1 | `124_Admin_Phase1_V56` | Validation Phase 1 non structurée par rôle admin |
| 9 | **Pro Invitations Hôtel** (route `/hotellerie/invitations`) | `127_Pro_Hotels_V57` | Pas de listing/relance invitations depuis portail Pro |
| 10 | **Messagerie HRA** exposée en frontend | DTOs existent | Conversations créateur ↔ partenaire non accessibles |
| 11 | **Console HRA par voyage** (timeline + checklists) | `QA_PATCH_1181` | Pas de vue synthétique HRA par voyage |
| 12 | **Rooming Deadline Configurable** | `134_V59` | Deadline rooming non configurable |
| 13 | **DEADLINE_CONFIRMATION auto** (libération chambres si pas de réponse) | V55 | Chambres bloquées indéfiniment sans réponse hôtel |
| 14 | **ANOMALY_THRESHOLD configurable** (seuil % repas → escalade) | V95-V98 | Escalade litiges repas non déclenchée automatiquement |
| 15 | **Export Invoice Consolidated** | drawio mentionné | Facturation fournisseurs non exportable consolidée |
| 16 | **HRA Staff Free Rooms Trace** | `QA_PATCH_1137` | Chambres staff non tracées |
| 17 | **Finance Admin HRA Params VAT Method** | `QA_PATCH_1140` | Méthode TVA HRA non configurable admin |
| 18 | **Cutoff Express Override 21D** | `QA_PATCH_1174` | Pas de raccourci override délai express |

### PRIORITÉ P2 — Post-MVP

| # | Fonctionnalité | Page drawio | Impact |
|---|---|---|---|
| 19 | HRA Matching Simple Top 3 suggestions | QA_PATCH_1206 | Aide créateur à trouver partenaires |
| 20 | Multi-Provider RFQ Batch Send Top3 | QA_PATCH_1211 | Gain temps envoi devis |
| 21 | HRA Quotes Comparator Scorecard | QA_PATCH_1212 | Comparaison devis |
| 22 | HRA Provider Selection Lock + Cancel Others | QA_PATCH_1213 | Automatisation post-sélection |
| 23 | HRA Outbox Provider + Retry + Fallback | QA_PATCH_1185 | Fiabilité envoi comms fournisseurs |
| 24 | Ops Health HRA Tiles | QA_PATCH_1190 | Monitoring temps réel HRA |
| 25 | HRA Negotiation One-Click + Buyout | QA_PATCH_1155/1161 | Automatisation négociation |
| 26 | Activités Agenda + Conflits | `V3_ACTD_04` **[V48-EXCLUSIF]** | Gestion planning activités + timeline client — détails Section 14 |
| 27 | Analytics Activités | `V3_ACTD_05` **[V48-EXCLUSIF]** | Reporting activités + insights créateur — détails Section 14 |
| 28 | V3_ACTD_02 — Client Choix Options (activités optionnelles) | `V3_ACTD_02` | Personnalisation client |
| 29 | PATCH_COMMS_003 — SLA Escalade N1-N5 | `PATCH_COMMS_003` | Communication SLA multi-niveaux — détails Section 14 |
| 30 | PATCH_V505 — Elastic Rooming + LATE_ADD | `PATCH_V505` | Réservations last-minute + RoomingAddendum — détails Section 14 |

---

## PROCHAINES ÉTAPES RECOMMANDÉES

### Sprint 1 — P0 HRA Backend (1-2 jours)

1. **Créer API Rate Cards backend** — Table Prisma HraRateCard + CRUD `POST/GET/PATCH/DELETE /admin/hra/rate-cards` + connecter `/admin/hra/rate-cards/page.tsx`
2. **Créer OptionalActivityBooking + TravelActivityConfig** dans Prisma — requis pour V3_ACTD
3. **Implémenter événement HRA_SELECTED** dans `hra.service.ts` — audit log actor=CREATOR + auto-status

### Sprint 2 — P0 HRA Frontend (2-3 jours)

4. **Admin HRA Validation Queue** — Route `/admin/hra/validation-queue` avec auto-validation si ACTIVE sinon PENDING
5. **Pro Invitations Hôtel** — Route `/pro/voyages/[id]/hotellerie/invitations` avec listing + relances auto
6. **Pré-sélection HRA Principal + 2 backups** — Modifier `EtapeAccommodation.tsx` pour sélection multiple

### Sprint 3 — P1 Frontend HRA (3-5 jours)

7. **Creator HRA Comparison** — Page comparaison côte à côte hôtels
8. **3 Feux Admin Phase1** — Workflow FEU1 Ops / FEU2 Transport / FEU3 Finance dans `/admin/voyages/[id]/lifecycle`
9. **Messagerie HRA frontend** — Exposer `GET/POST /hra/conversations` dans portail Pro
10. **Console HRA par voyage** — Page `/pro/voyages/[id]/hra-console` avec timeline

### Sprint 4 — P1 Paramétrage (2-3 jours)

11. **SLA Désactivation** — Setting admin SLA par type + cron désactivation auto
12. **Rooming Deadline Configurable** — Setting par voyage
13. **ANOMALY_THRESHOLD** — Setting seuil écart repas
14. **Finance Admin HRA Params VAT** — Page paramètres TVA HRA

---

## RÉCAPITULATIF COVERAGE

| Domaine | Pages drawio | Couverture code | Statut global |
|---------|---|---|---|
| Hôtellerie Core (blocs, invitations, portail) | ~20 pages | 75% | ⚠️ Partiel |
| Hôtellerie Rate Cards + Négociation | 50 pages | 10% | ❌ Majoritairement STUBs |
| Hôtellerie Hubs + Provider Comms | 41 pages | 5% | ❌ STUBs — à compléter |
| Hôtellerie Matching | 9 pages | 0% | ❌ STUBs |
| Restauration Core (portail + déclarations + litiges) | ~15 pages | 95% | ✅ Excellent |
| Restaurant Partner Profiles | 5 pages | 50% | ⚠️ Partiel |
| Activités Core (wizard + backend) | 5 pages | 80% | ⚠️ Partiel (MOCK activités) |
| Activités Agenda + Analytics | 2 pages | 0% | ❌ Manque |
| Portail Fournisseurs (restaurateur/hôtelier) | ~8 pages | 85% | ✅ Bon |
| Rooming | ~8 pages | 90% | ✅ Bon |
| Rate Cards backend | 3 pages | 20% | ❌ Frontend seulement |
| SLA + Désactivation | 2 pages | 30% | ❌ Partiel |
| Contrôle Anomalies | ~5 pages | 70% | ⚠️ Partiel |
| Facturation Fournisseurs | ~5 pages | 50% | ⚠️ Partiel |
| **GLOBAL HRA** | **~180 pages** | **~55%** | **⚠️ Partiel** |

---

---

## 14. SECTION V48.DRAWIO — ANALYSE SPÉCIFIQUE

**Date analyse :** 2026-03-26
**Méthode :** grep XML sur `/c/Users/paco6/AppData/Local/Temp/V48.drawio` (1 693 pages, ~9,8 Mo)

### Résultat de la comparaison V48 vs T050 vs PATCH726

V48 contient **136 pages HRA/hotel/resto/activités/rooming** (selon grep pattern étendu).

**Comparaison exhaustive :**

| Résultat | Nombre | Pages concernées |
|----------|--------|-----------------|
| Pages V48 HRA EXCLUSIVEMENT dans V48 (absentes de T050 ET PATCH726) | **2** | V3_ACTD_04, V3_ACTD_05 |
| Pages V48 HRA présentes dans T050 mais absentes de PATCH726 | 2 | PATCH_COMMS_003, PATCH_V505 |
| Pages V48 HRA présentes dans les 3 fichiers (T050 + PATCH726 + V48) | ~132 | Toutes les autres pages HRA |

**Conclusion :** V48 est une version intermédiaire entre T050 et PATCH726. L'immense majorité de ses pages HRA sont déjà présentes dans T050 (qui contient toutes les pages V48 HRA plus PATCH_V505 et PATCH_COMMS_003), sauf les deux pages V3_ACTD_04 et V3_ACTD_05 qui sont exclusives à V48.

### Pages HRA V48-exclusives (NOUVELLES — non couvertes dans rapport existant)

#### V3_ACTD_04 — Activités : Agenda Client & Détection Conflits (MVP)

**Statut :** NOUVEAU — absent de T050 et PATCH726
**Priorité :** P1 · 4-6 jours · Agents Frontend + API
**Impact :** UX planning client

**A) Agenda Client `/client/bookings/[id]/programme`**
- Timeline verticale jour par jour (Jour 1, Jour 2...)
- Blocs horaires colorés : bleu (transport), violet (activité), orange (repas), gris (libre)
- Par bloc activité : nom, heure début/fin, lieu + lien maps, badge Inclus/En option, photo thumbnail
- Vue compacte mobile swipable avec sticky header
- Export ICS (Ajouter au calendrier) + PDF programme personnalisé

**B) Détection conflits horaires**
- Au checkout (step options ACTD-02) et post-booking
- Algorithme : `if (optionSlot.overlaps(otherSlot)) → CONFLICT` (overlap = start1 < end2 && start2 < end1)
- UI alerte non bloquante : "⚠ Cette activité chevauche Visite du château (10h-12h)"
- Modal confirmation si conflit, mais client décide
- API : `POST /api/client/bookings/:id/check-conflicts` — input: `{ activityConfigIds: [] }` — output: `{ conflicts: [{ act1, act2, overlapMinutes }] }`

**C) Vue Pro agenda `/pro/trips/[tripId]/programme`**
- Drag & drop pour réorganiser les blocs
- Alertes : gap > 2h entre activités, journée > 12h, activité sans horaire
- Template programme sauvegardable et réutilisable pour autres occurrences
- Admin : même vue read-only avec `GET /api/admin/trips/:tripId/programme`

**Code actuel :** ❌ Non implémenté — aucune route `/client/bookings/[id]/programme` ni `/pro/trips/[tripId]/programme`
**DoD :** Agenda client jour/jour, détection conflits horaires, export ICS+PDF, vue Pro drag&drop, alertes planning, tests Playwright

#### V3_ACTD_05 — Analytics Activités & Recommandations (MVP)

**Statut :** NOUVEAU — absent de T050 et PATCH726
**Priorité :** P2 · 3-5 jours · Agents API + Frontend + Finance
**Impact :** Intelligence business

**A) Dashboard Analytics Activités `/admin/analytics/activites`**
- KPIs globaux : taux souscription options, revenue options total, marge options, Top 5 activités, Flop 5 activités
- Par voyage : % pax ayant souscrit au moins 1 option, revenue additionnel, activités les plus populaires
- Par activité : historique souscriptions (courbe), taux annulation, marge nette, note client (P2)

**B) Recommandations créateur (sur `/pro/trips/[tripId]/activites`)**
- Encart "Insights" : taux souscription historique, suggestion prix, alerte si rarement choisi (<20% → suggérer INCLUDED)
- API : `GET /api/pro/trips/:tripId/activity-insights` — output: `[{ activityId, subscriptionRate, suggestedPrice, recommendation }]`
- Seuils : <20% → suggérer INCLUDED ; >70% → confirmer OPTIONAL

**C) Exports & Rapports**
- Rapport mensuel CRON (1er du mois) → email AdminFinance : synthèse options, comparaison M-1
- Export : `GET /api/admin/analytics/activities/export` — format CSV/Excel — params: `{ dateFrom, dateTo, tripId? }`
- Intégration P&L : lignes "Revenue activités optionnelles" + "Marge activités optionnelles" dans P&L par voyage

**Code actuel :** ❌ Non implémenté — aucune route `/admin/analytics/activites` ni `activity-insights`
**Futur (P3) :** A/B testing prix options, recommandations ML, scoring activités (satisfaction × marge)

### Pages V48 présentes dans T050 mais absentes de PATCH726 (PARTIELLEMENT NOUVELLES)

#### PATCH_COMMS_003 — Escalade SLA Multi-Niveaux

**Présence :** V48 + T050 (mais pas PATCH726 — donc non couvert dans rapport précédent)
**Sujet :** Aucune question client ne reste sans réponse. 5 niveaux d'escalade automatique :

| Niveau | Délai | Action |
|--------|-------|--------|
| N1 | 0-4h | Notification push + email au Pro responsable |
| N2 | 4-12h | Rappel Pro + notification 2e responsable |
| N3 | 12-24h | Alerte Employé Voyage + badge "EN RETARD" |
| N4 | 24-48h | Alerte Admin Voyage + file prioritaire + notif SuperAdmin |
| N5 | >48h | SuperAdmin + tag CRITIQUE + incident qualité créé |

**SLA leads "Être rappelé" :** rappel client < 4h heures ouvrées. 12h non traité → Employé rappelle au nom d'Eventy.
**DB/API :** `SLATracker(id, messageId, level[N1-N5], triggeredAt, resolvedAt)` + `CommsKPI` + cron toutes les 15 min.
**Code actuel :** ⚠️ Partiel — escalade SLA communications non implémentée spécifiquement ; SLATracker absent de Prisma.

#### PATCH_V505 — Elastic Rooming Deadline + Late Add MVP

**Présence :** V48 + T050 (mais pas PATCH726)
**Sujet :** Résoud le problème des réservations last-minute bloquées par deadline rooming rigide J-3.

**Règles ElasticRoomingDeadline :**
- Défaut : J-3 (inchangé)
- Si réservation après J-3 → deadline auto = `min(departureDate - 24h, bookingDate + 24h)` + mode UPDATE (addendum, pas nouvelle liste)
- Si hôtel a confirmé FINAL → nouvelle réservation = mode LATE_ADD avec statut `ROOMING_LATE_ADD` + admin approuve/refuse en 1 clic
- Admin peut verrouiller hard (`ROOMING_LOCKED`) ou ouvrir large (late add jusqu'à J-1)

**Modifications Prisma spécifiées :**
- `RoomBooking` : + `roomingMode RoomingMode @default(STANDARD)` + `lateAddStatus LateAddStatus?` + `lateAddApprovedBy` + `lateAddApprovedAt`
- `HotelBlock` : + `roomingStatus RoomingListStatus @default(DRAFT)`
- Nouveau : `RoomingAddendum(id, hotelBlockId, bookingGroupId, addendumType [ADD|REMOVE|MODIFY], sentAt, confirmedByHotelAt)`

**API spécifiée :**
- `POST /api/admin/bookings/:id/late-add/approve`
- `POST /api/admin/bookings/:id/late-add/refuse`
- `POST /api/admin/hotel-blocks/:id/rooming/send-addendum`
- `PATCH /api/admin/hotel-blocks/:id/rooming-status`

**Code actuel :** ❌ Non implémenté — `RoomingAddendum` absent de Prisma, `lateAddStatus` absent, endpoints late-add absents.

### Pages V48 CONNUES (couvertes dans T050 et PATCH726 — confirmation de présence)

Les pages suivantes ont été confirmées présentes dans les 3 drawio (donc CONNUES dans le rapport existant) :
- Toutes les pages `63-133 Hotel/HRA V32-V58` (Portail_Hotel, DB, Execution, RoomingList...)
- Toutes les pages `640-658 PATCH_V388-V406` (HRA Profiles, Pricing, Rooming, Restaurant...)
- Toutes les pages `703-705 PATCH_V464-V466` (RestoHotel, Payables, UI Inde Control)
- Toutes les pages `QA_PATCH_36, 92-94, 101, 363-389, 522-626` (HRA core, SLA, Onboarding...)
- `V3_ACTD_01, 02, 03` (présentes dans T050 ET V48, absentes de PATCH726)
- `812_Prisma_GroupeF_Hotel_Restauration_V15`
- `SITE_V8_06_HRA`, `SITE_V8_07_NEGOCIATION`

### Pages Archived V48 (HRA — pour mémoire)

Ces pages sont archivées dans V48 (préfixe ARCHIVED_) — elles représentent des versions antérieures remplacées :
- `ARCHIVED_QA_PATCH_526_VERIFY_HUBS_HRA_ADMIN_DEV_MVP_FR`
- `ARCHIVED_QA_PATCH_535_VERIFY_HRA_ADMIN_DEV_LINKS_MVP_FR`
- `ARCHIVED_QA_PATCH_571_VERIFY_HRA_ISOLATION_LOCKS_MVP_FR`
- `ARCHIVED_QA_PATCH_575_VERIFY_LINKS_HRA_LOCKS_MENU_MVP_FR`
- `ARCHIVED_QA_PATCH_609_VERIFY_NO_DUP_HRA_PRICING_EXISTING_MVP_FR`
- `ARCHIVED_QA_PATCH_610_VERIFY_OCCURRENCE_EDIT_AUTOSYNC_HRA_MVP_FR`
- `ARCHIVED_QA_PATCH_615_VERIFY_HRA_SELECTION_ISOLATION_MVP_FR`
- `ARCHIVED_QA_PATCH_620_VERIFY_HRA_MVP_FR`
- `ARCHIVED_QA_PATCH_625_VERIFY_RESTO_HOTEL_LOGIC_NOTES_MVP_FR`

Ces archives ne nécessitent pas d'analyse — elles sont remplacées par les pages actives correspondantes.

### Precision sur pages Execution V48 (absentes de T050)

Ces 3 pages sont dans V48 mais PAS dans T050 — elles sont dans PATCH726 :

#### 126_Execution_Hotellerie_Invite_Approval_V56

Décrit le flow complet côté backend pour l'invitation hôtel et la validation :
- Endpoints Pro : `POST /pro/voyages/{id}/hotellerie/plan`, `/hotellerie/blocs`, `/hotellerie/invite`, `PATCH /pro/hotellerie/blocs/{blockId}`, `POST phase1/submit`
- Endpoints Hôtel Extranet : `GET /hotel/invite/{token}`, `POST /hotel/onboarding`, `POST /hotel/blocks/{blockId}/submit`, `/comment`
- Endpoints Admin : `POST /admin/voyage/trips/{id}/phase1/accommodation/{blockId}/approve|changes|suspend`, `POST phase1/approve`
- State machine : `DRAFT → INVITE_SENT → HOTEL_SUBMITTED → APPROVED → ACTIVE`; boucle CHANGES_REQUESTED
- Impact Checkout : hotelBlockId requis, Hold 24h, quotas décrémentés sur PaymentConfirmed
- META : ROUTE TODO/ON HOLD

#### 130_Execution_HotelPortal_Invites_Relances_V57

API détaillée pour le workflow invitation + relances automatiques :
- `POST /trips/:id/hotel-invites`, `POST /hotel-invites/:id/resend`, `POST cancel`, `GET list`, `POST duplicate`
- Portail Hôtel : `GET /hotel/invite/:token`, `POST respond`, `POST submit`, `POST resubmit`, `GET status`
- Admin : `POST approve|changes-requested|suspend|blacklist`, `GET overview`
- Relances automatiques (BullMQ) : relance selon `reminderDays`, escalade admin après `escalationDays`
- Sécurité : token hashé, TTL configurable, rate limit, audit log RGPD
- META : ROUTE TODO/ON HOLD

#### 133_Execution_RoomingList_OK_Anomalie_Relances_V58

API détaillée rooming list avec relances et gestion statuts :
- `POST generate`, `POST export?format=PDF|CSV`, `POST send`, `POST lock`
- Portail Hôtel (token) : `GET`, `POST ok`, `POST anomaly`
- Jobs BullMQ : `roomingReminderJob` (J+1/J+3/J-5), `roomingDeadlineJob`, `exportCleanup`
- Machine états : `DRAFT → SENT → HOTEL_OK | HOTEL_ANOMALY`; ADMIN_LOCKED possible à tout moment
- Anomalie = ticket créé + bloque 'PHASE1 final' si critique (configurable)
- META : ROUTE TODO/ON HOLD

---

## 15. INVENTAIRE ROUTES BACKEND HRA

**Fichier :** `backend/src/modules/hra/hra.controller.ts`
**Préfixe route :** `/hra`

### Routes Hotel Partners

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 1 | POST | `/hra/hotel-partners` | Créer un partenaire hôtel |
| 2 | GET | `/hra/hotel-partners` | Lister les partenaires hôtels |
| 3 | GET | `/hra/hotel-partners/:id` | Obtenir un partenaire hôtel |
| 4 | PATCH | `/hra/hotel-partners/:id/status` | Modifier statut partenaire hôtel |
| 5 | PATCH | `/hra/hotel-partners/:id` | Modifier partenaire hôtel |
| 6 | GET | `/hra/hotel-partners/search` | Rechercher partenaires hôtels |
| 7 | GET | `/hra/hotel-partners/export` | Exporter partenaires hôtels (CSV) |
| 8 | POST | `/hra/hotel-partners/:id/note` | Ajouter note sur un hôtel |
| 9 | GET | `/hra/hotel-partners/:id/note` | Lire note hôtel |

### Routes Restaurant Partners

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 10 | POST | `/hra/restaurant-partners` | Créer partenaire restaurant |
| 11 | GET | `/hra/restaurant-partners` | Lister partenaires restaurants |
| 12 | GET | `/hra/restaurant-partners/:id` | Obtenir un partenaire restaurant |
| 13 | PATCH | `/hra/restaurant-partners/:id/status` | Modifier statut restaurant |
| 14 | PATCH | `/hra/restaurant-partners/:id` | Modifier partenaire restaurant |
| 15 | GET | `/hra/restaurant-partners/search` | Rechercher partenaires restaurants |
| 16 | GET | `/hra/restaurant-partners/export` | Exporter partenaires restaurants (CSV) |
| 17 | POST | `/hra/restaurant-partners/:id/menu` | Ajouter item menu restaurant |
| 18 | GET | `/hra/restaurant-partners/:id/menu` | Lister items menu restaurant |
| 19 | DELETE | `/hra/restaurant-partners/:id/menu/:menuItemId` | Supprimer item menu |

### Routes Activity Partners

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 20 | POST | `/hra/activity-partners` | Créer partenaire activité |
| 21 | GET | `/hra/activity-partners` | Lister partenaires activités |
| 22 | GET | `/hra/activity-partners/:id` | Obtenir partenaire activité |
| 23 | PATCH | `/hra/activity-partners/:id/status` | Modifier statut activité |

### Routes Hotel Blocks

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 24 | POST | `/hra/hotel-blocks` | Créer un bloc hôtel |
| 25 | GET | `/hra/hotel-blocks/travel/:travelId` | Blocs hôtels d'un voyage |
| 26 | GET | `/hra/hotel-blocks/respond/:token` | Obtenir bloc par token (portail hôtel) |
| 27 | POST | `/hra/hotel-blocks/respond/:token` | Répondre à une invitation hôtel |
| 28 | POST | `/hra/hotel-blocks/:id/confirm` | Confirmer un bloc hôtel (admin) |
| 29 | POST | `/hra/hotel-blocks/:id/request-changes` | Demander modifications (admin) |
| 30 | POST | `/hra/hotel-blocks/:id/reject` | Rejeter un bloc hôtel (admin) |
| 31 | POST | `/hra/hotel-blocks/calculate` | Calculer prix total bloc hôtel |

### Routes Meals

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 32 | PATCH | `/hra/meals/:id` | Modifier une déclaration repas |
| 33 | POST | `/hra/meals` | Créer déclaration repas |
| 34 | GET | `/hra/meals/travel/:travelId` | Déclarations repas d'un voyage |
| 35 | DELETE | `/hra/meals/:id` | Supprimer déclaration repas |

### Routes Activities (costs)

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 36 | POST | `/hra/activities` | Créer coût activité |
| 37 | GET | `/hra/activities/travel/:travelId` | Coûts activités d'un voyage |
| 38 | PATCH | `/hra/activities/:id` | Modifier coût activité |
| 39 | DELETE | `/hra/activities/:id` | Supprimer coût activité |

### Routes Dashboard & Catalog

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 40 | GET | `/hra/dashboard/travel/:travelId` | Dashboard HRA par voyage |
| 41 | GET | `/hra/dashboard/global` | Dashboard HRA global (admin) |
| 42 | GET | `/hra/catalog/hotels` | Catalogue hôtels (recherche publique pro) |
| 43 | GET | `/hra/catalog/restaurants` | Catalogue restaurants (recherche publique pro) |

### Routes Favorites & Conversations

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 44 | POST | `/hra/favorites` | Ajouter favori HRA |
| 45 | DELETE | `/hra/favorites/:id` | Supprimer favori HRA |
| 46 | GET | `/hra/favorites` | Lister favoris HRA |
| 47 | POST | `/hra/conversations` | Créer conversation HRA |
| 48 | GET | `/hra/conversations` | Lister conversations HRA |
| 49 | GET | `/hra/conversations/:id` | Obtenir conversation |
| 50 | POST | `/hra/conversations/:id/messages` | Envoyer message conversation |

**Total : 50 routes dans `/hra`**

### Routes Restauration (`/restauration`)

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 1 | GET | `/:travelId/meal-plan` | Plan repas du voyage |
| 2 | PATCH | `/:travelId/meal-plan` | Modifier plan repas |
| 3 | GET | `/:travelId/dietary` | Préférences alimentaires du voyage |
| 4 | POST | `/booking/:bookingGroupId/dietary` | Ajouter préférences alimentaires |
| 5 | GET | `/:travelId/restaurants` | Restaurants du voyage |
| 6 | POST | `/:travelId/restaurants` | Ajouter restaurant au voyage |
| 7 | GET | `/:travelId/summary-pdf` | Export PDF résumé restauration |
| 8 | GET | `/:travelId/costs` | Coûts restauration |
| 9 | PATCH | `/:travelId/meal-formula` | Modifier formule repas |
| 10 | GET | `/:travelId/meal-formula` | Obtenir formule repas |
| 11 | GET | `/:travelId/menus` | Menus du voyage |
| 12 | POST | `/:travelId/menus` | Créer menu |
| 13 | POST | `/menus/:menuId/courses` | Ajouter plat à un menu |
| 14 | GET | `/:travelId/meal-cost` | Coût repas moyen |
| 15 | GET | `/:travelId/declarations` | Déclarations repas |
| 16 | POST | `/:travelId/declarations` | Créer déclaration repas |
| 17 | PATCH | `/declarations/:id/serve` | Marquer repas servi |
| 18 | PATCH | `/declarations/:id/invoice` | Marquer déclaration facturée |
| 19 | PATCH | `/declarations/:id/pay` | Marquer déclaration payée |
| 20 | GET | `/:travelId/disputes` | Litiges restauration |
| 21 | POST | `/declarations/:id/dispute` | Créer litige sur déclaration |
| 22 | PATCH | `/disputes/:id/resolve` | Résoudre un litige |

**Total : 22 routes dans `/restauration`**

### Routes Rooming

| # | Méthode | Route | Description |
|---|---------|-------|-------------|
| 1 | GET | `/rooming/:travelId` | Rooming list d'un voyage |
| 2 | PATCH | `/rooming/booking/:bookingGroupId/assign` | Assigner chambre à un groupe |
| 3 | GET | `/rooming/:travelId/hotel-blocks` | Blocs hôtels pour le rooming |
| 4 | PATCH | `/rooming/hotel-blocks/:id` | Modifier bloc hôtel (rooming) |
| 5 | GET | `/rooming/:travelId/pdf` | Export PDF rooming list |
| 6 | GET | `/rooming/:travelId/stats` | Statistiques rooming |
| 7 | GET | `/rooming/:travelId/passengers` | Liste passagers avec chambres |
| 8 | GET | `/rooming/:travelId/passengers/manifest.csv` | Export CSV manifeste passagers |
| 9 | PATCH | `/rooming/passengers/:participantId/document` | Mettre à jour document participant |
| 10 | POST | `/rooming/passengers/:participantId/reveal` | Révéler données passager (RGPD) |
| 11 | POST | `/rooming/:travelId/passengers/remind-documents` | Relancer participants pour documents |

**Total : 11 routes dans `/rooming`**

---

## 16. INVENTAIRE ROUTES FRONTEND HRA — ÉTAT COMPLET

### Routes existantes confirmées (AXE 2)

| Route | Fichier | Lignes | Sections clés |
|-------|---------|--------|---------------|
| `/pro/hra` | `app/(pro)/pro/hra/page.tsx` | 538 | Catalogue hôtels+restaurants, filtres standing/cuisine/badge, favoris toggle, search, tabs hôtels/restaurants |
| `/pro/voyages/[id]/hotellerie` | `app/(pro)/pro/voyages/[id]/hotellerie/page.tsx` | 331 | KPIs blocs, liste blocs hôtels avec statut, rooming list (toggle), anomalies tickets |
| `/pro/voyages/[id]/restauration` | `app/(pro)/pro/voyages/[id]/restauration/page.tsx` | 493 | Options repas, formule, déclarations, litiges restauration |
| `/pro/voyages/[id]/activites` | `app/(pro)/pro/voyages/[id]/activites/page.tsx` | 421 | Gestion activités post-création (coûts, approbations) |
| `/admin/hra` | `app/(admin)/admin/hra/page.tsx` | 695 | 5 onglets : Aperçu / Hôtels / Restaurants / Activités / Messagerie — connecté à `GET /hra/dashboard/global` |
| `/admin/hra/rate-cards` | `app/(admin)/admin/hra/rate-cards/page.tsx` | 892 | 3 interfaces Rate Card (HotelRateCard, RestaurantRateCard, ActivityRateCard) — DemoBanner visible (backend non connecté) |
| `/admin/rooming` | `app/(admin)/admin/rooming/page.tsx` | 613 | Rooming list, assignation chambres, exports PDF/CSV, filtre voyage |
| `/admin/restauration` | `app/(admin)/admin/restauration/page.tsx` | 370 | Dashboard stats restauration, déclarations filtrables, exports |

**Note :** `/pro/activites/` est un portail restaurateur (avis, calendrier, catalogue...), pas une page pro activités HRA. La page Pro HRA activités est à `/pro/voyages/[id]/activites`.

### Routes manquantes confirmées (AXE 3)

| Route | Statut | Drawio source | Impact |
|-------|--------|---------------|--------|
| `/pro/voyages/[id]/hotellerie/invitations` | ❌ MANQUE | `127_Pro_Hotels_Invites_Relances_UI_V57` | Listing + relances invitations hôtels depuis pro |
| `/pro/voyages/[id]/hotellerie/blocs/[blockId]` | ❌ MANQUE | `126_Execution_Hotellerie_V56` | Détail d'un bloc hôtel individuel |
| `/pro/hra/comparison` | ❌ MANQUE | `645_PATCH_V393_Creator_HRA_Comparison_MVP_FR` | Comparaison côte à côte hôtels |
| `/admin/hra/validation-queue` | ❌ MANQUE | `647_PATCH_V395_Admin_HRA_Validation_For_Trip_MVP_FR` | Queue validation HRA pour voyages |
| `/hotel/magic/[token]` | ❌ MANQUE | `128_Hotel_Portal_MVP_UI_V57` | Magic link login portail hôtel |
| `/pro/voyages/[id]/hra-console` | ❌ MANQUE | `QA_PATCH_1181_CONSOLE_HRA_TRIP_TIMELINE_MVP_FR` | Console HRA par voyage avec timeline |

**Note sur `/admin/hra/rate-cards` :** Route EXISTE (892 lignes) mais avec `DemoBanner` — backend API Rate Cards non connecté. Table Prisma `HraRateCard` absente.

---

---

### 17. PRISMA SCHEMA HRA — INVENTAIRE COMPLET

**Mis à jour le 2026-03-26 — Extraction directe de `backend/prisma/schema.prisma` (6 747 lignes)**

#### Tables HRA présentes dans le schema (17 tables)

| Table | Lignes schema | Champs clés | Relations | Statut dans rapport précédent |
|-------|--------------|-------------|-----------|-------------------------------|
| `HotelBlock` | L.3080 | id, travelId, hotelPartnerId, hotelName, hotelEmail, hotelPhone, inviteToken (unique), status (HotelBlockStatus), roomsRequested, roomsConfirmed, checkInDate, checkOutDate, pricePerNightTTC, marginType, marginValue, priceType, taxeSejourType, supplementSingleCents, supplementSeaViewCents, supplementHalfBoardCents, supplementFullBoardCents, supplementAllInclusiveCents, childPriceType, releaseDate | Travel, HotelPartner, HotelRoomAllocation[] | ✅ Présente |
| `HotelPartner` | L.3126 | id, name, contactEmail, contactPhone, address, city, country, status (PartnerStatus), description, website, standing (HotelStanding), photos (Json), amenities (Json), latitude, longitude, badge (PartnerBadge), trustScore, totalCollabs, avgRating | HotelBlock[], HotelPartnerNote[], HraFavorite[], HraConversation[] | ✅ Présente |
| `HotelRoomAllocation` | L.3159 | id, hotelBlockId, roomType, quantity, pricePerNightTTC, status (AllocationStatus), roomCategory (RoomCategory), superficieMq, viewType (RoomView), amenities (Json), photos (Json) | HotelBlock | ✅ Présente |
| `RestaurantPartner` | L.3180 | id, name, contactEmail, contactPhone, address, city, status (PartnerStatus), description, website, cuisineTypes (Json), ambiance (RestaurantAmbiance), tags (Json), photos (Json), maxGroupCapacity, specialties (Json), badge (PartnerBadge), trustScore, avgRating, payoutSchedule, nfcEnabled | MealDeclaration[], MealDisputeTicket[], HraFavorite[], HraConversation[], RestaurantMenuItem[], MenuDuJour[] | ✅ Présente |
| `MealPlan` | L.3218 | id, travelId, name, description, mealType (MealType), date, startTime, endTime, location, maxGuests, costPerPax, status | Travel | ✅ Présente (partielle) |
| `MealDeclaration` | L.3243 | id, travelId, restaurantId, mealType, date, expectedCount, servedCount, scanMethod (MANUAL/NFC), costAmountTTC, notes, status (MealDeclarationStatus), invoicedAt, paidAt | RestaurantPartner, MealDisputeTicket[] | ✅ Présente |
| `MealDisputeTicket` | L.3272 | id, mealDeclarationId, restaurantId, travelId, reason, expectedCount, invoicedCount, diffCount, status (MealDisputeStatus), resolution, resolvedAt, resolvedByUserId | MealDeclaration, RestaurantPartner | ✅ Présente |
| `HotelPartnerNote` | L.3298 | id, hotelPartnerId, proProfileId, note | HotelPartner, ProProfile | ✅ Présente |
| `HraFavorite` | L.3314 | id, proProfileId, hotelPartnerId, restaurantPartnerId, destination | ProProfile, HotelPartner, RestaurantPartner | ✅ Présente |
| `HraConversation` | L.3331 | id, proProfileId, hotelPartnerId, restaurantPartnerId, travelId, subject, status (HraConversationStatus), lastMessageAt | ProProfile, HotelPartner, RestaurantPartner, HraMessage[] | ✅ Présente |
| `HraMessage` | L.3355 | id, conversationId, senderType (PRO/PARTNER), senderId, content, messageType (HraMessageType), attachments (Json), readAt | HraConversation | ✅ Présente |
| `RestaurantMenuItem` | L.3373 | id, restaurantPartnerId, name, description, category, priceCents, photo, isSignature, allergens (Json), dietaryTags (Json), isAvailable, sortOrder | RestaurantPartner | ⚠️ Non mentionné dans rapport précédent |
| `TravelMealFormula` | L.3396 | id, travelId (unique), formula (MealFormula), mealsIncluded (Json), totalMealsCount, costPerPersonPerMealCents, totalCostCents, participantsCount, includesAlcohol, notes | Travel, MenuDuJour[] | ⚠️ Non mentionné dans rapport précédent |
| `MenuDuJour` | L.3417 | id, travelMealFormulaId, restaurantPartnerId, travelId, mealType, date, menuName, menuDescription, isSurpriseMenu, localSpecialty, ambiance, photos (Json), negotiatedPricePerPersonCents, hasVegetarianOption, hasVeganOption, hasHalalOption, hasGlutenFreeOption, confirmedByRestaurant | TravelMealFormula, RestaurantPartner, MenuCourse[], MealReview[] | ⚠️ Non mentionné dans rapport précédent |
| `MenuCourse` | L.3460 | id, menuDuJourId, courseType (CourseType), name, description, photo, allergens (Json), dietaryTags (Json), isVegetarian, isVegan, isHalal, isGlutenFree, sortOrder | MenuDuJour | ❌ ABSENT du rapport précédent |
| `MealReview` | L.3476 | id, menuDuJourId, bookingGroupId, userId, rating (1-5), comment, photoUrls (Json) | MenuDuJour, BookingGroup, User | ❌ ABSENT du rapport précédent |
| `DietaryPreference` | L.3495 | id, bookingGroupId, userId, diet (DietType), allergies (String[]), specialNotes — contrainte UNIQUE (bookingGroupId, userId) | BookingGroup, User | ❌ ABSENT du rapport précédent |

#### Tables Rooming liées à HRA (dans schema, non strictement "HRA module" mais intégrées)

| Table | Lignes schema | Champs clés | Statut dans rapport précédent |
|-------|--------------|-------------|-------------------------------|
| `RoomBooking` | L.2220 | id, bookingGroupId, travelId, roomTypeId, roomLabel, roomTotalAmountTTC, capacitySnapshot, occupancyCount, pricingParts, perPersonAmountTTC, holdExpiresAt, bookingLockedAt, status (RoomBookingStatus), assignedRoomNumber, assignmentNotes, insuranceSelected | ✅ Mentionné |
| `RoomParticipant` | L.3515 | id, roomBookingId, firstName, lastName, email, phone, isLeader, dateOfBirth, nationality, documentType (PassengerDocumentType), documentNumber (chiffré), documentExpiry, documentDeadlineNotifiedAt, documentCompleted | ✅ Mentionné |
| `PassengerRevealLog` | L.3560 | id, roomParticipantId, accessedByUserId, accessedByRole, fieldAccessed, ipAddress, userAgent | ⚠️ Non mentionné dans rapport précédent |

#### Tables activités liées à HRA

| Table | Lignes schema | Champs clés | Statut dans rapport précédent |
|-------|--------------|-------------|-------------------------------|
| `ActivityPartner` | L.2571 | id, name, contactEmail, contactPhone, address, city, siret, website, activityTypes (Json), zones, status (PartnerStatus), notes | ⚠️ Non mentionné dans rapport précédent |
| `TravelActivityCost` | L.2594 | id, travelId, activityId, title, purchaseMode (ActivityPurchaseMode), purchaseStatus (ActivityPurchaseStatus), costMode (CostMode), costAmountHT, vatRateBps, costAmountTTC, proofFileId, activityPartnerId, notes | ✅ Présente |

#### Tables HRA Négociation (découvertes — absentes du rapport précédent)

| Table | Lignes schema | Champs clés | Statut dans rapport précédent |
|-------|--------------|-------------|-------------------------------|
| `HraNegotiation` | L.6675 | id, travelId, creatorId, partnerId, partnerType (HraPartnerType), requestedPrice, offeredPrice, counterPrice, agreedPrice, eventiMarginPercent, eventiMarginCents, creatorMarginPercent, creatorMarginCents, clientFinalPriceCents, status (HraNegotiationStatus), notes, agreedAt, expiresAt | ❌ ABSENT — non mentionné |
| `NegotiationMessage` | L.6709 | id, negotiationId, senderId, senderRole (NegotiationSenderRole), content, attachments (Json), isAutoGenerated | ❌ ABSENT — non mentionné |
| `HraPreNegotiatedRate` | L.6726 | id, partnerId, partnerType (HraPartnerType), destination, serviceType, pricePerUnitCents, unitDescription, validFrom, validUntil, minParticipants, maxParticipants, notes, isActive, createdByAdminId | ❌ ABSENT — non mentionné |

#### Table générique Supplier (non HRA-spécifique mais référencée)

| Table | Lignes schema | Champs clés | Statut dans rapport précédent |
|-------|--------------|-------------|-------------------------------|
| `Supplier` | L.5025 | id, name, type (SupplierType), status (SupplierStatus), email, phone, address, city, country, siret, tvaNumber, contactName, notes, rating, capacity, metadata | ⚠️ Non mentionné (table générique, pas liée aux tables HRA) |

#### Tables ABSENTES du schema (confirmées manquantes)

| Table attendue | Statut | Source |
|----------------|--------|--------|
| `HraRateCard` (Hotel/Restaurant/Activity Rate Cards) | ❌ ABSENTE | Attendu par `/admin/hra/rate-cards` (892 lignes frontend avec DemoBanner) |
| `TravelAccommodation` (bilan hébergement voyage) | ❌ ABSENTE | Non présente dans schema |

#### Enums HRA complets

| Enum | Valeurs |
|------|---------|
| `HotelBlockStatus` | INVITE_SENT, HOTEL_SUBMITTED, BLOCK_ACTIVE, CHANGES_REQUESTED, REJECTED |
| `HotelInviteStatus` | SENT, OPENED, SUBMITTED, EXPIRED |
| `HotelStanding` | ETOILE_1 à ETOILE_5, BOUTIQUE, PALACE |
| `AccommodationType` | HOTEL, VILLA, RIAD, LODGE, ECOLODGE, PALACE, BOUTIQUE_HOTEL, APPARTEMENT, CAMPING_LUXE, YACHT, CHALET |
| `AccommodationStanding` | STANDARD, CONFORT, SUPERIEUR, LUXE, PALACE |
| `RoomCategory` | SINGLE, DOUBLE, TRIPLE, SUITE, SUITE_JUNIOR, SUITE_PRESIDENTIELLE, FAMILLE, PENTHOUSE, VILLA, BUNGALOW |
| `RoomView` | MER, JARDIN, VILLE, PISCINE, MONTAGNE, PATIO, INTERIEUR |
| `AllocationStatus` | AVAILABLE, HELD, BOOKED, RELEASED, BLOCKED |
| `RoomingMode` | AUTOMATIC, MANUAL, HYBRID |
| `RoomingListStatus` | DRAFT, SUBMITTED, CONFIRMED, LOCKED |
| `RoomBookingStatus` | PENDING, CONFIRMED, CANCELED |
| `MealType` | BREAKFAST, LUNCH, DINNER, SNACK, SPECIAL |
| `MealFormula` | PETIT_DEJEUNER_SEUL, DEMI_PENSION, PENSION_COMPLETE, ALL_INCLUSIVE |
| `CourseType` | AMUSE_BOUCHE, ENTREE, PLAT, FROMAGE, DESSERT, CAFE |
| `DietType` | OMNIVORE, VEGETARIAN, VEGAN, HALAL, KOSHER, GLUTEN_FREE, PESCATARIAN, OTHER |
| `RestaurantAmbiance` | ROMANTIQUE, FESTIF, FAMILIAL, CHIC, DECONTRACTE, TRADITIONNEL, MODERNE |
| `CuisineType` | FRANCAISE, ITALIENNE, ASIATIQUE, MEDITERRANEENNE, STREET_FOOD, GASTRONOMIQUE, VEGETARIEN_VEGAN, FRUITS_DE_MER, LOCALE_TRADITIONNELLE, FUSION, BBQ, DESSERTS, AUTRES |
| `MealDeclarationStatus` | OPEN, CLOSED, INVOICED, PAID |
| `RestaurantPayoutSchedule` | WEEKLY, PER_OCCURRENCE, END_OF_TRIP, AFTER_INVOICE |
| `MealDisputeStatus` | OPEN, IN_REVIEW, RESOLVED, CLOSED |
| `HraMessageType` | TEXT, QUOTE_REQUEST, QUOTE_RESPONSE, BOOKING_CONFIRMATION, DOCUMENT |
| `HraConversationStatus` | OPEN, PENDING_RESPONSE, CONFIRMED, CLOSED |
| `HraPartnerType` | HOTEL, RESTAURANT, ACTIVITY |
| `HraNegotiationStatus` | REQUESTED, COUNTER_OFFERED, CREATOR_COUNTER, AGREED, REJECTED, EXPIRED |
| `NegotiationSenderRole` | CREATOR, PARTNER, EMPLOYEE, SYSTEM |
| `ActivityPurchaseMode` | EVENTY_BUYS, CREATOR_BUYS |
| `ActivityPurchaseStatus` | PLANNED, PROOF_UPLOADED, CONFIRMED, REJECTED |
| `ActivityStanding` | STANDARD, CONFORT, PREMIUM, EXCLUSIF |
| `ActivityType` | EXCURSION, VISITE_GUIDEE, SPORT_NAUTIQUE, SPORT_TERRESTRE, SPA, GASTRONOMIE, CULTURE, AVENTURE, SOIREE, PREMIUM_EXPERIENCE |
| `PassengerDocumentType` | PASSPORT, ID_CARD, RESIDENCE_PERMIT, VISA |
| `PartnerStatus` | ACTIVE, INACTIVE, BLACKLISTED |
| `PartnerBadge` | NEW, VERIFIED, PREMIUM, EXCELLENCE |
| `SupplierStatus` | (défini L.5008) |
| `SupplierType` | (défini L.5015) |

#### Résumé comparatif avec le rapport précédent

| Métrique | Rapport précédent (S.13) | Inventaire réel (S.17) |
|----------|--------------------------|------------------------|
| Tables HRA core identifiées | ~10 tables mentionnées | **22 tables HRA/rooming/activités** |
| Tables absentes du rapport précédent | — | **7 tables nouvelles** : RestaurantMenuItem, TravelMealFormula, MenuDuJour, MenuCourse, MealReview, DietaryPreference, PassengerRevealLog + 3 négociation (HraNegotiation, NegotiationMessage, HraPreNegotiatedRate) |
| `HraRateCard` | ❌ Manque confirmé | ❌ TOUJOURS ABSENTE du schema |
| Tables négociation HRA | Non auditées | **3 tables découvertes** : HraNegotiation, NegotiationMessage, HraPreNegotiatedRate |
| Enums HRA complets | ~15 mentionnés | **36 enums** HRA-liés identifiés |

---

### 18. CHECKOUT CLIENT — INTÉGRATIONS HRA

**Analyse des fichiers `app/(checkout)/checkout/**/*.tsx` (7 pages, 3 021 lignes total)**

#### Fichiers analysés

| Page checkout | Lignes | Description |
|--------------|--------|-------------|
| `start/page.tsx` | 293 | Initiation réservation — appel `/checkout/initiate` |
| `step-1/page.tsx` | 340 | Sélection des chambres (types de chambres + occupancy) |
| `step-2/page.tsx` | 468 | Saisie participants par chambre |
| `step-3/page.tsx` | 563 | Résumé + paiement (solo ou split) |
| `activites/page.tsx` | 332 | Activités optionnelles |
| `transport/page.tsx` | 722 | Sélection transport |
| `confirmation/page.tsx` | 303 | Confirmation réservation |

#### Intégrations HRA présentes dans le checkout

| Fonctionnalité HRA | Page | API appelée | Statut |
|-------------------|------|-------------|--------|
| Sélection du type de chambre (SINGLE/DOUBLE/TRIPLE...) | `step-1/page.tsx` | `GET /checkout/{bookingGroupId}/available-rooms` | ✅ Implémenté — RoomSelection avec roomTypeId, label, occupancyCount, perPersonTTC |
| Assignation participants par chambre (rooming pré-checkout) | `step-2/page.tsx` | Store checkout — roomBookingId par chambre | ✅ Implémenté — participants groupés par chambre avec roomBookingId unique |
| Résumé hébergement (roomCount, rooms dans confirmation) | `confirmation/page.tsx` | — | ✅ Partiel — roomCount visible, pas de détail type chambre |
| Activités optionnelles (MktActivity, pas HRA) | `activites/page.tsx` | `GET /checkout/{bookingId}/suggested-activities` + `POST /checkout/{bookingId}/add-activity` | ✅ Implémenté — MAIS ce sont des activités marketing (MktActivity) et non des TravelActivityCost HRA |

#### Intégrations HRA ABSENTES du checkout

| Fonctionnalité HRA manquante | Impact | Notes |
|-----------------------------|--------|-------|
| Choix de formule repas client (DEMI_PENSION, PENSION_COMPLETE...) | ❌ MANQUE | `TravelMealFormula` définie par le Pro — le client ne peut pas la sélectionner au checkout |
| Préférences alimentaires au checkout (DietaryPreference) | ❌ MANQUE | Disponible en post-checkout via `/client/reservations/[id]/preferences` — mais pas intégré dans le flux checkout |
| Sélection vue chambre (RoomView : MER, JARDIN...) | ❌ MANQUE | `HotelRoomAllocation.viewType` existe dans Prisma mais non exposé au checkout |
| Affichage hôtel assigné au checkout | ❌ MANQUE | Le client ne voit pas quel hôtel/HotelBlock sera utilisé |
| Option supplément single/vue mer (supplementSingleCents, supplementSeaViewCents) | ❌ MANQUE | Champs Prisma présents dans HotelBlock mais non exposés |

#### Observation critique : activités checkout vs activités HRA

Le checkout `activites/page.tsx` appelle `GET /checkout/{bookingId}/suggested-activities` — ce sont les **activités marketing** (`MktActivityEntry` du module marketing), pas les activités HRA (`TravelActivityCost`). Les activités HRA (excursions, visites guidées, etc. gérées par le Pro via `/pro/voyages/[id]/activites`) ne sont **pas vendables** individuellement au client via le checkout.

---

### 19. PORTAIL CLIENT — EXPOSITION HRA

**Analyse des fichiers `app/(client)/client/**/*.tsx`**

#### Pages client exposant des données HRA

| Page client | Route | Lignes | Données HRA exposées | Statut |
|------------|-------|--------|---------------------|--------|
| `reservations/[id]/rooming/page.tsx` | `/client/reservations/[id]/rooming` | 542 | Type de chambre, hotelName, checkIn/checkOut, occupants, capacité, préférences rooming, documents participants (documentNumber via bouton "Révéler"), manifest CSV | ✅ Implémenté — API `GET /client/bookings/{id}/rooming` + `PATCH /client/bookings/{id}/rooming` |
| `reservations/[id]/preferences/page.tsx` | `/client/reservations/[id]/preferences` | 247 | Préférences alimentaires (DietaryForm) — diet, allergies, notes spéciales | ✅ Implémenté — API `POST /restauration/booking/{bookingId}/dietary` |
| `reservations/[id]/page.tsx` | `/client/reservations/[id]` | 804 | Onglet Hébergement : rooms (type, prix, participants) + lien vers rooming | ✅ Partiel — rooms en mock fallback, révélation documentNumber via `POST /rooming/passengers/{id}/reveal`, export CSV via `/api/rooming/{id}/passengers/manifest.csv` |
| `voyage/[id]/activites/page.tsx` | `/client/voyage/[id]/activites` | 297 | Activités disponibles pour le voyage (catalogue) + réservation individuelle | ⚠️ Partiel — API `GET /pro/travels/{travelId}/available-activities` (endpoint PRO appelé depuis client — potentiel conflit rôle) |
| `voyage/[id]/page.tsx` | `/client/voyage/[id]` | 374 | Lien vers activités (`/client/voyage/{id}/activites`) | ✅ Navigation uniquement |

#### Pages client N'exposant PAS de données HRA (mais pertinentes)

| Page client | Données HRA attendues mais absentes |
|------------|-------------------------------------|
| `reservations/[id]/page.tsx` (onglet Repas) | Formule repas du voyage (DEMI_PENSION...), menus du jour, restaurants assignés — non exposés |
| `voyage/[id]/carnet/page.tsx` | Pas de mention HRA dans le carnet de voyage |
| `dashboard/page.tsx` | Pas de résumé HRA sur le dashboard client |

#### Anomalie détectée : endpoint PRO utilisé côté client

La page `/client/voyage/[id]/activites/page.tsx` appelle `GET /pro/travels/{travelId}/available-activities` — un endpoint du module PRO depuis le portail client. Risque de conflit de guard JWT si l'endpoint exige le rôle PRO.

#### Composant partagé : DietaryForm

Le composant `@/components/restauration/dietary-form` est importé dans `reservations/[id]/preferences/page.tsx` — il s'agit d'un composant restauration HRA réutilisé côté client.

---

### 20. TESTS HRA BACKEND — COUVERTURE

**Mis à jour le 2026-03-26 — Analyse des spec files HRA + Restauration + Rooming**

#### Inventaire des fichiers spec

| Fichier | Chemin | Lignes | Tests (it) |
|---------|--------|--------|-----------|
| `hra.service.spec.ts` | `backend/src/modules/hra/` | 1 038 | **64** |
| `hra.controller.spec.ts` | `backend/src/modules/hra/` | 474 | **40** |
| `hotel-portal.service.spec.ts` | `backend/src/modules/hra/` | 316 | **23** |
| `restaurant-portal.service.spec.ts` | `backend/src/modules/hra/` | 404 | **24** |
| `referral.service.spec.ts` | `backend/src/modules/hra/referral/` | 172 | **8** |
| `restauration.service.spec.ts` | `backend/src/modules/restauration/` | 1 435 | **38** |
| `restauration.controller.spec.ts` | `backend/src/modules/restauration/` | 1 147 | **62** |
| `rooming.service.spec.ts` | `backend/src/modules/rooming/` | 488 | **17** |
| `rooming.controller.spec.ts` | `backend/src/modules/rooming/` | 930 | **43** |
| **TOTAL** | | **6 404 lignes** | **319 tests** |

#### Détail `hra.service.spec.ts` (64 tests — 1 038 lignes)

**Describe blocks principaux :**
- `createHotelPartner` — 1 test (création avec status ACTIVE)
- `listHotelPartners` — 2 tests (sans filtre, avec filtre statut)
- `getHotelPartner` — 2 tests (OK + NotFoundException)
- `updateHotelPartnerStatus` — 4 tests (ACTIVE→INACTIVE, BLACKLISTED sans raison, BLACKLISTED avec raison, NotFoundException)
- `createHotelBlock` — 5 tests (création OK, voyage inexistant, checkOut≤checkIn, dates hors voyage, partenaire blacklisté)
- `getHotelBlockByToken` — 3 tests (OK, token invalide, bloc rejeté)
- `respondToHotelBlock` — 3 tests (mise à jour en transaction, bloc non trouvé, statut invalide)
- `confirmHotelBlock` — 4 tests (confirmation OK, proProfileId mismatch SECURITY FIX, statut invalide, race condition)
- `requestChangesHotelBlock` — 2 tests (OK, proProfileId mismatch)
- `rejectHotelBlock` — 2 tests (OK, déjà rejeté)
- `listHotelBlocksForTravel` — 2 tests (OK avec ownership, Pro sans ownership)
- `createRestaurantPartner` — 1 test
- `listRestaurantPartners` — 1 test (take limit défensif LOT 166)
- `getRestaurantPartner` — 1 test (NotFoundException)
- `updateRestaurantPartnerStatus` — 1 test (BLACKLISTED sans raison)
- `createMealDeclaration` — 2 tests (OK, restaurant blacklisté)
- `listMealDeclarations` — 2 tests (ownership SECURITY FIX LOT 166, take limit)
- `deleteMealDeclaration` — 2 tests (OK, NotFoundException)
- `createActivityCost` — 1 test (centimes INVARIANT 3)
- `updateActivityCost` — 3 tests (transition workflow, transition invalide PLANNED→CONFIRMED, proofFileId requis pour PROOF_UPLOADED)
- `deleteActivityCost` — 2 tests (OK si PLANNED, rejeté si autre statut)
- `getTravelHraDashboard` — 2 tests (agrégation hébergement+restauration+activités, ownership check)
- `getGlobalHraStats` — 1 test (stats admin)
- `verifyTravelOwnership` — 6 tests (ADMIN, SUPER_ADMIN, FOUNDER_ADMIN, propriétaire, ForbiddenException, NotFoundException)
- `resolveAuthorizedProProfileId` — 3 tests (ADMIN bypass, propriétaire, rejet)
- `resolveProProfileIdFromBlock` — 2 tests (OK, NotFoundException)
- `verifyMealDeclarationOwnership` — 2 tests (ADMIN, rejet)
- `verifyActivityCostOwnership` — 2 tests (SUPER_ADMIN, rejet)

#### Détail `hotel-portal.service.spec.ts` (23 tests — 316 lignes)

**Describe blocks :**
- `getHotelDashboard` — 5 tests (métriques, calcul revenue, taux occupancy, NotFoundException, check-ins à venir)
- `getUpcomingBookings` — 3 tests (OK, NotFoundException, filtre date range)
- `updateRoomAvailability` — 3 tests (OK, NotFoundException, nombre négatif)
- `confirmHotelBlock` — 3 tests (OK, déjà confirmé, NotFoundException)
- `getOccupancyReport` — 3 tests (OK, NotFoundException, regroupement par mois)
- `exportHotelReportCSV` — 2 tests (OK, headers CSV)
- `getHotelNotifications` — 3 tests (OK, type notification, NotFoundException)

#### Détail `restaurant-portal.service.spec.ts` (24 tests — 404 lignes)

**Describe blocks :**
- `getRestaurantDashboard` — 4 tests (métriques, calcul revenue, NotFoundException, services à venir)
- `getUpcomingMeals` — 3 tests (OK, NotFoundException, filtre date range)
- `confirmMealDeclaration` — 3 tests (OK, déjà confirmé, NotFoundException)
- `updateGuestCount` — 4 tests (OK, zéro guests, négatif, NotFoundException)
- `getDietarySummary` — 3 tests (OK, parsing mots-clés, NotFoundException)
- `getRevenueReport` — 4 tests (OK, moyenne par guest, NotFoundException, regroupement mois)
- `exportRestaurantReportCSV` — 2 tests (OK, headers)
- `getRestaurantNotifications` — *(1 describe restant)*

#### Détail `referral.service.spec.ts` (8 tests — 172 lignes)

**Describe blocks :**
- `generateHotelReferralLink` — 3 tests (OK, NotFoundException, codes uniques par ambassadeur)
- `generateRestaurantReferralLink` — 2 tests (OK, NotFoundException)
- `getReferralStats` — 3 tests (OK, top 5 ambassadeurs triés, 3 mois dans tendance)

#### Détail `restauration.service.spec.ts` (38 tests — 1 435 lignes)

**Describe blocks :**
- `getMealPlan` — 4 tests (programJson, défaut si null, NotFoundException, programJson vide)
- `updateMealPlan` — 3 tests (fusion programJson, création vierge, NotFoundException)
- `getDietaryRequirements` — 4 tests (stats totalParticipants, NotFoundException, zéro participant, relations bookingGroups)
- `submitDietaryPreference` — 4 tests (OK, allergies vides, NotFoundException, submittedAt comme Date)
- `getRestaurantPartners` — 4 tests (exclusionsJson, null, tableau vide, NotFoundException)
- `addRestaurantPartner` — 4 tests (ajout liste, création tableau, ID unique timestamp, NotFoundException)
- `generateMealSummary` — 6 tests (totalParticipants, mealPlan programJson, null, generatedAt, downloadUrl, NotFoundException + relations)
- `getMealCosts` — 9 tests (calcul centimes INVARIANT 3, totalParticipants, Math.ceil jours, tarifs centimes, travelId réponse, NotFoundException, relations, zéro participant)

#### Détail `restauration.controller.spec.ts` (62 tests — 1 147 lignes)

**Describe blocks :**
- `getMealPlan` — 4 tests (OK, NotFoundException, plan vide, validation travelId)
- `updateMealPlan` — 4 tests (OK 200, données invalides, DTO vide, HTTP 200)
- `getDietaryRequirements` — 5 tests (OK, tableau vide, allergies, notes spéciales, voyage invalide)
- `submitDietaryPreference` — 6 tests (OK, 4 arguments corrects, HTTP 201 ×2, user.id du JWT, voyage inexistant, DTO)
- `getRestaurantPartners` — 6 tests (OK, informations complètes, tableau vide, capacité positive, note valide, NotFoundException)
- `addRestaurantPartner` — 7 tests (OK, HTTP 201 ×2, champs obligatoires, déjà existant, capacité invalide, tous détails)
- `generateMealSummary` — 6 tests (OK, Content-Type PDF, buffer non vide, travelId dans nom, NotFoundException, format cohérent + vérification buffer)
- `getMealCosts` — 8 tests (OK, total+perPerson, ventilation, somme ventilations, NotFoundException, zéro, nombres positifs ×2)
- `Intégration générale` — 7 tests (guard JWT, injection service, 8 endpoints, méthodes GET, PATCH, reset mocks, gestion erreurs)
- `Tests de couverture avancée` — 9 tests (submitDietaryPreference JWT, getMealPlan param, updateMealPlan, getDietaryRequirements, getRestaurantPartners, addRestaurantPartner, generateMealSummary, getMealCosts)

#### Détail `rooming.service.spec.ts` (17 tests — 488 lignes)

**Describe blocks :**
- `getRoomingList` — 3 tests (statut paiement+verrouillage, INVARIANT 1 pricingParts=occupancyCount, NotFoundException)
- `assignRoom` — 3 tests (OK, NotFoundException, INVARIANT 5 réservation verrouillée)
- `getHotelBlocks` — 2 tests (OK, NotFoundException)
- `updateHotelBlock` — 3 tests (OK, NotFoundException, BadRequestException bloc actif)
- `checkBlockExpiry` — 2 tests (INVITE_SENT → REJECTED après 14j via updateMany, aucun bloc expiré)
- `generateRoomingPdf` — 2 tests (OK Buffer, NotFoundException)
- `getRoomingStats` — 2 tests (OK via aggregate+count, NotFoundException)

#### Détail `rooming.controller.spec.ts` (43 tests — 930 lignes)

**Describe blocks :**
- `getRoomingList` — 5 tests (OK, pas d'user passé au service, liste vide, erreurs, structure données)
- `assignRoom` — 6 tests (OK, pas d'user au service, dto complet, erreurs, multi-groupes, détails assignation)
- `getHotelBlocks` — 5 tests (OK, pas d'user au service, liste vide, détails complets, erreurs)
- `updateHotelBlock` — 6 tests (OK, pas d'user au service, dto complet, erreurs, détails mis à jour, multi-blocs)
- `generateRoomingPdf` — 7 tests (OK headers, setHeader ×2, nom fichier, contenu PDF, erreurs, pas d'user, multi-travelIds)
- `getRoomingStats` — 6 tests (OK, pas d'user au service, stats détaillées, erreurs, propriétés attendues, multi-travelIds)
- `Validation paramètres` — 2 tests (formats ID divers, IDs numériques comme chaînes)
- `Vérification appels service` — 2 tests (appel unique par endpoint, propagation exceptions)
- `Gestion payload utilisateur` — 2 tests (différents rôles, jamais payload complet au service)
- `Scénarios d'intégration` — 2 tests (flux complet assignation, mises à jour séquentielles)

#### Couverture des cas edge

| Scenario | Couvert ? | Fichier |
|----------|-----------|---------|
| Race condition sur confirmHotelBlock (updateMany count=0) | ✅ | hra.service.spec.ts |
| SECURITY FIX : ownership check proProfileId sur confirmHotelBlock | ✅ | hra.service.spec.ts |
| LOT 166 : take limit défensif sur listRestaurantPartners | ✅ | hra.service.spec.ts |
| LOT 166 : ownership check sur listMealDeclarations | ✅ | hra.service.spec.ts |
| INVARIANT 3 : montants en centimes Int (createActivityCost) | ✅ | hra.service.spec.ts |
| INVARIANT 1 : pricingParts = occupancyCount | ✅ | rooming.service.spec.ts |
| INVARIANT 5 : réservation verrouillée non modifiable | ✅ | rooming.service.spec.ts |
| Expiration blocs INVITE_SENT après 14 jours | ✅ | rooming.service.spec.ts |
| Calcul coûts repas en centimes avec Math.ceil | ✅ | restauration.service.spec.ts |
| Préférences alimentaires avec allergies vides | ✅ | restauration.service.spec.ts |
| Parsing programJson null → plan par défaut | ✅ | restauration.service.spec.ts |
| Transitions statut activité invalides | ✅ | hra.service.spec.ts |
| Portail hôtel : taux d'occupancy, export CSV | ✅ | hotel-portal.service.spec.ts |
| Portail restaurant : summary diététique, export CSV | ✅ | restaurant-portal.service.spec.ts |
| Guard JWT côté controller restauration | ✅ | restauration.controller.spec.ts |
| Négociations HRA (HraNegotiation) | ❌ NON COUVERT | Aucun spec trouvé |
| HraPreNegotiatedRate | ❌ NON COUVERT | Aucun spec trouvé |
| MenuDuJour / MenuCourse | ❌ NON COUVERT | Aucun spec trouvé |
| MealReview (avis client repas) | ❌ NON COUVERT | Aucun spec trouvé |
| ReferralService liens partenaires | ✅ | referral.service.spec.ts |

#### Synthèse couverture tests HRA

| Module | Fichiers spec | Tests | Lignes |
|--------|--------------|-------|--------|
| HRA (service + controller + portails + referral) | 5 fichiers | **159** | 2 404 |
| Restauration (service + controller) | 2 fichiers | **100** | 2 582 |
| Rooming (service + controller) | 2 fichiers | **60** | 1 418 |
| **Total HRA/Restauration/Rooming** | **9 fichiers** | **319 tests** | **6 404 lignes** |

---

### 21. TABLES PRISMA HRA — ANALYSE PROFONDE

#### Méthode
Lecture complète de `backend/prisma/schema.prisma` (6 747 lignes) + grep exhaustif dans `backend/src/` pour chaque table.

---

#### HraNegotiation

**Champs :**
| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | PK |
| travelId | String? | FK Travel optionnelle |
| creatorId | String | ProProfile.id — créateur du voyage |
| partnerId | String | HotelPartner.id ou RestaurantPartner.id |
| partnerType | HraPartnerType | HOTEL / RESTAURANT / ACTIVITY |
| requestedPrice | Int? | Centimes — prix demandé au partenaire |
| offeredPrice | Int? | Centimes — prix proposé par le partenaire |
| counterPrice | Int? | Centimes — contre-proposition du créateur |
| agreedPrice | Int? | Centimes — prix final accepté |
| eventiMarginPercent | Float? | % marge EventyLife (configurable admin) |
| eventiMarginCents | Int? | Centimes marge EventyLife |
| creatorMarginPercent | Float? | % marge créateur |
| creatorMarginCents | Int? | Centimes marge créateur |
| clientFinalPriceCents | Int? | Prix final client calculé |
| status | HraNegotiationStatus | REQUESTED (défaut) |
| notes | String? | Text |
| agreedAt | DateTime? | Date accord |
| expiresAt | DateTime? | Date expiration |
| createdAt / updatedAt | DateTime | Timestamps |
| messages | NegotiationMessage[] | Relation messages de négociation |

**États (HraNegotiationStatus) :** `REQUESTED → COUNTER_OFFERED → CREATOR_COUNTER → AGREED / REJECTED / EXPIRED`

**Index :** creatorId, travelId, (partnerId + partnerType), status

| Critère | Statut |
|---------|--------|
| Définie en Prisma | ✅ |
| Utilisée en service | ❌ Aucune référence dans backend/src/ |
| Exposée en controller | ❌ Aucun endpoint |
| Testée | ❌ Aucun spec |

**Conclusion :** Table entièrement définie mais 100% morte. Le système de négociation de prix direct créateur ↔ partenaire HRA n'est pas implémenté.

---

#### NegotiationMessage

**Champs :**
| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | PK |
| negotiationId | String | FK HraNegotiation (Cascade delete) |
| senderId | String | User ID de l'expéditeur |
| senderRole | NegotiationSenderRole | CREATOR / PARTNER / EMPLOYEE / SYSTEM |
| content | String (Text) | Corps du message |
| attachments | Json | Tableau d'URLs pièces jointes (défaut `[]`) |
| isAutoGenerated | Boolean | Message système automatique (défaut false) |
| createdAt | DateTime | Timestamp |

**Index :** negotiationId, (negotiationId + createdAt)

| Critère | Statut |
|---------|--------|
| Définie en Prisma | ✅ |
| Utilisée en service | ❌ Aucune référence dans backend/src/ |
| Exposée en controller | ❌ Aucun endpoint |
| Testée | ❌ Aucun spec |

**Conclusion :** Table de messagerie interne à la négociation. Entièrement morte — cascade avec HraNegotiation.

---

#### HraPreNegotiatedRate

**Champs :**
| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | PK |
| partnerId | String | HotelPartner.id ou RestaurantPartner.id |
| partnerType | HraPartnerType | HOTEL / RESTAURANT / ACTIVITY |
| destination | String? | ex: "Paris", "Lyon" |
| serviceType | String? | ex: "chambre double", "pension complète" |
| pricePerUnitCents | Int | Prix unitaire en centimes (requis) |
| unitDescription | String | ex: "par chambre/nuit", "par personne/repas" |
| validFrom / validUntil | DateTime? | Fenêtre de validité |
| minParticipants / maxParticipants | Int? | Capacité min/max |
| notes | String? | Text |
| isActive | Boolean | Actif (défaut true) |
| createdByAdminId | String? | Admin ayant saisi le tarif |
| createdAt / updatedAt | DateTime | Timestamps |

**Index :** (partnerId + partnerType), destination, isActive

**Rôle :** Catalogue de tarifs pré-négociés entre EventyLife et ses partenaires HRA, saisis par l'admin. Permet au créateur de voir les prix déjà négociés sans passer par le flow de négociation directe.

| Critère | Statut |
|---------|--------|
| Définie en Prisma | ✅ |
| Utilisée en service | ❌ Aucune référence dans backend/src/ |
| Exposée en controller | ❌ Aucun endpoint |
| Testée | ❌ Aucun spec |

**Conclusion :** Table catalogue de tarifs Eventy. Non implémentée — aucun admin ne peut saisir un tarif, aucun créateur ne peut le consulter.

---

#### PassengerRevealLog

**Champs :**
| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | PK |
| roomParticipantId | String | FK RoomParticipant (Cascade delete) |
| accessedByUserId | String | User ayant cliqué "Révéler" |
| accessedByRole | String (50) | ADMIN, PRO ou CLIENT |
| fieldAccessed | String (50) | Champ révélé : documentNumber, dateOfBirth, etc. |
| ipAddress | String? (45) | IP de l'accès |
| userAgent | String? (500) | User-Agent du navigateur |
| createdAt | DateTime | Timestamp |

**Relation :** appartient à RoomParticipant (qui stocke les PII des passagers chiffrés)

**Index :** roomParticipantId, accessedByUserId, createdAt

**Lien HRA :** Table de traçabilité RGPD pour le bouton "Révéler" les données personnelles des passagers (numéro de passeport, date de naissance). Citée dans les commentaires draw.io "passagers" — partie intégrante du module Rooming, liée par RoomBooking → HotelBlock → Travel.

| Critère | Statut |
|---------|--------|
| Définie en Prisma | ✅ |
| Utilisée en service | ❌ Aucune référence dans backend/src/ |
| Exposée en controller | ❌ Aucun endpoint "révéler PII" |
| Testée | ❌ Aucun spec |

**Conclusion :** Table d'audit RGPD critique pour la conformité légale. Non implémentée — les PII passagers peuvent être lus sans traçabilité, contrairement aux exigences RGPD.

---

#### MealReview

**Champs :**
| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | PK |
| menuDuJourId | String? | FK MenuDuJour (optionnel, SetNull) |
| bookingGroupId | String | FK BookingGroup (Cascade delete) |
| userId | String | FK User (relation "MealReviews", Cascade delete) |
| rating | Int | Note 1-5 |
| comment | String? (Text) | Commentaire libre |
| photoUrls | Json | Tableau d'URLs photos (défaut `[]`) |
| createdAt | DateTime | Timestamp |

**Relations :** MenuDuJour (optionnel), BookingGroup, User

**Index :** menuDuJourId, bookingGroupId

**Workflow attendu :** Après le voyage, le client note chaque repas (MenuDuJour) avec une note 1-5, un commentaire et des photos. Permet d'évaluer la qualité des partenaires restaurant HRA.

| Critère | Statut |
|---------|--------|
| Définie en Prisma | ✅ (relation visible sur User ligne 1585, sur MenuDuJour ligne 3445) |
| Utilisée en service | ❌ Aucune référence dans backend/src/ |
| Exposée en controller | ❌ Aucun endpoint |
| Testée | ❌ Aucun spec |

**Conclusion :** Table d'avis post-voyage sur les repas. Non implémentée — le feedback client sur la restauration HRA est absent.

---

#### Synthèse Tables Section 21

| Table | Prisma | Service | Controller | Tests | Criticité |
|-------|--------|---------|------------|-------|-----------|
| HraNegotiation | ✅ | ❌ | ❌ | ❌ | Haute — cœur du système de négociation prix |
| NegotiationMessage | ✅ | ❌ | ❌ | ❌ | Haute — dépend de HraNegotiation |
| HraPreNegotiatedRate | ✅ | ❌ | ❌ | ❌ | Haute — catalogue tarifs Eventy |
| PassengerRevealLog | ✅ | ❌ | ❌ | ❌ | Critique — conformité RGPD |
| MealReview | ✅ | ❌ | ❌ | ❌ | Moyenne — feedback post-voyage |

**5 tables entièrement définies en Prisma, 0% implémentées en backend.**

---

### 22. ENUMS HRA — VALEURS ORPHELINES

#### Méthode
Pour chaque enum HRA, grep sur `.[VALEUR]` dans `backend/src/` pour détecter les valeurs jamais référencées en dehors de leur définition.

---

#### HotelBlockStatus — `INVITE_SENT | HOTEL_SUBMITTED | BLOCK_ACTIVE | CHANGES_REQUESTED | REJECTED`

| Valeur | Utilisée | Où |
|--------|----------|----|
| INVITE_SENT | ✅ | cron.service.ts:529 (expiration 14 jours) |
| HOTEL_SUBMITTED | ✅ | hra.controller.spec.ts (tests confirmHotelBlock) |
| BLOCK_ACTIVE | ✅ | finance.service.ts:98,539 (filtrage blocs actifs) |
| CHANGES_REQUESTED | ✅ | hra.controller.spec.ts:237 |
| REJECTED | ❌ | Jamais utilisée dans le code (seulement définie dans l'enum) |

**Note critique :** `rooming.service.ts:227` utilise les valeurs string `'PENDING'` et `'DRAFT'` dans un cast `as HotelBlockStatus[]` — ces valeurs n'existent PAS dans l'enum Prisma. Bug potentiel de type safety.

---

#### HotelInviteStatus — `SENT | OPENED | SUBMITTED | EXPIRED`

| Valeur | Utilisée | Où |
|--------|----------|----|
| SENT | ❌ | Non utilisée |
| OPENED | ❌ | Jamais utilisée |
| SUBMITTED | ❌ | Jamais utilisée |
| EXPIRED | ❌ | Jamais utilisée |

**Enum entièrement orpheline.** Le tracking d'ouverture des invitations hôtel n'est pas implémenté.

---

#### PartnerBadge — `NEW | VERIFIED | PREMIUM | EXCELLENCE`

| Valeur | Utilisée | Où |
|--------|----------|----|
| NEW | ❌ | Jamais utilisée |
| VERIFIED | ❌ | Jamais utilisée |
| PREMIUM | ❌ | Jamais utilisée |
| EXCELLENCE | ❌ | Jamais utilisée |

**Enum entièrement orpheline.** Le système de badges partenaire est défini mais non implémenté — ni attribution, ni affichage.

---

#### HraMessageType — `TEXT | QUOTE_REQUEST | QUOTE_RESPONSE | BOOKING_CONFIRMATION | DOCUMENT`

**Note :** L'enum Prisma `HraMessageType` n'est pas importée directement — le code DTO redéfinit un `HraMessageTypeEnum` local dans `create-hra-message.dto.ts`.

| Valeur Prisma | Utilisée dans service |
|---------------|----------------------|
| TEXT | ✅ Via HraMessageTypeEnum local |
| QUOTE_REQUEST | ⚠️ Dans DTO seulement, logique métier absente |
| QUOTE_RESPONSE | ⚠️ Dans DTO seulement, logique métier absente |
| BOOKING_CONFIRMATION | ⚠️ Dans DTO seulement, logique métier absente |
| DOCUMENT | ⚠️ Dans DTO seulement, logique métier absente |

Les types `QUOTE_REQUEST`, `QUOTE_RESPONSE`, `BOOKING_CONFIRMATION`, `DOCUMENT` sont des valeurs orphelines fonctionnelles — DTO valide, logique métier absente.

---

#### HraConversationStatus — `OPEN | PENDING_RESPONSE | CONFIRMED | CLOSED`

L'enum Prisma `HraConversationStatus` n'est référencée dans aucun service ni controller. Aucune transition de statut n'est gérée dans le code.

**Toutes les valeurs sont orphelines** — définies, jamais transitionnées par le code.

---

#### HraNegotiationStatus — `REQUESTED | COUNTER_OFFERED | CREATOR_COUNTER | AGREED | REJECTED | EXPIRED`

**Enum entièrement orpheline.** Liée à `HraNegotiation` (table non implémentée — cf. section 21). Aucune valeur n'est utilisée dans le backend.

---

#### NegotiationSenderRole — `CREATOR | PARTNER | EMPLOYEE | SYSTEM`

**Enum entièrement orpheline.** Liée à `NegotiationMessage` (table non implémentée — cf. section 21).

---

#### MealDeclarationStatus — `OPEN | CLOSED | INVOICED | PAID`

| Valeur | Utilisée | Où |
|--------|----------|----|
| OPEN | ✅ | restauration.service.ts |
| CLOSED | ✅ | restauration.service.ts |
| INVOICED | ✅ | restauration.service.ts |
| PAID | ✅ | restauration.service.ts |

**Enum complètement implémentée** — les 4 états sont utilisés dans le workflow de déclaration repas.

---

#### MealDisputeStatus — `OPEN | IN_REVIEW | RESOLVED | CLOSED`

| Valeur | Utilisée | Où |
|--------|----------|----|
| OPEN | ✅ | restauration.service.ts |
| IN_REVIEW | ❌ | Jamais utilisée dans le code |
| RESOLVED | ✅ | restauration.service.ts |
| CLOSED | ✅ | restauration.service.ts |

**IN_REVIEW est orphelin.** La transition "litige pris en charge" (passage OPEN → IN_REVIEW) n'est pas implémentée.

---

#### RestaurantPayoutSchedule — `WEEKLY | PER_OCCURRENCE | END_OF_TRIP | AFTER_INVOICE`

**Enum entièrement orpheline.** Définie pour la configuration du calendrier de paiement restaurant, mais aucune logique de paiement planifié par restaurant n'est implémentée dans le backend.

---

#### PassengerDocumentType — `PASSPORT | ID_CARD | RESIDENCE_PERMIT | VISA`

Liée au champ `documentType` de `RoomParticipant`. Aucune validation par type de document n'est implémentée dans le service Rooming — le champ est stocké mais jamais filtré ou validé par type.

| Valeur | Utilisée |
|--------|----------|
| PASSPORT | ❌ |
| ID_CARD | ❌ |
| RESIDENCE_PERMIT | ❌ |
| VISA | ❌ |

**Enum entièrement orpheline** au niveau du code — champ stocké en DB, jamais traité par logique métier.

---

#### RoomCategory — `SINGLE | DOUBLE | TRIPLE | SUITE | SUITE_JUNIOR | SUITE_PRESIDENTIELLE | FAMILLE | PENTHOUSE | VILLA | BUNGALOW`

Liée au champ `roomCategory` de `RoomAllocation`. Aucun service n'utilise ce champ — ni assignation, ni filtrage, ni affichage dans le code backend.

**Valeurs orphelines de haut standing :** `SUITE_PRESIDENTIELLE`, `PENTHOUSE`, `VILLA`, `BUNGALOW`, `SUITE_JUNIOR` — fonctionnalités premium définies mais non implémentées.

---

#### RoomView — `MER | JARDIN | VILLE | PISCINE | MONTAGNE | PATIO | INTERIEUR`

Liée au champ `viewType` de `RoomAllocation`. Aucun service n'utilise ce champ.

**Valeurs orphelines :** `PATIO`, `INTERIEUR` — jamais référencées même dans les tests.

---

#### HotelStanding — `ETOILE_1 | ETOILE_2 | ETOILE_3 | ETOILE_4 | ETOILE_5 | BOUTIQUE | PALACE`

Utilisée dans le DTO `create-hotel-partner.dto.ts` (HotelStandingEnum local). Les valeurs `ETOILE_1` et `ETOILE_2` ne sont jamais produites par les tests — hôtels entrée de gamme non ciblés.

---

#### CuisineType et RestaurantAmbiance

Redéfinies comme enums locaux dans `create-restaurant-partner.dto.ts`. Toutes les valeurs sont présentes dans le DTO mais aucune n'est validée ou filtrée dans le service.

---

#### ActivityPurchaseMode — `EVENTY_BUYS | CREATOR_BUYS`

✅ Les deux valeurs sont utilisées dans `hra.service.ts:945` et les specs.

---

#### ActivityPurchaseStatus — `PLANNED | PROOF_UPLOADED | CONFIRMED | REJECTED`

| Valeur | Utilisée |
|--------|----------|
| PLANNED | ✅ (valeur par défaut) |
| PROOF_UPLOADED | ✅ hra.service.spec.ts:743, hra.controller.spec.ts:402 |
| CONFIRMED | ❌ Jamais utilisée dans le code |
| REJECTED | ❌ Jamais utilisée dans le code |

**CONFIRMED et REJECTED sont orphelines.** Le workflow de validation de preuve d'achat activité (Admin confirme ou rejette) n'est pas implémenté.

---

#### CostMode — `FIXED_TOTAL | PER_PERSON | INCLUDED_IN_PACK`

✅ Les 3 valeurs sont définies dans le DTO `CostModeEnum` et utilisées dans le service HRA.

---

#### Synthèse Enums Orphelins Section 22

| Enum | Valeurs totales | Valeurs orphelines | Criticité |
|------|----------------|-------------------|-----------|
| HotelBlockStatus | 5 | 1 (REJECTED) | Moyenne |
| HotelInviteStatus | 4 | 4 (toutes) | Haute — tracking invitations absent |
| PartnerBadge | 4 | 4 (toutes) | Haute — système badges absent |
| HraMessageType | 5 | 4 (hors TEXT) | Haute — types spéciaux non gérés |
| HraConversationStatus | 4 | 4 (transitions) | Haute — statuts non transitionnés |
| HraNegotiationStatus | 6 | 6 (toutes) | Critique — négociation absente |
| NegotiationSenderRole | 4 | 4 (toutes) | Critique — dépend de négociation |
| MealDisputeStatus | 4 | 1 (IN_REVIEW) | Faible |
| RestaurantPayoutSchedule | 4 | 4 (toutes) | Haute — paiement restaurant absent |
| PassengerDocumentType | 4 | 4 (toutes) | Haute — RGPD non appliqué |
| RoomCategory | 10 | ~6 (premium) | Moyenne |
| RoomView | 7 | 2+ (PATIO/INTERIEUR) | Faible |
| ActivityPurchaseStatus | 4 | 2 (CONFIRMED/REJECTED) | Haute — validation achat absente |

**Total estimé : ~50 valeurs d'enum définies, jamais utilisées dans le code backend.**

---

### 23. DOUBLE SYSTÈME ACTIVITÉS — MktActivity vs TravelActivityCost

#### Présentation des deux systèmes

**Système A — MktActivity (Marketplace)**
Tables Prisma : `MktActivityProvider`, `MktActivityEntry`, `MktActivityBooking`, `MktActivityReview`, `MktStripeConnect`

- `MktActivityProvider` : prestataire indépendant (SIRET, commission 15% en basis points, Stripe Connect)
- `MktActivityEntry` : activité au catalogue public (prix unitaire, durée, location, rating)
- `MktActivityBooking` : réservation marketplace par un client (client ou admin, source WIDGET/SOCIAL/CATALOG/DIRECT)
- Lié à `BookingGroup.mktActivityBookings[]` et `Travel.mktActivityBookings[]`
- Enum `MktActivityCategory` (17 catégories) + `MktBookingStatus`

**Système B — TravelActivityCost (HRA/Coûts Voyage)**
Tables Prisma : `TravelActivityCost`, `ActivityPartner`

- `ActivityPartner` : partenaire activité HRA (contact professionnel, zones, types d'activités)
- `TravelActivityCost` : coût d'une activité pour un voyage spécifique
  - `activityId` : référence String (VARCHAR 255) — pas une FK vers MktActivityEntry
  - `activityPartnerId` : FK optionnelle vers `ActivityPartner`
  - `purchaseMode` : EVENTY_BUYS / CREATOR_BUYS
  - `costMode` : FIXED_TOTAL / PER_PERSON / INCLUDED_IN_PACK
  - Lié à `Travel.activityCosts[]` et `ActivityPartner.activityCosts[]`

---

#### Lien (FK) entre les deux systèmes

**Il n'existe aucune Foreign Key entre MktActivityEntry et TravelActivityCost.**

Le champ `TravelActivityCost.activityId` est un `String @db.VarChar(255)` — une référence libre, pas une FK Prisma vers `MktActivityEntry`. Il peut contenir un cuid de MktActivityEntry ou une référence externe, mais aucune contrainte ne le garantit.

```
MktActivityEntry { id: "cuid..." }
         |
         | (pas de FK — référence libre uniquement)
         v
TravelActivityCost { activityId: "cuid..." }  <- aucun @relation Prisma
```

---

#### Comment le Checkout résout la sélection d'activité

**Étape 1 — Suggestion (GET /checkout/:bookingId/suggested-activities)**
Le service `CrossSellService` appelle `prisma.mktActivityEntry.findMany()` — il puise dans le catalogue Système A (Marketplace).

**Étape 2 — Ajout au panier (POST /checkout/:bookingId/add-activity)**
Le service calcule `totalCostCents = priceCentsPerPerson * paxCount` et retourne une confirmation, mais ne crée aucun enregistrement en base de données :
```
// Note : En production, créer un enregistrement CartItem ou similaire
// Pour démo, on retourne simplement la confirmation
```
Ce commentaire dans `cross-sell.service.ts` confirme que la persistance n'est pas implémentée.

**Étape 3 — Aucun pont vers TravelActivityCost**
Après le checkout, aucun code ne crée un `TravelActivityCost`. Le passage de "activité sélectionnée pendant le checkout" à "coût d'activité enregistré dans le voyage HRA" n'est pas implémenté.

---

#### Conclusion — Deux systèmes parallèles déconnectés

| Aspect | MktActivity | TravelActivityCost |
|--------|------------|-------------------|
| Rôle | Marketplace public (catalogue + réservation client) | HRA interne (coûts voyage pro) |
| Lié à | User (client), BookingGroup, Travel | Travel, ActivityPartner |
| Implémenté | ✅ Partiellement (CrossSellService, activities module) | ✅ Partiellement (hra.service addActivityCost) |
| FK entre eux | ❌ Aucune | — |
| Checkout → TravelActivityCost | ❌ Pas de pont | — |

**Gap critique identifié :** Une activité ajoutée par un client pendant le checkout (`MktActivityBooking`) n'est jamais transformée en coût de voyage (`TravelActivityCost`). Le créateur PRO ne voit pas dans son tableau de bord HRA les activités réservées via la marketplace par ses clients. Les deux systèmes fonctionnent en silos.

**Scénario production cassé :**
1. Client ajoute "Visite du Château" au checkout → aucun enregistrement créé (commentaire "pour démo")
2. Créateur PRO consulte ses coûts activités → tableau vide (aucun `TravelActivityCost`)
3. Finance calcule le coût du voyage → activités marketplace non incluses dans les coûts

---

### 24. QA_PATCH T050 500-620 — PAGES HRA NON INVENTORIÉES

#### Pages HRA trouvées dans T050 (zone 500-620, non archivées)

Toutes les pages QA_PATCH HRA de la zone 500-620 déjà dans le rapport :

| Page | Dans rapport |
|------|-------------|
| QA_PATCH_522_HUB_HRA_REVIEW_MVP_FR | ✅ |
| QA_PATCH_527_HRA_HUB_LINKMAP_NODUP_MVP_FR | ✅ |
| QA_PATCH_533_HRA_ISOLE_AUTOSELECT_MVP_FR | ✅ |
| QA_PATCH_577_HRA_REQUEST_REDIRECT_ONLY_MVP_FR | ✅ |
| QA_PATCH_580_STANDBY_COMMS_HRA_UNLOCK_MVP_FR | ✅ |
| QA_PATCH_594_ANTI_DOUBLON_REFERENCES_HRA_ADMIN_SUPPORT_MVP_FR | ✅ |
| QA_PATCH_612_DATE_CHANGE_AUTOSYNC_HRA_MVP_FR | ✅ |
| QA_PATCH_616_HRA_SELECTION_FLOW_PHASE1_MVP_FR | ✅ |
| QA_PATCH_617_HRA_CHANGE_BEFORE_VALIDATE_MVP_FR | ✅ |
| QA_PATCH_619_QA_HRA_SELECTION_MVP_FR | ✅ |

#### Nouvelles pages trouvées hors zone initialement auditée (600-629)

Les pages suivantes sont dans T050 mais absentes du rapport ou partiellement couvertes :

**QA_PATCH_621_PHASE1_HRA_GATE_MVP_FR** — ✅ Dans rapport (gate hébergement + repas obligatoires)

**QA_PATCH_622_ACTIVITES_OPTION_MVP_FR** — NON dans le rapport
- Statut dans le drawio : Phase QA, ROUTE: TODO/ON HOLD
- Contenu : page stub vide (aucun label de contenu — 3 041 caractères de métadonnées uniquement)
- Thème attendu : activation optionnelle des activités dans le wizard Phase 1
- Statut code : Non implémenté — le checkout activités est un module séparé (CrossSellService), pas intégré au wizard Phase 1

**QA_PATCH_623_HRA_CHANGE_NOJUSTIF_MVP_FR** — ✅ Dans rapport

**QA_PATCH_626_HRA_RESTO_MODEL_SUMMARY_NODUP_MVP_FR** — ✅ Dans rapport

**QA_PATCH_627_MVP_RESTO_SINGLE_EXTERNAL_RULE_MVP_FR** — NON dans le rapport
- Statut dans le drawio : Phase QA, ROUTE: TODO/ON HOLD
- Contenu : page stub vide (aucun label de contenu — 3 339 caractères de métadonnées uniquement)
- Thème attendu : règle MVP — max 1 restaurant externe par voyage (restaurant non-HRA)
- Statut code : Règle mentionnée dans le commentaire drawio QA_PATCH_626 mais aucune contrainte DB ou service ne l'enforce explicitement

**QA_PATCH_628_FUTURE_NFC_BRACELET_MULTI_RESTO_NOTES_FR** — NON dans le rapport
- Statut dans le drawio : Phase FUTUR (pas MVP), ROUTE: TODO/ON HOLD
- Contenu : page stub vide (3 351 caractères de métadonnées uniquement)
- Thème : fonctionnalité future NFC / bracelet connecté pour multi-restaurant — hors scope MVP
- Statut code : Non applicable au MVP

#### Pages HRA archivées zone 500-620 (pour mémoire)

| Page archivée | Thème |
|---------------|-------|
| ARCHIVED_QA_PATCH_526_VERIFY_HUBS_HRA_ADMIN_DEV_MVP_FR | Vérification hubs HRA/admin/dev |
| ARCHIVED_QA_PATCH_535_VERIFY_HRA_ADMIN_DEV_LINKS_MVP_FR | Vérification liens HRA |
| ARCHIVED_QA_PATCH_571_VERIFY_HRA_ISOLATION_LOCKS_MVP_FR | Vérification isolation/locks |
| ARCHIVED_QA_PATCH_575_VERIFY_LINKS_HRA_LOCKS_MENU_MVP_FR | Vérification liens + menu locks |
| ARCHIVED_QA_PATCH_609_VERIFY_NO_DUP_HRA_PRICING_EXISTING_MVP_FR | Anti-doublon pricing |
| ARCHIVED_QA_PATCH_610_VERIFY_OCCURRENCE_EDIT_AUTOSYNC_HRA_MVP_FR | Autosync edit occurrence |
| ARCHIVED_QA_PATCH_615_VERIFY_HRA_SELECTION_ISOLATION_MVP_FR | Isolation sélection HRA |
| ARCHIVED_QA_PATCH_620_VERIFY_HRA_MVP_FR | Vérification générale HRA |
| ARCHIVED_QA_PATCH_625_VERIFY_RESTO_HOTEL_LOGIC_NOTES_MVP_FR | Logique resto/hôtel |

Ces pages ARCHIVED sont des pages de vérification (VERIFY_) — confirmations que les exigences étaient connues mais intégrées dans d'autres pages.

#### Bilan Zone 500-620

- Pages HRA dans T050 : 10 actives + 9 archivées = 19 total
- Pages déjà dans rapport avant cet audit : 16/19
- Nouvelles pages ajoutées au rapport : 3 (622, 627, 628)
- Pages 627 et 628 sont des stubs vides (TODO/ON HOLD)
- Page 622 confirme que l'intégration activités dans le wizard Phase 1 est un gap identifié

---

### MISE À JOUR — FONCTIONNALITÉS MANQUANTES (nouvelles gaps sections 21-24)

Les sections précédentes (1-20) couvraient déjà les principaux gaps. Les investigations 21-24 révèlent des gaps supplémentaires :

| Gap | Criticité | Source | Impact |
|-----|-----------|--------|--------|
| Système de négociation HRA (HraNegotiation + NegotiationMessage) entièrement absent | Critique | Section 21 | Le créateur ne peut pas négocier les prix avec les partenaires |
| Catalogue tarifs pré-négociés (HraPreNegotiatedRate) absent | Haute | Section 21 | Aucun tarif Eventy disponible pour les créateurs |
| Traçabilité révélation PII passagers (PassengerRevealLog) absente | Critique RGPD | Section 21 | Non-conformité RGPD — accès PII sans audit |
| Avis clients sur repas (MealReview) absent | Moyenne | Section 21 | Pas de feedback qualité restauration |
| Système badges partenaire (PartnerBadge) absent | Haute | Section 22 | Différenciation partenaires impossible |
| Tracking ouverture invitations hôtel (HotelInviteStatus) absent | Haute | Section 22 | Relances aveugles |
| Validation achat activité par admin (CONFIRMED/REJECTED) absente | Haute | Section 22 | Workflow preuve achat incomplet |
| Pont MktActivity → TravelActivityCost absent | Critique | Section 23 | Activités checkout non comptabilisées dans HRA |
| Checkout add-activity ne persiste pas en DB | Critique | Section 23 | Activités perdues après session |
| Règle max 1 restaurant externe non enforced (QA_PATCH_627) | Moyenne | Section 24 | Violation règle métier possible |

---

---

### 25. V52 ET V53 DRAWIO — PAGES HRA EXCLUSIVES

*Ajouté le 2026-03-27 — Analyse des deux drawio supplémentaires découverts.*

#### Inventaire général V52/V53

- **Total pages V52** : 225 pages
- **Total pages V53** : 225 pages (identique à V52 — même contenu, même liste)
- **Différence V52 vs V53** : aucune — les deux fichiers sont strictement identiques en termes de pages et contenu HRA

#### Pages HRA identifiées dans V52/V53

Sur les 225 pages, 81 correspondent à des patterns HRA/Hotel/Restauration/Activités/Rooming/Négociation/SLA/Invoice. Après filtrage strict sur les pages nommées explicitement HRA, les pages significatives sont :

| Page V52/V53 | Thème | Dans rapport T050/V48/PATCH726 ? |
|---|---|---|
| `SITE_V8_06_HRA` | Hub synthétique HRA — 12 types étendus + Panel créateur + Invitation fournisseur + Contrats + Portail + Admin | OUI (S.7 + S.11 — contenu V52 plus dense) |
| `SITE_V8_07_NEGOCIATION` | Workflow prix 5 étapes + Réponse 2 clics + Automation 1-clic + SLA relances + Sourcing batch | OUI (S.6 + S.11 — même périmètre couvert) |
| `812_Prisma_GroupeF_Hotel_Restauration_V15` | Schema Prisma HotelPartner + HotelBlock + HotelRoomAllocation + RestaurantPartner + MealDeclaration | OUI (S.13 — tables confirmées) |
| `V3_ACTD_04_Activités_Agenda_Conflits_MVP` | Agenda client jour/jour — détection conflits — vue Pro drag&drop — export ICS+PDF | OUI (S.14 — attributé à V48 dans le rapport) |
| `V3_ACTD_05_Analytics_Activités_MVP` | Dashboard analytics activités — insights créateur — CRON rapport mensuel | OUI (S.14 — attributé à V48 dans le rapport) |
| `V3_ACTD_01_Modele_ToutCompris_Options_MVP` | Modèle tout-compris vs options activités | OUI (S.5) |
| `V3_ACTD_02_UI_Client_Choix_Options_MVP` | UI client sélection options activités | OUI (S.5) |
| `V3_ACTD_03_Gestion_Createur_Options_MVP` | Gestion créateur des options activités | OUI (S.5) |
| `PATCH_V505_Elastic_Rooming_Deadline_LateAdd_MVP` | Rooming deadline élastique — ajout tardif | OUI (S.1) |
| `PATCH_COMMS_003_SLA_Escalade_MultiNiveaux_MVP_FR` | SLA escalade multi-niveaux | OUI (S.11) |

#### Pages dans V52/V53 absentes des 3 drawio précédents (T050, V48, PATCH726)

V52/V53 sont des drawio **compacts synthétiques** (225 pages vs 1 700+ pour les drawio précédents). Ils ne contiennent pas de nouvelles pages HRA — ils regroupent une sélection des pages existantes sous forme de hub de référence.

Les séries présentes dans V52/V53 mais absentes des 3 drawio précédents ne sont **pas HRA** :
- `SITE_V8_*` (01-14) — cartographie architecture globale site V8 (14 pages)
- `V3_BUS_*` (01-05) — bus stops dynamiques, manifest, multi-bus
- `V3_PAY_*` (01-05) — échéancier configurable, relances, EarlyBird
- `V3_PLC_*` (01-05) — participants réels vs réservés, places libérées
- `PATCH_V500-V513` — social TravelGroup, Groupe client, Elastic Hold
- `PATCH_COMMS_*` — communication inbox Pro, canal direct, post-voyage
- `QA_PATCH_734/886-927/989-990/1080-1104/1356-1363` — rétention/archivage/notifications admin
- `810_Prisma_GroupeD_Finance_Facturation_V15` — finance (non HRA)
- `CLIENT_V2_*` — portail client V2
- `PRO_*` — portail Pro pages

**Aucune page V52/V53 n'est strictement HRA ET absente du rapport existant.**

#### Informations nouvelles apportées par SITE_V8_06_HRA (V52)

Le contenu de `SITE_V8_06_HRA` dans V52 est plus détaillé que ce qui était référencé dans le rapport. Points notables :

1. **12 types de fournisseurs étendus** (vs 4 types mentionnés précédemment) :
   - Hébergement : Hôtel, Camping, Croisière, Club, **Yacht**, **Villa**, **Riad**, **Divers/Insolite**
   - Filtres : type (HOTEL/RESTO/BAR/ACTIVITY) + badge **Luxe**
   - Séjours packagés (croisières) : dates fixes, durée verrouillée
   - `providerTypeFlags` extensible

2. **Panel créateur HRA (QA_PATCH_1166)** : espace préparation réseau fournisseurs en amont (avant création voyage). Permet browser HRA catalogue Eventy filtrable (V392), comparaison côte à côte 2-3 fournisseurs (V393), pré-sélection HRA principal + backups (V394).

3. **Invitation fournisseur (QA_PATCH_1215/1216)** : flux inscription rapide via lien pré-rempli. SM invitation : SENT → ACCEPTED → SUBMITTED → APPROVED. Pour activités non enregistrées : invitation + demande devis → brouillon Activity HRA.

4. **Contrats & Signatures (V27)** : contrat-cadre signé 1 FOIS à l'approbation (sur profil HRA). Templates versionnés admin. Blocage publication si `SIGNATURE_OK` absent. ForcePublish = Employé/Admin Voyage (raison + audit).

Ces informations complètent les sections 6 (Négociation) et 11 (QA_PATCH_1166/1215/1216) du rapport sans créer de nouveaux gaps — les gaps correspondants étaient déjà identifiés.

#### Informations nouvelles apportées par SITE_V8_07_NEGOCIATION (V52)

`SITE_V8_07_NEGOCIATION` synthétise en une page le workflow prix complet :

1. **Workflow prix 5 étapes formalisé** : BASE_PRICE → CREATOR_NEGOTIATED → SUPPLIER_ACCEPT/REFUSE/COUNTER → ADMIN_APPROVED → EFFECTIVE_PRICE (gelé, source de vérité facturation)
2. **Réponse 2 clics (QA_PATCH_1195)** : interface simplifiée sans login (lien magique) — Confirmer / Décliner / Contre-proposer
3. **Automation 1-clic (QA_PATCH_1155)** : génère RoomBlockRequest + HRA_NegotiationRequest + email fournisseur en une action
4. **SLA négociation** : 24h premier contact / 48h relance. TILT si silence. Cutoff J-14/J-7 auto-relances
5. **Sourcing batch (QA_PATCH_1211-1214)** : RFQ batch Top 3 simultanés + scorecard + sélection + annulation automatique

Ces informations sont toutes déjà couvertes dans le rapport (sections 6, 11, liste des 65 pages HRA manquantes).

#### Confirmation V3_ACTD_04 et V3_ACTD_05

Le rapport les attribue à V48 (`V3_ACTD_04_Activites_Agenda_Conflits_MVP` sans accent). Ces pages existent dans V52/V53 avec le nom `V3_ACTD_04_Activités_Agenda_Conflits_MVP` (avec accent). C'est la même page — la différence est uniquement l'encodage des accents. Le contenu V52 est identique à ce qui est décrit en Section 14 du rapport.

#### Bilan V52/V53

| Métrique | Valeur |
|---|---|
| Pages V52 HRA identifiées | 10 pages nommées strictement HRA |
| Pages V53 HRA identifiées | 10 pages (identiques à V52) |
| V52 = V53 | OUI — 100% identiques |
| Pages nouvelles (absentes des 3 drawio précédents) | 0 page HRA nouvelle |
| Pages HRA présentes dans rapport | 10/10 (toutes couvertes) |
| Nouvelles informations apportées | Contenu plus riche SITE_V8_06/07 : 12 types fournisseurs, contrats V27, workflow prix 5 étapes formalisé |
| Impact sur les gaps identifiés | Aucun nouveau gap — les gaps existants sont confirmés |
| V3_ACTD_04/05 | Identiques à V48 (accent différent uniquement) — déjà en Section 14 |

---

### 26. CRON JOBS HRA — PRÉSENTS ET MANQUANTS

#### Inventaire des crons présents dans `backend/src/modules/cron/cron.service.ts`

Le module cron contient **16 jobs** au total. Deux sont directement liés à HRA :

| Cron | Méthode | Fréquence | Fonction | Spec drawio | Statut |
|---|---|---|---|---|---|
| `handleBlockExpiry` | `@Cron('0 8 * * *')` | Quotidien 8h00 | Expire les `HotelBlock` dont l'invitation date de plus de `CRON_WINDOWS.HOTEL_BLOCK_EXPIRY_DAYS` (14 jours) → status `EXPIRED` | Couvre partiellement SLA désactivation (V48 `QA_PATCH_1113` — délai bloc sans réponse) | PRÉSENT — partiel |
| `handleExpiredRoomHoldCleanup` | `@Cron('*/10 * * * *')` | Toutes les 10 min | Libère les `RoomHold` expirés (`expiresAt < now`) → status `EXPIRED`. Permet à d'autres clients de réserver. | Couvre le hold checkout rooming (V48 checkout flows) | PRÉSENT — OK |

Les 14 autres jobs concernent : holds booking (`handleHoldExpiry` — 5 min), no-go check voyages (`handleNoGoCheck` — 6h), payout mensuel Pro (`handlePayoutCompute` — 1er/mois), rappels documents (`handleDocsReminder` — 7h), rétention données legacy/full, nettoyage tokens email/reset/vouchers, rappels réservation (`handleBookingReminder` — 9h), rappels paiement (`handlePaymentReminder` — 10h), monitoring système (30 min), rapport quotidien (7h), waitlist (4h), panier abandonné (30 min / heure), rapprochement bancaire mensuel (2h le 1er), backup quotidien (2h).

**Crons manquants (spécifiés dans drawio, absents du code) :**

| Cron attendu | Spec drawio | Statut |
|---|---|---|
| Relance auto fournisseur HRA J-14 / J-7 (négociation) | V48 `QA_PATCH_1195` — SLA 24h/48h, relances automatiques cutoff J-14 et J-7 | ABSENT |
| Désactivation auto partenaire HRA (SLA dépassé, 0 réponse) | V48 — SLA désactivation : si fournisseur ne répond pas après N relances → `STATUS_INACTIVE` | ABSENT |
| Rappel confirmation départ (`DEADLINE_CONFIRMATION`) | T050 — confirmation départ x jours avant (distinct du rappel booking générique) | ABSENT |
| Cutoff rooming auto (fermeture liste J-X avant départ) | V48 `RoomingListStatus` → `CLOSED` automatiquement à J-X | ABSENT |
| Rappel complétion profil HRA fournisseur | V48 `QA_PATCH_1166` — relance onboarding fournisseur incomplet | ABSENT |
| Sourcing batch auto-annulation (Top 3 non sélectionné à deadline) | V48 `QA_PATCH_1211-1214` — annulation automatique des 2 offres non retenues | ABSENT |

**Synthèse AXE 1 :**
- 2 crons HRA présents sur ~8 attendus selon les specs drawio
- `handleBlockExpiry` couvre le cas de base (14 jours) mais pas les SLA fins (24h/48h négociation, relances J-14/J-7)
- `handleExpiredRoomHoldCleanup` est correctement implémenté
- Les 6 crons manquants couvrent les flows critiques de négociation, désactivation fournisseur, et fermeture rooming
- `CRON_WINDOWS` ne définit que 2 constantes (`HOTEL_BLOCK_EXPIRY_DAYS: 14`, `ORPHAN_FILE_CLEANUP_DAYS: 7`) — insuffisant pour piloter tous les SLA drawio

---

### 27. NOTIFICATIONS HRA — PRÉSENTES ET MANQUANTES

#### Système de notification existant

Le module `notifications/` utilise 6 `NotificationType` (Prisma) : `BOOKING`, `PAYMENT`, `DOCUMENT`, `SYSTEM`, `MARKETING`, `SUPPORT`. Ces types sont génériques — aucun type dédié HRA (ex. `HRA_NEGOTIATION`, `SUPPLIER_INVITE`, `ROOMING_UPDATE`).

`notification-events.service.ts` expose **9 méthodes** :
- `notifyNewFollower` (Pro) — SYSTEM
- `notifyTeamInvite` / `notifyTeamRemoval` (Pro) — SYSTEM
- `notifyBookingStatusChange` / `notifyBookingConfirmed` (client) — BOOKING
- `notifyPaymentReceived` / `notifyProPaymentReceived` — PAYMENT
- `notifyTravelStatusChange` (tous participants) — BOOKING
- `notifyDocumentStatusChange` (Pro) — DOCUMENT
- `notifyTicketReply` (client) — SUPPORT

`notification-dispatcher.service.ts` : dispatch multi-canal (IN_APP + EMAIL via templateId générique).
`email-templates.service.ts` : aucun template HRA/fournisseur identifié (1 seule mention anecdotique "activités" dans une liste bullet HTML).

| Event | Destinataire | Existe | Spec drawio | Statut |
|---|---|---|---|---|
| Invitation fournisseur HRA (lien pré-rempli) | Fournisseur (email externe) | NON | `QA_PATCH_1215/1216` — flux inscription rapide via lien magique | ABSENT |
| Notification négociation nouvelle demande | Fournisseur HRA | NON | V48 `QA_PATCH_1195` — "Réponse 2 clics" via lien magique | ABSENT |
| Relance négociation J-14 / J-7 | Fournisseur HRA | NON | V48 SLA négociation — auto-relance cutoff | ABSENT |
| Notification offre acceptée/refusée/contre-proposée | Pro créateur voyage | NON | V48 workflow prix 5 étapes | ABSENT |
| Notification bloc hôtel confirmé (`BLOCK_ACTIVE`) | Pro + fournisseur | NON | V48 `HotelBlock` status flow | ABSENT |
| Notification bloc hôtel expiré | Pro + fournisseur | NON | `CRON handleBlockExpiry` → aucune notif envoyée | ABSENT |
| Rappel complétion rooming (client) | Client | NON | V48 `RoomingList` — rappel données rooming manquantes | ABSENT |
| Fermeture liste rooming (cutoff) | Pro + clients | NON | V48 `RoomingListStatus.CLOSED` | ABSENT |
| Notification `RoomHold` expiré (client) | Client | NON | `CRON handleExpiredRoomHoldCleanup` → aucune notif envoyée | ABSENT |
| Notification commande restauration confirmée | Client + restaurateur | NON | V48 `MealOrder` / portail restaurateur | ABSENT |
| Notification activité réservée / annulée | Client | NON | V48 `ActivityBooking` | ABSENT |
| Rappel départ voyage (booking-reminder générique) | Client | OUI (partiel) | `handleBookingReminder` — générique, pas HRA-specific | PRÉSENT — partiel |
| Notification nouveau follower / team invite | Pro | OUI | Specs portail Pro | PRÉSENT — OK |
| Notification statut réservation | Client | OUI | Specs checkout | PRÉSENT — OK |

**Notifications manquantes (critiques drawio, absentes du code) :**
- Email/push invitation fournisseur HRA avec lien magique onboarding (`QA_PATCH_1215/1216`)
- Email fournisseur "Réponse 2 clics" pour négociation (`QA_PATCH_1195`)
- Notifications de statut bloc hôtel (`BLOCK_ACTIVE`, `EXPIRED`, `CANCELLED`) pour Pro et fournisseur
- Notifications `RoomHold` expiré pour client (rooming incomplet)
- Notifications restauration (`MealOrder` confirmée/refusée) pour client et restaurateur
- Notifications activités (réservée, liste d'attente, annulée) pour client
- Aucun `NotificationType` dédié HRA dans le schéma Prisma — toutes les notifs HRA devront utiliser SYSTEM ou BOOKING, sans catégorie propre

**Synthèse AXE 2 :**
- 0 notification spécifiquement HRA implémentée sur les ~11 attendues par les specs drawio
- Le système de notification est fonctionnel pour les flows génériques (booking, payment, document) mais aveugle sur tout le périmètre fournisseur/HRA
- L'absence de `NotificationType.HRA` ou `NotificationType.SUPPLIER` dans le schéma Prisma bloque toute catégorisation future sans migration
- Les crons qui modifient des statuts HRA (`handleBlockExpiry`, `handleExpiredRoomHoldCleanup`) n'envoient aucune notification au déclenchement

---

### 28. FINANCE ↔ HRA — HANDOFF ET CALCULS

#### Calculs financiers touchant HRA

Le service `finance.service.ts` calcule les KPIs financiers d'un voyage en deux composantes de coût HRA :

**Coûts activités** (`TravelActivityCost`) :
- Somme de `costAmountTTC` sur tous les enregistrements liés au voyage
- Couvre : activités, transport (inclus dans `TravelActivityCost` selon commentaire code)
- Source de vérité : table `TravelActivityCost` avec `activityId`

**Coûts hôtel** (`HotelBlock`) :
- Filtre `status = BLOCK_ACTIVE` uniquement
- Calcul : `pricePerNightTTC × roomsConfirmed × nights`
- `nights` = durée du voyage en jours (`(endDate - startDate) / 86400000`)

**Formule TVA marge (INVARIANT 6)** :
```
coutsTTC = activityCostsTTC + hotelCosts
marge = caTTC - coutsTTC
tvaMarge = Math.round(marge × 20 / 120)
```
Implémentée dans `finance.service.ts` et aussi dans `tva-audit-trail.service.ts` (double implémentation — même formule, constante `TVA_MARGE` partagée).

#### Handoff HRA → Finance : manuel ou automatique ?

**Handoff SEMI-MANUEL — pas de déclenchement automatique :**

| Trigger | Mécanisme | Statut |
|---|---|---|
| Nouveau `HotelBlock` créé/confirmé | Aucun event/hook → Finance lit les blocs à la demande via `getFinanceData()` | Lecture pull, pas push |
| Nouveau `TravelActivityCost` créé | Aucun trigger → Finance recalcule à la demande | Lecture pull, pas push |
| `HotelBlock` expiré (cron 8h) | Cron expire le bloc mais n'appelle pas Finance ni TVA audit | Pas de handoff |
| Payout mensuel Pro (`handlePayoutCompute`, 1er/mois) | Cron déclenche `computeMonthlyPayout` via Finance — seul handoff automatique existant | PRÉSENT |
| Rapprochement bancaire mensuel (`handleMonthlyBankReconciliation`) | Appelle `supplier-reconciliation.service.ts` — catégorise HRA, HEBERGEMENT, ACTIVITE, RESTAURATION | PRÉSENT |

#### Coverage des specs QA_PATCH drawio

| Spec | Contenu | Couverture code | Statut |
|---|---|---|---|
| `QA_PATCH_1140` TVA marge | TVA calculée sur la marge (CA − coûts fournisseurs) à 20/120 | Oui — `finance.service.ts` INVARIANT 6 + `tva-audit-trail.service.ts` | COUVERT |
| `QA_PATCH_1198` Finance Handoff | Handoff automatique HRA confirmé → ligne comptable créée, payout fournisseur déclenché | Partiellement — `supplier-reconciliation.service.ts` crée des lignes factures manuellement (import CSV ou API), pas de déclenchement auto sur confirmation HRA | PARTIEL |

#### `supplier-reconciliation.service.ts` — analyse

- Catégorisation des fournisseurs : `HRA` (compte 607600), `HEBERGEMENT`, `ACTIVITE`, `RESTAURATION`, `TRANSPORT`, `ASSURANCE`, `AUTRE`
- Inférence automatique par mots-clés dans `_inferCategory()` : "hra", "activit", "guide" → `HRA` ; "hotel", "resort" → `HEBERGEMENT`
- Import CSV supporté pour factures fournisseurs
- Rapprochement automatique (`autoMatchRate`) entre `TravelActivityCost` et factures
- **Pas de déclenchement automatique depuis les modules HRA** : aucun `import` de `SupplierReconciliationService` dans `hra.service.ts`, `hotel-portal.service.ts`, ou `restaurant-portal.service.ts`

#### Gaps Finance ↔ HRA

1. **Pas de trigger automatique** : quand un `HotelBlock` passe en `BLOCK_ACTIVE` (négociation acceptée), aucune ligne comptable n'est créée automatiquement — l'admin doit déclencher manuellement le rapprochement
2. **`TravelActivityCost` non lié aux entités HRA** : le champ `activityId` est une string libre (valeur `'manual'` par défaut dans Finance) — pas de FK vers `Activity` ou `HotelBlock`
3. **Double calcul TVA** : `finance.service.ts` et `tva-audit-trail.service.ts` calculent tous les deux `marge × 20/120` — risque de divergence si l'un est mis à jour sans l'autre
4. **Payout fournisseur absent** : `computeMonthlyPayout` calcule le payout du **Pro** (créateur voyage), pas le payout des **fournisseurs HRA** (hôtels, restaurants, activités) — ce mécanisme n'existe pas
5. **`QA_PATCH_1198` (Finance Handoff)** partiellement couvert : la réconciliation existe mais n'est pas intégrée au workflow de confirmation HRA

---

*Audit finalisé le 2026-03-27 — Sections 21-24 : Tables Prisma profondes + Enums orphelins + Double système activités + QA_PATCH T050 500-620 — Section 25 : V52 + V53 audit — Sections 26-28 : Cron HRA + Notifications HRA + Finance↔HRA — Claude Sonnet 4.6 — Aucune modification apportée au code.*
*Basé sur T050.drawio (1 702 pages), V48.drawio (1 693 pages), PATCH726.drawio (1 766 pages), eventy_v52_FINAL_COMPLET.drawio (225 pages), eventy_v53_COMPLET_PRET_CODAGE.drawio (225 pages)*
*Code analysé : backend/src/modules/hra/ + restauration/ + rooming/ + checkout/ + frontend app/(pro)/pro/hra + (admin)/admin/hra + (restaurateur)/restaurateur/ + (public)/hotel-invite/ + cron/ + notifications/ + finance/*
