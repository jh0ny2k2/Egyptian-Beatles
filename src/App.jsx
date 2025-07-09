import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import Sostenibilidad from './components/Sostenibilidad';
import Contacto from './components/Contacto';
import Admin from './components/Admin';
import ResetPassword from './components/ResetPassword';
import { supabase } from "./supabaseClient";
import { useAuth } from "./context/AuthContext";
import Checkout from './components/Checkout';

// FOOTER
import Faq from "./components/footer/Faq";
import Envios from "./components/footer/EnviosDevoluciones";
import Terminos from './components/footer/Terminos';
import Privacidad from './components/footer/Privacidad';
import Cookies from './components/footer/Cookies';
import Accesibilidad from './components/footer/Accesibilidad';

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Función para registrar visitas
  const registrarVisita = async (pagina) => {
    try {
      const visitaData = {
        pagina,
        user_id: user?.id || null,
        user_agent: navigator.userAgent
      };

      await supabase.from('visitas').insert([visitaData]);
    } catch (error) {
      console.error('Error al registrar visita:', error);
    }
  };

  // Registrar visita cuando cambia la ubicación
  useEffect(() => {
    registrarVisita(location.pathname);
  }, [location.pathname]);

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
        <Route path="/sostenibilidad" element={<Sostenibilidad />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/accesibilidad" element={<Accesibilidad />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
