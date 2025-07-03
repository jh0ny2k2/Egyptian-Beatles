import React from 'react'
import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductSection from './components/ProductSection'
import SocialCommitment from './components/SocialCommitment'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <TopBanner />
      <Header />
      <Hero />
      <ProductSection />
      <SocialCommitment />
      <Footer />
    </div>
  )
}

export default App
