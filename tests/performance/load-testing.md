# Load Testing Guide for Puffy Delights

## Overview

This guide outlines the load testing strategy for the Puffy Delights e-commerce application to ensure it can handle expected user loads and traffic spikes.

## Testing Objectives

### Primary Goals
- **Determine maximum user capacity** - How many concurrent users can the system handle?
- **Identify performance bottlenecks** - Where does the system slow down first?
- **Validate response times** - Are response times acceptable under load?
- **Test system stability** - Does the system remain stable under sustained load?

### Key Metrics to Monitor
- **Response Time**: Average, 95th percentile, 99th percentile
- **Throughput**: Requests per second (RPS)
- **Error Rate**: Percentage of failed requests
- **Resource Utilization**: CPU, Memory, Database connections
- **Database Performance**: Query response times, connection pool usage

---

## Load Testing Tools

### Recommended Tools

#### 1. Artillery.io (Recommended for Node.js/JavaScript teams)
```bash
npm install -g artillery
```

#### 2. Apache JMeter (GUI-based, comprehensive)
- Download from https://jmeter.apache.org/
- Good for complex scenarios and detailed reporting

#### 3. K6 (Developer-friendly, JavaScript-based)
```bash
# Install k6
curl https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.tar.gz -L | tar xvz --strip-components 1
```

#### 4. Lighthouse CI (For performance regression testing)
```bash
npm install -g @lhci/cli
```

---

## Test Scenarios

### Scenario 1: Normal User Browsing
**User Journey**: Homepage → Order Page → Browse Products → Add to Cart

```javascript
// Artillery configuration example
config:
  target: 'http://localhost:5173'
  phases:
    - duration: 60
      arrivalRate: 5
    - duration: 120
      arrivalRate: 10
    - duration: 60
      arrivalRate: 5
scenarios:
  - name: "Browse and Add to Cart"
    weight: 70
    flow:
      - get:
          url: "/"
      - get:
          url: "/order"
      - think: 5
      - post:
          url: "/api/cart"
          json:
            dessert_id: 1
            quantity: 2
```

### Scenario 2: Checkout Process
**User Journey**: Cart → Checkout Form → Order Submission

```javascript
scenarios:
  - name: "Complete Checkout"
    weight: 20
    flow:
      - get:
          url: "/checkout"
      - think: 30
      - post:
          url: "/api/orders"
          json:
            customer_info:
              name: "Test User"
              email: "test@example.com"
              phone: "+1234567890"
              address: "123 Test St"
            total_cents: 2999
            delivery_date: "2024-01-15"
```

### Scenario 3: Admin Operations
**User Journey**: Admin Login → View Orders → Update Status

```javascript
scenarios:
  - name: "Admin Tasks"
    weight: 10
    flow:
      - get:
          url: "/admin"
      - get:
          url: "/api/orders"
      - patch:
          url: "/api/orders/123"
          json:
            status: "confirmed"
```

---

## Load Testing Strategy

### Phase 1: Baseline Testing
**Objective**: Establish performance baseline with minimal load

- **Users**: 1-5 concurrent users
- **Duration**: 5-10 minutes
- **Goal**: Document baseline response times and throughput

```bash
# Artillery example
artillery quick --duration 300 --rate 2 http://localhost:5173
```

### Phase 2: Load Testing
**Objective**: Test system under normal expected load

- **Users**: 10-50 concurrent users
- **Duration**: 15-30 minutes
- **Goal**: Verify system performs well under normal conditions

```yaml
# load-test.yml
config:
  target: 'http://localhost:5173'
  phases:
    - duration: 300
      arrivalRate: 10
    - duration: 600
      arrivalRate: 25
    - duration: 300
      arrivalRate: 10
```

### Phase 3: Stress Testing
**Objective**: Find the breaking point

- **Users**: 50-200+ concurrent users
- **Duration**: 10-20 minutes
- **Goal**: Identify maximum capacity and failure modes

```yaml
# stress-test.yml
config:
  target: 'http://localhost:5173'
  phases:
    - duration: 300
      arrivalRate: 50
    - duration: 600
      arrivalRate: 100
    - duration: 300
      arrivalRate: 150
```

### Phase 4: Spike Testing
**Objective**: Test system behavior during traffic spikes

- **Users**: Sudden increase from 10 to 100+ users
- **Duration**: Short bursts (2-5 minutes)
- **Goal**: Verify system can handle sudden load increases

```yaml
# spike-test.yml
config:
  target: 'http://localhost:5173'
  phases:
    - duration: 120
      arrivalRate: 10
    - duration: 60
      arrivalRate: 100  # Sudden spike
    - duration: 120
      arrivalRate: 10
```

### Phase 5: Endurance Testing
**Objective**: Test system stability over time

- **Users**: 20-30 concurrent users
- **Duration**: 2-4 hours
- **Goal**: Identify memory leaks and degradation over time

---

## Performance Benchmarks

### Response Time Targets
- **Homepage**: < 2 seconds
- **Product/Order Page**: < 3 seconds
- **Search Results**: < 2 seconds
- **Add to Cart**: < 1 second
- **Checkout Submission**: < 5 seconds
- **Admin Operations**: < 3 seconds

### Throughput Targets
- **Normal Load**: 100+ requests/second
- **Peak Load**: 500+ requests/second
- **Database Queries**: < 100ms average

### Error Rate Targets
- **Normal Conditions**: < 0.1%
- **Under Load**: < 1%
- **During Spikes**: < 5%

---

## Test Scripts

### Artillery Load Test Script

```yaml
# puffy-delights-load-test.yml
config:
  target: 'http://localhost:5173'
  phases:
    # Warm-up phase
    - duration: 60
      arrivalRate: 2
      name: "Warm up"
    
    # Ramp-up phase
    - duration: 300
      arrivalRate: 5
      name: "Ramp up load"
    
    # Sustained load phase
    - duration: 600
      arrivalRate: 15
      name: "Sustained load"
    
    # Peak load phase
    - duration: 300
      arrivalRate: 25
      name: "Peak load"
    
    # Cool-down phase
    - duration: 120
      arrivalRate: 5
      name: "Cool down"

  processor: "./load-test-processor.js"
  
scenarios:
  - name: "User Browsing Journey"
    weight: 60
    flow:
      - get:
          url: "/"
          capture:
            - json: "$.title"
              as: "pageTitle"
      - think: 3
      - get:
          url: "/order"
      - think: 5
      - function: "addToCart"
      
  - name: "Checkout Journey"
    weight: 30
    flow:
      - get:
          url: "/checkout"
      - think: 15
      - function: "submitOrder"
      
  - name: "Admin Operations"
    weight: 10
    flow:
      - get:
          url: "/admin"
      - think: 5
      - function: "viewOrders"
```

### K6 Load Test Script

```javascript
// k6-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 10 },   // Stay at 10 users
    { duration: '2m', target: 20 },   // Ramp up to 20 users
    { duration: '5m', target: 20 },   // Stay at 20 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

const BASE_URL = 'http://localhost:5173';

export default function () {
  // Homepage
  let response = http.get(BASE_URL);
  check(response, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in reasonable time': (r) => r.timings.duration < 3000,
  });
  sleep(1);
  
  // Order page
  response = http.get(`${BASE_URL}/order`);
  check(response, {
    'order page status is 200': (r) => r.status === 200,
  });
  sleep(2);
  
  // Add to cart simulation
  const cartData = {
    dessert_id: Math.floor(Math.random() * 10) + 1,
    quantity: Math.floor(Math.random() * 3) + 1,
  };
  
  response = http.post(`${BASE_URL}/api/cart`, JSON.stringify(cartData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    'add to cart successful': (r) => r.status >= 200 && r.status < 300,
  });
  
  sleep(1);
}
```

---

## Monitoring During Load Tests

### Application Metrics
```bash
# Monitor application performance
top -p $(pgrep node)
htop
iostat -x 1
free -h
```

### Database Monitoring
```sql
-- PostgreSQL/Supabase monitoring queries
SELECT * FROM pg_stat_activity WHERE state = 'active';
SELECT * FROM pg_stat_database;
```

### Network Monitoring
```bash
# Monitor network traffic
netstat -i
ss -tuln
iftop
```

---

## Test Execution Commands

### Run Artillery Tests
```bash
# Basic load test
artillery run puffy-delights-load-test.yml

# Generate detailed report
artillery run --output test-results.json puffy-delights-load-test.yml
artillery report test-results.json

# Quick test
artillery quick --duration 60 --rate 10 http://localhost:5173
```

### Run K6 Tests
```bash
# Run k6 test
k6 run k6-load-test.js

# Run with custom options
k6 run --vus 20 --duration 300s k6-load-test.js

# Export results
k6 run --out json=test-results.json k6-load-test.js
```

### Run Lighthouse Performance Tests
```bash
# Single page audit
lighthouse http://localhost:5173 --output html --output-path report.html

# Multiple pages with custom config
lhci autorun --config=./tests/performance/lighthouse-config.js
```

---

## Post-Test Analysis

### Key Questions to Answer
1. **What was the maximum concurrent user load the system handled?**
2. **At what point did response times become unacceptable?**
3. **Were there any errors or failures during testing?**
4. **Which endpoints/pages performed worst under load?**
5. **What was the database performance like?**
6. **Did memory usage grow excessively over time?**

### Creating Reports
```bash
# Generate comprehensive report
artillery report test-results.json --output artillery-report.html

# Analyze K6 results
k6 run --out influxdb=http://localhost:8086/k6 script.js
```

### Performance Optimization Recommendations

#### Frontend Optimizations
- Enable gzip compression
- Optimize images (WebP format, lazy loading)
- Minimize and bundle CSS/JS
- Implement service worker for caching
- Use CDN for static assets

#### Backend Optimizations
- Database connection pooling
- Query optimization and indexing
- Implement caching (Redis)
- API rate limiting
- Load balancing

#### Infrastructure Optimizations
- Horizontal scaling (multiple app instances)
- Database read replicas
- Content Delivery Network (CDN)
- Auto-scaling based on metrics

---

## Continuous Performance Testing

### CI/CD Integration
```yaml
# GitHub Actions example
name: Performance Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start application
        run: npm run dev &
      
      - name: Wait for application
        run: npx wait-on http://localhost:5173
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
      
      - name: Run load tests
        run: |
          npm install -g artillery
          artillery run tests/performance/basic-load-test.yml
```

### Performance Monitoring Dashboard
Set up ongoing monitoring with tools like:
- **New Relic** - Application performance monitoring
- **DataDog** - Infrastructure and application monitoring
- **Grafana + Prometheus** - Open-source monitoring stack
- **Supabase Dashboard** - Database performance metrics

---

## Troubleshooting Common Issues

### Slow Response Times
1. Check database query performance
2. Review API endpoint efficiency
3. Analyze bundle sizes and loading
4. Check for memory leaks

### High Error Rates
1. Review application logs
2. Check database connection limits
3. Verify error handling
4. Monitor resource exhaustion

### Memory Issues
1. Check for JavaScript memory leaks
2. Monitor database connection pooling
3. Review caching strategies
4. Analyze garbage collection

### Database Performance
1. Analyze slow queries
2. Check index usage
3. Monitor connection pool
4. Review query patterns

---

This load testing guide provides a comprehensive framework for testing the Puffy Delights application under various load conditions. Regular load testing ensures the application can handle real-world traffic patterns and provides a great user experience even during peak usage.