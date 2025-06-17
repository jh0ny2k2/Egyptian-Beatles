import { useState, useEffect } from 'react'

const TopBanner = () => {
  const messages = [
    "DESPACHOS A TODO CHILE",
    "DESCUENTOS ESPECIALES", 
    "DESPACHOS A TODO CHILE",
  ]

  return (
    <div className="bg-black text-white text-center py-3 text-sm relative overflow-hidden">
      {/* Contenedor del texto en movimiento */}
      <div className="whitespace-nowrap">
        <div className="inline-block animate-scroll">
          {/* Repetimos el contenido para crear el efecto continuo */}
          <span className="inline-block px-8">
            {messages.map((message, index) => (
              <span key={index} className="font-medium tracking-wider px-16">
                {message}
                <span className="mx-8">•</span>
              </span>
            ))}
          </span>
          <span className="inline-block px-8">
            {messages.map((message, index) => (
              <span key={`duplicate-${index}`} className="font-medium tracking-wider px-16">
                {message}
                <span className="mx-8">•</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TopBanner