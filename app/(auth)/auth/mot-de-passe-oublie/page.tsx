/**
 * Redirection /auth/mot-de-passe-oublie → /mot-de-passe-oublie
 * Route dupliquée — redirige vers la route principale
 */
import { redirect } from 'next/navigation';

export default function AuthForgotPasswordRedirectPage() {
  redirect('/mot-de-passe-oublie');
}
