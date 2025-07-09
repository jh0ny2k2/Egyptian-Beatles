import React from "react";

const Accesibilidad = () => (
  <div className="min-h-screen bg-white text-black px-4 py-12 flex items-center justify-center">
    <div className="w-full max-w-3xl bg-white bg-opacity-5 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-md">
      <div className="flex items-center gap-4 mb-8">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
        <h1 className="text-4xl font-extrabold tracking-tight">Accesibilidad</h1>
      </div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">1. Compromiso con la accesibilidad</h2>
        <p className="mb-2 text-gray-700">En Egyptian Beatles nos comprometemos a ofrecer un sitio web accesible para todas las personas, independientemente de sus capacidades o tecnología utilizada.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">2. Medidas adoptadas</h2>
        <ul className="list-disc ml-8 text-gray-700 space-y-1">
          <li>Diseño responsivo y adaptable a diferentes dispositivos.</li>
          <li>Colores y contrastes adecuados para facilitar la lectura.</li>
          <li>Navegación mediante teclado y lectores de pantalla.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">3. Mejoras continuas</h2>
        <p className="mb-2 text-gray-700">Trabajamos constantemente para mejorar la accesibilidad de nuestro sitio. Si encuentras alguna barrera, por favor <a href="/contacto" className="underline text-indigo-300">contáctanos</a> para que podamos solucionarlo.</p>
      </section>
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-700 text-gray-400 text-xs">
        <span>Última actualización: {new Date().toLocaleDateString()}</span>
        <span className="italic">Egyptian Beatles &copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  </div>
);

export default Accesibilidad;