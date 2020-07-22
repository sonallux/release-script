const {CleanWorkingTree, NewVersion, Changelog, NpmPackage} = require('./dist/release-script');

//This has a name of `release-script.config.js` instead of `release.config.js` so it will not be picked up by the tests.

module.exports = {
    push: true,
    gitSign: true,
    nextDevelopmentVersion: false,
    preconditions: [CleanWorkingTree(), NewVersion()],
    versionHook: [Changelog('CHANGELOG.md'), NpmPackage()],
};
