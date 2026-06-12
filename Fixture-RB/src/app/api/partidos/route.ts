import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_MATCHES, TEAM_TLA_MAP } from '@/data/mock';

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Falta configurar FOOTBALL_DATA_API_KEY' }, { status: 500 });
  }

  try {
    // Código de competencia del Mundial FIFA es 'WC'
    const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: {
        'X-Auth-Token': apiKey,
      },
      next: { revalidate: 300 }, // Caché de Vercel por 5 minutos para no quemar el límite
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error al llamar a Football-Data.org:', errorText);
      return NextResponse.json({ error: 'Error al consultar resultados en vivo' }, { status: res.status });
    }

    const data = await res.json();
    
    // Mapear los partidos limpios devueltos por la API
    const matches = (data.matches || []).map((m: any) => ({
      id: m.id,
      utcDate: m.utcDate,
      status: m.status, // SCHEDULED, LIVE, IN_PLAY, PAUSED, FINISHED
      homeTeam: {
        name: m.homeTeam.name,
        tla: m.homeTeam.tla,
      },
      awayTeam: {
        name: m.awayTeam.name,
        tla: m.awayTeam.tla,
      },
      score: {
        home: m.score.fullTime?.home ?? null,
        away: m.score.fullTime?.away ?? null,
      }
    }));

    // ====== AUTO-SYNC LOGIC ======
    // Ejecutamos y esperamos la sincronización. Si no hay partidos nuevos, termina en milisegundos.
    await autoSyncResults(matches).catch(err => console.error('Error auto-syncing:', err));

    return NextResponse.json({ matches });
  } catch (err: any) {
    console.error('Excepción en API partidos:', err);
    return NextResponse.json({ error: 'Excepción en el servidor' }, { status: 500 });
  }
}

async function autoSyncResults(apiMatches: any[]) {
  // Check if any API matches are FINISHED
  const finishedApiMatches = apiMatches.filter(m => m.status === 'FINISHED' && m.score.home !== null && m.score.away !== null);
  if (finishedApiMatches.length === 0) return;

  // Get current official results
  const { data: dbResults } = await supabase.from('fixture_resultados_oficiales').select('match_id');
  const existingMap = new Set((dbResults || []).map(r => r.match_id));

  let hasNew = false;
  const matchesToUpsert: any[] = [];

  for (const mockMatch of MOCK_MATCHES) {
    if (existingMap.has(mockMatch.id)) continue; // Already synced
    
    const live = finishedApiMatches.find((lm: any) => {
      const mappedHomeTla = TEAM_TLA_MAP[mockMatch.homeTeam.id] || mockMatch.homeTeam.id;
      const mappedAwayTla = TEAM_TLA_MAP[mockMatch.awayTeam.id] || mockMatch.awayTeam.id;
      return (lm.homeTeam.tla === mappedHomeTla || lm.homeTeam.name === mockMatch.homeTeam.name) &&
             (lm.awayTeam.tla === mappedAwayTla || lm.awayTeam.name === mockMatch.awayTeam.name);
    });

    if (live) {
      hasNew = true;
      matchesToUpsert.push({
        match_id: mockMatch.id,
        goles_local: live.score.home,
        goles_visitante: live.score.away
      });
    }
  }

  // Si hay nuevos resultados que no teníamos en DB, actualizamos y recalculamos
  if (hasNew && matchesToUpsert.length > 0) {
    // 1. Insert
    for (const match of matchesToUpsert) {
      await supabase.from('fixture_resultados_oficiales').upsert(match, { onConflict: 'match_id' });
    }

    // 2. Recalculate Points
    const { data: resultados } = await supabase.from('fixture_resultados_oficiales').select('*');
    const { data: usuarios } = await supabase.from('fixture_usuarios').select('*');
    
    let allPreds: any[] = [];
    let fetchMore = true;
    let step = 0;
    while (fetchMore) {
      const { data: predsChunk } = await supabase.from('fixture_predicciones').select('*').range(step * 1000, (step + 1) * 1000 - 1);
      if (predsChunk && predsChunk.length > 0) {
        allPreds.push(...predsChunk);
        step++;
        if (predsChunk.length < 1000) fetchMore = false;
      } else {
        fetchMore = false;
      }
    }

    const resultsMap = new Map<string, { home: number; away: number }>();
    resultados?.forEach(r => resultsMap.set(r.match_id, { home: r.goles_local, away: r.goles_visitante }));

    const userPointsMap = new Map<string, { puntos: number; plenos: number; tendencias: number }>();
    usuarios?.forEach(u => userPointsMap.set(u.dni, { puntos: 0, plenos: 0, tendencias: 0 }));

    allPreds.forEach(p => {
      const oficial = resultsMap.get(p.match_id);
      if (!oficial) return;

      const pLocal = p.goles_local;
      const pVisitante = p.goles_visitante;
      const oLocal = oficial.home;
      const oVisitante = oficial.away;

      let puntos = 0; let esPleno = false; let esTendencia = false;
      if (pLocal === oLocal && pVisitante === oVisitante) {
        puntos = 6; esPleno = true;
      } else {
        const predGanador = pLocal > pVisitante ? 'L' : pLocal < pVisitante ? 'V' : 'E';
        const ofiGanador = oLocal > oVisitante ? 'L' : oLocal < oVisitante ? 'V' : 'E';
        if (predGanador === ofiGanador) {
          puntos = 3; esTendencia = true;
        }
      }

      const userScore = userPointsMap.get(p.usuario_dni) || { puntos: 0, plenos: 0, tendencias: 0 };
      userPointsMap.set(p.usuario_dni, {
        puntos: userScore.puntos + puntos,
        plenos: userScore.plenos + (esPleno ? 1 : 0),
        tendencias: userScore.tendencias + (esTendencia ? 1 : 0)
      });
    });

    if (usuarios) {
      for (const [dni, score] of userPointsMap.entries()) {
        await supabase
          .from('fixture_usuarios')
          .update({
            puntos: score.puntos,
            plenos: score.plenos,
            tendencias: score.tendencias
          })
          .eq('dni', dni);
      }
    }
    
    // Log the event
    await supabase.from('fixture_logs_actividad').insert([{
      usuario_dni: 'SYSTEM',
      usuario_nombre: 'Auto-Sync',
      accion: 'RECALCULO_AUTOMATICO',
      detalles: `Se sincronizaron automáticamente ${matchesToUpsert.length} partidos finalizados y se recalcularon los puntos.`
    }]);
  }
}
