import { Page, expect } from '@playwright/test';

/**
 * Utilitaires pour les tests E2E Eventy Life
 * Fonctions communes pour les assertions et opérations
 */

/**
 * Attendre qu'un élément soit visible avec un message d'erreur personnalisé
 */
export async function expectElementVisible(
  page: Page,
  selector: string,
  timeoutMs: number = 5000
): Promise<void> {
  const element = page.locator(selector).first();
  
  try {
    await element.waitFor({ timeout: timeoutMs, state: 'visible' });
  } catch {
    throw new Error(`Élément "${selector}" n'est pas devenu visible après ${timeoutMs}ms`);
  }
}

/**
 * Remplir un formulaire avec les données fournies
 */
export async function fillForm(
  page: Page,
  data: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(data)) {
    const input = page.locator(`input[name="${key}"], textarea[name="${key}"], select[name="${key}"]`).first();
    
    if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
      const tagName = await input.evaluate((el) => el.tagName.toLowerCase());
      
      if (tagName === 'select') {
        await input.selectOption(value);
      } else {
        await input.fill(value);
      }
    }
  }
}

/**
 * Soumettre un formulaire en cliquant sur le bouton submit
 */
export async function submitForm(page: Page, buttonText: string = 'Soumettre'): Promise<void> {
  const submitButton = page.locator(`button:has-text("${buttonText}"), button[type="submit"]`).first();
  
  if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await submitButton.click();
  } else {
    throw new Error(`Bouton de soumission "${buttonText}" non trouvé`);
  }
}

/**
 * Vérifier qu'un message d'erreur s'affiche
 */
export async function expectErrorMessage(page: Page, errorText: string): Promise<void> {
  const errorElement = page.locator(`[role="alert"], .error, .alert, text="${errorText}"`).first();
  
  try {
    await errorElement.waitFor({ timeout: 5000, state: 'visible' });
  } catch {
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain(errorText);
  }
}

/**
 * Vérifier qu'un message de succès s'affiche
 */
export async function expectSuccessMessage(page: Page, successText: string): Promise<void> {
  const successElement = page.locator(`[role="alert"], .success, .message, text="${successText}"`).first();
  
  try {
    await successElement.waitFor({ timeout: 5000, state: 'visible' });
  } catch {
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain(successText);
  }
}

/**
 * Cliquer sur un lien par son texte
 */
export async function clickLinkByText(page: Page, linkText: string): Promise<void> {
  const link = page.locator(`a:has-text("${linkText}")`).first();
  
  if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
    await link.click();
  } else {
    throw new Error(`Lien "${linkText}" non trouvé`);
  }
}

/**
 * Cliquer sur un bouton par son texte
 */
export async function clickButtonByText(page: Page, buttonText: string): Promise<void> {
  const button = page.locator(`button:has-text("${buttonText}")`).first();
  
  if (await button.isVisible({ timeout: 5000 }).catch(() => false)) {
    await button.click();
  } else {
    throw new Error(`Bouton "${buttonText}" non trouvé`);
  }
}

/**
 * Attendre une URL spécifique avec gestion d'erreur
 */
export async function expectUrl(page: Page, urlPattern: string | RegExp): Promise<void> {
  try {
    if (typeof urlPattern === 'string') {
      await page.waitForURL(`**${urlPattern}**`, { timeout: 10000 });
    } else {
      await page.waitForURL(urlPattern, { timeout: 10000 });
    }
  } catch {
    const currentUrl = page.url();
    throw new Error(`URL n'a pas changé. Attendu: ${urlPattern}, Actuel: ${currentUrl}`);
  }
}

/**
 * Obtenir le contenu visible de la page
 */
export async function getPageContent(page: Page): Promise<string> {
  const content = await page.textContent('body');
  return content || '';
}

/**
 * Vérifier si un élément contient un texte
 */
export async function expectElementContainsText(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  const element = page.locator(selector).first();
  const elementText = await element.textContent();
  
  expect(elementText).toContain(text);
}

/**
 * Récupérer tous les textes d'une liste d'éléments
 */
export async function getElementsText(page: Page, selector: string): Promise<string[]> {
  const elements = page.locator(selector);
  const count = await elements.count();
  const texts: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const text = await elements.nth(i).textContent();
    if (text) {
      texts.push(text);
    }
  }
  
  return texts;
}

/**
 * Vérifier le nombre d'éléments
 */
export async function expectElementCount(
  page: Page,
  selector: string,
  expectedCount: number
): Promise<void> {
  const elements = page.locator(selector);
  const count = await elements.count();
  
  expect(count).toBe(expectedCount);
}

/**
 * Attendre que le contenu change
 */
export async function waitForContentChange(
  page: Page,
  initialContent: string,
  timeoutMs: number = 5000
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    const currentContent = await getPageContent(page);
    if (currentContent !== initialContent) {
      return;
    }
    await page.waitForTimeout(100);
  }
  
  throw new Error(`Le contenu n'a pas changé après ${timeoutMs}ms`);
}

/**
 * Obtenir la valeur d'un input
 */
export async function getInputValue(page: Page, name: string): Promise<string> {
  const input = page.locator(`input[name="${name}"]`).first();
  return await input.inputValue();
}

/**
 * Définir la valeur d'un input
 */
export async function setInputValue(page: Page, name: string, value: string): Promise<void> {
  const input = page.locator(`input[name="${name}"]`).first();
  await input.fill(value);
}

/**
 * Cocher une case à cocher
 */
export async function checkCheckbox(page: Page, name: string): Promise<void> {
  const checkbox = page.locator(`input[name="${name}"][type="checkbox"]`).first();
  
  if (await checkbox.isVisible({ timeout: 5000 }).catch(() => false)) {
    await checkbox.check();
  }
}

/**
 * Décocher une case à cocher
 */
export async function uncheckCheckbox(page: Page, name: string): Promise<void> {
  const checkbox = page.locator(`input[name="${name}"][type="checkbox"]`).first();
  
  if (await checkbox.isVisible({ timeout: 5000 }).catch(() => false)) {
    await checkbox.uncheck();
  }
}

/**
 * Sélectionner une option dans une liste déroulante
 */
export async function selectOption(page: Page, name: string, value: string): Promise<void> {
  const select = page.locator(`select[name="${name}"]`).first();
  
  if (await select.isVisible({ timeout: 5000 }).catch(() => false)) {
    await select.selectOption(value);
  }
}

/**
 * Obtenir les options d'une liste déroulante
 */
export async function getSelectOptions(page: Page, name: string): Promise<string[]> {
  const select = page.locator(`select[name="${name}"]`).first();
  const options = select.locator('option');
  const count = await options.count();
  const values: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const value = await options.nth(i).getAttribute('value');
    if (value) {
      values.push(value);
    }
  }
  
  return values;
}

/**
 * Prendre une capture d'écran avec un nom personnalisé
 */
export async function takeScreenshot(page: Page, fileName: string): Promise<void> {
  const timestamp = new Date().getTime();
  const screenshotName = `${fileName}-${timestamp}.png`;
  await page.screenshot({ path: `test-results/${screenshotName}` });
}

/**
 * Vérifier que la page n'a pas d'erreurs JS majeures
 */
export async function expectNoJSErrors(page: Page): Promise<void> {
  const errors: string[] = [];
  
  page.on('pageerror', (error) => {
    errors.push(error.toString());
  });
  
  expect(errors.length).toBe(0);
}

/**
 * Obtenir l'attribut data-testid d'un élément
 */
export async function getTestId(page: Page, testId: string): Promise<string | null> {
  return await page.locator(`[data-testid="${testId}"]`).first().getAttribute('data-testid');
}
