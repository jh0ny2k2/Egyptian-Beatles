import React from 'react';

const Sostenibilidad = () => {
  return (
    <div className="min-h-screen bg-white">
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
    </div>
  );
};

export default Sostenibilidad;