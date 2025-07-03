import React from "react";
import { Link } from "react-router-dom";
import products from '../assets/bbdd/products.json';

const AllProductsSection = () => {
  return (
    <>
      <div className="relative w-full">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
          alt="Banner tienda de ropa"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg uppercase">Todos los productos</h1>
        </div>
      </div>
    
    <section className="flex flex-col md:flex-row gap-8 px-4 py-10 bg-white">
        
      {/* Sidebar de filtros */}
      <aside className="w-full md:w-1/5 mb-8 md:mb-0">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" /></svg>
            <span className="font-semibold text-lg">Filtros</span>
          </div>
          <hr className="mb-2" />
          <div className="divide-y divide-gray-200">
            <details className="py-2" open>
              <summary className="font-semibold cursor-pointer flex justify-between items-center">Categoría <span className="ml-2">▾</span></summary>
              <ul className="pl-4 mt-2 text-sm text-gray-700">
                <li><input type="checkbox" className="mr-2" />Camisetas</li>
                <li><input type="checkbox" className="mr-2" />Pantalones</li>
                <li><input type="checkbox" className="mr-2" />Vestidos</li>
                <li><input type="checkbox" className="mr-2" />Abrigos</li>
              </ul>
            </details>
            <details className="py-2">
              <summary className="font-semibold cursor-pointer flex justify-between items-center">Talla <span className="ml-2">▾</span></summary>
              <ul className="pl-4 mt-2 text-sm text-gray-700">
                <li><input type="checkbox" className="mr-2" />XS</li>
                <li><input type="checkbox" className="mr-2" />S</li>
                <li><input type="checkbox" className="mr-2" />M</li>
                <li><input type="checkbox" className="mr-2" />L</li>
                <li><input type="checkbox" className="mr-2" />XL</li>
              </ul>
            </details>
            <details className="py-2">
              <summary className="font-semibold cursor-pointer flex justify-between items-center">Color <span className="ml-2">▾</span></summary>
              <ul className="pl-4 mt-2 text-sm text-gray-700">
                <li><input type="checkbox" className="mr-2" />Blanco</li>
                <li><input type="checkbox" className="mr-2" />Negro</li>
                <li><input type="checkbox" className="mr-2" />Azul</li>
                <li><input type="checkbox" className="mr-2" />Rojo</li>
              </ul>
            </details>
            <details className="py-2">
              <summary className="font-semibold cursor-pointer flex justify-between items-center">Precio <span className="ml-2">▾</span></summary>
              <ul className="pl-4 mt-2 text-sm text-gray-700">
                <li><input type="checkbox" className="mr-2" />Menos de $50</li>
                <li><input type="checkbox" className="mr-2" />$50 - $100</li>
                <li><input type="checkbox" className="mr-2" />Más de $100</li>
              </ul>
            </details>
          </div>
        </div>
      </aside>
      {/* Grid de productos */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full">
          {/* Aquí va el grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <Link
                  to={`/producto/${product.id}`}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center p-4 group overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ textDecoration: "none" }}
                >
                  <div className="w-full aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 w-full text-left mb-1 truncate">{product.name}</h3>
                  <span className="text-gray-500 text-sm w-full text-left mb-2 truncate">{product.category}</span>
                  <div className="flex items-center justify-between w-full mt-auto">
                    <span className="text-xl font-bold text-black">{product.price}</span>
                  </div>
                </Link>
                <button
                  className="absolute bottom-4 right-4 p-2 rounded-xl border border-gray-300 text-white shadow hover:bg-gray-300 transition-colors duration-200 opacity-90 group-hover:opacity-100"
                  onClick={() => {/* lógica para añadir al carrito */}}
                  aria-label="Añadir al carrito"
                >
                  <img src="/src/assets/img/carrito.png" alt="Añadir al carrito" className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>

  );
};

export default AllProductsSection;