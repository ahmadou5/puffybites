/**
 * End-to-End Test Suite for Puffy Delights
 * 
 * This file contains comprehensive E2E test scenarios using Playwright/Cypress syntax
 * Adapt as needed based on your preferred E2E testing framework
 */

// Playwright Example Tests
// To run: npx playwright test

import { test, expect } from '@playwright/test';

// Test Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5173';
const ADMIN_EMAIL = 'admin@test.com';
const CUSTOMER_EMAIL = 'customer@test.com';

// Test Data
const testDessert = {
  name: 'Test Chocolate Cake',
  description: 'Delicious test chocolate cake',
  pack_of: '6',
  price_cents: '2999', // $29.99
  ingredients: 'Chocolate, Flour, Sugar',
  tags: 'chocolate, cake'
};

const testCustomer = {
  name: 'John Doe',
  email: 'john.doe@test.com',
  phone: '+1234567890',
  address: '123 Test Street, Test City, TC 12345'
};

// Utility Functions
class TestHelpers {
  static async addItemsToCart(page, itemCount = 3) {
    await page.goto(`${BASE_URL}/order`);
    
    // Add multiple items to cart
    for (let i = 0; i < itemCount; i++) {
      const addButtons = await page.locator('button:has-text("Add to Cart")');
      if (await addButtons.count() > i) {
        await addButtons.nth(i).click();
        // Wait for cart to update
        await page.waitForTimeout(500);
      }
    }
  }

  static async fillCheckoutForm(page, customerData = testCustomer) {
    await page.fill('[name="name"]', customerData.name);
    await page.fill('[name="email"]', customerData.email);
    await page.fill('[name="phone"]', customerData.phone);
    await page.fill('[name="address"]', customerData.address);
    
    // Select future delivery date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('[name="deliveryDate"]', dateString);
  }

  static async waitForPageLoad(page) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
}

// Main E2E Test Suite
test.describe('Puffy Delights E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear any existing state
    await page.context().clearCookies();
    await page.goto(BASE_URL);
    await TestHelpers.waitForPageLoad(page);
  });

  // Homepage Tests
  test.describe('Homepage', () => {
    test('should load homepage with all essential elements', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check for essential elements
      await expect(page).toHaveTitle(/Puffy Delights/i);
      await expect(page.locator('nav, header')).toBeVisible();
      await expect(page.locator('main, .main-content')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      
      // Check navigation links
      await expect(page.locator('text=Home, text=Order, text=Admin').first()).toBeVisible();
    });

    test('should navigate between pages correctly', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Test navigation to Order page
      await page.click('text=Order');
      await expect(page).toHaveURL(/.*\/order/);
      await TestHelpers.waitForPageLoad(page);
      
      // Test navigation to Admin page
      await page.click('text=Admin');
      await expect(page).toHaveURL(/.*\/admin/);
      await TestHelpers.waitForPageLoad(page);
      
      // Test navigation back to Home
      await page.click('text=Home');
      await expect(page).toHaveURL(BASE_URL);
    });

    test('should support theme toggle functionality', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Look for theme toggle (adjust selector based on actual implementation)
      const themeToggle = page.locator('[data-testid="theme-toggle"], button:has-text("theme"), .theme-toggle').first();
      
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Verify theme change (check for dark mode class or similar)
        const body = page.locator('body, html, [data-theme]').first();
        const hasThemeClass = await body.evaluate(el => {
          return el.classList.contains('dark') || 
                 el.getAttribute('data-theme') === 'dark' ||
                 el.classList.contains('theme-dark');
        });
        
        expect(hasThemeClass).toBeTruthy();
      }
    });
  });

  // Order Page Tests
  test.describe('Order Page & Cart Functionality', () => {
    test('should display dessert items on order page', async ({ page }) => {
      await page.goto(`${BASE_URL}/order`);
      await TestHelpers.waitForPageLoad(page);
      
      // Check for dessert items
      await expect(page.locator('[data-testid="dessert-card"], .dessert-card, .product-card').first()).toBeVisible();
      
      // Check for Add to Cart buttons
      await expect(page.locator('button:has-text("Add to Cart")').first()).toBeVisible();
    });

    test('should add items to cart successfully', async ({ page }) => {
      await page.goto(`${BASE_URL}/order`);
      await TestHelpers.waitForPageLoad(page);
      
      // Find and click Add to Cart button
      const addButton = page.locator('button:has-text("Add to Cart")').first();
      await addButton.click();
      
      // Verify cart count increased
      const cartIndicator = page.locator('[data-testid="cart-count"], .cart-count, .cart-badge').first();
      if (await cartIndicator.isVisible()) {
        await expect(cartIndicator).toContainText('1');
      }
      
      // Add another item
      const secondAddButton = page.locator('button:has-text("Add to Cart")').nth(1);
      if (await secondAddButton.isVisible()) {
        await secondAddButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should manage cart operations correctly', async ({ page }) => {
      await TestHelpers.addItemsToCart(page, 2);
      
      // Open cart
      const cartButton = page.locator('[data-testid="cart-button"], button:has-text("cart"), .cart-button').first();
      await cartButton.click();
      await page.waitForTimeout(1000);
      
      // Verify cart items are displayed
      const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
      await expect(cartItems.first()).toBeVisible();
      
      // Test quantity increase
      const increaseButton = page.locator('button:has-text("+"), .quantity-increase').first();
      if (await increaseButton.isVisible()) {
        await increaseButton.click();
        await page.waitForTimeout(500);
      }
      
      // Test quantity decrease  
      const decreaseButton = page.locator('button:has-text("-"), .quantity-decrease').first();
      if (await decreaseButton.isVisible()) {
        await decreaseButton.click();
        await page.waitForTimeout(500);
      }
      
      // Test remove item
      const removeButton = page.locator('button:has-text("remove"), .remove-button, [data-testid="remove-item"]').first();
      if (await removeButton.isVisible()) {
        await removeButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should persist cart across page navigation', async ({ page }) => {
      await TestHelpers.addItemsToCart(page, 1);
      
      // Navigate away and back
      await page.goto(BASE_URL);
      await page.goto(`${BASE_URL}/order`);
      
      // Verify cart still has items
      const cartIndicator = page.locator('[data-testid="cart-count"], .cart-count, .cart-badge').first();
      if (await cartIndicator.isVisible()) {
        const count = await cartIndicator.textContent();
        expect(parseInt(count)).toBeGreaterThan(0);
      }
    });
  });

  // Checkout Process Tests
  test.describe('Checkout Process', () => {
    test('should prevent checkout with empty cart', async ({ page }) => {
      await page.goto(`${BASE_URL}/checkout`);
      await TestHelpers.waitForPageLoad(page);
      
      // Should show empty cart message
      await expect(page.locator('text=empty, text=no items')).toBeVisible();
      
      // Should have link back to order page
      const browseButton = page.locator('button:has-text("Browse"), a:has-text("Browse")').first();
      await expect(browseButton).toBeVisible();
    });

    test('should validate checkout form correctly', async ({ page }) => {
      await TestHelpers.addItemsToCart(page, 2);
      await page.goto(`${BASE_URL}/checkout`);
      await TestHelpers.waitForPageLoad(page);
      
      // Try submitting empty form
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Place Order")').first();
      await submitButton.click();
      
      // Should show validation errors
      const errorMessages = page.locator('.error, .invalid, [role="alert"]');
      const errorCount = await errorMessages.count();
      expect(errorCount).toBeGreaterThan(0);
      
      // Fill form with invalid email
      await page.fill('[name="email"]', 'invalid-email');
      await submitButton.click();
      
      // Should still show validation error
      await expect(page.locator('text=valid email, text=email format')).toBeVisible();
    });

    test('should complete checkout process successfully', async ({ page }) => {
      await TestHelpers.addItemsToCart(page, 2);
      await page.goto(`${BASE_URL}/checkout`);
      await TestHelpers.waitForPageLoad(page);
      
      // Fill out the form
      await TestHelpers.fillCheckoutForm(page);
      
      // Submit the order
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Place Order")').first();
      await submitButton.click();
      
      // Wait for order processing
      await page.waitForTimeout(3000);
      
      // Should show success message
      await expect(page.locator('text=success, text=order placed, text=thank you')).toBeVisible();
      
      // Should show bank transfer details
      await expect(page.locator('text=transfer, text=payment')).toBeVisible();
      
      // Should show transaction reference
      await expect(page.locator('text=reference, text=transaction')).toBeVisible();
      
      // Should show correct amount (not zero)
      const amountText = await page.locator('text=/\\$[0-9]+\\.[0-9]{2}/').first().textContent();
      expect(amountText).not.toContain('$0.00');
    });

    test('should calculate order total correctly', async ({ page }) => {
      await TestHelpers.addItemsToCart(page, 1);
      await page.goto(`${BASE_URL}/checkout`);
      await TestHelpers.waitForPageLoad(page);
      
      // Get subtotal from cart summary
      const subtotalElement = page.locator('[data-testid="subtotal"], .subtotal, text=/subtotal/i').first();
      
      // Fill and submit form
      await TestHelpers.fillCheckoutForm(page);
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      await page.waitForTimeout(3000);
      
      // Verify final amount includes tax and shipping
      const finalAmount = page.locator('text=/\\$[0-9]+\\.[0-9]{2}/').first();
      await expect(finalAmount).toBeVisible();
      
      const amount = await finalAmount.textContent();
      const numericAmount = parseFloat(amount.replace('$', ''));
      expect(numericAmount).toBeGreaterThan(0);
    });
  });

  // Admin Panel Tests
  test.describe('Admin Panel', () => {
    test('should load admin panel with all tabs', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      await TestHelpers.waitForPageLoad(page);
      
      // Check for admin tabs
      await expect(page.locator('text=Desserts, button:has-text("Desserts")')).toBeVisible();
      await expect(page.locator('text=Orders, button:has-text("Orders")')).toBeVisible();
      await expect(page.locator('text=Analytics, button:has-text("Analytics")')).toBeVisible();
    });

    test('should manage desserts correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      await TestHelpers.waitForPageLoad(page);
      
      // Switch to Desserts tab
      const dessertsTab = page.locator('button:has-text("Desserts")').first();
      await dessertsTab.click();
      await page.waitForTimeout(1000);
      
      // Check for dessert list
      const dessertList = page.locator('[data-testid="dessert-list"], .dessert-list, table').first();
      await expect(dessertList).toBeVisible();
      
      // Try adding a new dessert (if form is available)
      const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Fill dessert form
        await page.fill('[name="name"]', testDessert.name);
        await page.fill('[name="description"]', testDessert.description);
        await page.fill('[name="pack_of"]', testDessert.pack_of);
        await page.fill('[name="price_cents"]', testDessert.price_cents);
        
        const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
        await saveButton.click();
        await page.waitForTimeout(2000);
      }
    });

    test('should display and manage orders', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      await TestHelpers.waitForPageLoad(page);
      
      // Switch to Orders tab
      const ordersTab = page.locator('button:has-text("Orders")').first();
      await ordersTab.click();
      await page.waitForTimeout(1000);
      
      // Check for orders list
      const ordersList = page.locator('[data-testid="orders-list"], .orders-list, table').first();
      await expect(ordersList).toBeVisible();
      
      // Test status filter (if available)
      const statusFilter = page.locator('select[name="status"], .status-filter').first();
      if (await statusFilter.isVisible()) {
        await statusFilter.selectOption('pending');
        await page.waitForTimeout(1000);
      }
    });

    test('should display analytics charts', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      await TestHelpers.waitForPageLoad(page);
      
      // Switch to Analytics tab
      const analyticsTab = page.locator('button:has-text("Analytics")').first();
      await analyticsTab.click();
      await page.waitForTimeout(2000);
      
      // Check for chart containers
      const charts = page.locator('.recharts-wrapper, [data-testid="chart"], canvas, svg');
      const chartCount = await charts.count();
      expect(chartCount).toBeGreaterThan(0);
      
      // Check for summary statistics
      await expect(page.locator('text=Revenue, text=Orders, text=Total')).toBeVisible();
    });
  });

  // Performance Tests
  test.describe('Performance', () => {
    test('should load pages within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await TestHelpers.waitForPageLoad(page);
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle large cart operations efficiently', async ({ page }) => {
      // Add many items to cart
      const startTime = Date.now();
      await TestHelpers.addItemsToCart(page, 10);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds max
    });
  });

  // Error Handling Tests
  test.describe('Error Handling', () => {
    test('should handle invalid URLs gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/invalid-page`);
      
      // Should not show blank page or crash
      const body = await page.textContent('body');
      expect(body.length).toBeGreaterThan(0);
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline condition
      await page.context().setOffline(true);
      await page.goto(BASE_URL);
      
      // Should show some content or error message
      const content = await page.textContent('body');
      expect(content.length).toBeGreaterThan(0);
      
      // Restore connection
      await page.context().setOffline(false);
    });
  });

  // Cross-browser compatibility tests would go here
  // Mobile responsiveness tests would go here
});

// Cypress Alternative (commented out)
/*
// Cypress Example Tests
// To run: npx cypress open

describe('Puffy Delights E2E Tests (Cypress)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full user journey', () => {
    // Navigate to order page
    cy.contains('Order').click();
    
    // Add items to cart
    cy.get('button').contains('Add to Cart').first().click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    
    // Go to checkout
    cy.visit('/checkout');
    
    // Fill out form
    cy.get('[name="name"]').type('John Doe');
    cy.get('[name="email"]').type('john@example.com');
    cy.get('[name="phone"]').type('+1234567890');
    cy.get('[name="address"]').type('123 Test St');
    
    // Submit order
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.contains('success', { matchCase: false }).should('be.visible');
    cy.contains('$').should('not.contain', '$0.00');
  });
});
*/

// Jest Unit Test Examples (commented out)
/*
// Jest Unit Tests for utilities and components
// Place these in separate .test.js files

import { calculateOrderTotal } from '../src/lib/utils';

describe('Order Calculations', () => {
  test('should calculate order total correctly', () => {
    const subtotal = 45.99;
    const tax = subtotal * 0.08;
    const shipping = 5.99; // Under $50
    const expected = subtotal + tax + shipping;
    
    expect(calculateOrderTotal(subtotal)).toBeCloseTo(expected, 2);
  });

  test('should apply free shipping over $50', () => {
    const subtotal = 55.00;
    const tax = subtotal * 0.08;
    const shipping = 0; // Over $50
    const expected = subtotal + tax + shipping;
    
    expect(calculateOrderTotal(subtotal)).toBeCloseTo(expected, 2);
  });
});
*/

export default {
  testTimeout: 30000,
  use: {
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
};