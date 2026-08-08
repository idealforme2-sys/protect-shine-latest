const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('care-group') || line.includes('car-seat') || line.includes('care-groups')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
