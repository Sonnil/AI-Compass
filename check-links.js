const data = require('./public/ai-tools-feed.json');
const ext = data.tools.filter(t => t.type === 'external');
console.log('Checking', ext.length, 'external tools...');
const bad = ext.filter(t => !t.accessLink);
if (bad.length === 0) {
  console.log('✓ All external tools have access links');
} else {
  console.log('Tools without links:', bad.map(t => t.name));
}
