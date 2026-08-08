const { execSync } = require('child_process');

try {
  const diff = execSync('git log -p -S "siren-rail" styles.css', { encoding: 'utf8' });
  console.log('Git S-search siren-rail:');
  console.log(diff.slice(0, 4000));
} catch (e) {
  console.error(e);
}
