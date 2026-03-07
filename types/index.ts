/**
 * Types TypeScript pour Eventy Life
 */

// Utilisateurs
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'client' | 'pro' | 'admin';
  telephone?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Voyages
export interface Travel {
  id: string;
  titre: string;
  description: string;
  destination: string;
  duree: number; // en jours
  prix: number; // en euros
  dateDepart: Date;
  dateRetour: Date;
  placesDisponibles: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Réservations
export interface Booking {
  id: string;
  userId: string;
  travelId: string;
  nombreParticipants: number;
  statut: 'pendante' | 'confirmee' | 'annulee';
  prixTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

// Paiements
export interface Payment {
  id: string;
  bookingId: string;
  montant: number;
  devise: string;
  statut: 'pending' | 'succeeded' | 'failed';
  stripePaymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Cookie Consent (CNIL-Compliant)
export * from './cookie-consent';
