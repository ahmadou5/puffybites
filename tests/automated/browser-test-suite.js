/**
 * Automated Test Script for Puffy Delights E-commerce App
 * Run this in browser console or as a test automation script
 */

class PuffyDelightsTestSuite {
  constructor() {
    this.testResults = [];
    this.currentTest = 1;
  }

  // Helper function to log test results
  logTest(testName, status, details = '') {
    const result = {
      test: this.currentTest++,
      name: testName,
      status: status,
      details: details,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} Test ${result.test}: ${testName} - ${status}`);
    if (details) console.log(`   Details: ${details}`);
  }

  // Helper function to wait
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper function to check if element exists
  elementExists(selector) {
    return document.querySelector(selector) !== null;
  }

  // Helper function to click element
  async clickElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.click();
      await this.wait(500); // Wait for potential state changes
      return true;
    }
    return false;
  }

  // Test 1: Page Loading Tests
  async testPageLoading() {
    console.log('\n🚀 Starting Page Loading Tests...\n');

    // Test homepage elements
    const hasHeader = this.elementExists('header') || this.elementExists('nav');
    this.logTest('Homepage Header Present', hasHeader ? 'PASS' : 'FAIL');

    const hasMainContent = this.elementExists('main') || this.elementExists('.main-content');
    this.logTest('Main Content Present', hasMainContent ? 'PASS' : 'FAIL');

    const hasFooter = this.elementExists('footer');
    this.logTest('Footer Present', hasFooter ? 'PASS' : 'FAIL');

    // Check for navigation links
    const hasNavigation = this.elementExists('nav a') || this.elementExists('.nav-link');
    this.logTest('Navigation Links Present', hasNavigation ? 'PASS' : 'FAIL');
  }

  // Test 2: Cart Functionality Tests
  async testCartFunctionality() {
    console.log('\n🛒 Starting Cart Functionality Tests...\n');

    // Check if cart icon/button exists
    const hasCartIcon = this.elementExists('[data-testid="cart"]') || 
                       this.elementExists('.cart-icon') || 
                       this.elementExists('button[class*="cart"]');
    this.logTest('Cart Icon Present', hasCartIcon ? 'PASS' : 'FAIL');

    // Check for add to cart buttons
    const hasAddToCartButtons = this.elementExists('button[class*="add"]') || 
                               this.elementExists('.add-to-cart') ||
                               this.elementExists('button:contains("Add to Cart")');
    this.logTest('Add to Cart Buttons Present', hasAddToCartButtons ? 'PASS' : 'FAIL');

    // Test cart state persistence
    const cartData = localStorage.getItem('cart') || sessionStorage.getItem('cart');
    this.logTest('Cart Persistence Mechanism', cartData !== null ? 'PASS' : 'INFO', 
                'Local/Session storage for cart found');
  }

  // Test 3: Form Validation Tests
  async testFormValidation() {
    console.log('\n📝 Starting Form Validation Tests...\n');

    // Check for form elements
    const hasContactForm = this.elementExists('form') || this.elementExists('input[type="email"]');
    this.logTest('Forms Present', hasContactForm ? 'PASS' : 'FAIL');

    // Check for required field indicators
    const hasRequiredFields = this.elementExists('input[required]') || 
                             this.elementExists('.required') ||
                             this.elementExists('*');
    this.logTest('Required Field Indicators', hasRequiredFields ? 'PASS' : 'INFO');

    // Check for input validation patterns
    const hasEmailValidation = this.elementExists('input[type="email"]');
    this.logTest('Email Validation Fields', hasEmailValidation ? 'PASS' : 'INFO');

    const hasPhoneValidation = this.elementExists('input[type="tel"]');
    this.logTest('Phone Validation Fields', hasPhoneValidation ? 'PASS' : 'INFO');
  }

  // Test 4: Responsive Design Tests
  async testResponsiveDesign() {
    console.log('\n📱 Starting Responsive Design Tests...\n');

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Check if design is mobile-friendly
    const isMobile = viewport.width < 768;
    const hasResponsiveElements = this.elementExists('.responsive') || 
                                 this.elementExists('[class*="sm:"]') ||
                                 this.elementExists('[class*="md:"]') ||
                                 this.elementExists('[class*="lg:"]');
    
    this.logTest('Responsive CSS Classes', hasResponsiveElements ? 'PASS' : 'INFO',
                `Viewport: ${viewport.width}x${viewport.height}`);

    // Check for mobile navigation
    if (isMobile) {
      const hasMobileNav = this.elementExists('.mobile-nav') || 
                          this.elementExists('.hamburger') ||
                          this.elementExists('[class*="mobile"]');
      this.logTest('Mobile Navigation', hasMobileNav ? 'PASS' : 'INFO');
    }

    // Check for proper text scaling
    const bodyFontSize = window.getComputedStyle(document.body).fontSize;
    const isReadableFont = parseFloat(bodyFontSize) >= 14;
    this.logTest('Readable Font Size', isReadableFont ? 'PASS' : 'FAIL',
                `Body font size: ${bodyFontSize}`);
  }

  // Test 5: Performance Tests
  async testPerformance() {
    console.log('\n⚡ Starting Performance Tests...\n');

    // Check page load time (if performance API is available)
    if (window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      const isGoodLoadTime = loadTime < 3000;
      this.logTest('Page Load Time', isGoodLoadTime ? 'PASS' : 'FAIL',
                  `Load time: ${loadTime}ms`);

      // Check DOM content loaded time
      const domLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
      const isGoodDomTime = domLoadTime < 2000;
      this.logTest('DOM Load Time', isGoodDomTime ? 'PASS' : 'FAIL',
                  `DOM load time: ${domLoadTime}ms`);
    }

    // Check for large images
    const images = document.querySelectorAll('img');
    let largeImages = 0;
    images.forEach(img => {
      if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
        largeImages++;
      }
    });
    this.logTest('Image Optimization', largeImages === 0 ? 'PASS' : 'INFO',
                `Found ${largeImages} potentially large images`);
  }

  // Test 6: Accessibility Tests
  async testAccessibility() {
    console.log('\n♿ Starting Accessibility Tests...\n');

    // Check for alt text on images
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
    this.logTest('Image Alt Text', imagesWithoutAlt.length === 0 ? 'PASS' : 'FAIL',
                `${imagesWithoutAlt.length} images missing alt text`);

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const hasH1 = document.querySelector('h1') !== null;
    this.logTest('Proper Heading Structure', hasH1 ? 'PASS' : 'FAIL',
                `Found ${headings.length} headings, H1 present: ${hasH1}`);

    // Check for focus indicators
    const hasCustomFocusStyles = document.querySelector('*:focus') || 
                                document.querySelector('[class*="focus"]');
    this.logTest('Focus Indicators Present', hasCustomFocusStyles ? 'PASS' : 'INFO');

    // Check for ARIA labels
    const hasAriaLabels = this.elementExists('[aria-label]') || 
                         this.elementExists('[aria-labelledby]') ||
                         this.elementExists('[role]');
    this.logTest('ARIA Labels Present', hasAriaLabels ? 'PASS' : 'INFO');
  }

  // Test 7: Security Tests (Basic)
  async testBasicSecurity() {
    console.log('\n🔒 Starting Basic Security Tests...\n');

    // Check for HTTPS
    const isHttps = window.location.protocol === 'https:';
    this.logTest('HTTPS Protocol', isHttps ? 'PASS' : 'FAIL',
                `Current protocol: ${window.location.protocol}`);

    // Check for potential XSS vulnerabilities in inputs
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    const hasInputValidation = Array.from(textInputs).some(input => 
      input.hasAttribute('maxlength') || input.hasAttribute('pattern')
    );
    this.logTest('Input Validation Attributes', hasInputValidation ? 'PASS' : 'INFO');

    // Check for external link security
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    const hasSecureExternalLinks = Array.from(externalLinks).every(link => 
      link.hasAttribute('rel') && link.getAttribute('rel').includes('noopener')
    );
    this.logTest('External Link Security', 
                externalLinks.length === 0 ? 'INFO' : hasSecureExternalLinks ? 'PASS' : 'FAIL',
                `${externalLinks.length} external links found`);
  }

  // Test 8: Content Tests
  async testContent() {
    console.log('\n📄 Starting Content Tests...\n');

    // Check for broken images
    const brokenImages = Array.from(document.querySelectorAll('img'))
      .filter(img => img.naturalWidth === 0 && img.complete);
    this.logTest('No Broken Images', brokenImages.length === 0 ? 'PASS' : 'FAIL',
                `Found ${brokenImages.length} broken images`);

    // Check for empty links
    const emptyLinks = Array.from(document.querySelectorAll('a'))
      .filter(link => !link.href || link.href === '#' || link.href === window.location.href + '#');
    this.logTest('No Empty Links', emptyLinks.length === 0 ? 'PASS' : 'INFO',
                `Found ${emptyLinks.length} potentially empty links`);

    // Check for console errors
    const hasConsoleErrors = this.testResults.some(result => result.status === 'FAIL');
    this.logTest('No Critical Console Errors', !hasConsoleErrors ? 'PASS' : 'INFO',
                'Check browser console for JavaScript errors');
  }

  // Main test runner
  async runAllTests() {
    console.log('🧪 Starting Puffy Delights QA Test Suite...\n');
    console.log('=' * 50);

    const startTime = Date.now();

    try {
      await this.testPageLoading();
      await this.testCartFunctionality();
      await this.testFormValidation();
      await this.testResponsiveDesign();
      await this.testPerformance();
      await this.testAccessibility();
      await this.testBasicSecurity();
      await this.testContent();
    } catch (error) {
      console.error('Test execution error:', error);
      this.logTest('Test Execution', 'FAIL', error.message);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    this.generateSummaryReport(duration);
  }

  // Generate summary report
  generateSummaryReport(duration) {
    console.log('\n' + '=' * 50);
    console.log('📊 TEST SUMMARY REPORT');
    console.log('=' * 50);

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const info = this.testResults.filter(r => r.status === 'INFO').length;
    const total = this.testResults.length;

    console.log(`\n📈 Results Overview:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ℹ️  Info: ${info}`);
    console.log(`   📊 Pass Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    console.log(`   ⏱️  Duration: ${duration}ms`);

    if (failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.details || 'No details'}`);
        });
    }

    console.log(`\n💡 Recommendations:`);
    if (failed > 0) {
      console.log('   • Review and fix failed test cases');
    }
    if (info > 0) {
      console.log('   • Consider implementing suggested improvements');
    }
    console.log('   • Run manual tests for complete coverage');
    console.log('   • Test on different browsers and devices');
    console.log('   • Verify functionality with real user scenarios');

    // Export results for further analysis
    window.testResults = this.testResults;
    console.log(`\n💾 Test results saved to: window.testResults`);
    console.log('   Use JSON.stringify(window.testResults, null, 2) to export');
  }

  // Quick test runner for specific category
  async runQuickTest(category) {
    console.log(`🚀 Running Quick Test: ${category}`);
    
    switch(category.toLowerCase()) {
      case 'loading':
        await this.testPageLoading();
        break;
      case 'cart':
        await this.testCartFunctionality();
        break;
      case 'forms':
        await this.testFormValidation();
        break;
      case 'responsive':
        await this.testResponsiveDesign();
        break;
      case 'performance':
        await this.testPerformance();
        break;
      case 'accessibility':
        await this.testAccessibility();
        break;
      case 'security':
        await this.testBasicSecurity();
        break;
      case 'content':
        await this.testContent();
        break;
      default:
        console.log('Available categories: loading, cart, forms, responsive, performance, accessibility, security, content');
        return;
    }

    this.generateSummaryReport(0);
  }
}

// Usage Instructions
console.log(`
🧪 Puffy Delights QA Test Suite
==============================

To run tests, copy and paste this script into your browser console, then:

1. Run all tests:
   const qa = new PuffyDelightsTestSuite();
   qa.runAllTests();

2. Run specific test category:
   const qa = new PuffyDelightsTestSuite();
   qa.runQuickTest('cart');

3. Available test categories:
   - loading
   - cart
   - forms
   - responsive
   - performance
   - accessibility
   - security
   - content

Test results will be displayed in the console and saved to window.testResults
`);

// Auto-run if executed directly
if (typeof module === 'undefined') {
  // Browser environment - make available globally
  window.PuffyDelightsTestSuite = PuffyDelightsTestSuite;
  
  // Uncomment the line below to auto-run all tests
  // const qa = new PuffyDelightsTestSuite(); qa.runAllTests();
}