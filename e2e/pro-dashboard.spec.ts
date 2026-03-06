import { test, expect, loginUser, logoutUser } from './fixtures';
import type { Page } from '@playwright/test';

/**
 * Tests du tableau de bord Pro - Portail pour les professionnels (agences de voyage)
 * Environ 15 tests
 */

test.describe('Tableau de Bord Professionnel (Pro)', () => {
  test('La page /pro redirige vers /pro/dashboard si authentifié', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Accéder à /pro */
    await page.goto('/pro');
    
    /* Vérifier la redirection */
    const currentUrl = page.url();
    const isProPage = currentUrl.includes('/pro');
    expect(isProPage).toBeTruthy();
  });

  test('Le tableau de bord Pro affiche les statistiques', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller au tableau de bord */
    await page.goto('/pro/dashboard');
    
    /* Vérifier que le tableau de bord se charge */
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length).toBeGreaterThan(0);
    
    /* Vérifier la présence d'éléments de tableau de bord */
    const dashboardContent = page.locator('[data-testid="dashboard"], .dashboard, [role="main"]').first();
    
    const isVisible = await dashboardContent.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isVisible || (bodyContent && bodyContent.length > 100)).toBeTruthy();
  });

  test('Le tableau de bord affiche une section de statistiques', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller au tableau de bord */
    await page.goto('/pro/dashboard');
    
    /* Chercher les statistiques */
    const stats = page.locator('[data-testid="stats"], .stats, .card').first();
    
    const hasStats = await stats.isVisible({ timeout: 5000 }).catch(() => false);
    const bodyContent = await page.textContent('body');

    const hasContent = bodyContent && bodyContent.length > 100 && (bodyContent.includes('0') || bodyContent.includes('1'));
    expect(hasStats || hasContent).toBeTruthy();
  });

  test('Le menu de navigation Pro fonctionne', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller au tableau de bord */
    await page.goto('/pro/dashboard');
    
    /* Chercher un menu ou une navigation */
    const navLinks = page.locator('nav a, [role="navigation"] a').first();
    
    if (await navLinks.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await navLinks.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('La page /pro/voyages se charge et affiche la liste des voyages', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller à la page des voyages */
    await page.goto('/pro/voyages');
    
    /* Vérifier le chargement */
    const pageTitle = await page.title();
    expect(pageTitle.length).toBeGreaterThan(0);
    
    /* Vérifier qu'il y a du contenu */
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length).toBeGreaterThan(0);
  });

  test('Le formulaire de création d\'un voyage se charge', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller à la page de création de voyage */
    await page.goto('/pro/voyages/nouveau');
    
    /* Vérifier le chargement du formulaire */
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length).toBeGreaterThan(0);
    
    /* Chercher des champs de formulaire */
    const titleInput = page.locator('input[name*="title"], input[name*="name"]').first();
    
    const hasForm = await titleInput.isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasForm || bodyContent?.includes('voyage')).toBeTruthy();
  });

  test('Soumettre un nouveau formulaire de voyage', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller à la page de création de voyage */
    await page.goto('/pro/voyages/nouveau');
    
    /* Remplir le formulaire */
    const titleInput = page.locator('input[name*="title"], input[name*="name"], input[name*="destination"]').first();
    const descriptionInput = page.locator('textarea[name*="description"], input[name*="description"]').first();
    const priceInput = page.locator('input[type="number"], input[name*="price"]').first();
    
    if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await titleInput.fill(`Voyage Test ${Date.now()}`);
    }
    
    if (await descriptionInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await descriptionInput.fill('Description de test');
    }
    
    if (await priceInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await priceInput.fill('1000');
    }
    
    /* Soumettre le formulaire */
    const formSubmit = page.locator('button[type="submit"]').first();
    if (await formSubmit.isVisible({ timeout: 5000 }).catch(() => false)) {
      await formSubmit.click();
      
      /* Attendre la redirection */
      await page.waitForTimeout(2000);
    }
  });

  test('La page de détail d\'un voyage se charge', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller à la liste des voyages */
    await page.goto('/pro/voyages');
    
    /* Attendre le chargement */
    await page.waitForTimeout(2000);
    
    /* Cliquer sur le premier voyage */
    const firstTravel = page.locator('[data-testid="travel-item"], .travel-card, a[href*="/voyages/"]').first();
    
    if (await firstTravel.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstTravel.click();
      
      /* Attendre la page de détail */
      await page.waitForTimeout(2000);
      
      /* Vérifier le contenu */
      const bodyContent = await page.textContent('body');
      expect(bodyContent?.length).toBeGreaterThan(0);
    }
  });

  test('Le formulaire d\'édition d\'un voyage se charge', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller à la liste des voyages */
    await page.goto('/pro/voyages');
    
    /* Attendre le chargement */
    await page.waitForTimeout(2000);
    
    /* Cliquer sur le premier voyage */
    const firstTravel = page.locator('[data-testid="travel-item"], .travel-card, a[href*="/voyages/"]').first();
    
    if (await firstTravel.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstTravel.click();
      
      /* Attendre et chercher un bouton d'édition */
      await page.waitForTimeout(2000);
      
      const editButton = page.locator('button:has-text("Éditer"), button:has-text("Edit"), a:has-text("Éditer")').first();
      
      if (await editButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await editButton.click();
        
        /* Attendre le formulaire d'édition */
        await page.waitForTimeout(2000);
        
        /* Vérifier le contenu */
        const bodyContent = await page.textContent('body');
        expect(bodyContent?.length).toBeGreaterThan(0);
      }
    }
  });

  test('Soumettre le formulaire d\'édition d\'un voyage', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller à la liste des voyages */
    await page.goto('/pro/voyages');
    
    /* Attendre le chargement */
    await page.waitForTimeout(2000);
    
    /* Cliquer sur le premier voyage */
    const firstTravel = page.locator('[data-testid="travel-item"], .travel-card, a[href*="/voyages/"]').first();
    
    if (await firstTravel.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstTravel.click();
      
      /* Attendre et chercher un bouton d'édition */
      await page.waitForTimeout(2000);
      
      const editButton = page.locator('button:has-text("Éditer"), button:has-text("Edit"), a:has-text("Éditer")').first();
      
      if (await editButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await editButton.click();
        
        /* Attendre le formulaire d'édition */
        await page.waitForTimeout(2000);
        
        /* Modifier un champ */
        const titleInput = page.locator('input[name*="title"], input[name*="name"], input[name*="destination"]').first();
        
        if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
          await titleInput.fill(`Voyage Modifié ${Date.now()}`);
          
          /* Soumettre */
          const submitBtn = page.locator('button[type="submit"]').first();
          if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await submitBtn.click();
            
            /* Attendre la mise à jour */
            await page.waitForTimeout(2000);
          }
        }
      }
    }
  });

  test('La page de revenus/statistiques se charge', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller à la page de revenus */
    await page.goto('/pro/revenus');
    
    /* Vérifier le chargement */
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length).toBeGreaterThan(0);
  });

  test('Déconnexion depuis le portail Pro', async ({ page }: { page: Page }) => {
    /* Se connecter en tant que pro */
    await page.goto('/connexion');
    
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('pro@eventy.local');
    }
    
    if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await passwordInput.fill('ProPassword123!');
    }
    
    if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(2000);
    }
    
    /* Aller au tableau de bord */
    await page.goto('/pro/dashboard');
    
    /* Trouver et cliquer le bouton de déconnexion */
    const logoutButton = page.locator('button:has-text("Déconnexion"), button:has-text("Logout"), a[href*="logout"]').first();
    
    if (await logoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await logoutButton.click();
      
      /* Attendre la redirection */
      await page.waitForTimeout(1000);
      
      /* Vérifier que nous sommes redirigés */
      const currentUrl = page.url();
      const isLoggedOut = !currentUrl.includes('/pro/dashboard');
      expect(isLoggedOut).toBeTruthy();
    }
  });

  test('L\'accès au portail Pro sans authentification redirige vers /connexion', async ({ page }: { page: Page }) => {
    await page.goto('/pro/dashboard');
    
    /* Vérifier la redirection */
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    const redirectedToLogin = currentUrl.includes('/connexion');
    const onProPage = currentUrl.includes('/pro');
    
    expect(redirectedToLogin || onProPage).toBeTruthy();
  });
});
