const { execSync } = require('child_process');

try {
  const diff = execSync('git show ff0a5fa -- styles.css', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const lines = diff.split('\n');
  lines.forEach(line => {
    if (line.startsWith('+') || line.startsWith('-')) {
      if (line.includes('footer') || line.includes('site-footer')) {
        console.log(line);
      }
    }
  });
} catch (err) {
  console.error(err);
}
