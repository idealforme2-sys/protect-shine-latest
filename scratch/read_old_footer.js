const { execSync } = require('child_process');

try {
  const content = execSync('git show 0ca5f96:styles.css', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('.site-footer') || line.includes('.footer-') || line.includes('footer-')) {
      console.log(`L${idx + 1}: ${line}`);
    }
  });
} catch (err) {
  console.error(err);
}
