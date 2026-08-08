const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('fr-dispatch')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
