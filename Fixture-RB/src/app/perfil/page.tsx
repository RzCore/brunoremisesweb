'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Perfil() {
  const { user, logout } = useAuth();
  const [showReglamento, setShowReglamento] = useState(false);
  const [formData, setFormData] = useState({
    nombreApellido: '',
    dni: '',
    telefono: '',
    email: ''
  });

  // Sincronizar estado local con datos persistidos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        nombreApellido: user.name,
        dni: user.dni,
        telefono: user.telefono || '',
        email: user.email || ''
      });
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <section className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 shadow-[0_0_15px_rgba(212,175,55,0.1)] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-gold mb-1">Mi Perfil</h2>
          <p className="text-sm text-gray-400">Datos registrados del pasajero.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center border-2 border-accent-gold overflow-hidden shadow-lg shrink-0 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          {user && (
            <span className="text-[10px] bg-accent-gold/20 text-accent-gold font-black px-2 py-0.5 rounded-md mt-1.5 uppercase select-none">
              {user.points} Puntos
            </span>
          )}
        </div>
      </section>

      {/* Ficha Premium de Lectura de Datos */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 shadow-md flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-gold/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Nombre y Apellido */}
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Nombre y Apellido</span>
          <span className="text-sm font-bold text-white pr-1 text-right max-w-[200px] truncate">{formData.nombreApellido || '-'}</span>
        </div>

        {/* D.N.I. */}
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">D.N.I.</span>
          <span className="text-sm font-bold text-white pr-1">{formData.dni || '-'}</span>
        </div>

        {/* Teléfono */}
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Teléfono</span>
          <span className="text-sm font-bold text-white pr-1 text-right max-w-[200px] truncate">{formData.telefono || '-'}</span>
        </div>

        {/* Correo Electrónico */}
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Correo Electrónico</span>
          <span className="text-sm font-bold text-white pr-1 text-right max-w-[200px] truncate">{formData.email || '-'}</span>
        </div>

        {/* Estadísticas deportivas del perfil */}
        {user && (
          <div className="grid grid-cols-2 gap-3 mt-2 bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="text-center flex flex-col">
              <span className="text-accent-gold text-lg font-black">{user.plenos}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Aciertos Plenos (+6)</span>
            </div>
            <div className="text-center flex flex-col border-l border-white/5">
              <span className="text-accent-gold text-lg font-black">{user.tendencias}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Tendencias (+3)</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-3">
          <button 
            type="button"
            onClick={function() {
              const text = `🏆 ¡Estoy participando en el Prode Premium de Remises Bruno! ⚽\n` +
                           `🔥 Llevo acumulados ${user?.points || 0} puntos (${user?.plenos || 0} plenos y ${user?.tendencias || 0} tendencias).\n` +
                           `👉 ¡Registrate y sumate a jugar acá para ganarme! ✨\n\n` +
                           `https://bruno-remises-prode.vercel.app/`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="w-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-semibold py-3 rounded-xl hover:bg-[#25D366]/20 transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Compartir Prode
          </button>
          
          <button 
            type="button"
            onClick={function() { setShowReglamento(true); }}
            className="w-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold font-semibold py-3 rounded-xl hover:bg-accent-gold/20 transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Ver Reglas 📋
          </button>
        </div>

        <button 
          type="button"
          onClick={logout}
          className="w-full bg-red-950/20 border border-red-500/20 text-red-400 font-semibold py-3.5 rounded-xl hover:bg-red-950/40 transition-colors text-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 text-[11px] text-blue-300 flex gap-3 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <p>
          Tus datos quedaron fijos tras el registro para asegurar la validez del fixture. En caso de que necesites corregir algún dato de contacto para reclamar un premio, comunícate con Remises Bruno.
        </p>
      </div>

      {/* MODAL DE REGLAS / REGLAMENTO DEL PRODE */}
      {showReglamento && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={function() { setShowReglamento(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 bg-white/5 border border-white/10 rounded-full transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
              <span className="text-2xl">📋</span>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Reglas del Prode Executive</h3>
            </div>

            <div className="flex flex-col gap-4 text-xs text-gray-300 leading-relaxed">
              <section className="flex flex-col gap-1.5">
                <h4 className="font-bold text-accent-gold uppercase tracking-wide">🏆 Sistema de Puntuación</h4>
                <p>El sistema calcula tus puntos automáticamente según la precisión del pronóstico:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1 mt-1 text-gray-400">
                  <li><strong className="text-white">+6 Puntos (Pleno):</strong> Si acertás el resultado exacto del partido (ej. pronosticaste 2-1 y terminó 2-1).</li>
                  <li><strong className="text-white">+3 Puntos (Tendencia):</strong> Si acertás el ganador o el empate pero no los goles (ej. pronosticaste 2-0 y terminó 1-0; o pronosticaste 1-1 y terminó 2-2).</li>
                  <li><strong className="text-white">0 Puntos:</strong> Si no acertás ni ganador ni tendencia.</li>
                </ul>
              </section>

              <section className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <h4 className="font-bold text-accent-gold uppercase tracking-wide">⏱️ Definición de Partidos</h4>
                <p>
                  Para garantizar la claridad y transparencia, <strong>todos los partidos se computan con el resultado oficial al cumplirse los 90 minutos reglamentarios de juego + tiempo de descuento adicionado</strong>.
                </p>
                <p className="text-gray-400">
                  ⚠️ Los tiempos suplementarios (alargue) y definiciones por penales <strong>no son tenidos en cuenta</strong> para los puntos del Prode.
                </p>
              </section>

              <section className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <h4 className="font-bold text-accent-gold uppercase tracking-wide">🔒 Bloqueo Anti-Trampas</h4>
                <p>
                  Podés editar tus pronósticos las veces que quieras. Sin embargo, el partido <strong>se congelará automáticamente exactamente 1 minuto antes</strong> del horario programado de inicio. Pasado ese tiempo, no podrás realizar modificaciones.
                </p>
              </section>

              <section className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <h4 className="font-bold text-accent-gold uppercase tracking-wide">📊 Transparencia en Rankings</h4>
                <p>
                  El leaderboard de pasajeros es único y de alcance global, permitiendo a todos los clientes VIP de Remises Bruno competir por increíbles beneficios mensuales en base a su puntuación acumulada.
                </p>
              </section>
            </div>

            <button 
              onClick={function() { setShowReglamento(false); }}
              className="w-full mt-6 bg-accent-gold text-[#050508] font-bold py-3 rounded-xl hover:bg-accent-gold-light transition-all text-xs uppercase tracking-wider cursor-pointer"
            >
              ¡Entendido, a Jugar!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
