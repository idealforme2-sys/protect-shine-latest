const { execSync } = require('child_process');

try {
  const content = execSync('git show 0ca5f96:index.html', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const lines = content.split('\n');
  
  // Let's find where <footer begins and ends
  let footerStart = 0;
  let footerEnd = 0;
  lines.forEach((line, idx) => {
    if (line.includes('<footer')) {
      footerStart = idx + 1;
    }
    if (line.includes('</footer>')) {
      footerEnd = idx + 1;
    }
  });

  console.log(`Footer range: ${footerStart} to ${footerEnd}`);
  for (let i = footerStart - 1; i < footerEnd; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} catch (err) {
  console.error(err);
}
