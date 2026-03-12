/**
 * Schémas de validation Zod — Partenaire Pro
 *
 * Utilisé dans app/(pro)/pro/inscription/page.tsx
 * et app/(pro)/pro/profil/page.tsx
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';
import { emailSchema, passwordSchema } from './auth';

export const PRO_TYPES = [
  'CREATOR',
  'INDEPENDANT',
  'VENDEUR',
  'MAGASIN',
  'ASSOCIATION',
] as const;

export const proInscriptionSchema = z.object({
  proType: z.enum(PRO_TYPES, {
    errorMap: () => ({ message: 'Veuillez choisir un type de partenaire' }),
  }),
  name: z
    .string({ required_error: 'Le nom est requis' })
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
    .trim(),
  email: emailSchema,
  phone: z
    .string({ required_error: 'Le téléphone est requis' })
    .regex(/^[+]?[\d\s()-]{6,20}$/, { message: 'Numéro de téléphone invalide' }),
  companyName: z
    .string()
    .max(100, { message: "Le nom de l'entreprise ne peut pas dépasser 100 caractères" })
    .optional()
    .or(z.literal('')),
  siret: z
    .string()
    .regex(/^\d{14}$/, { message: 'Le SIRET doit contenir 14 chiffres' })
    .optional()
    .or(z.literal('')),
  zone: z
    .string({ required_error: 'La zone géographique est requise' })
    .min(1, { message: 'Veuillez choisir une zone' }),
  skills: z
    .array(z.string())
    .min(1, { message: 'Veuillez sélectionner au moins une compétence' }),
  description: z
    .string()
    .max(1000, { message: 'La description ne peut pas dépasser 1000 caractères' })
    .optional()
    .or(z.literal('')),
  acceptCharte: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter la charte partenaire" }),
  }),
  acceptCGV: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les CGV' }),
  }),
  acceptRGPD: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique RGPD' }),
  }),
});

export type ProInscriptionFormData = z.infer<typeof proInscriptionSchema>;

/** Schéma profil pro (modification) */
export const proProfileSchema = z.object({
  name: z
    .string({ required_error: 'Le nom est requis' })
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(100)
    .trim(),
  email: emailSchema,
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{6,20}$/, { message: 'Numéro de téléphone invalide' })
    .optional()
    .or(z.literal('')),
  companyName: z.string().max(100).optional().or(z.literal('')),
  siret: z.string().regex(/^\d{14}$/, { message: 'SIRET invalide (14 chiffres)' }).optional().or(z.literal('')),
  zone: z.string().optional(),
  description: z.string().max(1000).optional().or(z.literal('')),
});

export type ProProfileFormData = z.infer<typeof proProfileSchema>;
