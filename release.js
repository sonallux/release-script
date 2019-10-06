#!/usr/bin/env node

const fs = require('fs');
const realExecSync = require('child_process').execSync;

if (process.argv.length != 3) {
  console.log('No version number specified!');
  process.exit(1);
}

function execSync(command, options) {
  return realExecSync(command, options).toString('utf-8').trim();
}

//Check if git is initialised
if ('true' !== execSync('git rev-parse --is-inside-work-tree')) {
  console.log('You are not inside a git repository!');
  process.exit(1);
}

//Check for changed Files
const changedFiles = execSync('git status --porcelain');
if (changedFiles || changedFiles != '') {
  console.log('You have not commited files:\n', changedFiles);
  process.exit(1);
}

//Check if we are on branch "master"
if ('master' !== execSync('git rev-parse --abbrev-ref HEAD')) {
  console.log('You are not on branch "master"!')
  process.exit(1);
}

const versionParts = process.argv[2].split('.');
const NEW_MAJOR = parseInt(versionParts[0], 10);
const NEW_MINOR = parseInt(versionParts[1], 10);
const NEW_PATCH = parseInt(versionParts[2], 10);

const NEW_VERSION = NEW_MAJOR + '.' + NEW_MINOR + '.' + NEW_PATCH;
const NEXT_VERSION = NEW_MAJOR + '.' + NEW_MINOR + '.' + (NEW_PATCH + 1) + '-SNAPSHOT';

const gitTags = execSync('git tag').split('\n');
if (gitTags.includes('v' + NEW_VERSION)) {
  console.log("Version already released!");
  process.exit(1);
}

console.log('Releasing version', NEW_VERSION);

function updateVersionInFile(file, version) {
  fs.writeFileSync(file, version, 'utf-8');
}

function updateVersionInPackageJson(version, options) {
  execSync('npm -no-git-tag-version --allow-same-version version ' + version, options);
}

function updateVersionInMavenPom(version, options) {
  execSync('./mvnw versions:set -DnewVersion="' + version + '" -DgenerateBackupPoms=false', options)
}

// Change version
updateVersionInFile('VERSION', NEW_VERSION);
updateVersionInPackageJson(NEW_VERSION);
updateVersionInPackageJson(NEW_VERSION, {cwd: 'subproject1'});
updateVersionInMavenPom(NEW_VERSION, {cwd: 'subproject2'});

// Git commit and push
execSync('git commit -am "Release version ' + NEW_VERSION + ' [CI SKIP]"');
execSync('git tag -a v' + NEW_VERSION + ' -m "Release ' + NEW_VERSION + '"');

console.log('Finished releasing');

console.log('Update to next version', NEXT_VERSION);

updateVersionInFile('VERSION', NEXT_VERSION);
updateVersionInPackageJson(NEXT_VERSION);
updateVersionInPackageJson(NEXT_VERSION, {cwd: 'subproject1'});
updateVersionInMavenPom(NEXT_VERSION, {cwd: 'subproject2'});

// Git commit and push
execSync('git commit -am "Prepare next release [CI SKIP]"');

// execSync('git push --follow-tags');