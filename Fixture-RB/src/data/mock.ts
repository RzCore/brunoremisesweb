
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

export const TEAMS: Record<string, Team> = {
  "MXI": {
    "id": "MXI",
    "name": "México",
    "countryCode": "mx"
  },
  "SUD": {
    "id": "SUD",
    "name": "Sudáfrica",
    "countryCode": "za"
  },
  "COR": {
    "id": "COR",
    "name": "Corea del Sur",
    "countryCode": "kr"
  },
  "REP": {
    "id": "REP",
    "name": "República Checa",
    "countryCode": "cz"
  },
  "CAN": {
    "id": "CAN",
    "name": "Canadá",
    "countryCode": "ca"
  },
  "BOS": {
    "id": "BOS",
    "name": "Bosnia y Herzegovina",
    "countryCode": "ba"
  },
  "EST": {
    "id": "EST",
    "name": "Estados Unidos",
    "countryCode": "us"
  },
  "PAR": {
    "id": "PAR",
    "name": "Paraguay",
    "countryCode": "py"
  },
  "QAT": {
    "id": "QAT",
    "name": "Qatar",
    "countryCode": "qa"
  },
  "SUI": {
    "id": "SUI",
    "name": "Suiza",
    "countryCode": "ch"
  },
  "BRA": {
    "id": "BRA",
    "name": "Brasil",
    "countryCode": "br"
  },
  "MAR": {
    "id": "MAR",
    "name": "Marruecos",
    "countryCode": "ma"
  },
  "HAI": {
    "id": "HAI",
    "name": "Haití",
    "countryCode": "ht"
  },
  "ESC": {
    "id": "ESC",
    "name": "Escocia",
    "countryCode": "gb-sct"
  },
  "AUS": {
    "id": "AUS",
    "name": "Australia",
    "countryCode": "au"
  },
  "TUR": {
    "id": "TUR",
    "name": "Turquía",
    "countryCode": "tr"
  },
  "ALE": {
    "id": "ALE",
    "name": "Alemania",
    "countryCode": "de"
  },
  "CUR": {
    "id": "CUR",
    "name": "Curazao",
    "countryCode": "cw"
  },
  "PAS": {
    "id": "PAS",
    "name": "Países Bajos",
    "countryCode": "nl"
  },
  "JAP": {
    "id": "JAP",
    "name": "Japón",
    "countryCode": "jp"
  },
  "COS": {
    "id": "COS",
    "name": "Costa de Marfil",
    "countryCode": "ci"
  },
  "ECU": {
    "id": "ECU",
    "name": "Ecuador",
    "countryCode": "ec"
  },
  "SUE": {
    "id": "SUE",
    "name": "Suecia",
    "countryCode": "se"
  },
  "TNE": {
    "id": "TNE",
    "name": "Túnez",
    "countryCode": "tn"
  },
  "ESP": {
    "id": "ESP",
    "name": "España",
    "countryCode": "es"
  },
  "CAB": {
    "id": "CAB",
    "name": "Cabo Verde",
    "countryCode": "cv"
  },
  "BLG": {
    "id": "BLG",
    "name": "Bélgica",
    "countryCode": "be"
  },
  "EGI": {
    "id": "EGI",
    "name": "Egipto",
    "countryCode": "eg"
  },
  "ARA": {
    "id": "ARA",
    "name": "Arabia Saudita",
    "countryCode": "sa"
  },
  "URU": {
    "id": "URU",
    "name": "Uruguay",
    "countryCode": "uy"
  },
  "IRN": {
    "id": "IRN",
    "name": "Irán",
    "countryCode": "ir"
  },
  "NUE": {
    "id": "NUE",
    "name": "Nueva Zelanda",
    "countryCode": "nz"
  },
  "FRA": {
    "id": "FRA",
    "name": "Francia",
    "countryCode": "fr"
  },
  "SEN": {
    "id": "SEN",
    "name": "Senegal",
    "countryCode": "sn"
  },
  "IRA": {
    "id": "IRA",
    "name": "Irak",
    "countryCode": "iq"
  },
  "NOR": {
    "id": "NOR",
    "name": "Noruega",
    "countryCode": "no"
  },
  "ARG": {
    "id": "ARG",
    "name": "Argentina",
    "countryCode": "ar"
  },
  "ALG": {
    "id": "ALG",
    "name": "Argelia",
    "countryCode": "dz"
  },
  "AUT": {
    "id": "AUT",
    "name": "Austria",
    "countryCode": "at"
  },
  "JOR": {
    "id": "JOR",
    "name": "Jordania",
    "countryCode": "jo"
  },
  "POR": {
    "id": "POR",
    "name": "Portugal",
    "countryCode": "pt"
  },
  "RDC": {
    "id": "RDC",
    "name": "RD Congo",
    "countryCode": "cd"
  },
  "ING": {
    "id": "ING",
    "name": "Inglaterra",
    "countryCode": "gb-eng"
  },
  "CRO": {
    "id": "CRO",
    "name": "Croacia",
    "countryCode": "hr"
  },
  "GHA": {
    "id": "GHA",
    "name": "Ghana",
    "countryCode": "gh"
  },
  "PAN": {
    "id": "PAN",
    "name": "Panamá",
    "countryCode": "pa"
  },
  "UZB": {
    "id": "UZB",
    "name": "Uzbekistán",
    "countryCode": "uz"
  },
  "COL": {
    "id": "COL",
    "name": "Colombia",
    "countryCode": "co"
  }
};

const rawMatches = [
  {
    "id": "m1",
    "groupId": "A",
    "homeTeamRef": "MXI",
    "awayTeamRef": "SUD",
    "date": "2026-06-11T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m2",
    "groupId": "A",
    "homeTeamRef": "COR",
    "awayTeamRef": "REP",
    "date": "2026-06-11T23:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m3",
    "groupId": "B",
    "homeTeamRef": "CAN",
    "awayTeamRef": "BOS",
    "date": "2026-06-12T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m4",
    "groupId": "D",
    "homeTeamRef": "EST",
    "awayTeamRef": "PAR",
    "date": "2026-06-12T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m5",
    "groupId": "B",
    "homeTeamRef": "QAT",
    "awayTeamRef": "SUI",
    "date": "2026-06-13T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m6",
    "groupId": "C",
    "homeTeamRef": "BRA",
    "awayTeamRef": "MAR",
    "date": "2026-06-13T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m7",
    "groupId": "C",
    "homeTeamRef": "HAI",
    "awayTeamRef": "ESC",
    "date": "2026-06-13T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m8",
    "groupId": "D",
    "homeTeamRef": "AUS",
    "awayTeamRef": "TUR",
    "date": "2026-06-14T01:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m9",
    "groupId": "E",
    "homeTeamRef": "ALE",
    "awayTeamRef": "CUR",
    "date": "2026-06-14T14:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m10",
    "groupId": "F",
    "homeTeamRef": "PAS",
    "awayTeamRef": "JAP",
    "date": "2026-06-14T17:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m11",
    "groupId": "E",
    "homeTeamRef": "COS",
    "awayTeamRef": "ECU",
    "date": "2026-06-14T20:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m12",
    "groupId": "F",
    "homeTeamRef": "SUE",
    "awayTeamRef": "TNE",
    "date": "2026-06-14T23:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m13",
    "groupId": "H",
    "homeTeamRef": "ESP",
    "awayTeamRef": "CAB",
    "date": "2026-06-15T13:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m14",
    "groupId": "G",
    "homeTeamRef": "BLG",
    "awayTeamRef": "EGI",
    "date": "2026-06-15T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m15",
    "groupId": "H",
    "homeTeamRef": "ARA",
    "awayTeamRef": "URU",
    "date": "2026-06-15T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m16",
    "groupId": "G",
    "homeTeamRef": "IRN",
    "awayTeamRef": "NUE",
    "date": "2026-06-15T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m17",
    "groupId": "I",
    "homeTeamRef": "FRA",
    "awayTeamRef": "SEN",
    "date": "2026-06-16T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m18",
    "groupId": "I",
    "homeTeamRef": "IRA",
    "awayTeamRef": "NOR",
    "date": "2026-06-16T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m19",
    "groupId": "J",
    "homeTeamRef": "ARG",
    "awayTeamRef": "ALG",
    "date": "2026-06-16T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m20",
    "groupId": "J",
    "homeTeamRef": "AUT",
    "awayTeamRef": "JOR",
    "date": "2026-06-17T01:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m21",
    "groupId": "K",
    "homeTeamRef": "POR",
    "awayTeamRef": "RDC",
    "date": "2026-06-17T14:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m22",
    "groupId": "L",
    "homeTeamRef": "ING",
    "awayTeamRef": "CRO",
    "date": "2026-06-17T17:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m23",
    "groupId": "L",
    "homeTeamRef": "GHA",
    "awayTeamRef": "PAN",
    "date": "2026-06-17T20:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m24",
    "groupId": "K",
    "homeTeamRef": "UZB",
    "awayTeamRef": "COL",
    "date": "2026-06-17T23:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m25",
    "groupId": "A",
    "homeTeamRef": "REP",
    "awayTeamRef": "SUD",
    "date": "2026-06-18T13:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m26",
    "groupId": "B",
    "homeTeamRef": "SUI",
    "awayTeamRef": "BOS",
    "date": "2026-06-18T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m27",
    "groupId": "B",
    "homeTeamRef": "CAN",
    "awayTeamRef": "QAT",
    "date": "2026-06-18T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m28",
    "groupId": "A",
    "homeTeamRef": "MXI",
    "awayTeamRef": "COR",
    "date": "2026-06-18T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m29",
    "groupId": "D",
    "homeTeamRef": "EST",
    "awayTeamRef": "AUS",
    "date": "2026-06-19T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m30",
    "groupId": "C",
    "homeTeamRef": "ESC",
    "awayTeamRef": "MAR",
    "date": "2026-06-19T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m31",
    "groupId": "C",
    "homeTeamRef": "BRA",
    "awayTeamRef": "HAI",
    "date": "2026-06-19T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m32",
    "groupId": "D",
    "homeTeamRef": "TUR",
    "awayTeamRef": "PAR",
    "date": "2026-06-20T01:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m33",
    "groupId": "F",
    "homeTeamRef": "PAS",
    "awayTeamRef": "SUE",
    "date": "2026-06-20T14:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m34",
    "groupId": "E",
    "homeTeamRef": "ALE",
    "awayTeamRef": "COS",
    "date": "2026-06-20T17:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m35",
    "groupId": "E",
    "homeTeamRef": "ECU",
    "awayTeamRef": "CUR",
    "date": "2026-06-20T21:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m36",
    "groupId": "F",
    "homeTeamRef": "TNE",
    "awayTeamRef": "JAP",
    "date": "2026-06-21T01:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m37",
    "groupId": "H",
    "homeTeamRef": "ESP",
    "awayTeamRef": "ARA",
    "date": "2026-06-21T13:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m38",
    "groupId": "G",
    "homeTeamRef": "BLG",
    "awayTeamRef": "IRN",
    "date": "2026-06-21T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m39",
    "groupId": "H",
    "homeTeamRef": "URU",
    "awayTeamRef": "CAB",
    "date": "2026-06-21T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m40",
    "groupId": "G",
    "homeTeamRef": "NUE",
    "awayTeamRef": "EGI",
    "date": "2026-06-21T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m41",
    "groupId": "J",
    "homeTeamRef": "ARG",
    "awayTeamRef": "AUT",
    "date": "2026-06-22T14:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m42",
    "groupId": "I",
    "homeTeamRef": "FRA",
    "awayTeamRef": "IRA",
    "date": "2026-06-22T18:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m43",
    "groupId": "I",
    "homeTeamRef": "NOR",
    "awayTeamRef": "SEN",
    "date": "2026-06-22T21:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m44",
    "groupId": "J",
    "homeTeamRef": "JOR",
    "awayTeamRef": "ALG",
    "date": "2026-06-23T00:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m45",
    "groupId": "K",
    "homeTeamRef": "POR",
    "awayTeamRef": "UZB",
    "date": "2026-06-23T14:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m46",
    "groupId": "L",
    "homeTeamRef": "ING",
    "awayTeamRef": "GHA",
    "date": "2026-06-23T17:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m47",
    "groupId": "L",
    "homeTeamRef": "PAN",
    "awayTeamRef": "CRO",
    "date": "2026-06-23T20:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m48",
    "groupId": "K",
    "homeTeamRef": "COL",
    "awayTeamRef": "RDC",
    "date": "2026-06-23T23:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m49",
    "groupId": "B",
    "homeTeamRef": "SUI",
    "awayTeamRef": "CAN",
    "date": "2026-06-24T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m50",
    "groupId": "B",
    "homeTeamRef": "BOS",
    "awayTeamRef": "QAT",
    "date": "2026-06-24T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m51",
    "groupId": "C",
    "homeTeamRef": "BRA",
    "awayTeamRef": "ESC",
    "date": "2026-06-24T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m52",
    "groupId": "C",
    "homeTeamRef": "MAR",
    "awayTeamRef": "HAI",
    "date": "2026-06-24T19:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m53",
    "groupId": "A",
    "homeTeamRef": "REP",
    "awayTeamRef": "MXI",
    "date": "2026-06-24T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m54",
    "groupId": "A",
    "homeTeamRef": "SUD",
    "awayTeamRef": "COR",
    "date": "2026-06-24T22:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m55",
    "groupId": "E",
    "homeTeamRef": "CUR",
    "awayTeamRef": "COS",
    "date": "2026-06-25T17:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m56",
    "groupId": "E",
    "homeTeamRef": "ECU",
    "awayTeamRef": "ALE",
    "date": "2026-06-25T17:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m57",
    "groupId": "F",
    "homeTeamRef": "JAP",
    "awayTeamRef": "SUE",
    "date": "2026-06-25T20:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m58",
    "groupId": "F",
    "homeTeamRef": "TNE",
    "awayTeamRef": "PAS",
    "date": "2026-06-25T20:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m59",
    "groupId": "D",
    "homeTeamRef": "TUR",
    "awayTeamRef": "EST",
    "date": "2026-06-25T23:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m60",
    "groupId": "D",
    "homeTeamRef": "PAR",
    "awayTeamRef": "AUS",
    "date": "2026-06-25T23:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m61",
    "groupId": "I",
    "homeTeamRef": "NOR",
    "awayTeamRef": "FRA",
    "date": "2026-06-26T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m62",
    "groupId": "I",
    "homeTeamRef": "SEN",
    "awayTeamRef": "IRA",
    "date": "2026-06-26T16:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m63",
    "groupId": "H",
    "homeTeamRef": "CAB",
    "awayTeamRef": "ARA",
    "date": "2026-06-26T21:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m64",
    "groupId": "H",
    "homeTeamRef": "URU",
    "awayTeamRef": "ESP",
    "date": "2026-06-26T21:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m65",
    "groupId": "G",
    "homeTeamRef": "EGI",
    "awayTeamRef": "IRN",
    "date": "2026-06-27T00:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m66",
    "groupId": "G",
    "homeTeamRef": "NUE",
    "awayTeamRef": "BLG",
    "date": "2026-06-27T00:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m67",
    "groupId": "L",
    "homeTeamRef": "PAN",
    "awayTeamRef": "ING",
    "date": "2026-06-27T18:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m68",
    "groupId": "L",
    "homeTeamRef": "CRO",
    "awayTeamRef": "GHA",
    "date": "2026-06-27T18:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m69",
    "groupId": "K",
    "homeTeamRef": "COL",
    "awayTeamRef": "POR",
    "date": "2026-06-27T20:30:00Z",
    "status": "PENDING"
  },
  {
    "id": "m70",
    "groupId": "K",
    "homeTeamRef": "RDC",
    "awayTeamRef": "UZB",
    "date": "2026-06-27T20:30:00Z",
    "status": "PENDING"
  },
  {
    "id": "m71",
    "groupId": "J",
    "homeTeamRef": "ALG",
    "awayTeamRef": "AUT",
    "date": "2026-06-27T23:00:00Z",
    "status": "PENDING"
  },
  {
    "id": "m72",
    "groupId": "J",
    "homeTeamRef": "JOR",
    "awayTeamRef": "ARG",
    "date": "2026-06-27T23:00:00Z",
    "status": "PENDING"
  }
];

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
