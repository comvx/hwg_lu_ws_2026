// Cloudflare Pages build script — auto-generates data.json from folder contents.
// Build command: node build.js
// Build output: . (root)

const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanDir(full));
    } else if (/\.(pptx?|ipynb)$/i.test(entry.name)) {
      // Normalise to forward slashes for URLs
      results.push(full.replace(/\\/g, '/'));
    }
  }
  return results;
}

const files = [
  ...scanDir('slides'),
  ...scanDir('notebooks'),
];

fs.writeFileSync('data.json', JSON.stringify(files, null, 2));
console.log(`data.json written with ${files.length} file(s):`);
files.forEach(f => console.log(' ', f));
