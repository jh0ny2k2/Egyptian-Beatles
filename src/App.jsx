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
// Importamos los nuevos componentes
import Sostenibilidad from './components/Sostenibilidad';
import Contacto from './components/Contacto';

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
        {/* Reemplazamos las rutas de AboutUs con las nuevas rutas específicas */}
        <Route path="/sostenibilidad" element={<Sostenibilidad />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;