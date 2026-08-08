const { execSync } = require('child_process');

try {
  const commits = execSync('git log --oneline', { encoding: 'utf8' }).trim().split('\n');
  for (const commitLine of commits) {
    const hash = commitLine.split(' ')[0];
    const diff = execSync(`git show ${hash} -- styles.css`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    if (diff.includes('site-footer') || diff.includes('footer-brand')) {
      console.log(`Commit ${commitLine} modified footer styles`);
    }
  }
} catch (err) {
  console.error(err);
}
