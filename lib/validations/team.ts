/**
 * Schémas de validation Zod — Gestion d'équipe Pro
 *
 * Utilisé dans app/(pro)/pro/parametres/equipe/page.tsx
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';

export const TEAM_ROLES = ['admin', 'manager', 'agent', 'consultant'] as const;

/**
 * Schéma d'invitation d'un nouveau membre d'équipe.
 */
export const teamInviteSchema = z.object({
  email: z
    .string({ required_error: 'L\'adresse email est requise' })
    .email({ message: 'Veuillez entrer une adresse email valide' })
    .max(254, { message: 'L\'email ne peut pas dépasser 254 caractères' })
    .trim()
    .toLowerCase(),
  role: z.enum(TEAM_ROLES, {
    errorMap: () => ({ message: 'Veuillez choisir un rôle' }),
  }),
});

export type TeamInviteFormData = z.infer<typeof teamInviteSchema>;

/**
 * Schéma de modification d'un membre d'équipe.
 */
export const teamMemberUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
    .trim()
    .optional(),
  role: z.enum(TEAM_ROLES, {
    errorMap: () => ({ message: 'Veuillez choisir un rôle valide' }),
  }).optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{6,20}$/, { message: 'Numéro de téléphone invalide' })
    .optional()
    .or(z.literal('')),
});

export type TeamMemberUpdateFormData = z.infer<typeof teamMemberUpdateSchema>;
