/**
 * Barrel export — Schémas de validation Zod
 *
 * Tous les schémas Zod sont centralisés ici.
 * Import : import { loginSchema, contactSchema } from '@/lib/validations';
 */

export {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  zodErrorsToRecord,
} from './auth';
export type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyEmailFormData,
  ChangePasswordFormData,
} from './auth';

export {
  contactSchema,
  CONTACT_SUBJECTS,
} from './contact';
export type { ContactFormData } from './contact';

export {
  supportTicketSchema,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from './support';
export type { SupportTicketFormData } from './support';

export {
  profileSchema,
  preferencesSchema,
} from './profile';
export type { ProfileFormData, PreferencesFormData } from './profile';

export {
  proInscriptionSchema,
  proProfileSchema,
  PRO_TYPES,
} from './pro';
export type { ProInscriptionFormData, ProProfileFormData } from './pro';
