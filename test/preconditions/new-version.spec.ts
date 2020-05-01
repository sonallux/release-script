import {writeFileSync} from 'fs';
import path from 'path';

import semverParse from 'semver/functions/parse';

import {NewVersion} from '../../src/preconditions';
import {TestGitRepo} from '../test-git-repo';

let repo: TestGitRepo;

// eslint-disable-next-line
const context: any = {};

beforeEach(() => {
    repo = new TestGitRepo('TestPreconditionNewVersion');
    context.git = repo.git;
    writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('NewVersion', () => {
    it('should work on unreleased version', async () => {
        await context.git.tag('v0.0.1', 'Release 1.0.0');
        await context.git.tag('v1.0.0', 'Release 1.0.0');

        const precondition = NewVersion();
        context.version = semverParse('1.0.1');
        return expect(precondition(context)).resolves.toBe(undefined);
    });

    it('should not work on released version', async () => {
        await context.git.tag('v1.0.0', 'Release 1.0.0');

        const precondition = NewVersion();
        context.version = semverParse('1.0.0');
        return expect(precondition(context))
            .rejects.toHaveProperty('message', 'Version has already been released: 1.0.0!');
    });
});
