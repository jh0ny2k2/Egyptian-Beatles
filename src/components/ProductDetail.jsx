import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '../supabaseClient';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) {
        throw error;
      }

      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Producto no encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando producto...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Producto no encontrado'}</div>
      </div>
    );
  }

  // Si tienes más imágenes, puedes agregarlas como un array en el JSON y mapearlas aquí
  const gallery = [product.image];
  if (product.image1) {
    gallery.push(product.image1);
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto pt-10 pb-16 px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Galería de imágenes */}
          <div className="md:w-2/5 flex flex-col items-center">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src={product.image} alt={product.name} className="w-72 h-72 object-contain rounded-lg mb-4" />
              {/* Miniaturas (si tienes más imágenes) */}
              <div className="flex flex-col gap-3 mt-2">
                {gallery.map((img, idx) => (
                  <img key={idx} src={img} alt={product.name + idx} className="w-14 h-14 object-contain rounded border cursor-pointer" />
                ))}
              </div>
            </div>
          </div>
          {/* Información del producto */}
          <div className="md:w-3/5">
            <span className="text-xs tracking-widest text-gray-500 uppercase">{product.category}</span>
            <h1 className="text-4xl font-bold mb-2 uppercase">{product.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500 text-lg">★ 4.9</span>
              <span className="text-gray-500 text-sm">- Reviews</span>
            </div>
            {product.badge && (
              <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mb-2">
                {product.badge}
              </span>
            )}
            <span className="block text-gray-700 font-semibold mb-2">BLEND</span>
            <h2 className="text-lg font-bold mb-2">Cápsulas de café Ignite</h2>
            <p className="mb-4 text-gray-700"><b>Ignite</b> es un blend de cafés especiales cuidadosamente seleccionado con granos de Sudamérica y Asia. Es nuestro café más oscuro, intenso y tostado, diseñado para quienes buscan un impacto poderoso en cada taza, sin comprometer la calidad ya que contiene cafés frescos y sobre 80 puntos.<br/><br/>Su perfil sensorial ofrece notas amargas y profundas de chocolate bitter, un sutil dejo a tabaco y un final especiado con toques de pimienta, creando una experiencia de sabor audaz y llena de carácter.<br/><br/>Perfecto para espresso y preparaciones con leche como cappuccinos, lattes y más.</p>
            <h3 className="font-bold mb-2">Una redefinición del café.</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="bg-gray-200 px-3 py-1 rounded text-xs">TIPO DE CÁPSULA: ALUMINIO Y COMPOSTABLE</span>
              <span className="bg-gray-200 px-3 py-1 rounded text-xs">ESPRESSO</span>
              <span className="bg-gray-200 px-3 py-1 rounded text-xs">LUNGO</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">{product.price}</span>
              {product.original_price && <span className="text-gray-400 line-through">{product.original_price}</span>}
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">Añadir al carrito</button>
            <p className="text-xs text-gray-400 mt-4">Nuestras cápsulas son compatibles con el sistema original de cápsulas Nespresso®.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;