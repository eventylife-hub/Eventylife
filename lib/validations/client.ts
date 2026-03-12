/**
 * Schémas de validation Zod — Formulaires client
 *
 * Utilisés dans les formulaires de l'espace client :
 * avis, groupes, réservations, wallet, suivi commande.
 *
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';

// ─── Avis / Review ────────────────────────────────────────

export const reviewSchema = z.object({
  travelId: z
    .string({ required_error: 'Le voyage est requis' })
    .min(1, { message: 'Veuillez sélectionner un voyage' }),
  rating: z
    .number({ required_error: 'La note est requise' })
    .int({ message: 'La note doit être un nombre entier' })
    .min(1, { message: 'La note minimum est 1' })
    .max(5, { message: 'La note maximum est 5' }),
  comment: z
    .string({ required_error: 'Le commentaire est requis' })
    .min(10, { message: 'Le commentaire doit contenir au moins 10 caractères' })
    .max(2000, { message: 'Le commentaire ne peut pas dépasser 2000 caractères' })
    .trim(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ─── Avis détaillé post-voyage (multi-rating) ─────────────

export const detailedReviewSchema = z.object({
  overallRating: z
    .number({ required_error: 'La note globale est requise' })
    .int()
    .min(1, { message: 'Note minimum : 1' })
    .max(5, { message: 'Note maximum : 5' }),
  transportRating: z
    .number({ required_error: 'La note transport est requise' })
    .int()
    .min(1, { message: 'Note minimum : 1' })
    .max(5, { message: 'Note maximum : 5' }),
  accommodationRating: z
    .number({ required_error: "La note hébergement est requise" })
    .int()
    .min(1, { message: 'Note minimum : 1' })
    .max(5, { message: 'Note maximum : 5' }),
  organizationRating: z
    .number({ required_error: "La note organisation est requise" })
    .int()
    .min(1, { message: 'Note minimum : 1' })
    .max(5, { message: 'Note maximum : 5' }),
  guidanceRating: z
    .number({ required_error: "La note accompagnement est requise" })
    .int()
    .min(1, { message: 'Note minimum : 1' })
    .max(5, { message: 'Note maximum : 5' }),
  comment: z
    .string()
    .max(5000, { message: 'Le commentaire ne peut pas dépasser 5000 caractères' })
    .trim()
    .optional()
    .default(''),
});

export type DetailedReviewFormData = z.infer<typeof detailedReviewSchema>;

// ─── Création de groupe ───────────────────────────────────

export const createGroupSchema = z.object({
  name: z
    .string({ required_error: 'Le nom du groupe est requis' })
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
    .trim(),
  travelId: z
    .string({ required_error: 'Le voyage est requis' })
    .min(1, { message: 'Veuillez sélectionner un voyage' }),
  maxMembers: z
    .number({ required_error: 'Le nombre max de membres est requis' })
    .int({ message: 'Le nombre doit être un entier' })
    .min(2, { message: 'Un groupe doit avoir au moins 2 membres' })
    .max(50, { message: 'Un groupe ne peut pas dépasser 50 membres' }),
  isPrivate: z.boolean().default(false),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

// ─── Rejoindre un groupe (code invitation) ────────────────

export const joinGroupSchema = z.object({
  invitationCode: z
    .string({ required_error: "Le code d'invitation est requis" })
    .min(4, { message: 'Le code doit contenir au moins 4 caractères' })
    .max(20, { message: 'Le code ne peut pas dépasser 20 caractères' })
    .trim()
    .toUpperCase(),
});

export type JoinGroupFormData = z.infer<typeof joinGroupSchema>;

// ─── Inviter dans un groupe ───────────────────────────────

export const groupInviteSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email({ message: 'Adresse email invalide' })
    .trim()
    .toLowerCase(),
  message: z
    .string()
    .max(500, { message: 'Le message ne peut pas dépasser 500 caractères' })
    .trim()
    .optional()
    .default(''),
});

export type GroupInviteFormData = z.infer<typeof groupInviteSchema>;

// ─── Annulation de réservation ────────────────────────────

export const cancellationSchema = z.object({
  reason: z
    .string({ required_error: "Le motif d'annulation est requis" })
    .min(10, { message: 'Le motif doit contenir au moins 10 caractères' })
    .max(1000, { message: 'Le motif ne peut pas dépasser 1000 caractères' })
    .trim(),
});

export type CancellationFormData = z.infer<typeof cancellationSchema>;

// ─── Préférences rooming ──────────────────────────────────

export const roomingPreferencesSchema = z.object({
  floor: z
    .string()
    .max(50, { message: 'Max 50 caractères' })
    .trim()
    .optional()
    .default(''),
  bedType: z
    .string()
    .max(50, { message: 'Max 50 caractères' })
    .trim()
    .optional()
    .default(''),
  specialRequests: z
    .string()
    .max(500, { message: 'Max 500 caractères' })
    .trim()
    .optional()
    .default(''),
});

export type RoomingPreferencesFormData = z.infer<typeof roomingPreferencesSchema>;

// ─── Code voucher (wallet) ────────────────────────────────

export const voucherCodeSchema = z.object({
  code: z
    .string({ required_error: 'Le code est requis' })
    .min(4, { message: 'Le code doit contenir au moins 4 caractères' })
    .max(30, { message: 'Le code ne peut pas dépasser 30 caractères' })
    .trim()
    .toUpperCase(),
});

export type VoucherCodeFormData = z.infer<typeof voucherCodeSchema>;

// ─── Suivi de commande ────────────────────────────────────

export const orderTrackingSchema = z.object({
  orderRef: z
    .string({ required_error: 'La référence est requise' })
    .min(3, { message: 'La référence doit contenir au moins 3 caractères' })
    .max(50, { message: 'La référence ne peut pas dépasser 50 caractères' })
    .trim()
    .toUpperCase(),
  email: z
    .string({ required_error: "L'email est requis" })
    .email({ message: 'Adresse email invalide' })
    .trim()
    .toLowerCase(),
});

export type OrderTrackingFormData = z.infer<typeof orderTrackingSchema>;

// ─── Message simple (chat/messagerie) ─────────────────────

export const messageSchema = z.object({
  content: z
    .string({ required_error: 'Le message est requis' })
    .min(1, { message: 'Le message ne peut pas être vide' })
    .max(5000, { message: 'Le message ne peut pas dépasser 5000 caractères' })
    .trim(),
});

export type MessageFormData = z.infer<typeof messageSchema>;

// ─── Formulaire lead pro public ───────────────────────────

export const leadFormSchema = z.object({
  name: z
    .string({ required_error: 'Le nom est requis' })
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
    .trim(),
  email: z
    .string({ required_error: "L'email est requis" })
    .email({ message: 'Adresse email invalide' })
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9]\d{8}$/, { message: 'Numéro de téléphone français invalide' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(1000, { message: 'Le message ne peut pas dépasser 1000 caractères' })
    .trim()
    .optional()
    .default(''),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }),
  }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
