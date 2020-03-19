# Release script

## Hook Types
- precondition
- version
- release

Every hook type gets the current ReleaseContext as the only argument.

## Execution order
1. precondition: Check for a precondition and return true if it holds
2. version: Update the version (e.g. change version field in package.json)
3. git commit: only if previous version hook changed any files
4. git tag: Performs a git tag (can be disabled)
5. release: Perform the release
6. version: Update to the next snapshot version (optional)

## Plugin
