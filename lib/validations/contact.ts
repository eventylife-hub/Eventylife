/**
 * Schéma de validation Zod — Formulaire de contact public
 *
 * Utilisé dans app/(public)/contact/page.tsx
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';

const MESSAGE_MIN = 20;
const MESSAGE_MAX = 2000;
const NAME_MIN = 2;
const NAME_MAX = 100;

export const CONTACT_SUBJECTS = [
  'general',
  'reservation',
  'partenariat',
  'reclamation',
  'presse',
  'autre',
] as const;

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Le nom est requis' })
    .min(NAME_MIN, { message: `Le nom doit contenir au moins ${NAME_MIN} caractères` })
    .max(NAME_MAX, { message: `Le nom ne peut pas dépasser ${NAME_MAX} caractères` })
    .trim(),
  email: z
    .string({ required_error: "L'adresse email est requise" })
    .email({ message: 'Adresse email invalide' })
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{6,20}$/, { message: 'Numéro de téléphone invalide' })
    .optional()
    .or(z.literal('')),
  subject: z
    .string({ required_error: 'Veuillez choisir un sujet' })
    .min(1, { message: 'Veuillez choisir un sujet' }),
  message: z
    .string({ required_error: 'Le message est requis' })
    .min(MESSAGE_MIN, { message: `Le message doit contenir au moins ${MESSAGE_MIN} caractères` })
    .max(MESSAGE_MAX, { message: `Le message ne peut pas dépasser ${MESSAGE_MAX} caractères` })
    .trim(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }),
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
