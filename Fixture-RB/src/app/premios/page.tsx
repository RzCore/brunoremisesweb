'use client';

import { useState, useEffect } from 'react';

export default function Premios() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-accent-gold font-bold animate-pulse text-lg">Cargando premios...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12 items-center justify-center min-h-[70vh] px-4">
      {/* Caja Glassmorphic Premium */}
      <div className="w-full max-w-md bg-[#1a1a1a]/85 backdrop-blur-xl border border-[rgba(212,175,55,0.15)] rounded-3xl p-8 shadow-[0_10px_50px_rgba(0,0,0,0.4)] relative overflow-hidden text-center flex flex-col items-center">
        
        {/* Luces de acento dorado de fondo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-gold/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-gold/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Icono de Regalo Premium Animado */}
        <div className="w-20 h-20 bg-accent-gold/10 border border-accent-gold/35 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative group animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-10 h-10 text-accent-gold group-hover:scale-110 transition-transform duration-300"
          >
            <path d="M20 12v10H4V12" />
            <rect width="20" height="5" x="2" y="7" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          {/* Brillos extras flotando */}
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
        </div>

        <h2 className="text-2xl font-black tracking-wide text-white uppercase mb-2">Premios del Prode</h2>
        <span className="text-accent-gold text-xs font-bold tracking-widest uppercase mb-6 bg-accent-gold/10 px-3.5 py-1.5 rounded-full border border-accent-gold/20 select-none animate-pulse">
          ⚡ Próximamente
        </span>

        <p className="text-sm text-gray-300 leading-relaxed max-w-xs mb-4">
          La dirección de <strong>Remises Bruno</strong> está preparando increíbles sorpresas y recompensas exclusivas para coronar al podio de los mejores del Prode Executive.
        </p>

        <p className="text-xs text-gray-500 max-w-xs leading-relaxed border-t border-white/5 pt-4">
          ¡Seguí cargando tus predicciones y sumando plenos en cada fecha para mantenerte arriba de la tabla general! 🏆✨
        </p>
      </div>
    </div>
  );
}
