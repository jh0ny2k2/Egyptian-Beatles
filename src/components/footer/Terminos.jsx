import React from "react";

const Terminos = () => (
  <div className="min-h-screen bg-white text-black px-4 py-12 flex items-center justify-center">
    <div className="w-full max-w-3xl bg-white bg-opacity-5 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-md">
      <div className="flex items-center gap-4 mb-8">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z" /></svg>
        <h1 className="text-4xl font-extrabold tracking-tight">Términos y Condiciones</h1>
      </div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">1. Introducción</h2>
        <p className="mb-2 text-gray-700">Bienvenido a <span className="font-bold text-indigo-300">Egyptian Beatles</span>. Al acceder y utilizar nuestro sitio web, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, por favor no utilices nuestro sitio.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">2. Uso del Sitio</h2>
        <ul className="list-disc ml-8 text-gray-700 space-y-1">
          <li>Debes tener al menos 18 años o consentimiento de tus padres/tutores para comprar.</li>
          <li>No puedes usar el sitio para fines ilegales o no autorizados.</li>
          <li>Nos reservamos el derecho de rechazar el servicio a cualquier persona en cualquier momento.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">3. Propiedad Intelectual</h2>
        <p className="mb-2 text-gray-700">Todo el contenido de este sitio, incluyendo textos, imágenes, logotipos y diseños, es propiedad de Egyptian Beatles o de sus proveedores y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">4. Condiciones de Compra</h2>
        <ul className="list-disc ml-8 text-gray-700 space-y-1">
          <li>Los precios y la disponibilidad de los productos pueden cambiar sin previo aviso.</li>
          <li>Nos reservamos el derecho de cancelar pedidos por errores en la información o el precio.</li>
          <li>El usuario es responsable de proporcionar información veraz y actualizada para la entrega.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">5. Enlaces a Terceros</h2>
        <p className="mb-2 text-gray-700">Nuestro sitio puede contener enlaces a sitios web de terceros. No nos responsabilizamos por el contenido ni por las políticas de privacidad de dichos sitios.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">6. Limitación de Responsabilidad</h2>
        <p className="mb-2 text-gray-700">Egyptian Beatles no será responsable por daños directos, indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de uso del sitio.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">7. Modificaciones de los Términos</h2>
        <p className="mb-2 text-gray-700">Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 border-l-4 border-indigo-500 pl-3">8. Contacto</h2>
        <p className="mb-2 text-gray-700">Si tienes alguna pregunta sobre estos términos, puedes contactarnos a través de la sección <a href="/contacto" className="underline text-indigo-300">Contacto</a>.</p>
      </section>
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-700 text-gray-400 text-xs">
        <span>Última actualización: {new Date().toLocaleDateString()}</span>
        <span className="italic">Egyptian Beatles &copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  </div>
);

export default Terminos;