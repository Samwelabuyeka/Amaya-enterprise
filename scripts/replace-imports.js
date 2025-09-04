/**
 * scripts/replace-imports.js
 * Simple script to normalize imports that reference `supabase` or `firebase` to
 * canonical local client modules used in this repo.
 *
 * Usage:
 *   # from the project root
 *   node ./scripts/replace-imports.js
 *
 * Install requirements first if needed:
 *   npm install glob
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const root = process.cwd();
const patterns = [
  'src/**/*.js',
  'src/**/*.jsx',
  'src/**/*.ts',
  'src/**/*.tsx',
  'lib/**/*.js',
  'lib/**/*.ts',
];

const filePaths = patterns
  .map(p => glob.sync(p, { cwd: root, nodir: true }))
  .reduce((a, b) => a.concat(b), [])
  .filter(Boolean);

// Matches imports or require(...) containing the word 'supabase'
const supabaseRegex = /(from\s+|require\()\s*(['"`])([^'"`]*supabase[^'"`]*)\2\s*\)?/gmi;
// Matches imports or require(...) containing 'firebase' or '/firebase'
const firebaseRegex = /(from\s+|require\()\s*(['"`])([^'"`]*\/?firebase[^'"`]*)\2\s*\)?/gmi;

function replaceInFile(relPath) {
  const file = path.resolve(root, relPath);
  let src = fs.readFileSync(file, 'utf8');
  const original = src;

  src = src.replace(supabaseRegex, (m, prefix, quote) => {
    // prefer ES import style when possible
    if (prefix && prefix.trim().startsWith('require')) return `require(${quote}lib/supabase${quote})`;
    return `from ${quote}lib/supabase${quote}`;
  });

  src = src.replace(firebaseRegex, (m, prefix, quote) => {
    if (prefix && prefix.trim().startsWith('require')) return `require(${quote}src/lib/firebase${quote})`;
    return `from ${quote}src/lib/firebase${quote}`;
  });

  if (src !== original) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Updated:', relPath);
  }
}

if (filePaths.length === 0) {
  console.log('No files matched patterns. Are you running from the project root?');
  process.exit(0);
}

filePaths.forEach(f => {
  if (f.includes('node_modules') || f.includes('.next') || f.includes('dist')) return;
  try {
    replaceInFile(f);
  } catch (err) {
    console.error('Err processing', f, err.message || err);
  }
});

console.log('Done. Review git status/diff.');
