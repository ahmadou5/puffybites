# Puffy Bites - Premium Dessert Ordering Web App

A modern, responsive web application for ordering premium desserts, built with React, Vite, Tailwind CSS, and Supabase.

## Features

### 🏠 Home Page
- Beautiful hero section with brand introduction
- Featured desserts showcase
- Company highlights and testimonials
- Responsive design with mobile-first approach

### 🛒 Order Page
- Complete dessert catalog with search and filtering
- Category-based filtering (cakes, tarts, éclairs, etc.)
- Sort by name, price, and featured items
- Add to cart functionality with real-time updates

### 💳 Checkout Page
- Comprehensive order form with customer details
- Delivery address and date selection
- Secure payment information collection
- Order summary with tax and delivery calculations
- Order confirmation system

### ⚙️ Admin Dashboard
- Real-time business analytics and statistics
- Complete dessert management (CRUD operations)
- Order tracking and management
- Featured dessert management
- Inventory status updates

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd puffy-bites-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

4. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Header, Footer, Layout components
│   ├── DessertCard/     # Dessert display components
│   └── Cart/            # Shopping cart components
├── context/             # React Context providers
│   └── CartContext.jsx  # Shopping cart state management
├── lib/                 # Utility libraries
│   └── supabase.js      # Supabase client and API functions
├── pages/               # Main application pages
│   ├── HomePage.jsx     # Landing page
│   ├── OrderPage.jsx    # Product catalog
│   ├── CheckoutPage.jsx # Order completion
│   └── AdminPage.jsx    # Admin dashboard
├── App.jsx              # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Features Explained

### 🛍️ Shopping Cart System
- Persistent cart state using React Context
- Add, remove, and update item quantities
- Automatic total calculation with tax and delivery
- Free delivery threshold ($50+)

### 🎨 Design System
- Custom color palette with Puffy Bites branding
- Consistent component styling with Tailwind utilities
- Responsive breakpoints for all device sizes
- Smooth animations and hover effects

### 📊 Admin Dashboard
- Business metrics overview (revenue, orders, averages)
- Complete dessert inventory management
- Real-time order tracking
- Featured product management

### 🔒 Data Management
- Supabase integration with Row Level Security
- Real-time data synchronization
- Error handling with fallback demo data
- Optimistic UI updates

## Database Schema

The application uses these main tables:
- `desserts` - Product catalog with pricing, images, and metadata
- `orders` - Customer orders with delivery information
- `order_items` - Individual items within each order

## Customization

### Adding New Dessert Categories
Update the categories array in `src/pages/OrderPage.jsx`:
```javascript
const categories = [
  { id: 'new-category', name: 'New Category' },
  // ... existing categories
]
```

### Modifying Color Scheme
Update the Tailwind config in `tailwind.config.js`:
```javascript
colors: {
  'puffy-primary': '#your-color',
  'puffy-secondary': '#your-color',
  // ... other colors
}
```

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email hello@puffybites.com or join our Slack channel.

---

**Made with ❤️ by the Puffy Bites Team**