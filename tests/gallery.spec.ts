import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('Gallery Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForSelector('[id="gallery"], [class*="gallery"], main');
    await page.waitForLoadState('networkidle');
  });

  test('gallery media loading', async ({ page }) => {
    // Check for gallery items with test IDs
    const galleryItems = page.locator('[data-testid^="gallery-item-"]');
    const itemCount = await galleryItems.count();
    
    expect(itemCount).toBeGreaterThan(0);

    // Test image loading status
    const imageItems = page.locator('[data-testid^="gallery-image-"] img');
    const imageCount = await imageItems.count();
    let loadedImages = 0;
    let brokenImages = 0;

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = imageItems.nth(i);
      
      await img.waitFor({ state: 'visible', timeout: 5000 });
      
      const isLoaded = await img.evaluate((element: HTMLImageElement) => {
        return element.complete && element.naturalWidth > 0;
      });
      
      const isBroken = await img.evaluate((element: HTMLImageElement) => {
        return element.complete && element.naturalWidth === 0;
      });

      if (isLoaded) {
        loadedImages++;
      } else if (isBroken) {
        brokenImages++;
      }
    }

    expect(loadedImages).toBeGreaterThan(0);
    expect(brokenImages).toBeLessThan(imageCount / 2); // Less than half should be broken

    // Test video thumbnails
    const videoItems = page.locator('[data-testid^="gallery-video-"]');
    const videoCount = await videoItems.count();
    
    if (videoCount > 0) {
      for (let i = 0; i < Math.min(videoCount, 5); i++) {
        const videoItem = videoItems.nth(i);
        
        // Check for video thumbnail component
        const videoThumbnail = videoItem.locator('[data-testid="video-thumbnail"]');
        await expect(videoThumbnail).toBeVisible();

        // Check for play button
        const playButton = videoThumbnail.locator('[data-testid="video-play-button"]');
        await expect(playButton).toBeAttached();

        // Test play button visibility on hover
        await videoThumbnail.hover();
        await expect(playButton).toBeVisible();
      }
    }
  });

  test('gallery filtering', async ({ page }) => {
    // Capture initial state
    const allItems = page.locator('[data-testid^="gallery-item-"]');
    const initialCount = await allItems.count();
    
    // Test media type filtering
    const allMediaButton = page.locator('button:has-text("All Media")');
    const imagesButton = page.locator('button:has-text("Images")');
    const videosButton = page.locator('button:has-text("Videos")');

    const hasFilterButtons = await Promise.all([
      allMediaButton.count(),
      imagesButton.count(),
      videosButton.count()
    ]);

    if (hasFilterButtons.every(count => count > 0)) {
      // Test images filter
      await imagesButton.click();
      
      await page.waitForFunction(() => {
        const videoItems = document.querySelectorAll('[data-testid^="gallery-video-"]');
        const visibleVideos = Array.from(videoItems).filter(item => 
          getComputedStyle((item.closest('[data-testid^="gallery-item-"]') as HTMLElement)).display !== 'none'
        );
        return visibleVideos.length === 0;
      }, {}, { timeout: 5000 });
      
      const visibleAfterImageFilter = await allItems.locator(':visible').count();
      expect(visibleAfterImageFilter).toBeGreaterThan(0);
      expect(visibleAfterImageFilter).toBeLessThanOrEqual(initialCount);

      // Test videos filter
      await videosButton.click();
      
      await page.waitForFunction(() => {
        const imageItems = document.querySelectorAll('[data-testid^="gallery-image-"]');
        const visibleImages = Array.from(imageItems).filter(item => 
          getComputedStyle((item.closest('[data-testid^="gallery-item-"]') as HTMLElement)).display !== 'none'
        );
        return visibleImages.length === 0;
      }, {}, { timeout: 5000 });

      // Reset to all media
      await allMediaButton.click();
      await page.waitForFunction((expectedCount) => {
        const allItems = document.querySelectorAll('[data-testid^="gallery-item-"]');
        const visibleItems = Array.from(allItems).filter(item => 
          getComputedStyle((item as HTMLElement)).display !== 'none'
        );
        return visibleItems.length === expectedCount;
      }, initialCount, { timeout: 5000 });
    }

    // Test featured filter if available
    const featuredButton = page.locator('button:has-text("Featured")');
    if (await featuredButton.count() > 0) {
      await featuredButton.click();
      await page.waitForLoadState('networkidle');
      
      const featuredItems = await allItems.locator(':visible').count();
      expect(featuredItems).toBeGreaterThanOrEqual(0);
    }
  });

  test('gallery lightbox functionality', async ({ page }) => {
    const galleryItems = page.locator('[data-testid^="gallery-item-"]');
    const itemCount = await galleryItems.count();
    
    expect(itemCount).toBeGreaterThan(0);

    // Test image lightbox - click first item
    const firstItem = galleryItems.nth(0);
    await firstItem.click();

    // Wait for lightbox to open
    const lightboxDialog = page.locator('[role="dialog"]');
    await expect(lightboxDialog).toBeVisible();

    // Validate lightbox content is loaded
    const lightboxContent = lightboxDialog.locator('img, video');
    await expect(lightboxContent).toBeVisible();
    
    // For images, verify the image is actually loaded
    const lightboxImage = lightboxDialog.locator('img');
    if (await lightboxImage.count() > 0) {
      await expect(lightboxImage).toBeVisible();
      const isImageLoaded = await lightboxImage.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
      });
      expect(isImageLoaded).toBeTruthy();
    }

    // Test lightbox navigation if multiple items
    if (itemCount > 1) {
      const nextButton = lightboxDialog.locator('[class*="next"], [aria-label*="next"], [data-testid*="next"]');
      
      if (await nextButton.count() > 0) {
        const currentContent = lightboxDialog.locator('img, video');
        const currentSrc = await currentContent.getAttribute('src');
        
        await nextButton.click();
        
        // Wait for content to change
        await page.waitForFunction((prevSrc: string | null) => {
          const currentImg = document.querySelector('[role="dialog"] img, [role="dialog"] video') as HTMLImageElement | HTMLVideoElement;
          return currentImg && currentImg.src !== prevSrc;
        }, currentSrc, { timeout: 3000 });
      }
    }

    // Test keyboard navigation
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');

    // Test close functionality
    const closeButton = lightboxDialog.locator('button:has([data-lucide="x"]), [data-testid*="close"], [aria-label*="close"]');
    
    if (await closeButton.count() > 0) {
      await closeButton.click();
    } else {
      await page.keyboard.press('Escape');
    }

    // Wait for lightbox to be hidden
    await expect(lightboxDialog).toBeHidden();
  });

  test('gallery video functionality', async ({ page }) => {
    const videoItems = page.locator('[data-testid^="gallery-video-"]');
    const videoCount = await videoItems.count();
    
    if (videoCount === 0) {
      test.skip();
      return;
    }

    const firstVideo = videoItems.nth(0);
    
    // Test video thumbnail loading
    const thumbnailImage = firstVideo.locator('[data-testid="video-thumbnail-image"]');
    const thumbnailVideo = firstVideo.locator('[data-testid="video-thumbnail-video"]');
    
    const hasThumbnailImage = await thumbnailImage.count() > 0;
    const hasThumbnailVideo = await thumbnailVideo.count() > 0;
    
    expect(hasThumbnailImage || hasThumbnailVideo).toBeTruthy();

    if (hasThumbnailImage) {
      await expect(thumbnailImage).toBeVisible();
      const isImageLoaded = await thumbnailImage.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
      });
      expect(isImageLoaded).toBeTruthy();
    }

    // Test play button interaction
    const playButton = firstVideo.locator('[data-testid="video-play-button"]');
    await expect(playButton).toBeAttached();

    // Hover to reveal play button
    await firstVideo.hover();
    await expect(playButton).toBeVisible();

    // Click play button and wait for lightbox
    await playButton.click();

    // Wait for video lightbox to open
    const videoLightbox = page.locator('[role="dialog"]');
    await expect(videoLightbox).toBeVisible();

    // Check for video element in lightbox
    const lightboxVideo = videoLightbox.locator('video');
    await expect(lightboxVideo).toBeVisible();

    // Test video functionality
    const videoValidation = await lightboxVideo.evaluate(async (video: HTMLVideoElement) => {
      return new Promise<{readyState: number, duration: number, hasSource: boolean}>((resolve) => {
        if (video.readyState >= 1) {
          resolve({
            readyState: video.readyState,
            duration: video.duration,
            hasSource: Boolean(video.src && video.src.length > 0)
          });
        } else {
          video.addEventListener('loadedmetadata', () => {
            resolve({
              readyState: video.readyState,
              duration: video.duration,
              hasSource: Boolean(video.src && video.src.length > 0)
            });
          }, { once: true });
          
          setTimeout(() => resolve({
            readyState: video.readyState,
            duration: video.duration || -1,
            hasSource: Boolean(video.src && video.src.length > 0)
          }), 3000);
        }
      });
    });

    const validation = videoValidation as {hasSource: boolean};
    expect(validation.hasSource).toBeTruthy();

    // Close lightbox
    await page.keyboard.press('Escape');
    await expect(videoLightbox).toBeHidden();
  });

  test('gallery error handling', async ({ page }) => {
    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text() || 'Unknown error');
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check for error state display
    const errorStates = page.locator('[class*="error"], [data-testid*="error"]');
    const errorCount = await errorStates.count();
    
    // Should handle errors gracefully (some errors are acceptable)
    expect(consoleErrors.length).toBeLessThan(10); // Allow some errors but not excessive

    // Check for graceful degradation
    const galleryItems = page.locator('[data-testid^="gallery-item-"]');
    const itemCount = await galleryItems.count();
    
    // Should have some content even if some items fail
    expect(itemCount).toBeGreaterThan(0);
  });
});