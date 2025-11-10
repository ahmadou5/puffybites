import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Layout from '@/components/Layout/Layout'
import HomePage from '@/pages/HomePage'
import OrderPage from '@/pages/OrderPage'
import CheckoutPage from '@/pages/CheckoutPage'
import AdminPage from '@/pages/AdminPage'

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App