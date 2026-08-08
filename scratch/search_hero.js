const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');

const regex = /([^{}]+)\{([^}]+)\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  const selector = match[1].trim();
  const body = match[2].trim();
  if (selector.includes('hero') || selector.includes('backdrop')) {
    const lineNum = css.substring(0, match.index).split('\n').length;
    console.log(`L${lineNum}: ${selector} => ${body.substring(0, 120)}`);
  }
}
