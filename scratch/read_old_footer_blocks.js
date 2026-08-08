const { execSync } = require('child_process');

try {
  const content = execSync('git show 0ca5f96:styles.css', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const lines = content.split('\n');
  
  function printRange(start, end) {
    console.log(`\n--- LINES ${start} to ${end} ---`);
    for (let i = start - 1; i < end; i++) {
      if (lines[i] !== undefined) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
    }
  }

  printRange(2090, 2165);
  printRange(2570, 2600);
  printRange(2635, 2655);
  printRange(4630, 4670);
  printRange(5350, 5380);
} catch (err) {
  console.error(err);
}
