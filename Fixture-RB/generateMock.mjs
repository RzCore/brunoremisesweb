import fs from 'fs';
import path from 'path';

// Country to 2-letter code mapping for flagcdn
const countryMap = {
  'México': 'mx', 'Sudáfrica': 'za', 'Corea del Sur': 'kr', 'República Checa': 'cz',
  'Canadá': 'ca', 'Bosnia y Herzegovina': 'ba', 'Estados Unidos': 'us', 'Paraguay': 'py',
  'Qatar': 'qa', 'Suiza': 'ch', 'Brasil': 'br', 'Marruecos': 'ma', 'Haití': 'ht',
  'Escocia': 'gb-sct', 'Australia': 'au', 'Turquía': 'tr', 'Alemania': 'de', 'Curazao': 'cw',
  'Países Bajos': 'nl', 'Japón': 'jp', 'Costa de Marfil': 'ci', 'Ecuador': 'ec',
  'Suecia': 'se', 'Túnez': 'tn', 'España': 'es', 'Cabo Verde': 'cv', 'Bélgica': 'be',
  'Egipto': 'eg', 'Arabia Saudita': 'sa', 'Uruguay': 'uy', 'Irán': 'ir', 'Nueva Zelanda': 'nz',
  'Francia': 'fr', 'Senegal': 'sn', 'Irak': 'iq', 'Noruega': 'no', 'Argentina': 'ar',
  'Argelia': 'dz', 'Austria': 'at', 'Jordania': 'jo', 'Portugal': 'pt', 'RD Congo': 'cd',
  'Inglaterra': 'gb-eng', 'Croacia': 'hr', 'Ghana': 'gh', 'Panamá': 'pa', 'Uzbekistán': 'uz',
  'Colombia': 'co'
};

const text = fs.readFileSync('partidos.md', 'utf-8');

// The markdown file is somehow glued together or has line breaks?
// Let's use regex to extract matches.
const matchRegex = /([A-Z][a-záéíóúñ]+(?: [0-9]+)?(?: de [a-z]+)?)([0-9]{2}:[0-9]{2})([A-L])([A-Za-záéíóúñ. ]+?) vs. ([A-Za-záéíóúñ. ]+?)(?=[A-Z][a-záéíóúñ]+ [0-9]+|🏆|$)/g;

const matches = [];
const teams = {};

let m;
let idCounter = 1;

while ((m = matchRegex.exec(text)) !== null) {
  const [, date, time, group, home, away] = m;
  const hTeam = home.trim();
  const aTeam = away.trim();
  
  let hTeamId = hTeam.replace(/[^A-Za-z]/g, '').toUpperCase().substring(0, 3);
  let aTeamId = aTeam.replace(/[^A-Za-z]/g, '').toUpperCase().substring(0, 3);
  
  if (hTeam === 'Argelia') hTeamId = 'ALG';
  if (hTeam === 'Austria') hTeamId = 'AUT';
  if (aTeam === 'Argelia') aTeamId = 'ALG';
  if (aTeam === 'Austria') aTeamId = 'AUT';
  
  if (!teams[hTeamId]) {
    teams[hTeamId] = { id: hTeamId, name: hTeam === 'Argentin' ? 'Argentina' : hTeam, countryCode: countryMap[hTeam === 'Argentin' ? 'Argentina' : hTeam] || 'un' };
  }
  if (!teams[aTeamId]) {
    teams[aTeamId] = { id: aTeamId, name: aTeam === 'Argentin' ? 'Argentina' : aTeam, countryCode: countryMap[aTeam === 'Argentin' ? 'Argentina' : aTeam] || 'un' };
  }
  
  // Create a mock date object. The tournament is June 2026.
  // We need to parse date "Jueves 11 de junio" -> "2026-06-11T16:00:00Z"
  const dayMatch = date.match(/([0-9]+) de ([a-z]+)/i);
  let isoDate = '2026-06-11T00:00:00Z'; // fallback
  if (dayMatch) {
    const day = dayMatch[1].padStart(2, '0');
    isoDate = `2026-06-${day}T${time}:00Z`; // UTC for simplicity of mock
  }

  matches.push({
    id: `m${idCounter++}`,
    groupId: group,
    homeTeamRef: hTeamId,
    awayTeamRef: aTeamId,
    date: isoDate,
    status: 'PENDING'
  });
}

// Todos los partidos arrancan como PENDING

const mockFileContent = `
export interface Team {
  id: string;
  name: string;
  countryCode: string;
}

export interface Match {
  id: string;
  groupId: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'FINISHED';
  homeScore?: number;
  awayScore?: number;
}

export const TEAMS: Record<string, Team> = ${JSON.stringify(teams, null, 2)};

const rawMatches = ${JSON.stringify(matches, null, 2)};

export const MOCK_MATCHES: Match[] = rawMatches.map((m: any) => ({
  id: m.id,
  groupId: m.groupId,
  homeTeam: TEAMS[m.homeTeamRef],
  awayTeam: TEAMS[m.awayTeamRef],
  date: m.date,
  status: m.status,
  homeScore: m.homeScore,
  awayScore: m.awayScore,
}));

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  plenos: number;
  tendencias: number;
  sede: string;
  carrera: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1', name: 'Juan Pérez', points: 45, plenos: 6, tendencias: 3, sede: 'Luján', carrera: 'Sistemas' },
  { id: 'u2', name: 'María González', points: 42, plenos: 5, tendencias: 4, sede: 'San Miguel', carrera: 'Administración' },
  { id: 'u3', name: 'Lucas Martínez', points: 39, plenos: 5, tendencias: 3, isCurrentUser: true, sede: 'Campana', carrera: 'Agronomía' },
  { id: 'u4', name: 'Sofía López', points: 36, plenos: 4, tendencias: 4, sede: 'Luján', carrera: 'Administración' },
  { id: 'u5', name: 'Martín Silva', points: 33, plenos: 4, tendencias: 3, sede: 'Chivilcoy', carrera: 'Sistemas' },
  { id: 'u6', name: 'Valentina Gómez', points: 30, plenos: 3, tendencias: 4, sede: 'Luján', carrera: 'Agronomía' },
  { id: 'u7', name: 'Joaquín Rodríguez', points: 27, plenos: 3, tendencias: 3, sede: 'San Miguel', carrera: 'Sistemas' },
  { id: 'u8', name: 'Camila Fernández', points: 24, plenos: 2, tendencias: 4, sede: 'Campana', carrera: 'Administración' },
  { id: 'u9', name: 'Mateo Sánchez', points: 21, plenos: 2, tendencias: 3, sede: 'Chivilcoy', carrera: 'Agronomía' },
  { id: 'u10', name: 'Agustina Ruiz', points: 18, plenos: 1, tendencias: 4, sede: 'Luján', carrera: 'Sistemas' },
];
`;

fs.writeFileSync('src/data/mock.ts', mockFileContent);
console.log('Generated mock.ts');
