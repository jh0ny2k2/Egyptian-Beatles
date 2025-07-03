import React from 'react'

const phrases = [
  "¡Nuevas colecciones cada semana!",
  "Envío gratis en compras superiores a $50",
  "Descubre tu estilo único",
  "Descuentos exclusivos solo por hoy",
  "Moda sostenible y responsable",
  "Compra ahora, paga después",
  "Tendencias que inspiran",
  "¡Viste diferente, viste auténtico!"
]

const TopBanner = () => (
  <div className="bg-black text-white overflow-hidden py-3 w-full">
    <div className="whitespace-nowrap animate-marquee flex">
      {phrases.concat(phrases).map((phrase, idx) => (
        <span key={idx} className="mx-8 text-sm font-semibold">
          {phrase}
        </span>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        display: flex;
        animation: marquee 18s linear infinite;
      }
    `}</style>
  </div>
)

export default TopBanner