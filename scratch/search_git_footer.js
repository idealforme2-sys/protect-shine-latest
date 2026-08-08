const { execSync } = require('child_process');

try {
  // Let's run git log to find commits that modified index.html
  const commits = execSync('git log --oneline', { encoding: 'utf8' }).trim().split('\n');
  
  for (const commitLine of commits) {
    const hash = commitLine.split(' ')[0];
    try {
      const content = execSync(`git show ${hash}:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
      if (content.includes('Explore') && content.includes('Specialty') && content.includes('Contact')) {
        console.log(`Commit ${commitLine} HAS the new footer text`);
      } else {
        console.log(`Commit ${commitLine} DOES NOT HAVE the new footer text`);
      }
    } catch(e) {
      console.log(`Commit ${commitLine} error: ${e.message}`);
    }
  }
} catch (err) {
  console.error(err);
}
