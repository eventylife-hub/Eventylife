import { chromium, FullConfig } from '@playwright/test';

/**
 * Configuration globale pour les tests E2E Eventy Life
 * Initialise l'environnement avant tous les tests
 */

async function globalSetup(config: FullConfig): Promise<void> {
  /* Vérifier que le serveur est disponible */
  // baseURL is typically defined in the playwright config
  const baseURLString = 'http://localhost:3000';
  const baseURL = new URL(baseURLString);
  
  let retries = 0;
  const maxRetries = 30;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(baseURL.toString());
      if (response.ok || response.status === 404) {
        /* Serveur est disponible */
        break;
      }
    } catch {
      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  if (retries === maxRetries) {
    throw new Error(`Impossible de se connecter à ${baseURL.toString()}`);
  }

  /* Initialiser les variables d'environnement pour les tests */
  process.env.TEST_BASE_URL = baseURL.toString();
  process.env.TEST_EMAIL = 'testuser@eventy.local';
  process.env.TEST_PASSWORD = 'TestPassword123!';
  process.env.TEST_PRO_EMAIL = 'pro@eventy.local';
  process.env.TEST_PRO_PASSWORD = 'ProPassword123!';
  process.env.TEST_ADMIN_EMAIL = 'admin@eventy.local';
  process.env.TEST_ADMIN_PASSWORD = 'AdminPassword123!';
}

export default globalSetup;
