const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('fr-panel') || line.includes('fr-service') || line.includes('fr-cadence')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
