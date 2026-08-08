const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

js.split('\n').forEach((line, index) => {
  if (line.includes('cursor')) {
    console.log(`L${index + 1}: ${line}`);
  }
});
