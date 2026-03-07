/**
 * Redirection /auth/connexion → /connexion
 * Route dupliquée — redirige vers la route principale
 */
import { redirect } from 'next/navigation';

export default function AuthConnexionRedirectPage() {
  redirect('/connexion');
}
