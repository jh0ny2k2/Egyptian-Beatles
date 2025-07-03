import React from 'react'

const Hero = () => (
  <section className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-black">
    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80" alt="Moda" className="absolute inset-0 w-full h-full object-cover opacity-70" />
    <div className="relative z-10 text-center text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">EXPRESA TU ESTILO</h1>
      <p className="text-lg md:text-2xl mb-6 drop-shadow">Descubre la nueva colección para mujer y hombre</p>
      <button className="bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-full font-semibold shadow border border-white">Comprar ahora</button>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
  </section>
)

export default Hero