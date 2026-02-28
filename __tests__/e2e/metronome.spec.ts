import { test, expect } from '@playwright/test';

test.describe('Metronome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display metronome panel', async ({ page }) => {
    // Check for BPM display
    await expect(page.getByText('BPM')).toBeVisible();
  });

  test('should display default BPM value', async ({ page }) => {
    // Default BPM should be 120
    await expect(page.getByText('120')).toBeVisible();
  });

  test('should have start/stop button', async ({ page }) => {
    // Check for play button (using aria label or test id)
    const playButton = page.locator('[aria-label*="play"], [data-testid="metronome-play"]').first();
    await expect(playButton).toBeVisible();
  });

  test('should have time signature selector', async ({ page }) => {
    // Check for time signature display (e.g., 4/4)
    await expect(page.getByText('4/4')).toBeVisible();
  });

  test('should allow BPM adjustment via slider', async ({ page }) => {
    // Find slider and interact with it
    const slider = page.locator('input[type="range"]').first();
    if (await slider.isVisible()) {
      await slider.fill('100');
      // Verify BPM changed
      await expect(page.getByText('100')).toBeVisible();
    }
  });
});
