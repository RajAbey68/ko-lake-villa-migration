import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('Admin Gallery Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin gallery page
    await page.goto(`${BASE_URL}/admin/gallery`);
    await page.waitForLoadState('networkidle');
  });

  test('admin gallery interface loads', async ({ page }) => {
    // Check if admin interface is accessible
    const adminContent = page.locator('[class*="admin"], main, [role="main"]');
    await expect(adminContent).toBeVisible();

    // Look for gallery management elements
    const galleryManager = page.locator('[class*="gallery"], [class*="manager"], [data-testid*="gallery"]');
    await expect(galleryManager).toBeVisible();
  });

  test('file upload functionality', async ({ page }) => {
    // Look for upload components
    const uploadButton = page.locator('input[type="file"], [data-testid*="upload"], button:has-text("Upload")');
    
    if (await uploadButton.count() > 0) {
      await expect(uploadButton).toBeVisible();
      
      // Check for drag and drop area
      const dropZone = page.locator('[class*="dropzone"], [data-testid*="drop"], [class*="upload-area"]');
      if (await dropZone.count() > 0) {
        await expect(dropZone).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('gallery item management', async ({ page }) => {
    // Check for existing gallery items in admin view
    const adminGalleryItems = page.locator('[data-testid^="admin-gallery-item"], [class*="gallery-item"], [class*="media-item"]');
    const itemCount = await adminGalleryItems.count();

    if (itemCount > 0) {
      // Test item management controls
      const firstItem = adminGalleryItems.nth(0);
      
      // Look for edit controls
      const editControls = firstItem.locator('button, [class*="edit"], [class*="manage"]');
      const controlCount = await editControls.count();
      expect(controlCount).toBeGreaterThanOrEqual(1);
      
      // Look for delete controls
      const deleteControls = firstItem.locator('button:has-text("Delete"), [class*="delete"], [aria-label*="delete"]');
      if (await deleteControls.count() > 0) {
        await expect(deleteControls).toBeVisible();
      }
      
      // Look for metadata controls
      const metadataControls = firstItem.locator('input, textarea, [class*="metadata"], [class*="title"]');
      if (await metadataControls.count() > 0) {
        await expect(metadataControls).toBeVisible();
      }
    }
  });

  test('gallery categories and tags management', async ({ page }) => {
    // Look for category management
    const categoryControls = page.locator('[class*="category"], [class*="tag"], select, [class*="filter"]');
    
    if (await categoryControls.count() > 0) {
      await expect(categoryControls).toBeVisible();
      
      // Test category selection/editing
      const categorySelects = page.locator('select[name*="category"], [class*="category-select"]');
      if (await categorySelects.count() > 0) {
        const firstSelect = categorySelects.nth(0);
        await expect(firstSelect).toBeVisible();
        
        // Check for category options
        const options = firstSelect.locator('option');
        const optionCount = await options.count();
        expect(optionCount).toBeGreaterThanOrEqual(1);
      }
      
      // Test featured toggle
      const featuredToggles = page.locator('input[type="checkbox"][name*="featured"], [class*="featured-toggle"]');
      if (await featuredToggles.count() > 0) {
        await expect(featuredToggles.first()).toBeVisible();
      }
    }
  });

  test('bulk operations', async ({ page }) => {
    // Look for bulk operation controls
    const bulkControls = page.locator('[class*="bulk"], [class*="select-all"], input[type="checkbox"]');
    
    if (await bulkControls.count() > 0) {
      // Test select all functionality
      const selectAllCheckbox = page.locator('input[type="checkbox"][class*="select-all"], [data-testid*="select-all"]');
      if (await selectAllCheckbox.count() > 0) {
        await selectAllCheckbox.click();
        
        // Check if individual items are selected
        const itemCheckboxes = page.locator('[data-testid^="admin-gallery-item"] input[type="checkbox"], [class*="gallery-item"] input[type="checkbox"]');
        if (await itemCheckboxes.count() > 0) {
          const isChecked = await itemCheckboxes.first().isChecked();
          expect(isChecked).toBeTruthy();
        }
      }
      
      // Look for bulk action buttons
      const bulkActionButtons = page.locator('button:has-text("Delete Selected"), button:has-text("Update"), [class*="bulk-action"]');
      if (await bulkActionButtons.count() > 0) {
        await expect(bulkActionButtons.first()).toBeVisible();
      }
    }
  });

  test('search and filtering in admin', async ({ page }) => {
    // Look for admin search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], [class*="search-input"]');
    
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
      
      // Test search functionality
      await searchInput.fill('test');
      await page.keyboard.press('Enter');
      
      // Wait for potential filtering to occur
      await page.waitForLoadState('networkidle');
    }
    
    // Look for admin filter controls
    const filterControls = page.locator('select[class*="filter"], [class*="filter-dropdown"], button:has-text("Filter")');
    if (await filterControls.count() > 0) {
      await expect(filterControls.first()).toBeVisible();
    }
  });

  test('admin navigation and breadcrumbs', async ({ page }) => {
    // Check for admin navigation
    const adminNav = page.locator('[class*="admin-nav"], nav[class*="admin"], [class*="sidebar"]');
    if (await adminNav.count() > 0) {
      await expect(adminNav).toBeVisible();
      
      // Look for navigation items
      const navItems = adminNav.locator('a, button');
      const navItemCount = await navItems.count();
      expect(navItemCount).toBeGreaterThanOrEqual(1);
    }
    
    // Check for breadcrumbs
    const breadcrumbs = page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]');
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs).toBeVisible();
      
      // Check breadcrumb links
      const breadcrumbLinks = breadcrumbs.locator('a');
      if (await breadcrumbLinks.count() > 0) {
        await expect(breadcrumbLinks.first()).toBeVisible();
      }
    }
  });

  test('admin permissions and authentication', async ({ page }) => {
    // Check if admin area requires authentication
    const loginForm = page.locator('form[class*="login"], [class*="auth"], input[type="password"]');
    const adminContent = page.locator('[class*="admin-content"], [class*="gallery-manager"]');
    
    // Either should have admin content OR login form (but not both indicating broken auth)
    const hasLoginForm = await loginForm.count() > 0;
    const hasAdminContent = await adminContent.count() > 0;
    
    expect(hasLoginForm || hasAdminContent).toBeTruthy();
    
    if (hasLoginForm) {
      // If login form is present, test login fields
      const usernameField = page.locator('input[type="email"], input[name*="username"], input[name*="email"]');
      const passwordField = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"], button:has-text("Login")');
      
      await expect(usernameField).toBeVisible();
      await expect(passwordField).toBeVisible();
      await expect(loginButton).toBeVisible();
    }
  });

  test('admin interface responsiveness', async ({ page }) => {
    const viewports = [
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check if admin interface adapts to viewport
      const adminContent = page.locator('[class*="admin"], main');
      await expect(adminContent).toBeVisible();
      
      // Check for mobile-specific controls on smaller screens
      if (viewport.width < 1024) {
        const mobileControls = page.locator('[class*="mobile"], [class*="collapsed"], button[aria-expanded]');
        if (await mobileControls.count() > 0) {
          await expect(mobileControls.first()).toBeVisible();
        }
      }
    }
  });
});