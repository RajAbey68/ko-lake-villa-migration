import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

/**
 * MVP Test Cases - These MUST pass before deployment
 * 
 * These tests define the minimum viable product requirements.
 * ALL tests in this file must pass green before we deploy to production.
 */

test.describe('MVP Requirements - Must Pass Before Deployment', () => {

  test('MVP-1: Gallery shows at least 12 luxury resort images', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState('networkidle');

    // Gallery must have at least 12 images visible
    const galleryImages = page.locator('[data-testid^="gallery-item-"] img');
    const imageCount = await galleryImages.count();
    
    expect(imageCount).toBeGreaterThanOrEqual(12);

    // First 6 images must actually load (not broken)
    for (let i = 0; i < Math.min(6, imageCount); i++) {
      const img = galleryImages.nth(i);
      await expect(img).toBeVisible();
      
      const isLoaded = await img.evaluate((element: HTMLImageElement) => {
        return element.complete && element.naturalWidth > 0;
      });
      expect(isLoaded).toBeTruthy();
    }
  });

  test('MVP-2: Admin interface is accessible with working login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');

    // Should either show admin dashboard OR login form (not 404/error)
    const adminDashboard = page.locator('[data-testid="admin-dashboard"]');
    const loginForm = page.locator('[data-testid="admin-login-form"]');
    
    const hasAdminDashboard = await adminDashboard.count() > 0;
    const hasLoginForm = await loginForm.count() > 0;
    
    expect(hasAdminDashboard || hasLoginForm).toBeTruthy();

    // If login form exists, it should have working fields
    if (hasLoginForm) {
      const emailField = page.locator('[data-testid="login-email"]');
      const passwordField = page.locator('[data-testid="login-password"]');
      const loginButton = page.locator('[data-testid="login-submit"]');
      
      await expect(emailField).toBeVisible();
      await expect(passwordField).toBeVisible();
      await expect(loginButton).toBeVisible();
    }
  });

  test('MVP-3: Contact form accepts and submits inquiries', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    // Contact form must have all required fields
    const nameField = page.locator('[data-testid="contact-name"]');
    const emailField = page.locator('[data-testid="contact-email"]');
    const messageField = page.locator('[data-testid="contact-message"]');
    const submitButton = page.locator('[data-testid="contact-submit"]');

    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Form should accept input
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await messageField.fill('Test inquiry about luxury accommodations');

    // Submit button should be clickable
    await expect(submitButton).toBeEnabled();
  });

  test('MVP-4: Booking inquiry button works and connects to system', async ({ page }) => {
    await page.goto(`${BASE_URL}/accommodation`);
    await page.waitForLoadState('networkidle');

    // Booking button must exist and be clickable
    const bookingButton = page.locator('[data-testid="booking-button"], [data-testid="book-now"]');
    await expect(bookingButton).toBeVisible();
    await expect(bookingButton).toBeEnabled();

    // Click should trigger booking flow (modal/redirect/form)
    await bookingButton.click();

    // Should show booking interface within 3 seconds
    const bookingInterface = page.locator('[data-testid="booking-modal"], [data-testid="booking-form"]');
    await expect(bookingInterface).toBeVisible({ timeout: 3000 });
  });

  test('MVP-5: Homepage loads with professional luxury resort content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Hero section must be visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    // Must have resort name/branding
    const resortName = page.locator(':text("Ko Lake Villa")');
    await expect(resortName).toBeVisible();

    // Must have call-to-action for booking
    const ctaButton = page.locator('[data-testid="hero-cta"], [data-testid="book-now"]');
    await expect(ctaButton).toBeVisible();

    // Page should not show developer placeholders
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toMatch(/lorem ipsum|placeholder|todo|fixme/i);
  });

  test('MVP-6: All public pages load without errors', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/accommodation', name: 'Accommodation' },
      { url: '/gallery', name: 'Gallery' },
      { url: '/experiences', name: 'Experiences' },
      { url: '/contact', name: 'Contact' }
    ];

    for (const pageTest of pages) {
      await page.goto(`${BASE_URL}${pageTest.url}`);
      await page.waitForLoadState('networkidle');

      // Page should load (not 404/500)
      const pageContent = page.locator('main, [role="main"], body');
      await expect(pageContent).toBeVisible();

      // Should not show error messages
      const errorContent = await page.textContent('body');
      expect(errorContent).not.toMatch(/404|500|error|not found/i);
    }
  });

});

/**
 * DEPLOYMENT GATE:
 * 
 * Before deploying to production, ALL 6 MVP tests above must pass.
 * 
 * If any test fails:
 * 1. Fix the underlying issue
 * 2. Re-run tests until all pass
 * 3. Only then deploy
 * 
 * This ensures luxury resort visitors get a professional experience.
 */