/**
 * Redirection /register → /inscription
 * Route legacy anglaise — redirige vers la route principale FR
 */
import { redirect } from 'next/navigation';

export default function RegisterRedirectPage() {
  redirect('/inscription');
}
