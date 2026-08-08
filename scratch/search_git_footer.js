const { execSync } = require('child_process');

try {
  const commits = execSync('git log --oneline -n 30 styles.css', { encoding: 'utf8' });
  console.log('Recent Commits:');
  console.log(commits);
} catch (e) {
  console.error(e);
}
