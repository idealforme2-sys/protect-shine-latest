const { execSync } = require('child_process');

try {
  const content = execSync('git show 2b5c3de:index.html', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const lines = content.split('\n');
  let headerLines = [];
  let inHeader = false;
  lines.forEach((line, idx) => {
    if (line.includes('<header')) inHeader = true;
    if (inHeader) headerLines.push(`${idx+1}: ${line}`);
    if (line.includes('</header>')) inHeader = false;
  });
  console.log(headerLines.join('\n'));
} catch (err) {
  console.error(err);
}
