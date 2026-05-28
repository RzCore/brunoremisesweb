'use client';

import { useState, useEffect } from 'react';
import { MOCK_MATCHES } from '@/data/mock';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');
  const [predictions, setPredictions] = useState<Record<string, { home: number | '', away: number | '' }>>({});
  const [localPredictions, setLocalPredictions] = useState<Record<string, { home: number | '', away: number | '' }>>({});
  const [timeoutsMap, setTimeoutsMap] = useState<Record<string, any>>({});
  const [editingMatchIds, setEditingMatchIds] = useState<Record<string, boolean>>({});
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [officialResults, setOfficialResults] = useState<Record<string, { home: number, away: number }>>({});

  useEffect(() => {
    async function loadData() {
      // 1. Cargar predicciones del conductor desde Supabase
      if (user) {
        const { data, error } = await supabase
          .from('fixture_predicciones')
          .select('*')
          .eq('usuario_dni', user.dni);
        
        if (!error && data) {
          const loaded: Record<string, { home: number | '', away: number | '' }> = {};
          data.forEach(p => {
            loaded[p.match_id] = {
              home: p.goles_local,
              away: p.goles_visitante
            };
          });
          setPredictions(loaded);
          setLocalPredictions(loaded);
        }
      }

      // 1.5 Cargar resultados manuales oficiales de Supabase
      try {
        const { data: resData } = await supabase
          .from('fixture_resultados_oficiales')
          .select('*');
        if (resData) {
          const mapped: Record<string, { home: number, away: number }> = {};
          resData.forEach(r => {
            mapped[r.match_id] = { home: r.goles_local, away: r.goles_visitante };
          });
          setOfficialResults(mapped);
        }
      } catch (err) {
        console.error('Error al cargar resultados oficiales:', err);
      }

      // 2. Cargar partidos y goles en vivo desde la API de Football-Data.org
      try {
        const res = await fetch('/api/partidos');
        if (res.ok) {
          const apiData = await res.json();
          if (apiData.matches) {
            setLiveMatches(apiData.matches);
          }
        }
      } catch (err) {
        console.error('Error al cargar partidos en vivo:', err);
      }

      setMounted(true);
    }
    loadData();
  }, [user]);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-accent-gold font-bold animate-pulse text-lg">Cargando partidos...</div>
      </div>
    );
  }

  const handlePredictionChange = (matchId: string, team: 'home' | 'away', value: string) => {
    if (value !== '') {
      const val = parseInt(value, 10);
      if (isNaN(val) || val < 0 || val > 99) return;
    }
    const numValue = value === '' ? '' : parseInt(value, 10);
    
    const updatedLocal = {
      ...localPredictions,
      [matchId]: {
        ...(localPredictions[matchId] || { home: '', away: '' }),
        [team]: numValue,
      }
    };
    setLocalPredictions(updatedLocal);

    // Cancelar timeout previo si el usuario sigue tipeando
    if (timeoutsMap[matchId]) {
      clearTimeout(timeoutsMap[matchId]);
    }

    // Setear delay de 1.5 segundos antes de guardarlo definitivamente y moverlo de tab
    const timeout = setTimeout(async () => {
      const pred = updatedLocal[matchId];
      if (pred && pred.home !== '' && pred.away !== '') {
        // Impactar en la lista principal (provoca que se mueva a la pestaña de Guardados)
        setPredictions(prev => ({
          ...prev,
          [matchId]: pred
        }));

        // Persistir en Supabase
        if (user) {
          const { error } = await supabase
            .from('fixture_predicciones')
            .upsert({
              usuario_dni: user.dni,
              match_id: matchId,
              goles_local: pred.home,
              goles_visitante: pred.away
            }, { onConflict: 'usuario_dni,match_id' });

          if (error) {
            console.error('Error al guardar predicción en Supabase:', error);
          }
        }
      }
    }, 1500);

    setTimeoutsMap(prev => ({
      ...prev,
      [matchId]: timeout
    }));
  };

  // Fusionar fixture local con resultados en vivo
  const mergedMatches = MOCK_MATCHES.map(function(mockMatch) {
    // Si hay resultado manual cargado por el administrador, tiene prioridad absoluta
    const official = officialResults[mockMatch.id];
    if (official !== undefined) {
      return {
        ...mockMatch,
        status: 'FINISHED' as any,
        homeScore: official.home,
        awayScore: official.away,
      };
    }

    const live = liveMatches.find(function(lm) {
      // Comparar por códigos TLA de equipos o por sus nombres oficiales
      const homeMatch = lm.homeTeam.tla === mockMatch.homeTeam.id || lm.homeTeam.name === mockMatch.homeTeam.name;
      const awayMatch = lm.awayTeam.tla === mockMatch.awayTeam.id || lm.awayTeam.name === mockMatch.awayTeam.name;
      return homeMatch && awayMatch;
    });

    if (live) {
      const isFinished = live.status === 'FINISHED';
      const isInProgress = live.status === 'IN_PLAY' || live.status === 'LIVE';
      return {
        ...mockMatch,
        status: isFinished ? 'FINISHED' : isInProgress ? 'IN_PROGRESS' : 'PENDING' as any,
        homeScore: live.score.home !== null ? live.score.home : mockMatch.homeScore,
        awayScore: live.score.away !== null ? live.score.away : mockMatch.awayScore,
      };
    }
    return mockMatch;
  });

  const filteredMatches = mergedMatches.filter(function(match) {
    const pred = predictions[match.id];
    const hasPrediction = pred && pred.home !== '' && pred.away !== '';
    if (filter === 'PENDING') return !hasPrediction;
    if (filter === 'COMPLETED') return hasPrediction;
    return true;
  });

  const pendingNoPredictionCount = mergedMatches.filter(function(m) {
    const matchTime = new Date(m.date).getTime();
    const fortyEightHoursInMs = 48 * 60 * 60 * 1000;
    const isUpcomingAndEditable = m.status === 'PENDING' && (matchTime - Date.now() >= fortyEightHoursInMs);
    const pred = predictions[m.id];
    const hasPrediction = pred && pred.home !== '' && pred.away !== '';
    return isUpcomingAndEditable && !hasPrediction;
  }).length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <section className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        <h2 className="text-xl font-bold text-accent-gold mb-1">Mis Predicciones</h2>
        <p className="text-sm text-gray-400">Completá los resultados. Tenés hasta 1 minuto antes de que empiece el partido.</p>
      </section>

      {pendingNoPredictionCount > 0 && (
        <div className="bg-accent-gold/15 border border-accent-gold/30 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(212,175,55,0.15)] animate-pulse">
          <div className="flex items-center gap-2 text-accent-gold">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span className="text-xs font-bold text-white leading-tight">
              ¡Tenés {pendingNoPredictionCount} partido{pendingNoPredictionCount > 1 ? 's' : ''} sin pronosticar!
            </span>
          </div>
          <button 
            onClick={function() { setFilter('PENDING'); }}
            className="text-[10px] font-black uppercase bg-accent-gold text-[#050508] px-2.5 py-1.5 rounded-lg shadow-md hover:bg-accent-gold-light active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            Completar
          </button>
        </div>
      )}

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
          // Un partido se bloquea si ya empezó o si faltan menos de 48 horas para su inicio
          var matchTime = new Date(match.date).getTime();
          var fortyEightHoursInMs = 48 * 60 * 60 * 1000;
          var isLocked = match.status !== 'PENDING' || (matchTime - Date.now() < fortyEightHoursInMs);
          
          var d = new Date(match.date);
          var day = d.getDate();
          var month = d.getMonth() + 1;
          var hours = d.getHours();
          var minutes = d.getMinutes();
          var dateString = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
          var timeString = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
 
          var pred = localPredictions[match.id];
          var homeVal = isLocked ? (match.homeScore !== undefined && match.homeScore !== null ? match.homeScore : '') : (pred ? pred.home : '');
          var awayVal = isLocked ? (match.awayScore !== undefined && match.awayScore !== null ? match.awayScore : '') : (pred ? pred.away : '');
          
          var isSaved = pred && pred.home !== '' && pred.away !== '';
          var inputDisabled = isLocked;
          
          return (
            <div key={match.id} className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                <span className="bg-white/10 px-2 py-0.5 rounded-md">Grupo {match.groupId}</span>
                <div className="flex items-center gap-2">
                  <span>{dateString + ' - ' + timeString}</span>
                  {!isLocked && isSaved && (
                    <span className="text-[9px] bg-green-950/30 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Guardado
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[9px] bg-red-950/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Bloqueado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 gap-4">
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

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="w-12 h-14 bg-[#2a2a2a] border border-accent-gold/30 rounded-lg text-center text-xl font-bold text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold disabled:opacity-50 disabled:bg-[#1a1a1a]"
                    value={homeVal}
                    onChange={function(e) { handlePredictionChange(match.id, 'home', e.target.value); }}
                    disabled={inputDisabled}
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
                    disabled={inputDisabled}
                    placeholder="-"
                  />
                </div>

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
