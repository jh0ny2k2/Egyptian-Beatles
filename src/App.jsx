import React from 'react'
import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductSection from './components/ProductSection'

function App() {
  return (
    <div className="min-h-screen">
      <TopBanner />
      <Header />
      <Hero />
      <ProductSection />
    </div>
  )
}

export default App
