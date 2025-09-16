import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('Page Integration Tests', () => {
  test('home page functionality', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('nav');
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Ko Lake Villa');
    
    // Check navigation elements
    const navItems = await page.locator('[href="/"], [href="/accommodation"], [href="/gallery"], [href="/experiences"], [href="/contact"]').count();
    expect(navItems).toBeGreaterThanOrEqual(5);
    
    // Check hero section
    const heroSection = page.locator('[class*="hero"], h1, [class*="Hero"]');
    await expect(heroSection).toBeVisible();
    
    // Check booking functionality
    const bookingButtons = page.locator('[class*="book"], button:has-text("Book")');
    await expect(bookingButtons).toHaveCount(({ gte: 1 } as any));
    
    // Test booking modal
    await bookingButtons.first().click();
    await page.waitForSelector('[role="dialog"], [class*="modal"], [class*="Modal"]');
  });

  test('accommodation page', async ({ page }) => {
    await page.goto(`${BASE_URL}/accommodation`);
    await page.waitForSelector('main');
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Accommodation');
    
    // Check rooms/accommodation content
    const roomElements = page.locator('[class*="room"], [class*="Room"], [class*="accommodation"]');
    await expect(roomElements).toHaveCount(({ gte: 1 } as any));
    
    // Check for room details
    const roomInfo = page.locator('text=/bed|guest|bathroom|price|rate/i');
    await expect(roomInfo).toBeVisible();
  });

  test('gallery page', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForSelector('main');
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Gallery');
    
    // Check for gallery elements
    const mediaElements = page.locator('img, video, [class*="gallery"], [class*="Gallery"]');
    const mediaCount = await mediaElements.count();
    expect(mediaCount).toBeGreaterThanOrEqual(1);
    
    // Check if images are loading
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      await firstImage.waitFor({ state: 'visible' });
      
      const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
      expect(isLoaded).toBeTruthy();
    }
  });

  test('experiences page', async ({ page }) => {
    await page.goto(`${BASE_URL}/experiences`);
    await page.waitForSelector('main');
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Experiences');
    
    // Check for experiences content
    const experienceElements = page.locator('[class*="experience"], [class*="amenity"], [class*="activity"]');
    const expCount = await experienceElements.count();
    expect(expCount).toBeGreaterThanOrEqual(1);
    
    // Check for descriptive content
    const content = page.locator('text=/cruise|tour|wellness|spa|culture/i');
    await expect(content).toBeVisible();
  });

  test('contact page', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForSelector('main');
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Contact');
    
    // Check for contact form
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Check form fields
    const nameField = page.locator('input[name="name"], input[placeholder*="name" i]');
    const emailField = page.locator('input[name="email"], input[type="email"]');
    const messageField = page.locator('textarea[name="message"], textarea[placeholder*="message" i]');
    
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
    
    // Check contact information
    const contactInfo = page.locator('text=/phone|email|address|contact/i');
    await expect(contactInfo).toBeVisible();
  });

  test('404 page', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-existent-page`);
    
    // Check for 404 content
    const has404 = page.locator('text=/404|not found|page not found/i');
    await expect(has404).toBeVisible();
    
    // Check for back to home link
    const homeLink = page.locator('a[href="/"], a:has-text("home")');
    await expect(homeLink).toBeVisible();
  });

  test('navigation consistency across pages', async ({ page }) => {
    const pages = ['/', '/accommodation', '/gallery', '/experiences', '/contact'];
    
    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForSelector('nav');
      
      // Check navigation items exist
      const navItems = page.locator('nav a');
      const navCount = await navItems.count();
      expect(navCount).toBeGreaterThanOrEqual(3);
      
      // Check logo/brand exists
      const logo = page.locator('img[alt*="Ko Lake"], [class*="logo"], text=/Ko Lake/i');
      await expect(logo).toBeVisible();
    }
  });

  test('responsive design', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(BASE_URL);
      
      // Check if mobile menu exists on smaller screens
      if (viewport.width < 768) {
        const mobileMenuTrigger = page.locator('button:has([data-lucide="menu"]), button:has-text("Menu"), [class*="mobile"]');
        await expect(mobileMenuTrigger).toBeVisible();
      }
      
      // Check layout doesn't break
      const bodyOverflow = await page.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).overflowX;
      });
      
      expect(bodyOverflow).not.toBe('scroll');
    }
  });

  test('basic accessibility', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for alt attributes on images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
    
    // Check for heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThanOrEqual(1);
    
    // Check for semantic landmarks
    const landmarks = page.locator('main, nav, header, footer, [role="main"], [role="navigation"]');
    const landmarkCount = await landmarks.count();
    expect(landmarkCount).toBeGreaterThanOrEqual(2);
  });
});