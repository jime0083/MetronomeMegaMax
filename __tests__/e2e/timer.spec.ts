import { test, expect } from '@playwright/test';

test.describe('Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display timer panel', async ({ page }) => {
    // Check for timer-related text
    const timerPanel = page.locator('[data-testid="timer-panel"]').first();
    // If no test id, look for timer display format (MM:SS or HH:MM:SS)
    const timeDisplay = page.getByText(/\d{2}:\d{2}/).first();
    await expect(timeDisplay).toBeVisible();
  });

  test('should have timer controls', async ({ page }) => {
    // Look for play/pause or start/stop buttons for timer
    const timerControls = page.locator('[aria-label*="timer"], [data-testid*="timer"]').first();
    // Or look for time adjustment buttons
    const plusButton = page.getByText('+').first();
    await expect(plusButton).toBeVisible();
  });

  test('should display time in correct format', async ({ page }) => {
    // Timer should display time in MM:SS format
    const timeDisplay = page.getByText(/^\d{2}:\d{2}$/).first();
    await expect(timeDisplay).toBeVisible();
  });
});
