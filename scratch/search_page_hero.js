const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('commercial-hero') || line.includes('page-hero')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
