# Release script

[![Build](https://github.com/jsone-studios/release-script/workflows/Build/badge.svg)](https://github.com/jsone-studios/release-script/actions?query=workflow%3ABuild)
[![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/jsone-studios/release-script?sort=semver)](https://github.com/jsone-studios/release-script/releases)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=jsone-studios/release-script)](https://dependabot.com)
[![GitHub](https://img.shields.io/github/license/jsone-studios/release-script)](https://github.com/jsone-studios/release-script/blob/master/LICENSE)

Release script automates your release process for projects using git. Typically, releases involve a fixed number of steps to be executed in a given order. Most often these steps are always present:
1. Update the version number and do a `git commit`
2. Do a `git tag`
3. Update the version number to the next development version and do a `git commit`
4. Do a `git push`

Release Script will execute all these steps and can be customized to your needs with preconditions, version update hook and release hook.

## Usage

## Configuration
Release Script takes an optional configuration object. Following properties are available:
- `push: boolean` whether to execute the `git push` command. Default: `true`
- `nextDevelopmentVersion: boolean | string` whether to update to the next development version after the release. If set to `true` and a release of version `1.0.0`, the next development version will be `1.0.0-0`. A string can used to specify the prerelease id (e.g. using `'dev'` will result in `1.0.0-dev.0`). Default: `true`
- `tag: boolean | string` whether to perform a `git tag`. A string can be used to specify a prefix for the tag name (e.g. a prefix of `'v'` will generate a git tag `v1.0.0`). Default: `'v'`
- `preconditions` Array of [precondition hook function](#precondition-hook).
- `versionHook` Array of [version update hook function](#version-update-hook).
- `releaseHook` Array of [release hook function](#release-hook).

## Custom Hooks
The release script can be customized by the following hooks
<a name="precondition-hook"></a>
- Precondition: Checks that must be valid before performing a release.
<a name="version-update-hook"></a>
- Version update hook: Update the version (e.g. change version field in package.json)
<a name="release-hook"></a>
- Release hook: Perform the actual release (e.g. publish package to npm)

Every hook is a function which gets the current [ReleaseContext](#release-context) as the only argument and should return a Promise, that resolves for a successfull execution and rejects for an error. Errors will cause release script to terminate without any special error handling or reverting changes. Therefore extra care must be taken by the user if release script terminates with an error.

### Execution order
1. All precondition hooks
2. All version update hook with the version to release
3. `git commit` (only if previous version hook changed any files)
4. `git tag`
5. All release hooks
6. All version update hooks with the next development version (optional)
7. `git commit` (only if previous version hook changed any files)
8. `git push`

<a name="release-context"></a>
### `ReleaseContext`
The `ReleaseContext` holds any information relevant to the current release. The following properties are available:
- `directory: string` The root directory of the git repository
- `version` An instance of the [`SemVer`](https://github.com/npm/node-semver) class holding the current version number
- `config` the configuration object the release script was started with.
- `git` An instance of the `Git` class holding a reference to the current git repository
- `isNextDevelopmentVersion: boolean` This will only be `true` for the version update hook with the next development version, otherwise it will be `false`

## License

[MIT](https://github.com/jsone-studios/release-script/blob/master/LICENSE)
