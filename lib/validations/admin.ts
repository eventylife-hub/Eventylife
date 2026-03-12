/**
 * Schémas de validation Zod — Portail Admin
 *
 * Utilisés dans les formulaires de l'espace admin :
 * notifications manuelles, gestion utilisateurs, etc.
 *
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z } from 'zod';

// ─── Envoi manuel de notification ────────────────────────

export const manualNotificationSchema = z.object({
  recipient: z
    .string({ required_error: 'Le destinataire est requis' })
    .min(1, { message: 'Veuillez saisir un destinataire' })
    .trim(),
  templateId: z
    .string({ required_error: 'Le template est requis' })
    .min(1, { message: 'Veuillez choisir un template' }),
  channel: z.enum(['EMAIL', 'SMS', 'PUSH'], {
    errorMap: () => ({ message: 'Canal invalide' }),
  }),
});

export type ManualNotificationFormData = z.infer<typeof manualNotificationSchema>;
