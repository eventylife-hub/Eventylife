/**
 * Schémas de validation Zod — Authentification
 *
 * Utilisés dans les formulaires de connexion, inscription,
 * mot de passe oublié et réinitialisation.
 *
 * Convention : messages d'erreur en FRANÇAIS.
 */

import { z, type ZodType, type ZodError } from 'zod';

/** Utilitaire : extrait le type Output d'un schéma Zod */
type Infer<T extends ZodType> = T['_output'];

// ─── Constantes de validation ───────────────────────────────

const PASSWORD_MIN = 12;
const PASSWORD_MAX = 128;
const NAME_MIN = 2;
const NAME_MAX = 50;

// ─── Schéma email réutilisable ──────────────────────────────

export const emailSchema = z
  .string({ required_error: 'L\'adresse email est requise' })
  .email({ message: 'Adresse email invalide' })
  .trim()
  .toLowerCase();

// ─── Schéma mot de passe réutilisable ───────────────────────

export const passwordSchema = z
  .string({ required_error: 'Le mot de passe est requis' })
  .min(PASSWORD_MIN, { message: `Le mot de passe doit contenir au moins ${PASSWORD_MIN} caractères` })
  .max(PASSWORD_MAX, { message: `Le mot de passe ne peut pas dépasser ${PASSWORD_MAX} caractères` })
  .regex(/[a-zA-Z]/, { message: 'Le mot de passe doit contenir au moins une lettre' })
  .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' });

// ─── Connexion ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Le mot de passe est requis' }).min(1, { message: 'Le mot de passe est requis' }),
});

export type LoginFormData = Infer<typeof loginSchema>;

// ─── Inscription ────────────────────────────────────────────

export const registerSchema = z.object({
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
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string({ required_error: 'La confirmation du mot de passe est requise' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
});

export type RegisterFormData = Infer<typeof registerSchema>;

// ─── Mot de passe oublié ────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = Infer<typeof forgotPasswordSchema>;

// ─── Réinitialisation de mot de passe ───────────────────────

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Le token de réinitialisation est requis' }),
  password: passwordSchema,
  confirmPassword: z.string({ required_error: 'La confirmation du mot de passe est requise' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
});

export type ResetPasswordFormData = Infer<typeof resetPasswordSchema>;

// ─── Vérification email ─────────────────────────────────────

export const verifyEmailSchema = z.object({
  token: z.string({ required_error: 'Le token de vérification est requis' }),
});

export type VerifyEmailFormData = Infer<typeof verifyEmailSchema>;

// ─── Changement de mot de passe (authentifié) ───────────────

export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Le mot de passe actuel est requis' }).min(1, { message: 'Le mot de passe actuel est requis' }),
  newPassword: passwordSchema,
  confirmNewPassword: z.string({ required_error: 'La confirmation du nouveau mot de passe est requise' }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Les nouveaux mots de passe ne correspondent pas',
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Le nouveau mot de passe doit être différent de l\'ancien',
});

export type ChangePasswordFormData = Infer<typeof changePasswordSchema>;

// ─── Utilitaire : extraire les erreurs Zod en Record ────────

/**
 * Transforme une ZodError en Record<string, string> pour les formulaires
 * Exemple : { email: "Adresse email invalide", password: "Trop court" }
 */
export function zodErrorsToRecord(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!result[path]) {
      result[path] = issue.message;
    }
  }
  return result;
}
