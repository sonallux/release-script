const {readFileSync, writeFileSync} = require('fs');
const path = require('path');

function extractChanges(version, outputFile) {
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
  if (i !== lines.length) {
    i++;
    for (; i < lines.length; i++) {
      if (lines[i].startsWith('##')) {
        break;
      }
      currentChanges.push(lines[i]);
    }
  }
  var extractedChangelog = currentChanges.join('\n');
  writeFileSync(path.resolve(outputFile), extractedChangelog, 'utf-8');
}

module.exports = extractChanges;