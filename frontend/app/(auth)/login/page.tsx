/**
 * Redirection /login → /connexion
 * Route legacy anglaise — redirige vers la route principale FR
 */
import { redirect } from 'next/navigation';

export default function LoginRedirectPage() {
  redirect('/connexion');
}
