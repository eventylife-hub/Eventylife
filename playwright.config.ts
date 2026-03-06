import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration de Playwright pour les tests E2E Eventy Life
 * Frontend Next.js 14 avec 3 portails: Client, Pro, Admin
 */

const baseURL = 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  
  /* Durée maximale d'exécution d'un test */
  timeout: 30 * 1000,
  
  /* Durée maximale d'exécution de la suite de tests */
  globalTimeout: 30 * 60 * 1000,
  
  expect: {
    timeout: 5000,
  },

  /* Exécuter les tests de manière séquentielle */
  fullyParallel: false,

  /* Réessayer les tests échoués uniquement en CI */
  retries: process.env.CI ? 1 : 0,

  /* Nombre de workers en parallèle */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github']] : []),
  ] as any,

  use: {
    baseURL,
    
    /* Enregistrer les traces des tests échoués */
    trace: 'on-first-retry',
    
    /* Capturer les écrans des tests échoués */
    screenshot: 'only-on-failure',
    
    /* Enregistrer les vidéos des tests échoués */
    video: 'retain-on-failure',
  },

  /* Configurer les projets de test */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test optionnel sur mobile Chrome */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Serveur web local pour développement */
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Configuration globale */
  globalSetup: require.resolve('./e2e/global-setup.ts'),
});
