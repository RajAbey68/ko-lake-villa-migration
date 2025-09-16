import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('main navigation structure', async ({ page }) => {
    await page.waitForSelector('nav');
    
    // Define expected navigation items
    const expectedNavItems = [
      { text: 'Home', href: '/' },
      { text: 'Accommodation', href: '/accommodation' },
      { text: 'Gallery', href: '/gallery' },
      { text: 'Experiences', href: '/experiences' },
      { text: 'Contact', href: '/contact' }
    ];
    
    // Check each navigation item
    for (const item of expectedNavItems) {
      const navLink = page.locator(`nav a[href="${item.href}"]`);
      await expect(navLink).toBeVisible();
      
      const linkText = await navLink.textContent();
      expect(linkText?.toLowerCase()).toContain(item.text.toLowerCase());
    }
  });

  test('navigation functionality', async ({ page }) => {
    const navigationTests = [
      { linkText: 'Accommodation', expectedUrl: '/accommodation', expectedContent: /accommodation|room|bed/i },
      { linkText: 'Gallery', expectedUrl: '/gallery', expectedContent: /gallery|photo|image/i },
      { linkText: 'Experiences', expectedUrl: '/experiences', expectedContent: /experience|amenity|activity/i },
      { linkText: 'Contact', expectedUrl: '/contact', expectedContent: /contact|form|message/i }
    ];
    
    for (const navTest of navigationTests) {
      // Click navigation link
      await page.click(`nav a:has-text("${navTest.linkText}")`);
      
      // Wait for navigation
      await page.waitForURL(`**${navTest.expectedUrl}`);
      
      // Verify URL
      expect(page.url()).toContain(navTest.expectedUrl);
      
      // Verify page content
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(navTest.expectedContent);
    }
  });

  test('mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Look for mobile menu trigger
    const mobileMenuTrigger = page.locator('button:has([data-lucide="menu"]), button[aria-label*="menu"], [class*="mobile"] button');
    await expect(mobileMenuTrigger).toBeVisible();
    
    // Click mobile menu
    await mobileMenuTrigger.click();
    
    // Wait for mobile menu to open
    await page.waitForSelector('[role="dialog"], [class*="sheet"], [class*="mobile-menu"]');
    
    // Check mobile navigation items
    const mobileNavItems = page.locator('nav a, [role="dialog"] a, [class*="sheet"] a');
    const mobileNavCount = await mobileNavItems.count();
    expect(mobileNavCount).toBeGreaterThanOrEqual(4);
    
    // Test mobile navigation link
    await page.click('[role="dialog"] a:has-text("Gallery"), [class*="sheet"] a:has-text("Gallery")');
    await page.waitForURL('**/gallery');
  });

  test('navigation accessibility', async ({ page }) => {
    // Check for navigation landmarks
    const navLandmarks = page.locator('nav, [role="navigation"]');
    await expect(navLandmarks).toHaveCount(({ gte: 1 } as any));
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(focusedElement);
  });

  test('external links security', async ({ page }) => {
    // Look for external links
    const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"]):not([href*="127.0.0.1"])');
    const count = await externalLinks.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = externalLinks.nth(i);
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      
      // Check if external links open in new tab
      if (target) {
        expect(target).toBe('_blank');
      }
      
      // Check if external links have security attributes
      if (rel) {
        expect(rel).toMatch(/noopener|noreferrer/);
      }
    }
  });
});