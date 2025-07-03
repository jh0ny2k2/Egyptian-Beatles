import React from "react";

const Footer = () => (
  <footer className="bg-black text-white py-12 mt-12 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start">
        <span className="font-extrabold text-2xl tracking-widest mb-2">EGYPTIAN BEATLES</span>
        <span className="text-gray-400 text-sm">Moda contemporánea para mujer y hombre</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <a href="#colecciones" className="hover:underline">Colecciones</a>
        <a href="#novedades" className="hover:underline">Novedades</a>
        <a href="#tiendas" className="hover:underline">Tiendas</a>
        <a href="#contacto" className="hover:underline">Contacto</a>
      </div>
      <div className="flex space-x-4">
        <a href="#" aria-label="Instagram" className="hover:text-yellow-400 transition-colors">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"/></svg>
        </a>
        <a href="#" aria-label="Facebook" className="hover:text-yellow-400 transition-colors">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788c1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0"/></svg>
        </a>
        <a href="#" aria-label="TikTok" className="hover:text-yellow-400 transition-colors">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12.004 2.003c-5.523 0-10 4.477-10 10c0 5.523 4.477 10 10 10c5.523 0 10-4.477 10-10c0-5.523-4.477-10-10-10zm0 1.5c4.694 0 8.5 3.806 8.5 8.5c0 4.694-3.806 8.5-8.5 8.5c-4.694 0-8.5-3.806-8.5-8.5c0-4.694 3.806-8.5 8.5-8.5zm2.5 3.5v6.25c0 1.242-1.008 2.25-2.25 2.25s-2.25-1.008-2.25-2.25c0-.414.336-.75.75-.75s.75.336.75.75c0 .414.336.75.75.75s.75-.336.75-.75V7h1.5zm-2.5 10.25c-2.071 0-3.75-1.679-3.75-3.75c0-2.071 1.679-3.75 3.75-3.75c.414 0 .75.336.75.75s-.336.75-.75.75c-1.242 0-2.25 1.008-2.25 2.25c0 1.242 1.008 2.25 2.25 2.25c.414 0 .75.336.75.75s-.336.75-.75.75z"/></svg>
        </a>
      </div>
    </div>
    <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-xs">
      &copy; {new Date().getFullYear()} Egyptian Beatles. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;
