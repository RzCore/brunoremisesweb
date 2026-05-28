'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function RankingContent() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      const { data, error } = await supabase
        .from('fixture_usuarios')
        .select('*')
        .neq('rol', 'ADMIN')
        .order('puntos', { ascending: false });

      if (!error && data) {
        const dbUsers = data.map(u => ({
          id: u.dni,
          name: u.nombre_apellido,
          points: u.puntos || 0,
          plenos: u.plenos || 0,
          tendencias: u.tendencias || 0,
          telefono: u.telefono || '',
          email: u.email || '',
          isCurrentUser: user ? u.dni === user.dni : false
        }));

        setLeaderboard(dbUsers);
      }
      setLoading(false);
    }
    loadLeaderboard();
  }, [user]);

  // Pasajeros filtrados por búsqueda
  const filteredPasajeros = leaderboard.filter(function(u) {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderItem = (item: any, index: number) => {
    var isTop3 = index < 3;
    var isFirst = index === 0;
    
    return (
      <div 
        key={item.id} 
        className={`grid grid-cols-[3rem_1fr_4rem] gap-2 p-3 items-center border-b border-white/5 last:border-b-0 transition-colors
          ${item.isCurrentUser ? 'bg-accent-gold/20 font-bold' : 'hover:bg-[#2a2a2a]'}
        `}
      >
        <div className="flex justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${isFirst ? 'bg-accent-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 
              index === 1 ? 'bg-gray-300 text-black' : 
              index === 2 ? 'bg-amber-700 text-white' : 'bg-[#333] text-gray-400'}
          `}>
            {index + 1}
          </div>
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className={`font-semibold truncate ${item.isCurrentUser ? 'text-accent-gold font-bold' : 'text-gray-200'}`}>
            {item.name} {item.isCurrentUser && '(Vos)'}
          </span>
          <span className="text-[10px] text-gray-500 truncate">
            {`${item.plenos} plenos • ${item.tendencias} tendencias`}
          </span>
        </div>

        <div className="text-right pr-2">
          <span className={`font-black text-lg ${isTop3 ? 'text-white' : 'text-gray-300'}`}>
            {item.points}
          </span>
        </div>
      </div>
    );
  };

  var renderRankingList = function(list: any[]) {
    // Si hay búsqueda, mostramos todo sin truncar para facilitar encontrar al pasajero
    if (searchQuery.trim() !== '') {
      return list.map(function(item, index) {
        return renderItem(item, index);
      });
    }

    // 1. Mostrar los primeros 10
    const top10 = list.slice(0, 10);
    const elements = top10.map(function(item, index) {
      return renderItem(item, index);
    });

    // 2. Si el usuario actual existe y no está en el top 10, mostrar puntos suspensivos y su puesto
    if (user) {
      const currentUserIndex = list.findIndex(u => u.id === user.dni);
      if (currentUserIndex >= 10) {
        elements.push(
          <div key="separator" className="flex justify-center py-2 bg-[#1a1a1a]/20 border-b border-white/5 select-none">
            <span className="text-gray-500 font-extrabold tracking-[0.4em] text-xs text-center py-0.5">...</span>
          </div>
        );
        elements.push(renderItem(list[currentUserIndex], currentUserIndex));
      }
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-accent-gold font-bold animate-pulse text-lg">Cargando rankings...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <section className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 shadow-[0_0_15px_rgba(212,175,55,0.1)] flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-accent-gold mb-1">Ranking de Clientes</h2>
          <p className="text-sm text-gray-400">Sumá puntos acertando plenos (+6) o tendencias (+3).</p>
        </div>
        <div className="bg-[#2a2a2a] border border-white/10 px-3 py-1.5 rounded-xl text-center shadow shrink-0 ml-4 flex flex-col justify-center min-w-[75px]">
          <span className="text-accent-gold font-black text-xl leading-none">
            {leaderboard.length}
          </span>
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-1 select-none">
            Clientes
          </span>
        </div>
      </section>

      {/* Buscador */}
      <div className="flex flex-col gap-3.5 bg-[#1e1e1e]/60 border border-white/5 rounded-2xl p-4 shadow-sm relative z-20">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Buscar Pasajero</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={function(e) { setSearchQuery(e.target.value); }}
              placeholder="Escribí un nombre..."
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl overflow-hidden shadow-md">
        <div className="grid grid-cols-[3rem_1fr_4rem] gap-2 p-3 bg-[#2a2a2a] text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
          <div className="text-center">Pos</div>
          <div>Pasajero / Cliente</div>
          <div className="text-right pr-2">Pts</div>
        </div>

        <div className="flex flex-col">
          {renderRankingList(filteredPasajeros)}
        </div>
      </div>
    </div>
  );
}
