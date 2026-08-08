const fs = require('fs');

const css = fs.readFileSync('styles.css', 'utf8');

const regex = /@media\s*\([^\)]+\)\s*\{/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log(`L${css.substring(0, match.index).split('\n').length}: ${match[0]}`);
}
