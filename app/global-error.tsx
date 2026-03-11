'use client';

import * as Sentry from '@sentry/nextjs';
import React from 'react';

/**
 * Props pour le gestionnaire d&apos;erreur global
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Gestionnaire d&apos;erreur global pour Next.js 14
 * Capture les erreurs non gérées et les envoie à Sentry
 * Affiche une page d&apos;erreur conviviale en français
 */
export default function GlobalError({ error, reset }: GlobalErrorProps): JSX.Element {
  // Capturer l'erreur dans Sentry
  React.useEffect(() => {
    Sentry.captureException(error, {
      extra: {
        digest: error.digest,
        context: 'global-error-handler',
      },
    });
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
          <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
            {/* En-tête avec icône */}
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Titre principal */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Erreur d&apos;application</h1>
              <p className="text-gray-600">
                Une erreur critique s&apos;est produite lors du traitement de votre requête.
              </p>
            </div>

            {/* Contenu d'erreur en développement */}
            {process.env.NODE_ENV === 'development' && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-xs font-semibold text-red-600">Détails de l&apos;erreur:</p>
                <p className="mt-2 break-words font-mono text-sm text-red-700">
                  {error.message || 'Erreur inconnue'}
                </p>
                {error.digest && (
                  <p className="mt-2 text-xs text-red-600">ID: {error.digest}</p>
                )}
              </div>
            )}

            {/* Message utilisateur */}
            <div className="rounded-md bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                Nous avons enregistré cette erreur. Nos équipes techniques examineront le problème
                et travailleront à sa résolution.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              {/* Bouton de rafraîchissement */}
              <button type="button"
                onClick={(): void => reset()}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Réessayer
              </button>

              {/* Lien vers l'accueil */}
              <a
                href="/"
                className="block rounded-lg border-2 border-gray-300 px-4 py-3 text-center font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Aller à la page d&apos;accueil
              </a>
            </div>

            {/* Lien de support */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Si le problème persiste, veuillez{' '}
                <a
                  href="mailto:support@eventy-life.com"
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  contacter notre équipe de support
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
