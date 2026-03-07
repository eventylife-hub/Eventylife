/**
 * Types TypeScript partagés pour l'API
 * Utilisés dans tous les appels API frontend
 */

// ============= ENUMS =============

export enum UserRole {
  CLIENT = 'CLIENT',
  PRO = 'PRO',
  ADMIN = 'ADMIN',
}

export enum TravelStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  HOLD = 'HOLD',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum InsuranceStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CLAIMED = 'CLAIMED',
  REFUSED = 'REFUSED',
}

export enum CancellationReason {
  USER_REQUEST = 'USER_REQUEST',
  NO_GO = 'NO_GO',
  FORCE_MAJEURE = 'FORCE_MAJEURE',
  OTHER = 'OTHER',
}

export enum RefundStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// ============= USER TYPES =============

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============= TRAVEL TYPES =============

export interface Travel {
  id: string;
  title: string;
  destination: string;
  description: string;
  image?: string;
  status: TravelStatus;
  startDate: string;
  endDate: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  pricePerPerson: number;
  currency: string;
  proId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TravelDetail extends Travel {
  itinerary: string;
  accommodation: string;
  meals: string;
  activities: string;
  transportDetails: string;
  language: string;
  difficultyLevel: string;
  minAge?: number;
  insurance: boolean;
  cancellationPolicy: string;
}

// ============= BOOKING TYPES =============

export interface Booking {
  id: string;
  travelId: string;
  clientId: string;
  status: BookingStatus;
  numberOfParticipants: number;
  totalPrice: number;
  holdExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingGroup {
  id: string;
  bookingId: string;
  name: string;
  totalMembers: number;
  rooms: RoomBooking[];
  mealPlans: MealPlan[];
}

export interface RoomBooking {
  id: string;
  bookingGroupId: string;
  roomType: string;
  numberOfRooms: number;
  pricePerRoom: number;
  participants: string[];
}

export interface MealPlan {
  id: string;
  bookingGroupId: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'FULL_BOARD';
  pricePerDay: number;
  numberOfDays: number;
  participants: string[];
}

// ============= PAYMENT TYPES =============

export interface PaymentContribution {
  id: string;
  bookingId: string;
  paidById: string;
  amount: number;
  status: PaymentStatus;
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSplit {
  id: string;
  bookingId: string;
  totalAmount: number;
  contributions: PaymentContribution[];
  status: PaymentStatus;
  stripeAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= TRAVEL GROUP TYPES =============

export interface TravelGroup {
  id: string;
  travelId: string;
  name: string;
  description?: string;
  maxMembers: number;
  currentMembers: number;
  createdAt: string;
  updatedAt: string;
}

export interface TravelGroupMember {
  id: string;
  groupId: string;
  userId: string;
  joinedAt: string;
  role: 'ORGANIZER' | 'MEMBER';
}

// ============= INSURANCE TYPES =============

export interface Insurance {
  id: string;
  bookingId: string;
  type: string;
  coverage: string;
  maxAmount: number;
  premium: number;
  status: InsuranceStatus;
  policyNumber?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============= REVIEW TYPES =============

export interface Review {
  id: string;
  travelId: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verified: boolean; // Utilisateur a participé au voyage
  createdAt: string;
  updatedAt: string;
}

// ============= NOTIFICATION TYPES =============

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

// ============= MARKETING TYPES =============

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discountCode?: string;
  discountPercentage?: number;
  targetAudience?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= HOTEL BLOCK TYPES =============

export interface HotelBlock {
  id: string;
  travelId: string;
  hotelName: string;
  roomType: string;
  numberOfRooms: number;
  pricePerRoom: number;
  checkinDate: string;
  checkoutDate: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

// ============= CANCELLATION TYPES =============

export interface CancellationRequest {
  id: string;
  bookingId: string;
  reason: CancellationReason;
  comments?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface Refund {
  id: string;
  cancellationId: string;
  amount: number;
  status: RefundStatus;
  stripeRefundId?: string;
  processedAt?: string;
  failureReason?: string;
}

// ============= DOCUMENT TYPES =============

export interface Document {
  id: string;
  userId: string;
  type: 'PASSPORT' | 'ID' | 'VISA' | 'OTHER';
  fileName: string;
  fileUrl: string;
  expiresAt?: string;
  verified: boolean;
  uploadedAt: string;
}

// ============= RESPONSE TYPES =============

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}

// ============= AUTH TYPES =============

/**
 * Réponse de connexion — les tokens sont dans les httpOnly cookies
 * Le body contient uniquement les infos utilisateur
 */
export interface LoginResponse {
  user: UserProfile;
}

/**
 * Réponse d'inscription — les tokens sont dans les httpOnly cookies
 * Le body contient uniquement les infos utilisateur
 */
export interface RegisterResponse {
  user: UserProfile;
}

/**
 * Réponse de rafraîchissement — les tokens sont dans les httpOnly cookies
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
