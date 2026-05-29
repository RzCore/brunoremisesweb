'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_MATCHES } from '@/data/mock';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalPredictions: 0 });
  
  // Formulario Carga de Resultados
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [golesLocal, setGolesLocal] = useState('');
  const [golesVisitante, setGolesVisitante] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [savingResult, setSavingResult] = useState(false);

  // Estados de Recálculo
  const [recalculating, setRecalculating] = useState(false);
  const [recalcSuccess, setRecalcSuccess] = useState('');
  const [recalcError, setRecalcError] = useState('');

  // Gestión de Pasajeros
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [banningDni, setBanningDni] = useState('');

  // Bitácora de Auditoría (Logs)
  const [logsList, setLogsList] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function checkApiConnection() {
      try {
        const { error } = await supabase.from('fixture_usuarios').select('dni').limit(1);
        if (!error) {
          setApiOk(true);
        } else {
          setApiOk(false);
        }
      } catch (err) {
        setApiOk(false);
      }
    }
    if (mounted && user?.role === 'ADMIN') {
      checkApiConnection();
    }
  }, [mounted, user]);

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, mounted, router]);

  async function loadMetricsAndData() {
    if (user && user.role === 'ADMIN') {
      // 1. Cargar métricas rápidas
      const { count: usersCount } = await supabase
        .from('fixture_usuarios')
        .select('*', { count: 'exact', head: true });

      const { count: predsCount } = await supabase
        .from('fixture_predicciones')
        .select('*', { count: 'exact', head: true });

      setMetrics({
        totalUsers: usersCount || 0,
        totalPredictions: predsCount || 0
      });

      // 2. Cargar todos los clientes
      const { data: dbUsers } = await supabase
        .from('fixture_usuarios')
        .select('*')
        .order('puntos', { ascending: false });
      
      if (dbUsers) {
        setUsersList(dbUsers);
      }

      // 3. Cargar logs de auditoría
      setLoadingLogs(true);
      const { data: dbLogs } = await supabase
        .from('fixture_logs_actividad')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (dbLogs) {
        setLogsList(dbLogs);
      }
      setLoadingLogs(false);
    }
  }

  useEffect(() => {
    if (mounted && user?.role === 'ADMIN') {
      loadMetricsAndData();
    }
  }, [user, mounted]);

  // Escribir un log en Supabase
  const writeAuditLog = async (accion: string, detalles: string) => {
    if (!user) return;
    try {
      await supabase
        .from('fixture_logs_actividad')
        .insert([{
          usuario_dni: user.dni,
          usuario_nombre: user.name,
          accion,
          detalles
        }]);
    } catch (err) {
      console.error('Error al guardar log de auditoría:', err);
    }
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedMatchId || golesLocal === '' || golesVisitante === '') {
      setFormError('Por favor completá todos los campos del resultado.');
      return;
    }

    const gl = parseInt(golesLocal, 10);
    const gv = parseInt(golesVisitante, 10);

    if (isNaN(gl) || isNaN(gv) || gl < 0 || gv < 0) {
      setFormError('Los goles deben ser números enteros positivos.');
      return;
    }

    const matchInfo = MOCK_MATCHES.find(m => m.id === selectedMatchId);
    const matchLabel = matchInfo 
      ? `${matchInfo.homeTeam.name} vs. ${matchInfo.awayTeam.name}`
      : selectedMatchId;

    setSavingResult(true);
    try {
      const { error } = await supabase
        .from('fixture_resultados_oficiales')
        .upsert({
          match_id: selectedMatchId,
          goles_local: gl,
          goles_visitante: gv
        }, { onConflict: 'match_id' });

      if (error) {
        throw error;
      }

      // Escribir log de auditoría
      await writeAuditLog(
        'CARGA_RESULTADO', 
        `Cargó el resultado oficial ${gl}-${gv} para el partido: ${matchLabel} (ID: ${selectedMatchId})`
      );

      setFormSuccess('Resultado oficial guardado y publicado con éxito.');
      setGolesLocal('');
      setGolesVisitante('');
      setSelectedMatchId('');
      loadMetricsAndData();
    } catch (err: any) {
      console.error(err);
      setFormError(`Error al guardar: ${err.message || 'Error desconocido'}`);
    } finally {
      setSavingResult(false);
    }
  };

  const handleRecalculatePoints = async () => {
    setRecalcSuccess('');
    setRecalcError('');
    setRecalculating(true);

    try {
      // 1. Obtener todos los resultados oficiales
      const { data: resultados, error: resError } = await supabase
        .from('fixture_resultados_oficiales')
        .select('*');

      if (resError) throw resError;

      // 2. Obtener todas las predicciones de los clientes
      const { data: predicciones, error: predError } = await supabase
        .from('fixture_predicciones')
        .select('*');

      if (predError) throw predError;

      // 3. Obtener todos los usuarios de Supabase
      const { data: usuarios, error: userError } = await supabase
        .from('fixture_usuarios')
        .select('*');

      if (userError) throw userError;

      // Convertir resultados a un mapa de consulta rápida
      const resultsMap = new Map<string, { home: number; away: number }>();
      resultados?.forEach(r => {
        resultsMap.set(r.match_id, { home: r.goles_local, away: r.goles_visitante });
      });

      // Agrupar predicciones por usuario
      const userPointsMap = new Map<string, { puntos: number; plenos: number; tendencias: number }>();
      
      // Inicializar cada usuario con 0 puntos
      usuarios?.forEach(u => {
        userPointsMap.set(u.dni, { puntos: 0, plenos: 0, tendencias: 0 });
      });

      // Calcular puntos para cada predicción en base a los resultados oficiales cargados
      predicciones?.forEach(p => {
        const oficial = resultsMap.get(p.match_id);
        if (!oficial) return; // Si el partido no tiene resultado oficial cargado, se ignora

        const pLocal = p.goles_local;
        const pVisitante = p.goles_visitante;
        const oLocal = oficial.home;
        const oVisitante = oficial.away;

        let puntos = 0;
        let esPleno = false;
        let esTendencia = false;

        if (pLocal === oLocal && pVisitante === oVisitante) {
          // Pleno: resultado exacto
          puntos = 6;
          esPleno = true;
        } else {
          // Tendencia: acertar ganador o empate
          const predGanador = pLocal > pVisitante ? 'L' : pLocal < pVisitante ? 'V' : 'E';
          const ofiGanador = oLocal > oVisitante ? 'L' : oLocal < oVisitante ? 'V' : 'E';
          if (predGanador === ofiGanador) {
            puntos = 3;
            esTendencia = true;
          }
        }

        const userScore = userPointsMap.get(p.usuario_dni) || { puntos: 0, plenos: 0, tendencias: 0 };
        userPointsMap.set(p.usuario_dni, {
          puntos: userScore.puntos + puntos,
          plenos: userScore.plenos + (esPleno ? 1 : 0),
          tendencias: userScore.tendencias + (esTendencia ? 1 : 0)
        });
      });

      // 4. Actualizar cada usuario en la base de datos
      let updatedCount = 0;
      for (const [dni, score] of userPointsMap.entries()) {
        const { error: updateError } = await supabase
          .from('fixture_usuarios')
          .update({
            puntos: score.puntos,
            plenos: score.plenos,
            tendencias: score.tendencias
          })
          .eq('dni', dni);

        if (updateError) {
          console.error(`Error al actualizar DNI ${dni}:`, updateError);
        } else {
          updatedCount++;
        }
      }

      // Escribir log de auditoría
      await writeAuditLog(
        'RECALCULO_PUNTOS', 
        `Ejecutó el recálculo general de puntos. Se actualizaron los puntajes de ${updatedCount} clientes en tiempo real.`
      );

      setRecalcSuccess(`Recálculo completado. Se actualizaron los puntajes de ${updatedCount} clientes en tiempo real.`);
      loadMetricsAndData();
    } catch (err: any) {
      console.error(err);
      setRecalcError(`Error en el recálculo: ${err.message || 'Error desconocido'}`);
    } finally {
      setRecalculating(false);
    }
  };

  const handleBanUser = async (targetDni: string) => {
    if (user && targetDni === user.dni) {
      alert('⚠️ No podés auto-banearte.');
      return;
    }

    const targetUser = usersList.find(u => u.dni === targetDni);
    const targetName = targetUser ? targetUser.nombre_apellido : targetDni;

    if (confirm(`⚠️ ¿Estás seguro de que deseas BANEAR y ELIMINAR definitivamente al cliente ${targetName} (DNI: ${targetDni})?\nEsta acción borrará al usuario y todas sus predicciones de forma irreversible.`)) {
      setBanningDni(targetDni);
      try {
        // 1. Eliminar sus predicciones primero
        await supabase
          .from('fixture_predicciones')
          .delete()
          .eq('usuario_dni', targetDni);

        // 2. Eliminar al usuario de la tabla
        const { error } = await supabase
          .from('fixture_usuarios')
          .delete()
          .eq('dni', targetDni);

        if (error) throw error;

        // Escribir log de auditoría
        await writeAuditLog(
          'BANEO_USUARIO', 
          `Baneó y eliminó definitivamente al cliente ${targetName} (DNI: ${targetDni})`
        );

        alert('Cliente eliminado y baneado con éxito de la base de datos.');
        loadMetricsAndData();
      } catch (err: any) {
        console.error(err);
        alert(`Error al banear: ${err.message || 'Error desconocido'}`);
      } finally {
        setBanningDni('');
      }
    }
  };

  const filteredUsers = usersList.filter(u => {
    const query = userSearchQuery.toLowerCase();
    return u.nombre_apellido.toLowerCase().includes(query) || u.dni.includes(query);
  });

  if (!mounted || loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-3">
        <div className="text-accent-gold font-bold animate-pulse text-lg">Verificando acceso de administrador...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      {/* Cabecera Premium */}
      <section className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 shadow-[0_0_15px_rgba(212,175,55,0.1)] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-accent-gold mb-1">Panel de Control ⚙️</h2>
          <p className="text-sm text-gray-400">Herramientas administrativas de Bruno Remises.</p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* API Connection Indicator */}
          {apiOk === null && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-400 select-none uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
              <span>Verificando API...</span>
            </div>
          )}
          {apiOk === true && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-[10px] font-bold text-emerald-400 select-none uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>API Conectada</span>
            </div>
          )}
          {apiOk === false && (
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-full text-[10px] font-bold text-rose-400 select-none uppercase tracking-wider shadow-[0_0_10px_rgba(244,63,94,0.1)] animate-bounce">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              <span>API Desconectada</span>
            </div>
          )}
          
          <div className="bg-accent-gold text-[#050508] font-black text-xs px-3.5 py-2 rounded-full select-none uppercase tracking-wider shadow shadow-accent-gold/25">
            Admin
          </div>
        </div>
      </section>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 shadow flex flex-col gap-1.5 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent-gold/5 rounded-full blur-[40px] pointer-events-none" />
          <span className="text-2xl">👥</span>
          <span className="text-2xl font-black text-white">{metrics.totalUsers}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none select-none">Pasajeros</span>
        </div>

        <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 shadow flex flex-col gap-1.5 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent-gold/5 rounded-full blur-[40px] pointer-events-none" />
          <span className="text-2xl">⚽</span>
          <span className="text-2xl font-black text-white">{metrics.totalPredictions}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none select-none">Predicciones</span>
        </div>
      </div>

      {/* SECCIÓN 1: RECALCULAR PUNTOS */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">🔄 Sistema de Puntos</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Esta herramienta escanea todas las predicciones de los clientes y las compara con los resultados oficiales que hayas cargado en la base de datos de Supabase. Recalcula plenos (+6), tendencias (+3) y actualiza el Leaderboard al instante.
        </p>

        <button 
          onClick={handleRecalculatePoints}
          disabled={recalculating}
          className="w-full bg-accent-gold text-[#050508] font-bold py-3.5 rounded-xl hover:bg-accent-gold-light active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          {recalculating ? 'Procesando recálculo en Supabase...' : '🔄 Recalcular Puntos de Pasajeros'}
        </button>

        {recalcSuccess && (
          <p className="text-green-400 text-xs font-semibold bg-green-950/20 border border-green-500/20 rounded-lg p-2.5">
            ✔ {recalcSuccess}
          </p>
        )}
        {recalcError && (
          <p className="text-red-400 text-xs font-semibold bg-red-950/20 border border-red-500/20 rounded-lg p-2.5">
            ⚠️ {recalcError}
          </p>
        )}
      </div>

      {/* SECCIÓN 2: CARGAR RESULTADOS OFICIALES */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">⚽ Cargar Resultados de Partidos</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Selecciona un partido del fixture oficial e ingresá el resultado de los 90 minutos de juego reglamentarios. Este resultado se utilizará para el recálculo del Prode.
        </p>

        <form onSubmit={handleSaveResult} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Seleccionar Partido</label>
            <div className="relative">
              <select
                required
                value={selectedMatchId}
                onChange={e => setSelectedMatchId(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold appearance-none cursor-pointer pr-10"
              >
                <option value="">Selecciona un encuentro...</option>
                {MOCK_MATCHES.map(m => {
                  const d = new Date(m.date);
                  const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
                  return (
                    <option key={m.id} value={m.id}>
                      {`[Grupo ${m.groupId}] ${m.homeTeam.name} vs. ${m.awayTeam.name} (${dateStr})`}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Goles Local</label>
              <input
                type="number"
                min="0"
                max="99"
                required
                value={golesLocal}
                onChange={e => setGolesLocal(e.target.value)}
                placeholder="Local"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Goles Visitante</label>
              <input
                type="number"
                min="0"
                max="99"
                required
                value={golesVisitante}
                onChange={e => setGolesVisitante(e.target.value)}
                placeholder="Visita"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold"
              />
            </div>
          </div>

          {formSuccess && (
            <p className="text-green-400 text-xs font-semibold bg-green-950/20 border border-green-500/20 rounded-lg p-2.5">
              ✔ {formSuccess}
            </p>
          )}
          {formError && (
            <p className="text-red-400 text-xs font-semibold bg-red-950/20 border border-red-500/20 rounded-lg p-2.5">
              ⚠️ {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={savingResult}
            className="w-full mt-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-accent-gold/30 font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            {savingResult ? 'Guardando...' : '💾 Publicar Resultado Oficial'}
          </button>
        </form>
      </div>

      {/* SECCIÓN 3: GESTIÓN DE PASAJEROS */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">👥 Gestión de Clientes</h3>
        
        {/* Buscador de pasajeros */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Buscar por Nombre o DNI</label>
          <div className="relative">
            <input
              type="text"
              value={userSearchQuery}
              onChange={e => setUserSearchQuery(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        {/* Tabla / Lista de pasajeros */}
        <div className="border border-white/5 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-xs text-gray-500 py-6">No se encontraron clientes.</div>
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {filteredUsers.map((item) => {
                const isAdmin = item.rol === 'ADMIN';
                const isSelf = user && item.dni === user.dni;
                
                return (
                  <div key={item.dni} className="p-3 flex justify-between items-center bg-[#1a1a1a]/40 hover:bg-[#2a2a2a]/40 transition-colors gap-2">
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{item.nombre_apellido}</span>
                        {isAdmin && (
                          <span className="text-[8px] bg-accent-gold/20 text-accent-gold font-black px-1.5 py-0.2 rounded uppercase">Admin</span>
                        )}
                        {isSelf && (
                          <span className="text-[8px] bg-white/10 text-gray-300 font-bold px-1.5 py-0.2 rounded">Vos</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {`DNI: ${item.dni} • Tel: ${item.telefono || 'Sin tel'} • Ptos: ${item.puntos || 0}`}
                      </span>
                    </div>

                    {!isSelf && (
                      <button
                        onClick={() => handleBanUser(item.dni)}
                        disabled={banningDni === item.dni}
                        className="bg-red-950/30 border border-red-500/20 hover:bg-red-950/60 text-red-400 hover:text-red-300 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {banningDni === item.dni ? 'Baneando...' : '🚫 Banear'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 4: BITÁCORA DE AUDITORÍA */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">📜 Bitácora de Auditoría</h3>
          <span className="text-[9px] bg-white/10 text-gray-300 font-semibold px-2 py-0.5 rounded uppercase select-none">Historial</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Este registro audita y transparenta todas las acciones de administración realizadas en esta plataforma. Evita cualquier tipo de malentendido o sospechas en el Prode de Bruno Remises.
        </p>

        <div className="border border-white/5 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
          {loadingLogs ? (
            <div className="text-center text-xs text-gray-500 py-6 animate-pulse">Cargando bitácora de auditoría...</div>
          ) : logsList.length === 0 ? (
            <div className="text-center text-xs text-gray-500 py-6">No hay registros de auditoría aún.</div>
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {logsList.map((log) => {
                const d = new Date(log.created_at);
                const dateString = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                
                let badgeColor = 'bg-white/10 text-gray-300';
                if (log.accion === 'BANEO_USUARIO') badgeColor = 'bg-red-950/20 text-red-400 border border-red-500/20';
                if (log.accion === 'CARGA_RESULTADO') badgeColor = 'bg-green-950/20 text-green-400 border border-green-500/20';
                if (log.accion === 'RECALCULO_PUNTOS') badgeColor = 'bg-blue-950/20 text-blue-400 border border-blue-500/20';

                return (
                  <div key={log.id} className="p-3 flex flex-col gap-1.5 bg-[#1a1a1a]/20">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-gray-500 font-medium">{dateString}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase ${badgeColor}`}>
                        {log.accion}
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed pl-1">{log.detalles}</p>
                    <span className="text-[9px] text-gray-500 pl-1">
                      {`Realizado por: ${log.usuario_nombre} (DNI ${log.usuario_dni})`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
