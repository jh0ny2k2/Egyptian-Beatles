import React from "react";
import { Link } from 'react-router-dom';


const Footer = () => (
  <footer className="bg-white text-black border-t border-gray-200 pt-12">
    {/* Newsletter */}
    <div className="max-w-4xl mx-auto px-4 text-center mb-10">
      <h3 className="uppercase tracking-widest font-semibold mb-4 text-sm">SUBSCRÍBETE A NUESTRA NEWSLETTER</h3>
      <form className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
        <input type="email" placeholder="Email" className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto focus:outline-none" />
        <button type="submit" className="bg-black text-white px-6 py-2 rounded uppercase font-semibold tracking-wider hover:bg-gray-800 transition">Suscribirse</button>
      </form>
    </div>
    <hr className="border-gray-200 mb-10 " />
    {/* Enlaces principales */}
    <div className="max-w-[90%] mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm mb-10">
      <div>
        <h4 style={{ fontWeight: 600 }}>ATENCIÓN AL CLIENTE</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li><a href="/contacto" className="hover:font-bold">Contacto</a></li>
          <li><a href="/faq" className="hover:font-bold">Preguntas Frecuentes</a></li>
          <li><a href="/envios" className="hover:font-bold">Envíos y Devoluciones</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ fontWeight: 600 }}>TIENDA</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li><a href="/productos?category=Camisetas" className="hover:font-bold">Hombre</a></li>
          <li><a href="/productos?category=Vestidos" className="hover:font-bold">Mujer</a></li>
          <li><a href="/productos?category=Accesorios" className="hover:font-bold">Accesorios</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ fontWeight: 600 }}>ÁREA LEGAL</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li><a href="/terminos" className="hover:font-bold">Términos de Uso</a></li>
          <li><a href="/privacidad" className="hover:font-bold">Política de Privacidad</a></li>
          <li><a href="/cookies" className="hover:font-bold">Cookies</a></li>
          <li><a href="/accesibilidad" className="hover:font-bold">Accesibilidad</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ fontWeight: 600 }}>SÍGUENOS</h4>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
      </div>
    </div>
    {/* Logos y barra inferior */}
    <div className=" mx-auto px-4 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6 pb-4 text-xs text-gray-500">
      {/* <div className="flex flex-col md:flex-row items-center gap-4 mb-2 md:mb-0">
        <img src="/logo1.png" alt="Logo 1" className="h-6" />
        <img src="/logo2.png" alt="Logo 2" className="h-6" />
        <img src="/logo3.png" alt="Logo 3" className="h-6" />
      </div> */}
      <div className="flex-1 text-center">&copy; {new Date().getFullYear()} Egyptian Beatles. Todos los derechos reservados.</div>
      {/* <div className="flex items-center gap-2 mt-2 md:mt-0">
        <span className="bg-red-700 text-white px-3 py-1 rounded-full">SHOP IN: ESPAÑA</span>
        
      </div> */}
    </div>
  </footer>
);

export default Footer;