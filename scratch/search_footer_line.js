const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('policeSiren') || line.includes('footer::before') || line.includes('site-footer::before') || line.includes('.site-footer')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
