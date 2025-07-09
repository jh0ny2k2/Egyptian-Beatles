import React from "react";

const Privacidad = () => (
  <div className="min-h-screen bg-white text-black px-4 py-12 flex items-center justify-center">
    <div className="w-full max-w-4xl bg-white bg-opacity-5 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-md">
      <div className="flex items-center gap-4 mb-8">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z"/></svg>
        <h1 className="text-4xl font-extrabold tracking-tight">Política de Privacidad</h1>
      </div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">1. Información que Recopilamos</h2>
        <p className="mb-2 text-gray-700">Recopilamos información personal que nos proporcionas al registrarte, realizar compras o contactar con nosotros, como nombre, correo electrónico, dirección y datos de pago.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">2. Uso de la Información</h2>
        <ul className="list-disc ml-8 text-gray-700 space-y-1">
          <li>Procesar y gestionar tus pedidos.</li>
          <li>Comunicarnos contigo sobre tu cuenta o pedidos.</li>
          <li>Enviar información promocional si has dado tu consentimiento.</li>
          <li>Mejorar nuestros servicios y la experiencia del usuario.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">3. Compartir Información</h2>
        <p className="mb-2 text-gray-700">No compartimos tu información personal con terceros, salvo para cumplir con obligaciones legales, procesar pagos o mejorar nuestros servicios (por ejemplo, empresas de mensajería).</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">4. Seguridad</h2>
        <p className="mb-2 text-gray-700">Adoptamos medidas de seguridad para proteger tu información personal y evitar accesos no autorizados, alteraciones o divulgaciones.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">5. Derechos del Usuario</h2>
        <ul className="list-disc ml-8 text-gray-700 space-y-1">
          <li>Acceder, rectificar o eliminar tus datos personales.</li>
          <li>Oponerte al tratamiento de tus datos o solicitar su portabilidad.</li>
          <li>Ejercer estos derechos contactando a través de <a href="/contacto" className="underline text-indigo-300">Contacto</a>.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">6. Cookies</h2>
        <p className="mb-2 text-gray-700">Utilizamos cookies para mejorar la experiencia de usuario y analizar el tráfico del sitio. Puedes gestionar tus preferencias de cookies en la configuración de tu navegador.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">7. Cambios en la Política</h2>
        <p className="mb-2 text-gray-700">Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios serán publicados en esta página.</p>
      </section>
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-700 text-gray-400 text-xs">
        <span>Última actualización: {new Date().toLocaleDateString()}</span>
        <span className="italic">Egyptian Beatles &copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  </div>
);

export default Privacidad;