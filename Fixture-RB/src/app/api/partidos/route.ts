import { NextResponse } from 'next/server';

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

    return NextResponse.json({ matches });
  } catch (err: any) {
    console.error('Excepción en API partidos:', err);
    return NextResponse.json({ error: 'Excepción en el servidor' }, { status: 500 });
  }
}
