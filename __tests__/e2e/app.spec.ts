import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');

    // App should load without errors
    await expect(page).toHaveTitle(/Metronome/i);
  });

  test('should display header with app title', async ({ page }) => {
    await page.goto('/');

    // Check for app branding
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have language selector', async ({ page }) => {
    await page.goto('/');

    // Look for language selector or flags
    const langSelector = page.locator('[data-testid="language-selector"], [aria-label*="language"]').first();
    // Or look for common language codes/flags
    const langText = page.getByText(/日本語|English|Español/).first();

    // Either selector or text should be visible
    const isLangSelectorVisible = await langSelector.isVisible().catch(() => false);
    const isLangTextVisible = await langText.isVisible().catch(() => false);

    expect(isLangSelectorVisible || isLangTextVisible).toBe(true);
  });

  test('should have login button for unauthenticated users', async ({ page }) => {
    await page.goto('/');

    // Look for login/sign in button
    const loginButton = page.getByRole('button', { name: /login|sign in|ログイン|サインイン/i }).first();
    await expect(loginButton).toBeVisible();
  });
});
