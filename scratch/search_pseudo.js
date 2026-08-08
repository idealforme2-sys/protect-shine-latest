const fs = require('fs');

const css = fs.readFileSync('styles.css', 'utf8');

const regex = /([^{}]+)\{([^}]+)\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  const selector = match[1].trim();
  const body = match[2].trim();
  if (selector.includes('package-label') || body.includes('package-label')) {
    console.log(`Selector: ${selector} => ${body}`);
  }
}
