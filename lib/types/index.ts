/**
 * Types TypeScript pour Eventy Life
 * Correspondent au schéma Prisma du backend
 * Généré à partir de: /backend/prisma/schema.prisma
 */

// ============================================================================
// ENUMS - Types d'énumération
// ============================================================================

/** Rôle principal d'un utilisateur */
export type UserRole = 'CLIENT' | 'PRO' | 'ADMIN';

/** Rôles administrateur spécialisés */
export type AdminRole =
  | 'FOUNDER_ADMIN'
  | 'OPS_VOYAGE_ADMIN'
  | 'TRANSPORT_ADMIN'
  | 'MARKETING_ADMIN'
  | 'FINANCE_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'HRA_ADMIN'
  | 'LEGAL_ADMIN'
  | 'TECH_ADMIN';

/** Type de profil professionnel */
export type ProType = 'CREATOR' | 'INDEPENDANT' | 'VENDEUR' | 'MAGASIN' | 'DISTRIBUTION_PARTNER';

/** Statut de validation du profil Pro */
export type ProValidationStatus =
  | 'PENDING'
  | 'DOCS_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'
  | 'SUSPENDED';

/** Statut d'un voyage */
export type TravelStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PHASE1_REVIEW'
  | 'APPROVED_P1'
  | 'PHASE2_REVIEW'
  | 'APPROVED_P2'
  | 'PUBLISHED'
  | 'SALES_OPEN'
  | 'DEPARTURE_CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NO_GO'
  | 'CANCELED';

/** Statut d'une réservation de groupe */
export type BookingStatus = 'DRAFT' | 'HELD' | 'PARTIALLY_PAID' | 'FULLY_PAID' | 'CONFIRMED' | 'EXPIRED' | 'CANCELED';

/** Fournisseur de paiement */
export type PaymentProvider = 'STRIPE' | 'PAYPAL' | 'MANGOPAY' | 'MANUAL';

/** Statut d'un paiement */
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'CANCELED';

/** Canal d'invitation */
export type InviteChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'LINK';

/** Mode d'achat d'activité */
export type ActivityPurchaseMode = 'EVENTY_BUYS' | 'CREATOR_BUYS';

/** Statut d'achat d'activité */
export type ActivityPurchaseStatus = 'PLANNED' | 'PROOF_UPLOADED' | 'CONFIRMED' | 'REJECTED';

/** Mode de calcul des coûts */
export type CostMode = 'FIXED_TOTAL' | 'PER_PERSON' | 'INCLUDED_IN_PACK';

/** Type de modèle de contrat */
export type ContractTemplateType =
  | 'PRESTATAIRE_INDEPENDANT'
  | 'DECLARATION_NON_SALARIAT'
  | 'CHARTE_PRESTATAIRE'
  | 'VENDEUR_INDEPENDANT'
  | 'RGPD_STATUS'
  | 'IMAGE_RIGHTS';

/** Méthode de signature */
export type SignatureMethod = 'CHECKBOX_ACCEPT' | 'CLICK_TO_SIGN' | 'TYPED_NAME' | 'BATCH_SIGN';

/** Type de point d'arrêt de bus */
export type BusStopType = 'PICKUP_DEPARTURE' | 'DROPOFF_ARRIVAL';

/** Statut d'un point d'arrêt de bus */
export type BusStopStatus = 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'CHANGES_REQUESTED' | 'ARCHIVED';

/** Type de média */
export type MediaType = 'PHOTO' | 'VIDEO';

/** Statut d'un groupe de voyage */
export type TravelGroupStatus = 'FORMING' | 'HOLD_ACTIVE' | 'PARTIAL' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';

/** Rôle dans un groupe de voyage */
export type TravelGroupRole = 'LEADER' | 'MEMBER' | 'ASSOCIATION';

/** Statut d'une campagne marketing */
export type CampaignStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'LIVE' | 'ENDED' | 'DISABLED';

/** Statut d'un bloc hôtel */
export type HotelBlockStatus =
  | 'INVITE_SENT'
  | 'HOTEL_SUBMITTED'
  | 'BLOCK_ACTIVE'
  | 'CHANGES_REQUESTED'
  | 'REJECTED';

/** Mode de départ */
export type DepartureMode = 'PICKUP_STOP' | 'SELF_ARRIVAL';

/** Type de notification */
export type NotificationType = 'BOOKING' | 'PAYMENT' | 'DOCUMENT' | 'SYSTEM' | 'MARKETING' | 'SUPPORT';

/** Priorité d'un ticket de support */
export type TicketPriority = 'P0' | 'P1' | 'P2' | 'P3';

/** Statut d'un ticket de support */
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_USER' | 'RESOLVED' | 'CLOSED';

/** Action d'audit */
export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'OVERRIDE'
  | 'LOGIN'
  | 'LOGOUT';

/** Type de feature flag */
export type FeatureFlagType = 'BOOLEAN' | 'PERCENTAGE' | 'STRING';

/** Type de document */
export type DocumentType =
  | 'CONTRAT'
  | 'PIECE_IDENTITE'
  | 'KBIS'
  | 'CONFIRMATION_RESERVATION'
  | 'FACTURE'
  | 'DOCUMENT_VOYAGE';

/** Statut d'un document */
export type DocumentStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

// ============================================================================
// A) Auth & Users - Authentification et Utilisateurs
// ============================================================================

/**
 * Utilisateur principal du système
 * @description Entité centrale représentant un utilisateur enregistré
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  adminRoles: AdminRole[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations optionnelles
  proProfile?: ProProfile;
  refreshTokens?: RefreshToken[];
  signatures?: SignatureProof[];
  legalAcceptances?: LegalAcceptance[];
  notifications?: Notification[];
  busStops?: BusStop[];
  bookingGroupsCreated?: BookingGroup[];
  travelGroupsLed?: TravelGroup[];
  travelGroupMembers?: TravelGroupMember[];
  roomBookingsLocked?: RoomBooking[];
  paymentContributions?: PaymentContribution[];
  supportTickets?: SupportTicket[];
  supportTicketsAssigned?: SupportTicket[];
  auditLogsActor?: AuditLog[];
  busStopsValidated?: BusStop[];
  busStopMedia?: BusStopMedia[];
  fileAssets?: FileAsset[];
  groupMessages?: GroupMessage[];
  documents?: Document[];
  cancellationsRequested?: Cancellation[];
  cancellationsProcessed?: Cancellation[];
  travelFeedbacks?: TravelFeedback[];
}

/**
 * Token de rafraîchissement pour les sessions
 * @description Gère les tokens JWT pour les sessions utilisateur
 */
export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  revokedAt?: string;
  rotatedFromId?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;

  user?: User;
}

/**
 * Version d'un document légal
 * @description Gère les versions des documents légaux (CGU, politique de confidentialité, etc.)
 */
export interface LegalDocumentVersion {
  id: string;
  type: string;
  version: number;
  contentUrl: string;
  activeFrom: string;
  createdAt: string;

  legalAcceptances?: LegalAcceptance[];
}

/**
 * Acceptation d'un document légal par un utilisateur
 * @description Trace les acceptations des documents légaux
 */
export interface LegalAcceptance {
  id: string;
  userId: string;
  legalDocVersionId: string;
  acceptedAt: string;
  ip?: string;
  userAgent?: string;

  user?: User;
  legalDocVersion?: LegalDocumentVersion;
}

// ============================================================================
// B) Pro Profiles - Profils Professionnels
// ============================================================================

/**
 * Profil Pro pour les créateurs, vendeurs, etc.
 * @description Représente le profil professionnel d'un utilisateur Pro
 */
export interface ProProfile {
  id: string;
  userId: string;
  proType: ProType;
  proStatuses: string[];
  validationStatus: ProValidationStatus;
  displayName: string;
  proSlug: string;
  bio?: string;
  website?: string;
  siret?: string;
  siren?: string;
  companyName?: string;
  companyAddress?: string;
  entityType?: string;
  onboardingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;

  user?: User;
  payoutProfile?: PayoutProfile;
  travels?: Travel[];
  recentTravels?: Travel[];
  campaignsMarketing?: CampaignMarketing[];
  documents?: Document[];
}

/**
 * Profil de paiement pour un Pro
 * @description Gère les coordonnées bancaires pour les paiements
 */
export interface PayoutProfile {
  id: string;
  proProfileId: string;
  iban: string;
  bic?: string;
  holderName: string;
  status: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;

  proProfile?: ProProfile;
}

// ============================================================================
// C) Travels - Voyages et Groupes de Voyage
// ============================================================================

/**
 * Voyage - offre de voyage de groupe
 * @description Représente une offre de voyage groupé créée par un Pro
 */
export interface Travel {
  id: string;
  title: string;
  slug: string;
  description?: string;
  summary?: string;
  proProfileId: string;
  status: TravelStatus;
  departureDate: string;
  returnDate: string;
  departureCity: string;
  destinationCity: string;
  destinationCountry: string;
  transportMode?: string;
  capacity: number;
  pricePerPersonTTC: number; // en centimes
  currency: string;
  coverImageUrl?: string;
  galleryUrls: string[];
  programJson?: string;
  inclusionsJson?: string;
  exclusionsJson?: string;
  phase1SubmittedAt?: string;
  phase1ApprovedAt?: string;
  phase2SubmittedAt?: string;
  phase2ApprovedAt?: string;
  publishedAt?: string;
  salesOpenAt?: string;
  noGoDeadline?: string;
  canceledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;

  proProfile?: ProProfile;
  bookingGroups?: BookingGroup[];
  roomBookings?: RoomBooking[];
  roomTypes?: RoomType[];
  activityCosts?: TravelActivityCost[];
  travelStopLinks?: TravelStopLink[];
  hotelBlocks?: HotelBlock[];
  travelGroup?: TravelGroup;
  occurrences?: TravelOccurrence[];
  travelFeedbacks?: TravelFeedback[];
}

/**
 * Type de chambre pour un voyage
 * @description Définit les types de chambres disponibles pour un voyage
 */
export interface RoomType {
  id: string;
  travelId: string;
  label: string;
  capacity: number;
  priceTotalTTC: number; // en centimes
  availableCount: number;
  sortOrder: number;
  createdAt: string;

  travel?: Travel;
}

/**
 * Occurrence (édition) d'un voyage
 * @description Gère les occurrences ou éditions d'un même voyage
 */
export interface TravelOccurrence {
  id: string;
  travelId: string;
  departureDateActual?: string;
  returnDateActual?: string;
  occurrenceNumber: number;
  createdAt: string;

  travel?: Travel;
}

// ============================================================================
// D) Bookings & Checkout - Réservations et Processus de Paiement
// ============================================================================

/**
 * Groupe de réservation pour une voyage
 * @description Représente un groupe de réservation/paiement pour un voyage
 */
export interface BookingGroup {
  id: string;
  travelId: string;
  status: BookingStatus;
  currency: string;
  totalAmountTTC: number; // en centimes
  expiresAt?: string;
  createdByUserId: string;
  travelGroupId?: string;
  createdAt: string;
  updatedAt: string;

  travel?: Travel;
  createdByUser?: User;
  travelGroup?: TravelGroup;
  roomBookings?: RoomBooking[];
  paymentContributions?: PaymentContribution[];
  travelerStopSelections?: TravelerStopSelection[];
  cancellations?: Cancellation[];
}

/**
 * Réservation de chambre
 * @description Représente une chambre réservée dans une réservation de groupe
 */
export interface RoomBooking {
  id: string;
  bookingGroupId: string;
  travelId: string;
  roomTypeId?: string;
  roomLabel: string;
  roomTotalAmountTTC: number; // en centimes
  currency: string;
  capacitySnapshot: number;
  occupancyCount: number;
  pricingParts: number;
  perPersonAmountTTC: number; // en centimes
  roundingRemainderCents: number;
  holdExpiresAt?: string;
  bookingLockedAt?: string;
  lockedByUserId?: string;
  insuranceSelected: boolean;
  insuranceProductId?: string;
  insuranceAmountPerPersonTTC: number; // en centimes
  insuranceTotalAmountTTC: number; // en centimes
  createdAt: string;
  updatedAt: string;

  bookingGroup?: BookingGroup;
  travel?: Travel;
  lockedByUser?: User;
  paymentContributions?: PaymentContribution[];
  paymentInviteTokens?: PaymentInviteToken[];
  travelGroupMember?: TravelGroupMember;
}

/**
 * Contribution de paiement pour une chambre
 * @description Représente la contribution financière d'un payeur
 */
export interface PaymentContribution {
  id: string;
  bookingGroupId: string;
  roomBookingId?: string;
  payerUserId: string;
  provider: PaymentProvider;
  providerRef?: string;
  status: PaymentStatus;
  amountTTC: number; // en centimes
  currency: string;
  idempotencyKey?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;

  bookingGroup?: BookingGroup;
  roomBooking?: RoomBooking;
  payerUser?: User;
}

/**
 * Token d'invitation pour le paiement
 * @description Gère les tokens d'invitation de paiement envoyés par différents canaux
 */
export interface PaymentInviteToken {
  id: string;
  roomBookingId: string;
  channel: InviteChannel;
  tokenHash: string;
  sentToEmail?: string;
  sentToPhone?: string;
  revokedAt?: string;
  usedAt?: string;
  expiresAt: string;
  createdAt: string;

  roomBooking?: RoomBooking;
}

// ============================================================================
// E) Travel Groups - Groupes de Voyage
// ============================================================================

/**
 * Groupe de voyage (covoiturage, partage)
 * @description Représente un groupe de voyage avec leader et membres
 */
export interface TravelGroup {
  id: string;
  code: string;
  travelId: string;
  leaderUserId: string;
  shareToken: string;
  status: TravelGroupStatus;
  maxRooms?: number;
  holdExpiresAt?: string;
  createdAt: string;
  updatedAt: string;

  travel?: Travel;
  leaderUser?: User;
  members?: TravelGroupMember[];
  invites?: TravelGroupInvite[];
  messages?: GroupMessage[];
  bookingGroups?: BookingGroup[];
}

/**
 * Membre d'un groupe de voyage
 * @description Représente un utilisateur membre d'un groupe de voyage
 */
export interface TravelGroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: TravelGroupRole;
  roomBookingId?: string;
  joinedAt: string;

  group?: TravelGroup;
  user?: User;
  roomBooking?: RoomBooking;
}

/**
 * Invitation à un groupe de voyage
 * @description Gère les invitations envoyées aux membres potentiels
 */
export interface TravelGroupInvite {
  id: string;
  groupId: string;
  sentToEmail: string;
  tokenHash: string;
  status: string;
  expiresAt: string;
  createdAt: string;

  group?: TravelGroup;
}

/**
 * Message dans un groupe de voyage
 * @description Représente un message dans le chat du groupe
 */
export interface GroupMessage {
  id: string;
  groupId: string;
  senderUserId: string;
  senderRole: string;
  content: string;
  createdAt: string;

  group?: TravelGroup;
  senderUser?: User;
}

// ============================================================================
// F) Activities & Costs - Activités et Coûts
// ============================================================================

/**
 * Coût d'activité pour un voyage
 * @description Gère les coûts associés aux activités d'un voyage
 */
export interface TravelActivityCost {
  id: string;
  travelId: string;
  activityId: string;
  title: string;
  purchaseMode: ActivityPurchaseMode;
  purchaseStatus: ActivityPurchaseStatus;
  costMode: CostMode;
  costAmountHT: number; // en centimes
  vatRateBps: number;
  costAmountTTC: number; // en centimes
  proofFileId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  travel?: Travel;
}

// ============================================================================
// G) Files & Documents - Fichiers et Documents
// ============================================================================

/**
 * Asset de fichier stocké
 * @description Représente un fichier uploadé et stocké
 */
export interface FileAsset {
  id: string;
  userId: string;
  storageKey: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  clientUploadId?: string;
  confirmedAt?: string;
  deletedAt?: string;
  createdAt: string;

  user?: User;
  documents?: Document[];
}

/**
 * Document utilisateur ou pro
 * @description Représente un document (contrat, pièce d'identité, etc.)
 */
export interface Document {
  id: string;
  userId?: string;
  proProfileId?: string;
  fileAssetId?: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;

  user?: User;
  proProfile?: ProProfile;
  fileAsset?: FileAsset;
}

/**
 * Modèle de contrat
 * @description Gère les templates de contrats disponibles
 */
export interface ContractTemplate {
  id: string;
  type: ContractTemplateType;
  version: number;
  name: string;
  contentHtml: string;
  isActive: boolean;
  publishedAt?: string;
  createdBy?: string;
  createdAt: string;
}

/**
 * Preuve de signature
 * @description Enregistre les preuves de signature des documents
 */
export interface SignatureProof {
  id: string;
  userId: string;
  documentType: string;
  documentVersion: number;
  method: SignatureMethod;
  hashSha256: string;
  ipAddress?: string;
  userAgent?: string;
  typedName?: string;
  consentText?: string;
  pdfSnapshotAssetId?: string;
  signedAt: string;

  user?: User;
}

// ============================================================================
// H) Transport & Bus Stops - Transport et Points d'Arrêt
// ============================================================================

/**
 * Point d'arrêt de bus
 * @description Représente un point d'arrêt (départ ou arrivée)
 */
export interface BusStop {
  id: string;
  ownerUserId: string;
  type: BusStopType;
  status: BusStopStatus;
  publicName: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
  placeId?: string;
  googleMapsUrl?: string;
  meetingNotes?: string;
  internalNotes?: string;
  submittedAt?: string;
  validatedAt?: string;
  validatedById?: string;
  createdAt: string;
  updatedAt: string;

  ownerUser?: User;
  validatedByUser?: User;
  media?: BusStopMedia[];
  travelStopLinks?: TravelStopLink[];
}

/**
 * Média associé à un point d'arrêt
 * @description Représente une photo ou vidéo d'un point d'arrêt
 */
export interface BusStopMedia {
  id: string;
  busStopId: string;
  type: MediaType;
  url: string;
  caption?: string;
  sortOrder: number;
  clientUploadId?: string;
  createdByUserId?: string;
  createdAt: string;

  busStop?: BusStop;
  createdByUser?: User;
}

/**
 * Lien entre un voyage et des points d'arrêt
 * @description Associe les points d'arrêt à un voyage
 */
export interface TravelStopLink {
  id: string;
  travelId: string;
  busStopId: string;
  type: BusStopType;
  createdAt: string;

  travel?: Travel;
  busStop?: BusStop;
}

/**
 * Sélection de point d'arrêt par un participant
 * @description Enregistre la sélection du point d'arrêt pour chaque participant
 */
export interface TravelerStopSelection {
  id: string;
  bookingGroupId: string;
  participantId: string;
  departureMode: DepartureMode;
  pickupBusStopId?: string;
  selectedAt: string;
  changeCount: number;
  lastChangedAt?: string;
  updatedAt: string;

  bookingGroup?: BookingGroup;
}

/**
 * Configuration des transports
 * @description Paramètres globaux pour la gestion des transports
 */
export interface TransportSettings {
  id: string;
  minPickupStopsPerIndependent: number;
  maxDepartureStopsPerTravel: number;
  singleArrivalStopMVP: boolean;
  requireValidatedStopsForPhase2: boolean;
  updatedAt: string;
}

// ============================================================================
// I) Hotel - Hôtels
// ============================================================================

/**
 * Bloc d'hôtel réservé pour un voyage
 * @description Gère les réservations de blocs d'hôtels
 */
export interface HotelBlock {
  id: string;
  travelId: string;
  hotelName: string;
  hotelEmail: string;
  hotelPhone?: string;
  inviteToken: string;
  status: HotelBlockStatus;
  roomsRequested: number;
  roomsConfirmed: number;
  checkInDate: string;
  checkOutDate: string;
  pricePerNightTTC?: number; // en centimes
  notes?: string;
  submittedAt?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;

  travel?: Travel;
}

// ============================================================================
// J) Admin, Audit, Notifications, Settings
// ============================================================================

/**
 * Journal d'audit des actions
 * @description Enregistre les actions administratives pour la conformité
 */
export interface AuditLog {
  id: string;
  actorUserId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  beforeJson?: string;
  afterJson?: string;
  reason?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;

  actorUser?: User;
}

/**
 * Notification utilisateur
 * @description Représente une notification envoyée à un utilisateur
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;

  user?: User;
}

/**
 * Ticket de support
 * @description Représente une demande d'assistance client
 */
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedToUserId?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;

  user?: User;
  assignedToUser?: User;
}

/**
 * Feature flag pour les fonctionnalités
 * @description Gère les drapeaux de fonctionnalités pour les déploiements progressifs
 */
export interface FeatureFlag {
  id: string;
  key: string;
  type: FeatureFlagType;
  value: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paramètre d'application
 * @description Stocke les paramètres de configuration de l'application
 */
export interface AppSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category?: string;
  updatedBy?: string;
  updatedAt: string;
}

/**
 * Boîte de sortie email
 * @description Gère la queue des emails à envoyer
 */
export interface EmailOutbox {
  id: string;
  to: string;
  subject: string;
  templateId?: string;
  variablesJson?: string;
  status: string;
  retryCount: number;
  lastError?: string;
  sentAt?: string;
  nextRetryAt?: string;
  createdAt: string;
}

/**
 * Campagne marketing
 * @description Représente une campagne marketing créée par un Pro
 */
export interface CampaignMarketing {
  id: string;
  proProfileId: string;
  title: string;
  description?: string;
  status: CampaignStatus;
  targetAudience?: string;
  budget: number; // en centimes
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;

  proProfile?: ProProfile;
}

/**
 * Demande d'annulation
 * @description Gère les demandes d'annulation de réservation
 */
export interface Cancellation {
  id: string;
  bookingGroupId: string;
  requestedByUserId: string;
  processedByUserId?: string;
  status: string;
  reason?: string;
  rejectionReason?: string;
  paidAmountCents: number;
  refundAmountCents: number;
  requestedAt: string;
  processedAt?: string;
  refundedAt?: string;
  createdAt: string;

  bookingGroup?: BookingGroup;
  requestedByUser?: User;
  processedByUser?: User;
}

/**
 * Feedback/avis client post-voyage
 * @description Enregistre les retours et avis des clients après un voyage
 */
export interface TravelFeedback {
  id: string;
  travelId: string;
  userId: string;
  overallRating: number; // 1-5
  transportRating?: number; // 1-5
  accommodationRating?: number; // 1-5
  organizationRating?: number; // 1-5
  guidanceRating?: number; // 1-5
  comment?: string;
  submittedAt: string;

  travel?: Travel;
  user?: User;
}

/**
 * Exécution de job/tâche planifiée
 * @description Enregistre l'exécution des jobs de fond
 */
export interface JobRun {
  id: string;
  jobName: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  resultJson?: string;
  errorMessage?: string;
  createdAt: string;
}

// ============================================================================
// API & Utility Types
// ============================================================================

/**
 * Réponse API générique
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Erreur API
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ProfileUpdateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface TravelFilterParams {
  destination?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CheckoutData {
  travelId: string;
  roomBookings: {
    roomTypeId: string;
    occupancy: number;
    price: number;
  }[];
  participants: {
    firstName: string;
    lastName: string;
    email?: string;
    dateOfBirth?: string;
  }[];
}

// ============================================================================
// Extended Types for Client Pages
// ============================================================================

/**
 * Invoice - Facture client
 * @description Représente une facture générée pour une réservation
 */
export interface Invoice {
  id: string;
  reference: string;
  totalTTC?: number;
  totalAmountCents: number;
  totalCostsCents?: number;
  createdAt: string;
  createdByUser?: User;
  travel?: Travel;
  paymentContributions?: PaymentContribution[];
}

/**
 * Booking - Réservation (alias pour BookingGroup avec champs étendus)
 */
export interface Booking extends BookingGroup {
  totalAmountCents?: number;
  cancellationFeeCents?: number;
  travel?: Travel;
}

/**
 * BookingFeedback - Feedback post-voyage
 */
export interface BookingFeedback extends TravelFeedback {
  travel?: Travel;
}

/**
 * RefundCalculation - Calcul de remboursement
 */
export interface RefundCalculation {
  refundAmount?: number;
  refundAmountCents?: number;
  cancellationFeeCents?: number;
  policyApplied?: string;
}

/**
 * CancellationDetail - Détail d'annulation
 */
export interface CancellationDetail extends Cancellation {
  refundCalculation?: RefundCalculation;
  bookingGroup?: BookingGroup;
}

/**
 * HistoryEntry - Entrée d'historique
 */
export interface HistoryEntry {
  id: string;
  action: string;
  reason?: string;
  createdAt?: string;
  actorUser?: User;
}

/**
 * Room - Type de chambre avec propriétés étendues
 */
export interface Room {
  id?: string;
  roomLabel?: string;
  roomType?: string;
  occupancyCount?: number;
  capacity?: number;
  label?: string;
  type?: string;
  pricePerPersonCents?: number;
  quantity?: number;
}

/**
 * DayProgram - Programme journalier
 */
export interface DayProgram {
  id?: string;
  dayNumber?: number;
  title?: string;
  description?: string;
  activities?: Activity[];
}

/**
 * Activity - Activité
 */
export interface Activity {
  id?: string;
  label?: string;
  time?: string;
  description?: string;
}

/**
 * Photo - Photo de voyage
 */
export interface Photo {
  id: string;
  url: string;
  alt?: string;
}

/**
 * BusStop - Point d'arrêt de bus (pour formulaires)
 */
export interface BusStopFormData extends BusStop {
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Pricing - Tarification
 */
export interface Pricing {
  perPersonTTC: number;
  currency: string;
}

/**
 * TravelFormData - Données du formulaire de création de voyage
 */
export interface TravelFormData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  transportMode?: string;
  capacity?: number;
  rooms?: Room[];
  program?: DayProgram[];
  photos?: Photo[];
  busStops?: BusStop[];
  pricing?: Pricing;
}

/**
 * CreateCampaignData - Données pour créer une campagne
 */
export interface CreateCampaignData {
  title: string;
  description?: string;
  budget: number;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
}

/**
 * CampaignData - Données de campagne
 */
export interface CampaignData extends CreateCampaignData {
  id: string;
  createdAt: string;
}

/**
 * CampaignMetrics - Métriques de campagne
 */
export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr?: string;
  conversionRate?: string;
  roi?: string;
}

/**
 * Cost - Coût/frais
 */
export interface Cost {
  id: string;
  label: string;
  amountCents: number;
  category?: string;
}

/**
 * Costs - Conteneur pour les coûts
 */
export interface Costs {
  costs?: Cost[];
  totalCents?: number;
}

/**
 * Dietary - Informations diététiques
 */
export interface Dietary {
  id: string;
  name: string;
  count?: number;
  stats?: {
    count?: number;
    percentage?: number;
  };
}

/**
 * Restaurant - Restaurant
 */
export interface Restaurant {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  cuisineType?: string;
  capacity?: number;
  address?: string;
  notes?: string;
}

/**
 * MealPlan - Plan de repas
 */
export interface MealPlan {
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  snacks?: boolean;
}

/**
 * RoomingStats - Statistiques de logement
 */
export interface RoomingStats {
  totalRoomBookings?: number;
  totalOccupants?: number;
  totalCapacity?: number;
  totalHotelRevenueCents?: number;
  occupancyRate?: number;
}

/**
 * HotelBlock - Bloc hôtel (formulaires)
 */
export interface HotelBlockFormData extends HotelBlock {
  contact?: string;
}

/**
 * TransportStop - Point d'arrêt de transport
 */
export interface TransportStop {
  id: string;
  busStop: BusStop;
  type: BusStopType;
  passengers?: number;
}

/**
 * StopCardData - Données pour une carte d'arrêt
 */
export interface StopCardData {
  type: BusStopType;
  busStop: BusStop;
}

/**
 * OnboardingFormData - Données du formulaire d'onboarding Pro
 */
export interface OnboardingFormData {
  displayName?: string;
  bio?: string;
  website?: string;
  proType?: ProType;
  identityDocAssetId?: string;
  kbisDocAssetId?: string;
  siret?: string;
  siren?: string;
  companyName?: string;
  companyAddress?: string;
  entityType?: string;
  payoutProfileId?: string;
  ibanEncrypted?: string;
  bicEncrypted?: string;
  holderName?: string;
  completedModules?: number[];
}

/**
 * ProDashboard - Tableau de bord Pro pour un voyage
 */
export interface ProDashboard {
  travel?: Travel;
  statistics?: {
    totalBookings?: number;
    totalRevenue?: number;
    pendingPayments?: number;
    confirmedPassengers?: number;
  };
  feedbacks?: TravelFeedback[];
  actions?: Array<{
    id: string;
    title: string;
    dueDate?: string;
    priority?: string;
    completed?: boolean;
  }>;
}

/**
 * TravelDashboard - Tableau de bord finance pour un voyage Pro
 */
export interface TravelDashboard {
  travel?: Travel;
  finance?: {
    caHT?: number;
    caTTC?: number;
    marge?: number;
    margePercent?: number;
  };
  costs?: Cost[];
  stats?: RoomingStats;
}
