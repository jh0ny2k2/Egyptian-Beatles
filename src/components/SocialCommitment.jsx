import React from 'react'

const SocialCommitment = () => (
  <section className="relative h-96 md:h-[500px] my-20 flex items-center justify-center overflow-hidden rounded-3xl mx-4 md:mx-8">
    <img 
      src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" 
      alt="Compromiso social" 
      className="absolute inset-0 w-full h-full object-cover" 
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
    <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Moda con <span className="text-amber-400">Propósito</span></h2>
      <p className="text-xl md:text-2xl leading-relaxed mb-8 font-light">En Egyptian Beatles creemos en la moda responsable: apoyamos la producción ética, materiales sostenibles y el empoderamiento de comunidades.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl">
          Conoce Más
        </button>
        <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
          Nuestra Historia
        </button>
      </div>
    </div>
  </section>
)

export default SocialCommitment