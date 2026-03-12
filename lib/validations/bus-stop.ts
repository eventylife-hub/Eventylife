/**
 * Schémas de validation Zod — Arrêts de bus Pro
 *
 * Utilisé dans app/(pro)/pro/arrets/nouveau/page.tsx
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';

export const BUS_STOP_TYPES = ['PICKUP_DEPARTURE', 'DROPOFF_ARRIVAL'] as const;

/**
 * Schéma de création d'un arrêt de bus.
 *
 * - publicName obligatoire (visible par les voyageurs)
 * - adresse complète obligatoire (addressLine, city, postalCode)
 * - lat/long optionnels mais validés si fournis
 */
export const busStopSchema = z.object({
  publicName: z
    .string({ required_error: 'Le nom public est requis' })
    .min(2, { message: 'Le nom public doit contenir au moins 2 caractères' })
    .max(150, { message: 'Le nom public ne peut pas dépasser 150 caractères' })
    .trim(),
  internalName: z
    .string()
    .max(50, { message: 'Le nom interne ne peut pas dépasser 50 caractères' })
    .optional()
    .or(z.literal('')),
  type: z.enum(BUS_STOP_TYPES, {
    errorMap: () => ({ message: 'Veuillez choisir un type d\'arrêt' }),
  }),
  addressLine: z
    .string({ required_error: 'L\'adresse est requise' })
    .min(3, { message: 'L\'adresse doit contenir au moins 3 caractères' })
    .max(255, { message: 'L\'adresse ne peut pas dépasser 255 caractères' })
    .trim(),
  city: z
    .string({ required_error: 'La ville est requise' })
    .min(1, { message: 'La ville est requise' })
    .max(100, { message: 'La ville ne peut pas dépasser 100 caractères' })
    .trim(),
  postalCode: z
    .string({ required_error: 'Le code postal est requis' })
    .regex(/^\d{5}$/, { message: 'Le code postal doit contenir 5 chiffres' }),
  country: z
    .string()
    .max(100)
    .optional()
    .or(z.literal('')),
  latitude: z
    .string()
    .refine(
      (val) => val === '' || (Number(val) >= -90 && Number(val) <= 90 && !isNaN(Number(val))),
      { message: 'La latitude doit être comprise entre -90 et 90' }
    )
    .optional()
    .or(z.literal('')),
  longitude: z
    .string()
    .refine(
      (val) => val === '' || (Number(val) >= -180 && Number(val) <= 180 && !isNaN(Number(val))),
      { message: 'La longitude doit être comprise entre -180 et 180' }
    )
    .optional()
    .or(z.literal('')),
  instructions: z
    .string()
    .max(1000, { message: 'Les instructions ne peuvent pas dépasser 1000 caractères' })
    .optional()
    .or(z.literal('')),
  parkingInfo: z
    .string()
    .max(500, { message: 'Les infos parking ne peuvent pas dépasser 500 caractères' })
    .optional()
    .or(z.literal('')),
  accessibilityInfo: z
    .string()
    .max(500, { message: 'Les infos accessibilité ne peuvent pas dépasser 500 caractères' })
    .optional()
    .or(z.literal('')),
});

export type BusStopFormData = z.infer<typeof busStopSchema>;
