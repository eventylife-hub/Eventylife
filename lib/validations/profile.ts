/**
 * Schémas de validation Zod — Profil utilisateur
 *
 * Utilisé dans app/(client)/client/profil/page.tsx
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';

const NAME_MIN = 2;
const NAME_MAX = 50;

export const profileSchema = z.object({
  firstName: z
    .string({ required_error: 'Le prénom est requis' })
    .min(NAME_MIN, { message: `Le prénom doit contenir au moins ${NAME_MIN} caractères` })
    .max(NAME_MAX, { message: `Le prénom ne peut pas dépasser ${NAME_MAX} caractères` })
    .trim(),
  lastName: z
    .string({ required_error: 'Le nom est requis' })
    .min(NAME_MIN, { message: `Le nom doit contenir au moins ${NAME_MIN} caractères` })
    .max(NAME_MAX, { message: `Le nom ne peut pas dépasser ${NAME_MAX} caractères` })
    .trim(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{6,20}$/, { message: 'Numéro de téléphone invalide' })
    .optional()
    .or(z.literal('')),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Format de date invalide (AAAA-MM-JJ)' })
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, { message: "L'adresse ne peut pas dépasser 200 caractères" })
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, { message: 'La ville ne peut pas dépasser 100 caractères' })
    .optional()
    .or(z.literal('')),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: 'Code postal invalide (5 chiffres)' })
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/** Schéma pour les préférences de notification */
export const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;
