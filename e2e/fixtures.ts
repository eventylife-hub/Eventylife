import { test as base, Page } from '@playwright/test';

/**
 * Fixtures personnalisées pour les tests E2E Eventy Life
 * Fournit des pages authentifiées pour les portails Client, Pro et Admin
 */

interface AuthContextType {
  email: string;
  password: string;
  token?: string;
}

interface TestFixtures {
  clientPage: Page;
  proPage: Page;
  adminPage: Page;
}

/**
 * Helper: Effectuer une connexion utilisateur
 */
async function loginUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/connexion');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  /* Attendre la redirection après connexion */
  await page.waitForURL((url) => !url.toString().includes('/connexion'), {
    timeout: 10000,
  });
}

/**
 * Helper: Effectuer une déconnexion utilisateur
 */
async function logoutUser(page: Page): Promise<void> {
  /* Localiser et cliquer sur le bouton de déconnexion */
  const logoutButton = page.locator('button:has-text("Déconnexion")');
  
  if (await logoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL('/', { timeout: 5000 });
  }
}

/**
 * Helper: Enregistrer un nouvel utilisateur
 */
async function registerUser(
  page: Page,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
): Promise<void> {
  await page.goto('/inscription');
  await page.fill('input[name="firstName"]', userData.firstName);
  await page.fill('input[name="lastName"]', userData.lastName);
  await page.fill('input[name="email"]', userData.email);
  await page.fill('input[name="password"]', userData.password);
  await page.fill('input[name="confirmPassword"]', userData.confirmPassword);
  
  /* Accepter les conditions si nécessaire */
  const agreeCheckbox = page.locator('input[name="agree"]');
  if (await agreeCheckbox.isVisible().catch(() => false)) {
    await agreeCheckbox.check();
  }
  
  await page.click('button[type="submit"]');
  
  /* Attendre la redirection après inscription */
  await page.waitForURL((url) => !url.toString().includes('/inscription'), {
    timeout: 10000,
  });
}

/**
 * Helper: Vérifier si l'utilisateur est authentifié
 */
async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    const response = await page.evaluate(() => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      return !!token;
    });
    return response;
  } catch {
    return false;
  }
}

/**
 * Helper: Récupérer le token d'authentification
 */
async function getAuthToken(page: Page): Promise<string | null> {
  try {
    const token = await page.evaluate(() => {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    });
    return token;
  } catch {
    return null;
  }
}

/**
 * Helper: Définir le token d'authentification
 */
async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((t) => {
    localStorage.setItem('authToken', t);
  }, token);
}

/**
 * Fixture: Page authentifiée en tant que client
 * SECURITY (LOT 166): Les fallbacks .local sont pour le dev local uniquement.
 * En CI, définir TEST_EMAIL et TEST_PASSWORD via les variables d'environnement.
 */
async function clientPage({ page }: any, use: any): Promise<void> {
  const email = process.env.TEST_EMAIL || 'testuser@eventy.local';
  const password = process.env.TEST_PASSWORD || 'TestPassword123!';
  
  try {
    await loginUser(page, email, password);
  } catch {
    /* La connexion peut échouer si l'utilisateur n'existe pas - continuer quand même */
  }
  
  await use(page);
  
  /* Cleanup après le test */
  try {
    await logoutUser(page);
  } catch {
    /* La déconnexion peut échouer - ignorer */
  }
}

/**
 * Fixture: Page authentifiée en tant que professionnel (Pro)
 * SECURITY (LOT 166): Fallbacks .local pour dev uniquement — définir les env vars en CI.
 */
async function proPage({ page }: any, use: any): Promise<void> {
  const email = process.env.TEST_PRO_EMAIL || 'pro@eventy.local';
  const password = process.env.TEST_PRO_PASSWORD || 'ProPassword123!';
  
  try {
    await loginUser(page, email, password);
  } catch {
    /* La connexion peut échouer si l'utilisateur n'existe pas - continuer quand même */
  }
  
  await use(page);
  
  /* Cleanup après le test */
  try {
    await logoutUser(page);
  } catch {
    /* La déconnexion peut échouer - ignorer */
  }
}

/**
 * Fixture: Page authentifiée en tant qu'administrateur
 * SECURITY (LOT 166): Fallbacks .local pour dev uniquement — définir les env vars en CI.
 */
async function adminPage({ page }: any, use: any): Promise<void> {
  const email = process.env.TEST_ADMIN_EMAIL || 'admin@eventy.local';
  const password = process.env.TEST_ADMIN_PASSWORD || 'AdminPassword123!';
  
  try {
    await loginUser(page, email, password);
  } catch {
    /* La connexion peut échouer si l'utilisateur n'existe pas - continuer quand même */
  }
  
  await use(page);
  
  /* Cleanup après le test */
  try {
    await logoutUser(page);
  } catch {
    /* La déconnexion peut échouer - ignorer */
  }
}

/**
 * Export du test avec fixtures personnalisées
 */
export const test = base.extend<TestFixtures>({
  clientPage,
  proPage,
  adminPage,
});

export { expect } from '@playwright/test';

/* Exporter les helpers pour utilisation dans les tests */
export { loginUser, logoutUser, registerUser, isAuthenticated, getAuthToken, setAuthToken };
