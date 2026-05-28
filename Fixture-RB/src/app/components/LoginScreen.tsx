'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regNombre, setRegNombre] = useState('');
  const [regDni, setRegDni] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const success = await login(loginEmail.trim(), loginPass);
    if (!success) {
      setLoginError('Correo electrónico o D.N.I. incorrectos.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regNombre || !regDni || !regTelefono || !regEmail) {
      setRegError('Por favor completá todos los campos.');
      return;
    }

    // Validación DNI argentino (debe tener entre 7 y 8 dígitos limpios)
    const cleanDni = regDni.replace(/\./g, '');
    if (cleanDni.length < 7 || cleanDni.length > 8) {
      setRegError('El D.N.I. debe tener entre 7 y 8 dígitos.');
      return;
    }

    // Validación formato email básica
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Por favor ingresá un correo electrónico válido.');
      return;
    }

    const success = await register({
      name: regNombre,
      dni: regDni,
      telefono: regTelefono,
      email: regEmail
    });

    if (!success) {
      setRegError('Error al registrar. Es posible que este D.N.I. ya se encuentre registrado.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8 animate-in fade-in duration-700">
      
      {/* Caja Principal Glassmorphic */}
      <div className="w-full max-w-md bg-[#1a1a1a]/85 backdrop-blur-xl border border-[rgba(212,175,55,0.15)] rounded-3xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">
        
        {/* Adorno brillante de fondo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-gold/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-gold/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Encabezado Logo */}
        <div className="flex flex-col items-center gap-3 mb-6 relative z-10">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent-gold shadow-lg shadow-accent-gold/20 animate-pulse">
            <img src="/Logo.jpg" alt="Logo Remises Bruno" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl font-black tracking-wide text-white">PRODE EXECUTIVE</h1>
            <span className="text-accent-gold text-xs font-bold tracking-widest uppercase mt-0.5">Remises Bruno</span>
          </div>
        </div>

        {/* Toggle Login / Registro */}
        <div className="grid grid-cols-2 bg-black/40 border border-white/5 rounded-xl p-1 gap-1 mb-6 relative z-10">
          <button 
            onClick={() => { setIsLogin(true); setLoginError(''); }}
            className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isLogin ? 'bg-accent-gold text-[#050508] shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Ingresar
          </button>
          <button 
            onClick={() => { setIsLogin(false); setRegError(''); }}
            className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !isLogin ? 'bg-accent-gold text-[#050508] shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario de Login */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Correo Electrónico de Cliente</label>
              <input 
                type="text" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                placeholder="Ingresá tu correo electrónico"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Contraseña (Tu D.N.I.)</label>
              <input 
                type="password" 
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                placeholder="Ingresá tu D.N.I."
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-xs font-medium bg-red-950/20 border border-red-500/20 rounded-lg p-2.5 pl-3 leading-relaxed mt-1">
                ⚠️ {loginError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full mt-2 bg-accent-gold text-[#050508] font-bold py-3.5 rounded-xl hover:bg-accent-gold-light transition-all shadow-lg shadow-accent-gold/10 hover:shadow-accent-gold/20 text-xs uppercase tracking-wider active:scale-[0.98]"
            >
              Iniciar Sesión
            </button>


          </form>
        ) : (
          /* Formulario de Registro */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5 relative z-10">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nombre y Apellido</label>
              <input 
                type="text" 
                required
                value={regNombre}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]/g, '');
                  setRegNombre(filtered);
                }}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                placeholder="Ej. Martín Silva"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">D.N.I. (Único por participante)</label>
              <input 
                type="text" 
                required
                value={regDni}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                  let formatted = digits;
                  if (digits.length > 2 && digits.length <= 5) {
                    formatted = `${digits.slice(0, digits.length - 3)}.${digits.slice(digits.length - 3)}`;
                  } else if (digits.length > 5) {
                    formatted = `${digits.slice(0, digits.length - 6)}.${digits.slice(digits.length - 6, digits.length - 3)}.${digits.slice(digits.length - 3)}`;
                  }
                  setRegDni(formatted);
                }}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                placeholder="Ej. 34.567.890"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Teléfono de Contacto</label>
              <input 
                type="tel" 
                required
                value={regTelefono}
                onChange={(e) => setRegTelefono(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                placeholder="Ej. +54 9 11 2345-6789"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
              <input 
                type="email" 
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                placeholder="Ej. martin@remisesbruno.com"
              />
            </div>

            {regError && (
              <p className="text-red-500 text-xs font-medium bg-red-950/20 border border-red-500/20 rounded-lg p-2 leading-relaxed">
                ⚠️ {regError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full mt-2 bg-accent-gold text-[#050508] font-bold py-3.5 rounded-xl hover:bg-accent-gold-light transition-all shadow-lg shadow-accent-gold/10 text-xs uppercase tracking-wider active:scale-[0.98]"
            >
              Crear Cuenta & Jugar
            </button>
          </form>
        )}
      </div>
      
      {/* Footer de la Agrupación */}
      <div className="flex flex-col items-center gap-3.5 mt-6 relative z-10 select-none">
        <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase opacity-75">
          Servicios Ejecutivos • Remises Bruno
        </span>
        <a 
          href="https://rzcore.dev" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-300 bg-white/5 border border-white/5 rounded-full px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
        >
          <img 
            src="/Isologo.png" 
            alt="RzCore Logo" 
            className="w-4.5 h-4.5 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Desarrollado por <span className="text-white font-black">RzCore</span>
          </span>
        </a>
      </div>
    </div>
  );
}
