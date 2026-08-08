const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('button-tcp')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
