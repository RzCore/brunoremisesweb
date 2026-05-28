import { MOCK_MATCHES, TEAMS } from './src/data/mock.ts';
console.log("Validating matches...");
let errors = 0;
MOCK_MATCHES.forEach(m => {
  if (!m.homeTeam) {
    console.error(`Match ${m.id} missing homeTeam: ref=${m.homeTeamRef}`);
    errors++;
  } else if (!m.homeTeam.countryCode) {
    console.error(`Match ${m.id} homeTeam missing countryCode`);
    errors++;
  }
  
  if (!m.awayTeam) {
    console.error(`Match ${m.id} missing awayTeam: ref=${m.awayTeamRef}`);
    errors++;
  } else if (!m.awayTeam.countryCode) {
    console.error(`Match ${m.id} awayTeam missing countryCode`);
    errors++;
  }
});
console.log(`Validation complete. Errors: ${errors}`);
