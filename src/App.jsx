import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductSection from "./components/ProductSection";
import AllProductsSection from "./components/AllProductsSection";
import Footer from "./components/Footer";
import TopBanner from "./components/TopBanner";
import SocialCommitment from "./components/SocialCommitment";
import ProductDetail from './components/ProductDetail';
import Login from "./components/Login";
import Registro from "./components/Registro";
import Perfil from './components/Perfil';

function App() {
  return (
    <>
      <TopBanner />
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <ProductSection />
            <SocialCommitment />
          </>
        } />
        <Route path="/productos" element={<AllProductsSection />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;