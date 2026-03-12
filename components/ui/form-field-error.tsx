/**
 * FormFieldError — Composant réutilisable pour afficher les erreurs de validation par champ.
 *
 * Usage :
 *   <FormFieldError error={errors.email} id="email-error" />
 *
 * Le composant gère aussi les attributs ARIA pour l'accessibilité :
 * - Ajouter aria-invalid={!!errors.email} sur l'input
 * - Ajouter aria-describedby="email-error" sur l'input
 *
 * Convention : messages d'erreur en FRANÇAIS.
 */

import React from 'react';

interface FormFieldErrorProps {
  /** Message d'erreur à afficher (undefined ou vide = pas d'erreur) */
  error?: string;
  /** ID pour le lien aria-describedby entre l'input et le message d'erreur */
  id?: string;
  /** Classe CSS additionnelle */
  className?: string;
}

/**
 * Affiche un message d'erreur sous un champ de formulaire.
 * Rendu conditionnel : rien n'est affiché si `error` est falsy.
 */
export function FormFieldError({ error, id, className }: FormFieldErrorProps) {
  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      className={className}
      style={{
        color: '#DC2626',
        fontSize: '0.75rem',
        marginTop: '0.25rem',
        lineHeight: '1.4',
      }}
    >
      {error}
    </p>
  );
}

/**
 * Retourne les props ARIA à ajouter sur un input associé à un champ avec erreur.
 *
 * Usage :
 *   <input {...ariaForField(errors.email, 'email-error')} />
 */
export function ariaForField(
  error: string | undefined,
  errorId: string
): { 'aria-invalid'?: boolean; 'aria-describedby'?: string } {
  if (!error) return {};
  return {
    'aria-invalid': true,
    'aria-describedby': errorId,
  };
}
