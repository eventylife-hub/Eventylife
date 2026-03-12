/**
 * Schémas de validation Zod — Campagnes Marketing Pro
 *
 * Utilisé dans app/(pro)/pro/marketing/creer/page.tsx
 * Convention : messages d'erreur en FRANÇAIS.
 * Montants en CENTIMES (INVARIANT 3 : jamais Float).
 */

import { z } from 'zod';

export const CAMPAIGN_TARGET_AUDIENCES = [
  'JEUNES_18_30',
  'FAMILLES',
  'SENIORS',
  'GROUPES_AMIS',
  'ASSOCIATIONS',
  'ENTREPRISES',
  'TOUS',
] as const;

export const campaignSchema = z.object({
  title: z
    .string({ required_error: 'Le titre est requis' })
    .min(3, { message: 'Le titre doit contenir au moins 3 caractères' })
    .max(120, { message: 'Le titre ne peut pas dépasser 120 caractères' })
    .trim(),
  description: z
    .string()
    .max(2000, { message: 'La description ne peut pas dépasser 2000 caractères' })
    .optional()
    .or(z.literal('')),
  targetAudience: z.enum(CAMPAIGN_TARGET_AUDIENCES, {
    errorMap: () => ({ message: 'Veuillez choisir une audience cible' }),
  }),
  budgetCents: z
    .number({ required_error: 'Le budget est requis' })
    .int({ message: 'Le budget doit être un nombre entier (centimes)' })
    .min(100, { message: 'Le budget minimum est de 1,00 €' })
    .max(10_000_000, { message: 'Le budget ne peut pas dépasser 100 000 €' }),
  startDate: z
    .string({ required_error: 'La date de début est requise' })
    .min(1, { message: 'La date de début est requise' }),
  endDate: z
    .string({ required_error: 'La date de fin est requise' })
    .min(1, { message: 'La date de fin est requise' }),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.endDate) > new Date(data.startDate);
  },
  { message: 'La date de fin doit être après la date de début', path: ['endDate'] }
);

export type CampaignFormData = z.infer<typeof campaignSchema>;
