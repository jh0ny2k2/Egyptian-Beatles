import React, { useState, useEffect } from 'react'

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23D4AF37;stop-opacity:1" /><stop offset="30%" style="stop-color:%23F4E4BC;stop-opacity:0.8" /><stop offset="70%" style="stop-color:%23B8860B;stop-opacity:1" /><stop offset="100%" style="stop-color:%238B4513;stop-opacity:1" /></linearGradient><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:%23FFD700;stop-opacity:0.3" /><stop offset="100%" style="stop-color:%23D4AF37;stop-opacity:0.1" /></radialGradient></defs><rect width="1200" height="800" fill="url(%23bg)"/><circle cx="300" cy="200" r="120" fill="url(%23glow)" opacity="0.4"/><circle cx="900" cy="600" r="180" fill="%23F4E4BC" opacity="0.2"/><polygon points="600,80 680,220 520,220" fill="%23FFD700" opacity="0.5"/><circle cx="150" cy="500" r="80" fill="%23DDD" opacity="0.15"/><polygon points="1000,150 1050,250 950,250" fill="%23B8860B" opacity="0.3"/></svg>')`,
    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
  }

  return (
    <section 
      className="relative h-screen bg-cover bg-center bg-no-repeat overflow-hidden" 
      style={heroStyle}
    >
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-yellow-300 rounded-full opacity-30 animate-pulse`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-center text-white max-w-5xl px-4 transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="mb-6">
            <div className="inline-block px-6 py-2 border border-yellow-400 rounded-full text-sm tracking-widest mb-8 bg-black bg-opacity-20 backdrop-blur-sm">
              COLECCIÓN PREMIUM
            </div>
          </div>
          
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-light tracking-widest mb-8 transition-all duration-1200 delay-300 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              WEAR GOOD
            </span>
            <span className="block mt-2 text-white drop-shadow-2xl">
              STYLE
            </span>
          </h1>
          
          <div className={`space-y-4 transition-all duration-1000 delay-600 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-xl md:text-2xl font-light tracking-wider text-yellow-200">
              ROPA DE
            </p>
            <p className="text-xl md:text-2xl font-light tracking-wider text-yellow-200">
              ESPECIALIDAD
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`mt-12 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-900 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button className="group px-8 py-4 bg-yellow-500 text-black font-semibold tracking-wider rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <span className="group-hover:tracking-widest transition-all duration-300">
                EXPLORAR COLECCIÓN
              </span>
            </button>
            <button className="group px-8 py-4 border-2 border-white text-white font-semibold tracking-wider rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
              <span className="group-hover:tracking-widest transition-all duration-300">
                VER LOOKBOOK
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white text-xs tracking-widest opacity-70">SCROLL</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center relative overflow-hidden group cursor-pointer hover:border-yellow-400 transition-colors duration-300">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce group-hover:bg-yellow-400 transition-colors duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-yellow-400 rounded-full opacity-20 animate-spin" style={{ animationDuration: '20s' }}></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 border border-white rounded-full opacity-10 animate-pulse"></div>
    </section>
  )
}

export default Hero