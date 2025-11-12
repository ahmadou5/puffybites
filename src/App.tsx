import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { AuthGuard } from '@/components'
import Layout from '@/components/Layout/Layout'
import HomePage from '@/pages/HomePage'
import OrderPage from '@/pages/OrderPage'
import CheckoutPage from '@/pages/CheckoutPage'
import AdminPage from '@/pages/AdminPage'

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public routes - accessible to everyone */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />
              <Route path="/order" element={
                <Layout>
                  <OrderPage />
                </Layout>
              } />
              <Route path="/checkout" element={
                <Layout>
                  <CheckoutPage />
                </Layout>
              } />
              
              {/* Protected admin route - requires authentication */}
              <Route path="/admin" element={
                <AuthGuard>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </AuthGuard>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App