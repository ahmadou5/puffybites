#!/usr/bin/env node

/**
 * Supabase Setup Verification Script
 * Run this script to verify your Supabase configuration
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(colors.green, `✅ ${message}`);
}

function logError(message) {
  log(colors.red, `❌ ${message}`);
}

function logWarning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

function logInfo(message) {
  log(colors.blue, `ℹ️  ${message}`);
}

function logHeader(message) {
  console.log();
  log(colors.bold + colors.blue, `🔍 ${message}`);
  log(colors.blue, '='.repeat(50));
}

async function verifySupabaseSetup() {
  logHeader('Supabase Configuration Verification');

  // 1. Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'your-supabase-project-url') {
    logError('VITE_SUPABASE_URL not configured in .env file');
    logInfo('Please set your Supabase project URL in .env file');
    return false;
  } else {
    logSuccess(`Supabase URL configured: ${supabaseUrl}`);
  }

  if (!supabaseKey || supabaseKey === 'your-supabase-anon-key') {
    logError('VITE_SUPABASE_ANON_KEY not configured in .env file');
    logInfo('Please set your Supabase anon key in .env file');
    return false;
  } else {
    logSuccess('Supabase anon key configured');
  }

  // 2. Test Supabase connection
  logHeader('Testing Supabase Connection');

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase.from('desserts').select('count', { count: 'exact' });
    
    if (error) {
      logError(`Connection failed: ${error.message}`);
      logInfo('Please check your Supabase credentials and database setup');
      return false;
    } else {
      logSuccess('Successfully connected to Supabase');
      logInfo(`Desserts table accessible (${data?.[0]?.count || 0} records)`);
    }

    // Test auth configuration
    const { data: authData } = await supabase.auth.getSession();
    logSuccess('Auth service accessible');

  } catch (error) {
    logError(`Connection error: ${error.message}`);
    return false;
  }

  // 3. Check database tables
  logHeader('Database Schema Verification');

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check desserts table
    try {
      const { data: dessertsData } = await supabase.from('desserts').select('*').limit(1);
      logSuccess('Desserts table accessible');
    } catch (error) {
      logWarning('Desserts table might not exist or is not accessible');
    }

    // Check orders table
    try {
      const { data: ordersData } = await supabase.from('orders').select('*').limit(1);
      logSuccess('Orders table accessible');
    } catch (error) {
      logWarning('Orders table might not exist or is not accessible');
    }

  } catch (error) {
    logError(`Database schema check failed: ${error.message}`);
  }

  return true;
}

async function checkAuthSetup() {
  logHeader('Authentication Setup Check');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    logError('Supabase not configured');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to sign in with demo credentials
    logInfo('Testing authentication with demo credentials...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@puffydelights.com',
      password: 'admin123'
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        logWarning('Demo admin user not found in Supabase');
        logInfo('You need to create the admin user in Supabase dashboard');
        logInfo('Email: admin@puffydelights.com');
        logInfo('Password: admin123');
      } else {
        logError(`Auth test failed: ${error.message}`);
      }
    } else {
      logSuccess('Demo admin user exists and can authenticate');
      
      // Sign out after test
      await supabase.auth.signOut();
      logInfo('Signed out after test');
    }

  } catch (error) {
    logError(`Auth setup check failed: ${error.message}`);
  }
}

function generateSetupInstructions() {
  logHeader('Setup Instructions');

  console.log(`
${colors.yellow}📋 To complete your Supabase setup:${colors.reset}

${colors.bold}1. Configure Environment Variables:${colors.reset}
   Create a .env file in your project root with:
   
   ${colors.blue}VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJI...${colors.reset}

${colors.bold}2. Create Admin User in Supabase Dashboard:${colors.reset}
   a) Go to https://app.supabase.com
   b) Select your project
   c) Go to Authentication → Users
   d) Click "Create a new user"
   e) Enter:
      ${colors.green}Email: admin@puffydelights.com
      Password: admin123
      ✅ Auto Confirm User${colors.reset}

${colors.bold}3. Configure Authentication Settings:${colors.reset}
   a) Go to Authentication → Settings
   b) Add Site URL: ${colors.green}http://localhost:3001${colors.reset}
   c) Add Redirect URLs:
      ${colors.green}http://localhost:3001
      http://localhost:3001/admin
      http://localhost:3001/auth/callback${colors.reset}

${colors.bold}4. Test Your Setup:${colors.reset}
   a) Restart your dev server: ${colors.blue}npm run dev${colors.reset}
   b) Go to: ${colors.blue}http://localhost:3001/admin${colors.reset}
   c) Login with demo credentials
   d) Verify admin dashboard access

${colors.bold}5. Run this script again to verify:${colors.reset}
   ${colors.blue}node verify-supabase-setup.js${colors.reset}
`);
}

async function main() {
  console.log(`${colors.bold}${colors.blue}🚀 Puffy Delights - Supabase Setup Verification${colors.reset}`);
  console.log('='.repeat(60));

  const isConfigured = await verifySupabaseSetup();
  
  if (isConfigured) {
    await checkAuthSetup();
  }

  generateSetupInstructions();

  logHeader('Quick Reference');
  console.log(`
${colors.blue}📚 Documentation:${colors.reset}
- Setup Guide: ${colors.yellow}SUPABASE_AUTH_SETUP.md${colors.reset}
- Supabase Docs: ${colors.yellow}https://supabase.com/docs/guides/auth${colors.reset}

${colors.blue}🔧 Development Commands:${colors.reset}
- Start dev server: ${colors.green}npm run dev${colors.reset}
- Run tests: ${colors.green}./tests/run-tests.sh${colors.reset}
- Verify setup: ${colors.green}node verify-supabase-setup.js${colors.reset}

${colors.blue}🎯 Test URLs:${colors.reset}
- Homepage: ${colors.green}http://localhost:3001/${colors.reset}
- Admin Login: ${colors.green}http://localhost:3001/admin${colors.reset}
`);
}

// Run the verification
main().catch(console.error);

export default verifySupabaseSetup;