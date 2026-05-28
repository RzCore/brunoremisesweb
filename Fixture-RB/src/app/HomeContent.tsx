'use client';

import { useState } from 'react';
import { MOCK_MATCHES } from '@/data/mock';

export default function HomeContent() {
  const [filter, setFilter] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');
  const [predictions, setPredictions] = useState<Record<string, { home: number | '', away: number | '' }>>({});

  const handlePredictionChange = (matchId: string, team: 'home' | 'away', value: string) => {
    if (value !== '') {
      const val = parseInt(value, 10);
      if (isNaN(val) || val < 0 || val > 99) return;
    }
    const numValue = value === '' ? '' : parseInt(value, 10);
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { home: '', away: '' }),
        [team]: numValue,
      },
    }));
  };

  const filteredMatches = MOCK_MATCHES.filter(function(match) {
    const pred = predictions[match.id];
    const hasPrediction = pred && pred.home !== '' && pred.away !== '';
    if (filter === 'PENDING') return !hasPrediction;
    if (filter === 'COMPLETED') return hasPrediction;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <section className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        <h2 className="text-xl font-bold text-accent-gold mb-1">Mis Predicciones</h2>
        <p className="text-sm text-gray-400">Completá los resultados. Tenés hasta 1 minuto antes de que empiece el partido.</p>
      </section>

      {/* Móvil: Selector Nativo */}
      <div className="block sm:hidden relative z-20">
        <select 
          value={filter}
          onChange={function(e) { setFilter(e.target.value as 'PENDING' | 'COMPLETED' | 'ALL'); }}
          className="w-full bg-[#1e1e1e] border border-accent-gold/30 rounded-lg px-4 py-3.5 text-sm font-bold text-accent-gold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-accent-gold appearance-none"
        >
          <option value="PENDING">Partidos Pendientes</option>
          <option value="COMPLETED">Partidos Guardados</option>
          <option value="ALL">Todos los Partidos</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent-gold">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>

      {/* Desktop: Tabs */}
      <div className="hidden sm:grid grid-cols-3 bg-[#1e1e1e] border border-white/10 rounded-lg p-1 gap-1 relative z-20">
        <button 
          onClick={function() { setFilter('PENDING'); }}
          className={`w-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider py-3 rounded-md transition-all touch-manipulation cursor-pointer ${filter === 'PENDING' ? 'bg-accent-gold text-[#050508] shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Pendientes
        </button>
        <button 
          onClick={function() { setFilter('COMPLETED'); }}
          className={`w-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider py-3 rounded-md transition-all touch-manipulation cursor-pointer ${filter === 'COMPLETED' ? 'bg-accent-gold text-[#050508] shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Guardadas
        </button>
        <button 
          onClick={function() { setFilter('ALL'); }}
          className={`w-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider py-3 rounded-md transition-all touch-manipulation cursor-pointer ${filter === 'ALL' ? 'bg-accent-gold text-[#050508] shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Todos
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredMatches.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-sm">
            No hay partidos en esta categoría.
          </div>
        )}
        {filteredMatches.map(function(match) {
          var isLocked = match.status !== 'PENDING';
          
          var d = new Date(match.date);
          var day = d.getDate();
          var month = d.getMonth() + 1;
          var hours = d.getHours();
          var minutes = d.getMinutes();
          var dateString = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
          var timeString = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
 
          var pred = predictions[match.id];
          var homeVal = isLocked ? (match.homeScore !== undefined && match.homeScore !== null ? match.homeScore : '') : (pred ? pred.home : '');
          var awayVal = isLocked ? (match.awayScore !== undefined && match.awayScore !== null ? match.awayScore : '') : (pred ? pred.away : '');
          
          return (
            <div key={match.id} className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                <span className="bg-white/10 px-2 py-0.5 rounded-md">Grupo {match.groupId}</span>
                <span>{dateString + ' - ' + timeString}</span>
              </div>

              <div className="flex items-center justify-between mt-2 gap-4">
                {/* Equipo Local */}
                <div className="flex flex-col items-center flex-1 gap-1">
                  <div className="w-10 h-10 relative overflow-hidden rounded-full shadow-sm border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={'https://flagcdn.com/w80/' + match.homeTeam.countryCode + '.png'} alt={match.homeTeam.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold w-full text-center leading-tight h-8 flex flex-col justify-center items-center">
                    {match.homeTeam.name === 'Bosnia y Herzegovina' ? (
                      <><span>Bosnia y</span><span>Herzegovina</span></>
                    ) : (
                      match.homeTeam.name
                    )}
                  </span>
                </div>

                {/* Marcador / Inputs */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="w-12 h-14 bg-[#2a2a2a] border border-accent-gold/30 rounded-lg text-center text-xl font-bold text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold disabled:opacity-50 disabled:bg-[#1a1a1a]"
                    value={homeVal}
                    onChange={function(e) { handlePredictionChange(match.id, 'home', e.target.value); }}
                    disabled={isLocked}
                    placeholder="-"
                  />
                  <span className="text-gray-500 font-bold">-</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="w-12 h-14 bg-[#2a2a2a] border border-accent-gold/30 rounded-lg text-center text-xl font-bold text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold disabled:opacity-50 disabled:bg-[#1a1a1a]"
                    value={awayVal}
                    onChange={function(e) { handlePredictionChange(match.id, 'away', e.target.value); }}
                    disabled={isLocked}
                    placeholder="-"
                  />
                </div>

                {/* Equipo Visitante */}
                <div className="flex flex-col items-center flex-1 gap-1">
                  <div className="w-10 h-10 relative overflow-hidden rounded-full shadow-sm border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={'https://flagcdn.com/w80/' + match.awayTeam.countryCode + '.png'} alt={match.awayTeam.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold w-full text-center leading-tight h-8 flex flex-col justify-center items-center">
                    {match.awayTeam.name === 'Bosnia y Herzegovina' ? (
                      <><span>Bosnia y</span><span>Herzegovina</span></>
                    ) : (
                      match.awayTeam.name
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
