const readFileSync = require('fs').readFileSync;
const path = require('path');

function extractChanges(version) {
  const changelogFile = path.resolve("CHANGELOG.md");
  const changelog = readFileSync(changelogFile, 'utf-8');
  const lines = changelog.split('\n');
  const currentChanges = [];
  let i = 0;
  for (; i < lines.length; i++) {
    if (lines[i] === `## [${version}]`) {
      break;
    }
  }
  if (i === lines.length) {
    return null;
  }
  i++;
  for (; i < lines.length; i++) {
    if (lines[i].startsWith('##')) {
      break;
    }
    currentChanges.push(lines[i]);
  }
  return currentChanges.join('\n');
}

module.exports = extractChanges;