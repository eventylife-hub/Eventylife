/**
 * Redirection /auth/inscription → /inscription
 * Route dupliquée — redirige vers la route principale
 */
import { redirect } from 'next/navigation';

export default function AuthInscriptionRedirectPage() {
  redirect('/inscription');
}
