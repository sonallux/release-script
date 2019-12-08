# How to test release script

- Empty git repo is needed for every test case, to evaluate all git related functionality
- gitignore the folder where these git repos are created, so they don't interfere with the main release-script git repo.
- On test setup create empty git repo.
- `git push` can not be tested as a separate remote is needed.
