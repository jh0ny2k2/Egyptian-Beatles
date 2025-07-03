import React from 'react'

const SocialCommitment = () => (
  <section className="relative h-80 md:h-96 my-16 flex items-center justify-center overflow-hidden">
    <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" alt="Compromiso social" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
      <div className="text-center text-white max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Moda con propósito</h2>
        <p className="text-lg">En Egyptian Beatles creemos en la moda responsable: apoyamos la producción ética, materiales sostenibles y el empoderamiento de comunidades. Viste con conciencia, viste con estilo.</p>
      </div>
    </div>
  </section>
)

export default SocialCommitment