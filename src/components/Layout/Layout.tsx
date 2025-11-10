import React from 'react'
import Header from './Header'
import Footer from './Footer'
import FluidBackground from '../FluidBackground'
import type { LayoutProps } from '@/types'

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col relative">
      <FluidBackground />
      <div className="relative z-10">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout