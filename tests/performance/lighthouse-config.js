/**
 * Lighthouse Performance Testing Configuration
 * 
 * This configuration file defines performance testing parameters
 * for the Puffy Delights e-commerce application
 */

module.exports = {
  // Lighthouse CI configuration
  ci: {
    collect: {
      url: [
        'http://localhost:5173',          // Homepage
        'http://localhost:5173/order',    // Order page
        'http://localhost:5173/checkout', // Checkout page
        'http://localhost:5173/admin'     // Admin page
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless'
      }
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Network and loading
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 5000 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 3 }],
        'unused-javascript': ['warn', { maxLength: 3 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'offscreen-images': ['warn', { maxLength: 2 }],
        
        // Security and best practices
        'uses-https': ['error', { minScore: 1 }],
        'is-on-https': ['error', { minScore: 1 }],
        'redirects-http': ['warn', { minScore: 1 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  },
  
  // Custom Lighthouse configuration
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Safari/537.36 Chrome-Lighthouse'
  },
  
  // Custom audits for e-commerce specific metrics
  audits: [
    'first-contentful-paint',
    'largest-contentful-paint',
    'speed-index',
    'total-blocking-time',
    'cumulative-layout-shift',
    'interactive',
    'mainthread-work-breakdown',
    'bootup-time',
    'uses-rel-preload',
    'uses-rel-preconnect',
    'font-display',
    'unminified-css',
    'unminified-javascript',
    'unused-css-rules',
    'unused-javascript',
    'modern-image-formats',
    'uses-optimized-images',
    'uses-webp-images',
    'uses-text-compression',
    'uses-responsive-images',
    'efficient-animated-content',
    'preload-lcp-image',
    'total-byte-weight',
    'offscreen-images',
    'render-blocking-resources',
    'uses-passive-event-listeners',
    'no-document-write',
    'uses-http2',
    'uses-long-cache-ttl',
    'dom-size',
    'critical-request-chains',
    'user-timings',
    'resource-summary'
  ],
  
  // Categories with custom scoring
  categories: {
    performance: {
      title: 'Performance',
      auditRefs: [
        { id: 'first-contentful-paint', weight: 10 },
        { id: 'largest-contentful-paint', weight: 25 },
        { id: 'total-blocking-time', weight: 30 },
        { id: 'cumulative-layout-shift', weight: 25 },
        { id: 'speed-index', weight: 10 }
      ]
    }
  }
};

// Mobile configuration for mobile performance testing
module.exports.mobile = {
  ...module.exports,
  settings: {
    ...module.exports.settings,
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false
    },
    emulatedUserAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
  }
};