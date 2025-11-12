# Puffy Delights - Testing Suite

This folder contains all testing resources for the Puffy Delights dessert e-commerce application.

## Test Structure

```
tests/
├── README.md                    # This file
├── manual/                      # Manual testing documentation
│   ├── qa-test-suite.md        # Comprehensive manual test cases
│   ├── test-checklist.md       # Quick testing checklist
│   └── bug-report-template.md  # Bug reporting template
├── automated/                   # Automated testing scripts
│   ├── browser-test-suite.js   # Browser console test runner
│   ├── e2e-tests.spec.js      # End-to-end test scenarios
│   └── unit-tests/             # Unit test files
├── performance/                 # Performance testing
│   ├── lighthouse-config.js    # Lighthouse testing config
│   └── load-testing.md        # Load testing guidelines
└── security/                   # Security testing
    ├── security-checklist.md  # Security testing checklist
    └── penetration-tests.md   # Penetration testing guide
```

## Quick Start

### 1. Manual Testing
```bash
# Review the comprehensive test suite
cat tests/manual/qa-test-suite.md

# Use the quick checklist for basic testing
cat tests/manual/test-checklist.md
```

### 2. Automated Browser Testing
```bash
# Open your browser, navigate to the app, and run in console:
# Copy the content from tests/automated/browser-test-suite.js
# Then execute:
const qa = new PuffyDelightsTestSuite();
qa.runAllTests();
```

### 3. Performance Testing
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run performance audit
lighthouse http://localhost:5173 --config-path=tests/performance/lighthouse-config.js
```

### 4. Security Testing
```bash
# Review security checklist
cat tests/security/security-checklist.md
```

## Test Categories

### Functional Tests
- ✅ Cart functionality (add, remove, update quantities)
- ✅ Checkout process (form validation, order placement)
- ✅ Admin panel (dessert management, order management, analytics)
- ✅ Navigation and routing
- ✅ Data persistence

### Non-Functional Tests
- ✅ Performance (load times, image optimization)
- ✅ Security (input validation, HTTPS, XSS prevention)
- ✅ Accessibility (WCAG compliance, screen readers)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Cross-browser compatibility

### Integration Tests
- ✅ Supabase database integration
- ✅ API endpoints functionality
- ✅ Context state management
- ✅ Component interactions

## Test Execution Schedule

### Pre-Release Testing
1. **Smoke Tests** - Basic functionality verification
2. **Regression Tests** - Ensure existing features still work
3. **New Feature Tests** - Test newly implemented features
4. **Performance Tests** - Check application performance
5. **Security Tests** - Verify security measures

### Post-Release Testing
1. **Production Smoke Tests** - Verify deployment success
2. **User Acceptance Testing** - Real user scenarios
3. **Monitoring** - Continuous performance monitoring

## Bug Reporting

Use the template in `tests/manual/bug-report-template.md` for consistent bug reporting.

## Contributing to Tests

1. **Adding New Test Cases**: Update `qa-test-suite.md`
2. **Automated Tests**: Add to appropriate files in `automated/`
3. **Performance Benchmarks**: Update `performance/` configs
4. **Security Tests**: Add to `security/` checklists

## Test Data Management

### Test Users
- Regular Customer: test@example.com
- Admin User: admin@example.com

### Test Orders
- Small order (< $50) - tests shipping calculation
- Large order (> $50) - tests free shipping
- Various order statuses for admin testing

### Test Products
- Featured desserts
- Out-of-stock items
- Different price ranges

## Continuous Integration

For future CI/CD integration:

```yaml
# Example GitHub Actions workflow
name: QA Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run automated tests
        run: npm run test
      - name: Performance audit
        run: lighthouse http://localhost:5173
```

## Test Metrics & KPIs

### Success Criteria
- **Pass Rate**: > 95% for critical tests
- **Performance**: Page load < 3 seconds
- **Accessibility**: WCAG AA compliance
- **Security**: No critical vulnerabilities
- **Cross-browser**: 100% functionality across major browsers

### Tracking
- Test execution time
- Bug discovery rate
- Fix verification time
- User satisfaction scores

## Contact

For questions about testing procedures or to report testing issues, please create an issue in the project repository with the label `testing`.