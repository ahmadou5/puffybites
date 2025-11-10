# Development Setup with Fake Data

This document explains the changes made to enable local development without Supabase.

## Changes Made

### 1. Created Fake Data System
- **File**: `src/data/fakeData.ts`
- Contains sample desserts and orders for development
- Includes ID generator for creating new items
- Simulates API delays for realistic behavior

### 2. Modified Supabase API (`src/lib/supabase.ts`)
- **Commented out** all actual Supabase calls
- **Added TODO comments** to easily identify where to restore Supabase
- **Replaced** with fake data functions that mimic the same API structure
- All functions return the same data types as the real Supabase calls

### 3. Fixed CSS Issues (`src/index.css`)
- Added missing utility classes used throughout the app
- Added custom component styles (`.btn-primary`, `.container-custom`, etc.)
- Added proper base styles and animations
- Fixed line-clamp utilities that were missing

### 4. Cleaned Up Pages
- Removed duplicate fallback data from HomePage, OrderPage, and AdminPage
- All pages now use the centralized fake data system

## How to Switch Back to Supabase

When your Supabase database is ready, follow these steps:

### Step 1: Restore Supabase Client
In `src/lib/supabase.ts`:
```typescript
// 1. Uncomment these lines:
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. Comment out this line:
// import { fakeDesserts, fakeOrders, simulateDelay, idGenerator } from '@/data/fakeData'
```

### Step 2: Restore API Functions
Replace each fake function with its commented Supabase version. Look for `TODO: Replace with actual Supabase call when ready` comments.

Example for `dessertsAPI.getAll()`:
```typescript
// Replace this:
return [...fakeDesserts]

// With this:
const { data, error } = await supabase
  .from('desserts')
  .select('*')
  .order('created_at', { ascending: false })

if (error) throw error
return data || []
```

### Step 3: Environment Variables
Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Step 4: Database Schema
Use the provided `supabase-schema.sql` file to set up your database tables.

### Step 5: Remove Fake Data (Optional)
Once Supabase is working, you can delete:
- `src/data/fakeData.ts`
- This file (`DEVELOPMENT_SETUP.md`)

## Current Fake Data

The app currently includes:
- **8 desserts** with various categories (cakes, tarts, cookies, etc.)
- **3 sample orders** with different statuses
- **All CRUD operations** work with in-memory data
- **Search and filtering** work with the fake data
- **Admin panel** fully functional for testing

## Features Working with Fake Data

✅ Browse desserts on home page  
✅ View full menu with search/filter  
✅ Add items to cart  
✅ Complete checkout process  
✅ Admin panel - view stats  
✅ Admin panel - manage desserts (CRUD)  
✅ Admin panel - view orders  
✅ All CSS styling and animations  

## Running the App

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

---

**Note**: All TODO comments in the code mark exactly where Supabase integration needs to be restored.