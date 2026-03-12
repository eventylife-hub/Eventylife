/**
 * Schéma de validation Zod — Formulaire support / tickets
 *
 * Utilisé dans app/(client)/client/support/page.tsx
 * et app/(pro)/pro/support/page.tsx
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';

export const TICKET_CATEGORIES = [
  'BOOKING',
  'TRANSPORT',
  'PAYMENT',
  'ACCOUNT',
  'TECHNICAL',
  'OTHER',
] as const;

export const TICKET_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export const supportTicketSchema = z.object({
  subject: z
    .string({ required_error: 'Le sujet est requis' })
    .min(5, { message: 'Le sujet doit contenir au moins 5 caractères' })
    .max(200, { message: 'Le sujet ne peut pas dépasser 200 caractères' })
    .trim(),
  category: z.enum(TICKET_CATEGORIES, {
    errorMap: () => ({ message: 'Veuillez choisir une catégorie' }),
  }),
  priority: z.enum(TICKET_PRIORITIES).default('MEDIUM'),
  message: z
    .string({ required_error: 'Le message est requis' })
    .min(10, { message: 'Le message doit contenir au moins 10 caractères' })
    .max(5000, { message: 'Le message ne peut pas dépasser 5000 caractères' })
    .trim(),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
