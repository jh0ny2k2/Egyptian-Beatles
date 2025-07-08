import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const AboutUs = () => {
  const { section } = useParams();

  // Contenido para la sección de Sostenibilidad
  const SostenibilidadContent = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Nuestro Compromiso con la Sostenibilidad</h1>
      
      <div className="mb-12">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Sostenibilidad" 
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        
        <h2 className="text-2xl font-semibold mb-4">Moda Responsable</h2>
        <p className="text-gray-700 mb-4">
          En Egyptian Beatles, creemos que la moda puede ser hermosa y responsable al mismo tiempo. Nos comprometemos a reducir nuestro impacto ambiental en cada etapa del proceso de producción.
        </p>
        <p className="text-gray-700 mb-4">
          Trabajamos con proveedores que comparten nuestros valores y utilizamos materiales sostenibles siempre que es posible, incluyendo algodón orgánico, poliéster reciclado y tintes naturales.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Materiales Sostenibles</h3>
          <p className="text-gray-700">
            Utilizamos materiales reciclados y de origen sostenible en nuestras colecciones, reduciendo el consumo de recursos naturales y minimizando los residuos.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Producción Ética</h3>
          <p className="text-gray-700">
            Garantizamos condiciones de trabajo justas y seguras en todas nuestras fábricas, con salarios dignos y horarios razonables para todos los trabajadores.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Embalaje Ecológico</h3>
          <p className="text-gray-700">
            Hemos rediseñado nuestros embalajes para eliminar el plástico innecesario y utilizar materiales reciclados y biodegradables.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Huella de Carbono</h3>
          <p className="text-gray-700">
            Medimos y reducimos constantemente nuestra huella de carbono, compensando las emisiones que no podemos eliminar a través de proyectos de reforestación.
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold mb-4">Nuestros Objetivos para 2025</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Utilizar 100% materiales sostenibles en todas nuestras colecciones</li>
          <li>Reducir nuestras emisiones de carbono en un 50%</li>
          <li>Eliminar completamente el plástico de un solo uso en nuestras operaciones</li>
          <li>Implementar un programa de reciclaje de prendas en todas nuestras tiendas</li>
          <li>Lograr la certificación B Corp para nuestro negocio</li>
        </ul>
      </div>
    </div>
  );

  // Contenido para la sección de Contacto
  const ContactoContent = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Contacto</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Estamos aquí para ayudarte</h2>
          <p className="text-gray-700 mb-6">
            Si tienes alguna pregunta, sugerencia o comentario, no dudes en ponerte en contacto con nosotros. Nuestro equipo de atención al cliente estará encantado de ayudarte.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h3 className="font-semibold">Dirección</h3>
                <p className="text-gray-600">Calle Principal 123, 28001 Madrid, España</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h3 className="font-semibold">Teléfono</h3>
                <p className="text-gray-600">+34 91 123 45 67</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">info@egyptianbeatles.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold">Horario de atención</h3>
                <p className="text-gray-600">Lunes a Viernes: 9:00 - 20:00</p>
                <p className="text-gray-600">Sábados: 10:00 - 15:00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Envíanos un mensaje</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tu nombre"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Asunto de tu mensaje"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea 
                id="message" 
                rows="4" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Nuestra ubicación</h2>
        <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
          {/* Aquí iría un mapa real, pero por ahora usamos un placeholder */}
          <p className="text-gray-500">Mapa de ubicación</p>
        </div>
      </div>
    </div>
  );

  // Renderizar el contenido según la sección
  const renderContent = () => {
    switch(section) {
      case 'sostenibilidad':
        return <SostenibilidadContent />;
      case 'contacto':
        return <ContactoContent />;
      default:
        return <Navigate to="/nosotros/sostenibilidad" replace />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderContent()}
    </div>
  );
};

export default AboutUs;