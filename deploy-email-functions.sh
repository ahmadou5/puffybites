#!/bin/bash

# Deploy Email Functions Script for Puffy Delights
# This script deploys Supabase Edge Functions for email functionality

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] ${message}${NC}"
}

print_header() {
    echo ""
    print_status $BLUE "🚀 $1"
    echo "=============================="
}

print_success() {
    print_status $GREEN "✅ $1"
}

print_error() {
    print_status $RED "❌ $1"
}

print_warning() {
    print_status $YELLOW "⚠️  $1"
}

print_info() {
    print_status $BLUE "ℹ️  $1"
}

# Check if Supabase CLI is installed
check_supabase_cli() {
    print_header "Checking Supabase CLI"
    
    if command -v supabase &> /dev/null; then
        local version=$(supabase --version)
        print_success "Supabase CLI is installed: $version"
        return 0
    else
        print_error "Supabase CLI is not installed"
        print_info "Install with: npm install -g supabase"
        return 1
    fi
}

# Check if user is logged in to Supabase
check_supabase_auth() {
    print_header "Checking Supabase Authentication"
    
    if supabase status &> /dev/null; then
        print_success "Logged in to Supabase"
        return 0
    else
        print_warning "Not logged in to Supabase"
        print_info "Login with: supabase login"
        return 1
    fi
}

# Check if project is linked
check_project_link() {
    print_header "Checking Project Link"
    
    if [ -f ".supabase/config.toml" ]; then
        local project_id=$(grep 'project_id' .supabase/config.toml | cut -d'"' -f2)
        print_success "Project linked: $project_id"
        return 0
    else
        print_warning "Project not linked"
        print_info "Link with: supabase link --project-ref your-project-id"
        return 1
    fi
}

# Deploy function
deploy_function() {
    local function_name=$1
    local function_path="supabase/functions/$function_name"
    
    if [ -d "$function_path" ]; then
        print_info "Deploying function: $function_name"
        
        if supabase functions deploy "$function_name"; then
            print_success "Successfully deployed: $function_name"
            return 0
        else
            print_error "Failed to deploy: $function_name"
            return 1
        fi
    else
        print_error "Function directory not found: $function_path"
        return 1
    fi
}

# Set environment secrets
set_secrets() {
    print_header "Setting Environment Secrets"
    
    # Check if RESEND_API_KEY is provided
    if [ -z "$RESEND_API_KEY" ]; then
        print_warning "RESEND_API_KEY not found in environment"
        read -p "Enter your Resend API key (re_...): " RESEND_API_KEY
    fi
    
    if [ -n "$RESEND_API_KEY" ]; then
        if supabase secrets set RESEND_API_KEY="$RESEND_API_KEY"; then
            print_success "Set RESEND_API_KEY secret"
        else
            print_error "Failed to set RESEND_API_KEY secret"
        fi
    fi
    
    # Set admin email
    local admin_email="${ADMIN_EMAIL:-admin@puffydelights.com}"
    if supabase secrets set ADMIN_EMAIL="$admin_email"; then
        print_success "Set ADMIN_EMAIL secret: $admin_email"
    else
        print_error "Failed to set ADMIN_EMAIL secret"
    fi
    
    # Set from email
    local from_email="${FROM_EMAIL:-orders@puffydelights.com}"
    if supabase secrets set FROM_EMAIL="$from_email"; then
        print_success "Set FROM_EMAIL secret: $from_email"
    else
        print_error "Failed to set FROM_EMAIL secret"
    fi
}

# Test function deployment
test_functions() {
    print_header "Testing Function Deployment"
    
    # Get project details
    local project_id=$(grep 'project_id' .supabase/config.toml | cut -d'"' -f2 2>/dev/null || echo "unknown")
    local anon_key=$(grep 'anon_key' .supabase/config.toml | cut -d'"' -f2 2>/dev/null || echo "")
    
    if [ "$project_id" != "unknown" ] && [ -n "$anon_key" ]; then
        print_info "Testing send-order-confirmation function..."
        
        local test_payload='{
            "to": "test@example.com",
            "customerName": "Test Customer",
            "orderId": "TEST123",
            "transactionRef": "TEST-REF-123",
            "orderItems": [
                {
                    "name": "Chocolate Cupcakes",
                    "quantity": 2,
                    "price": 15.99,
                    "pack_of": "6"
                }
            ],
            "subtotal": 31.98,
            "tax": 2.56,
            "shipping": 5.99,
            "total": 40.53,
            "deliveryDate": "2024-01-15",
            "customerAddress": "123 Test Street, Test City",
            "customerPhone": "+234 123 456 7890"
        }'
        
        local response=$(curl -s -X POST \
            "https://$project_id.supabase.co/functions/v1/send-order-confirmation" \
            -H "Authorization: Bearer $anon_key" \
            -H "Content-Type: application/json" \
            -d "$test_payload")
        
        if echo "$response" | grep -q '"success":true'; then
            print_success "Order confirmation function test passed"
        else
            print_warning "Order confirmation function test response: $response"
        fi
    else
        print_warning "Cannot test functions - missing project configuration"
    fi
}

# Main deployment process
main() {
    print_status $BLUE "📧 Deploying Puffy Delights Email Functions"
    echo "============================================"
    
    # Pre-deployment checks
    if ! check_supabase_cli; then
        exit 1
    fi
    
    if ! check_supabase_auth; then
        print_info "Please login first: supabase login"
        exit 1
    fi
    
    if ! check_project_link; then
        print_info "Please link your project first: supabase link --project-ref YOUR_PROJECT_ID"
        exit 1
    fi
    
    # Deploy functions
    print_header "Deploying Email Functions"
    
    local failed_deployments=0
    
    if ! deploy_function "send-order-confirmation"; then
        ((failed_deployments++))
    fi
    
    if ! deploy_function "send-admin-notification"; then
        ((failed_deployments++))
    fi
    
    if [ $failed_deployments -eq 0 ]; then
        print_success "All functions deployed successfully!"
    else
        print_error "$failed_deployments function(s) failed to deploy"
    fi
    
    # Set secrets
    set_secrets
    
    # Test deployment
    test_functions
    
    # Summary
    print_header "Deployment Summary"
    print_info "Functions deployed:"
    print_info "• send-order-confirmation - Sends beautiful order confirmation emails to customers"
    print_info "• send-admin-notification - Sends instant order alerts to admin"
    echo ""
    print_info "Next steps:"
    print_info "1. Test your setup by placing a test order"
    print_info "2. Check email delivery in your inbox (and spam folder)"
    print_info "3. Monitor function logs: supabase functions logs send-order-confirmation"
    print_info "4. Customize email templates as needed"
    echo ""
    print_success "Email system deployment complete! 🎉"
}

# Help function
show_help() {
    cat << EOF
Puffy Delights Email Functions Deployment Script

Usage: $0 [OPTION]

Options:
    -h, --help              Show this help message
    --skip-tests           Skip function testing after deployment
    --resend-key KEY       Specify Resend API key directly

Environment Variables:
    RESEND_API_KEY         Your Resend API key (re_...)
    ADMIN_EMAIL           Admin email for notifications (default: admin@puffydelights.com)
    FROM_EMAIL            From email address (default: orders@puffydelights.com)

Examples:
    $0                                    # Interactive deployment
    $0 --resend-key re_abc123            # Deploy with specific API key
    RESEND_API_KEY=re_abc123 $0          # Deploy with environment variable

Before running this script:
1. Install Supabase CLI: npm install -g supabase
2. Login to Supabase: supabase login
3. Link your project: supabase link --project-ref YOUR_PROJECT_ID
4. Get your Resend API key from https://resend.com

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --resend-key)
            RESEND_API_KEY="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main deployment
main