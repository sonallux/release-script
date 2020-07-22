const {CleanWorkingTree, NewVersion, Changelog, NpmPackage} = require('./dist/release-script');

module.exports = {
    push: true,
    gitSign: true,
    nextDevelopmentVersion: false,
    preconditions: [CleanWorkingTree(), NewVersion()],
    versionHook: [Changelog('CHANGELOG.md'), NpmPackage()],
};
