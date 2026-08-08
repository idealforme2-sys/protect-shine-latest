const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('site-nav') || line.includes('nav-dropdown-toggle') || line.includes('nav-dropdown')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
