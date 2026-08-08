const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('unit-card') || line.includes('unit-grid') || line.includes('unit-patrol')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
