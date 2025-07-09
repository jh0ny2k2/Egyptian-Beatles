import React from "react";

const Cookies = () => (
  <div className="min-h-screen bg-white text-black px-4 py-12 flex items-center justify-center">
    <div className="w-full max-w-3xl bg-white bg-opacity-5 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-md">
      <div className="flex items-center gap-4 mb-8">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-400"><circle cx="12" cy="12" r="10" strokeWidth="2"/><circle cx="12" cy="12" r="4" strokeWidth="2"/><circle cx="16.5" cy="7.5" r="1.5"/><circle cx="7.5" cy="16.5" r="1.5"/></svg>
        <h1 className="text-4xl font-extrabold tracking-tight">Política de Cookies</h1>
      </div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">1. ¿Qué son las cookies?</h2>
        <p className="mb-2 text-gray-700">Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia y a analizar el uso del sitio.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">2. Tipos de cookies que utilizamos</h2>
        <ul className="list-disc ml-8 text-gray-700 space-y-1">
          <li><span className="font-bold text-indigo-300">Cookies esenciales:</span> necesarias para el funcionamiento del sitio.</li>
          <li><span className="font-bold text-indigo-300">Cookies de análisis:</span> nos permiten analizar el tráfico y mejorar nuestros servicios.</li>
          <li><span className="font-bold text-indigo-300">Cookies de personalización:</span> recuerdan tus preferencias y ajustes.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">3. Gestión de cookies</h2>
        <p className="mb-2 text-gray-700">Puedes gestionar o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que desactivar ciertas cookies puede afectar el funcionamiento del sitio.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">4. Cambios en la política</h2>
        <p className="mb-2 text-gray-700">Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios serán publicados en esta página.</p>
      </section>
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-700 text-gray-400 text-xs">
        <span>Última actualización: {new Date().toLocaleDateString()}</span>
        <span className="italic">Egyptian Beatles &copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  </div>
);

export default Cookies;