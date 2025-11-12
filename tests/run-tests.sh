#!/bin/bash

# Puffy Delights - Comprehensive Test Runner Script
# This script executes various types of tests for the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_URL="${APP_URL:-http://localhost:5173}"
TEST_TIMEOUT="${TEST_TIMEOUT:-30}"
REPORTS_DIR="tests/reports"
DATE=$(date +%Y%m%d_%H%M%S)

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] ${message}${NC}"
}

# Function to check if application is running
check_app_status() {
    print_status $BLUE "Checking if application is running at $APP_URL..."
    
    if curl -s "$APP_URL" >/dev/null; then
        print_status $GREEN "✅ Application is running"
        return 0
    else
        print_status $RED "❌ Application is not running at $APP_URL"
        return 1
    fi
}

# Function to start application if not running
start_app() {
    print_status $YELLOW "Starting application..."
    npm run dev &
    APP_PID=$!
    
    # Wait for app to start
    sleep 10
    
    # Check if app started successfully
    if check_app_status; then
        print_status $GREEN "✅ Application started successfully (PID: $APP_PID)"
        return 0
    else
        print_status $RED "❌ Failed to start application"
        return 1
    fi
}

# Function to run manual test checklist validation
run_manual_tests() {
    print_status $BLUE "Running manual test checklist validation..."
    
    # Check if manual test files exist and are properly structured
    if [ -f "tests/manual/qa-test-suite.md" ] && [ -f "tests/manual/test-checklist.md" ]; then
        print_status $GREEN "✅ Manual test documentation is available"
        print_status $YELLOW "📋 Please review tests/manual/test-checklist.md for manual testing"
        
        # Count test cases
        local test_count=$(grep -c "Test Case" tests/manual/qa-test-suite.md || echo "0")
        print_status $BLUE "📊 Found $test_count manual test cases"
    else
        print_status $RED "❌ Manual test documentation is missing"
        return 1
    fi
}

# Function to run automated browser tests
run_browser_tests() {
    print_status $BLUE "Running automated browser tests..."
    
    # Check if Node.js application is accessible
    if ! check_app_status; then
        print_status $RED "❌ Cannot run browser tests - application not accessible"
        return 1
    fi
    
    # Create a test report
    local report_file="$REPORTS_DIR/browser-tests-$DATE.html"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Browser Tests Report - $DATE</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f4f4f4; padding: 15px; border-radius: 5px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .pass { color: green; } .fail { color: red; } .info { color: blue; }
        .instructions { background: #e7f3ff; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Puffy Delights - Browser Tests Report</h1>
        <p>Generated: $DATE</p>
        <p>Application URL: $APP_URL</p>
    </div>
    
    <div class="instructions">
        <h2>How to Run Browser Tests</h2>
        <ol>
            <li>Open your browser and navigate to <strong>$APP_URL</strong></li>
            <li>Open Developer Tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Copy and paste the content from <code>tests/automated/browser-test-suite.js</code></li>
            <li>Run: <code>const qa = new PuffyDelightsTestSuite(); qa.runAllTests();</code></li>
            <li>Review the test results in the console</li>
        </ol>
    </div>
    
    <div class="test-section">
        <h3>Quick Browser Test Commands</h3>
        <pre>
// Run all tests
const qa = new PuffyDelightsTestSuite();
qa.runAllTests();

// Run specific test categories
qa.runQuickTest('cart');
qa.runQuickTest('performance');
qa.runQuickTest('accessibility');
        </pre>
    </div>
</body>
</html>
EOF
    
    print_status $GREEN "✅ Browser test instructions generated: $report_file"
    print_status $YELLOW "📋 Open the report file for detailed browser testing instructions"
}

# Function to run performance tests
run_performance_tests() {
    print_status $BLUE "Running performance tests..."
    
    # Check if Lighthouse is installed
    if command -v lighthouse >/dev/null 2>&1; then
        local report_file="$REPORTS_DIR/lighthouse-$DATE.html"
        
        print_status $BLUE "Running Lighthouse audit..."
        lighthouse "$APP_URL" \
            --output=html \
            --output-path="$report_file" \
            --chrome-flags="--headless --no-sandbox" \
            --quiet || true
        
        if [ -f "$report_file" ]; then
            print_status $GREEN "✅ Lighthouse report generated: $report_file"
        else
            print_status $YELLOW "⚠️  Lighthouse report generation failed, but continuing..."
        fi
    else
        print_status $YELLOW "⚠️  Lighthouse not installed. Install with: npm install -g lighthouse"
    fi
    
    # Basic performance check using curl
    print_status $BLUE "Running basic performance checks..."
    
    local perf_report="$REPORTS_DIR/performance-$DATE.txt"
    
    echo "Performance Test Results - $DATE" > "$perf_report"
    echo "========================================" >> "$perf_report"
    echo "" >> "$perf_report"
    
    for endpoint in "/" "/order" "/admin"; do
        print_status $BLUE "Testing performance of $endpoint..."
        
        local response_time=$(curl -w "%{time_total}" -s -o /dev/null "$APP_URL$endpoint" || echo "ERROR")
        
        echo "Endpoint: $endpoint" >> "$perf_report"
        echo "Response Time: ${response_time}s" >> "$perf_report"
        echo "Status: $([ "$response_time" != "ERROR" ] && echo "SUCCESS" || echo "FAILED")" >> "$perf_report"
        echo "" >> "$perf_report"
        
        if [ "$response_time" != "ERROR" ]; then
            if (( $(echo "$response_time < 3.0" | bc -l 2>/dev/null || echo "0") )); then
                print_status $GREEN "✅ $endpoint: ${response_time}s (Good)"
            else
                print_status $YELLOW "⚠️  $endpoint: ${response_time}s (Slow)"
            fi
        else
            print_status $RED "❌ $endpoint: Failed to load"
        fi
    done
    
    print_status $GREEN "✅ Performance test results saved: $perf_report"
}

# Function to run security tests
run_security_tests() {
    print_status $BLUE "Running security tests..."
    
    local security_report="$REPORTS_DIR/security-$DATE.txt"
    
    echo "Security Test Results - $DATE" > "$security_report"
    echo "==============================" >> "$security_report"
    echo "" >> "$security_report"
    
    # Test HTTPS (if applicable)
    if [[ "$APP_URL" == https* ]]; then
        print_status $BLUE "Testing HTTPS configuration..."
        
        local ssl_check=$(curl -I -s "$APP_URL" | grep -i "strict-transport-security" || echo "NOT_FOUND")
        
        if [ "$ssl_check" != "NOT_FOUND" ]; then
            print_status $GREEN "✅ HSTS header found"
            echo "HTTPS: HSTS header present ✅" >> "$security_report"
        else
            print_status $YELLOW "⚠️  HSTS header not found"
            echo "HTTPS: HSTS header missing ⚠️" >> "$security_report"
        fi
    else
        print_status $YELLOW "⚠️  Application not using HTTPS"
        echo "HTTPS: Not enabled ⚠️" >> "$security_report"
    fi
    
    # Test security headers
    print_status $BLUE "Checking security headers..."
    
    local headers=$(curl -I -s "$APP_URL" || echo "ERROR")
    
    declare -A security_headers=(
        ["X-Content-Type-Options"]="nosniff"
        ["X-Frame-Options"]="DENY"
        ["X-XSS-Protection"]="1"
    )
    
    for header in "${!security_headers[@]}"; do
        if echo "$headers" | grep -qi "$header"; then
            print_status $GREEN "✅ $header header found"
            echo "$header: Present ✅" >> "$security_report"
        else
            print_status $YELLOW "⚠️  $header header missing"
            echo "$header: Missing ⚠️" >> "$security_report"
        fi
    done
    
    # Basic endpoint security check
    print_status $BLUE "Testing endpoint security..."
    
    local admin_status=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/admin" || echo "ERROR")
    
    if [ "$admin_status" = "401" ] || [ "$admin_status" = "403" ]; then
        print_status $GREEN "✅ Admin endpoint properly protected"
        echo "Admin Protection: Properly secured ✅" >> "$security_report"
    elif [ "$admin_status" = "200" ]; then
        print_status $RED "❌ Admin endpoint accessible without authentication"
        echo "Admin Protection: Not secured ❌" >> "$security_report"
    else
        print_status $YELLOW "⚠️  Admin endpoint status unclear: $admin_status"
        echo "Admin Protection: Status unclear ($admin_status) ⚠️" >> "$security_report"
    fi
    
    print_status $GREEN "✅ Security test results saved: $security_report"
    print_status $YELLOW "📋 Review tests/security/security-checklist.md for comprehensive security testing"
}

# Function to validate test environment
validate_environment() {
    print_status $BLUE "Validating test environment..."
    
    # Check required tools
    local tools=("curl" "node" "npm")
    local missing_tools=()
    
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_tools+=("$tool")
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_status $RED "❌ Missing required tools: ${missing_tools[*]}"
        return 1
    fi
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_status $RED "❌ package.json not found. Run from project root directory."
        return 1
    fi
    
    # Check if test directories exist
    if [ ! -d "tests" ]; then
        print_status $RED "❌ Tests directory not found"
        return 1
    fi
    
    print_status $GREEN "✅ Environment validation passed"
}

# Function to generate comprehensive test report
generate_test_report() {
    print_status $BLUE "Generating comprehensive test report..."
    
    local main_report="$REPORTS_DIR/test-summary-$DATE.html"
    
    cat > "$main_report" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Puffy Delights Test Summary - $DATE</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
        .card h3 { margin-top: 0; color: #007bff; }
        .section { margin: 20px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-pass { color: #28a745; font-weight: bold; }
        .status-fail { color: #dc3545; font-weight: bold; }
        .status-warn { color: #ffc107; font-weight: bold; }
        .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .footer { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Puffy Delights - Test Summary Report</h1>
        <p>Generated: $DATE</p>
        <p>Application: $APP_URL</p>
    </div>
    
    <div class="summary">
        <div class="card">
            <h3>📋 Manual Tests</h3>
            <p>Comprehensive manual test cases available</p>
            <p>Location: <code>tests/manual/</code></p>
        </div>
        
        <div class="card">
            <h3>🤖 Automated Tests</h3>
            <p>Browser automation scripts ready</p>
            <p>Location: <code>tests/automated/</code></p>
        </div>
        
        <div class="card">
            <h3>⚡ Performance Tests</h3>
            <p>Performance monitoring and benchmarks</p>
            <p>Location: <code>tests/performance/</code></p>
        </div>
        
        <div class="card">
            <h3>🔒 Security Tests</h3>
            <p>Security checklists and penetration testing</p>
            <p>Location: <code>tests/security/</code></p>
        </div>
    </div>
    
    <div class="section">
        <h2>📊 Test Execution Summary</h2>
        <div class="test-grid">
            <div>
                <h4>Environment Validation</h4>
                <p class="status-pass">✅ PASSED</p>
                <p>All required tools and dependencies available</p>
            </div>
            
            <div>
                <h4>Application Status</h4>
                <p class="status-pass">✅ RUNNING</p>
                <p>Application accessible at $APP_URL</p>
            </div>
            
            <div>
                <h4>Test Documentation</h4>
                <p class="status-pass">✅ COMPLETE</p>
                <p>All test documentation generated</p>
            </div>
            
            <div>
                <h4>Reports Generated</h4>
                <p class="status-pass">✅ SUCCESS</p>
                <p>Test reports available in tests/reports/</p>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>📂 Available Test Resources</h2>
        
        <h3>Manual Testing</h3>
        <ul>
            <li><strong>QA Test Suite</strong>: tests/manual/qa-test-suite.md</li>
            <li><strong>Quick Checklist</strong>: tests/manual/test-checklist.md</li>
            <li><strong>Bug Report Template</strong>: tests/manual/bug-report-template.md</li>
        </ul>
        
        <h3>Automated Testing</h3>
        <ul>
            <li><strong>Browser Test Suite</strong>: tests/automated/browser-test-suite.js</li>
            <li><strong>E2E Tests</strong>: tests/automated/e2e-tests.spec.js</li>
        </ul>
        
        <h3>Performance Testing</h3>
        <ul>
            <li><strong>Lighthouse Config</strong>: tests/performance/lighthouse-config.js</li>
            <li><strong>Load Testing Guide</strong>: tests/performance/load-testing.md</li>
        </ul>
        
        <h3>Security Testing</h3>
        <ul>
            <li><strong>Security Checklist</strong>: tests/security/security-checklist.md</li>
            <li><strong>Penetration Tests</strong>: tests/security/penetration-tests.md</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>🚀 Next Steps</h2>
        <ol>
            <li><strong>Manual Testing</strong>: Follow the checklist in tests/manual/test-checklist.md</li>
            <li><strong>Browser Tests</strong>: Run the automated browser test suite</li>
            <li><strong>Performance Testing</strong>: Execute Lighthouse and load tests</li>
            <li><strong>Security Testing</strong>: Complete security checklist and penetration tests</li>
            <li><strong>Bug Reports</strong>: Use the bug report template for any issues found</li>
            <li><strong>Documentation</strong>: Update test results and maintain test documentation</li>
        </ol>
    </div>
    
    <div class="footer">
        <p>For questions about testing procedures, refer to tests/README.md</p>
        <p>Test execution completed at: $(date)</p>
    </div>
</body>
</html>
EOF
    
    print_status $GREEN "✅ Comprehensive test report generated: $main_report"
    print_status $BLUE "🌐 Open $main_report in your browser to view the full report"
}

# Function to cleanup and exit
cleanup() {
    if [ ! -z "$APP_PID" ]; then
        print_status $YELLOW "Stopping application (PID: $APP_PID)..."
        kill $APP_PID 2>/dev/null || true
    fi
}

# Main execution function
main() {
    print_status $BLUE "🧪 Starting Puffy Delights Test Suite..."
    echo ""
    
    # Validate environment
    if ! validate_environment; then
        exit 1
    fi
    
    # Check if app is running, start if needed
    if ! check_app_status; then
        if ! start_app; then
            exit 1
        fi
    fi
    
    # Run tests
    run_manual_tests
    run_browser_tests
    run_performance_tests
    run_security_tests
    
    # Generate comprehensive report
    generate_test_report
    
    print_status $GREEN "🎉 Test suite execution completed!"
    print_status $BLUE "📊 Check the tests/reports/ directory for detailed results"
    echo ""
    
    # List generated reports
    print_status $BLUE "Generated reports:"
    find "$REPORTS_DIR" -name "*$DATE*" -type f | sort | while read file; do
        echo "  📄 $file"
    done
}

# Help function
show_help() {
    cat << EOF
Puffy Delights Test Runner

Usage: $0 [OPTION]

Options:
    -h, --help              Show this help message
    -u, --url URL          Set application URL (default: http://localhost:5173)
    -t, --timeout SECONDS  Set test timeout (default: 30)
    --manual-only          Run only manual test validation
    --performance-only     Run only performance tests
    --security-only        Run only security tests
    --no-app-start         Don't attempt to start the application

Examples:
    $0                      # Run all tests with default settings
    $0 -u http://localhost:3000  # Test different URL
    $0 --performance-only   # Run only performance tests

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -u|--url)
            APP_URL="$2"
            shift 2
            ;;
        -t|--timeout)
            TEST_TIMEOUT="$2"
            shift 2
            ;;
        --manual-only)
            MANUAL_ONLY=true
            shift
            ;;
        --performance-only)
            PERFORMANCE_ONLY=true
            shift
            ;;
        --security-only)
            SECURITY_ONLY=true
            shift
            ;;
        --no-app-start)
            NO_APP_START=true
            shift
            ;;
        *)
            print_status $RED "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Set trap for cleanup
trap cleanup EXIT

# Execute based on options
if [ "$MANUAL_ONLY" = true ]; then
    validate_environment && run_manual_tests
elif [ "$PERFORMANCE_ONLY" = true ]; then
    validate_environment && check_app_status && run_performance_tests
elif [ "$SECURITY_ONLY" = true ]; then
    validate_environment && check_app_status && run_security_tests
else
    main
fi