# Release script

![Build](https://github.com/jsone-studios/release-script/workflows/Build/badge.svg)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=jsone-studios/release-script)](https://dependabot.com)
[![GitHub](https://img.shields.io/github/license/jsone-studios/release-script)](https://github.com/jsone-studios/release-script/blob/master/LICENSE)

Release script automates your release process for projects using git. Typically, releases involve a fixed number of steps to be executed in a given order. Most often these steps are always present:
1. Update the version number and do a `git commit`
2. Do a `git tag`
3. Update the version number to the next development version and do a `git commit`
4. Do a `git push`

Release Script will execute all these steps and can be customized to your needs with preconditions, version update hook and release hook.

## Usage

## Custom Hooks
The release script can be customized by the following hooks
- Precondition: Checks that must be valid before performing a release.
- Version update hook: Update the version (e.g. change version field in package.json)
- Release hook: Perform the actual release (e.g. publish package to npm)

Every hook is a function which gets the current ReleaseContext as the only argument and should return a Promise.

### Execution order
1. All precondition hooks
2. All version update hook with the version to release
3. `git commit` (only if previous version hook changed any files)
4. `git tag`
5. All release hooks
6. All version update hooks with the next development version (optional)
7. `git commit` (only if previous version hook changed any files)
8. `git push`

## License

[MIT](https://github.com/jsone-studios/release-script/blob/master/LICENSE)
