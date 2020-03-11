import fs = require('fs');
import path = require('path');

import {GitBranch} from '../../src/preconditions';
import {TestGitRepo} from '../test-git-repo';

let repo: TestGitRepo;

// eslint-disable-next-line
const context: any = {};

beforeEach(() => {
    repo = new TestGitRepo('TestPreconditionGitBranch');
    context.git = repo.git;
    fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('GitBranch with string', () => {
    it('should work on correct branch', () => {
        const precondition = new GitBranch('master');
        return expect(precondition.precondition(context)).resolves.toBe(true);
    });

    it('should not work on wrong branch', async () => {
        const precondition = new GitBranch('test');

        try {
            await precondition.precondition(context);
        }
        catch (error) {
            expect(error.message).toBe('Expected branch "test" but got "master"!');
            return null;
        }
        throw new Error('Precondition should have thrown error');
    });
});

describe('GitBranch with RegExp', () => {
    it('should work on correct branch', async () => {
        await repo.git.simpleGit.checkout(['-b', 'v1.0']);

        const precondition = new GitBranch(/^v[0-9]+\.[0-9]+$/);
        return expect(precondition.precondition(context)).resolves.toBe(true);
    });

    it('should not work on wrong branch', async () => {
        const precondition = new GitBranch(/^v[0-9]+\.[0-9]+$/);

        try {
            await precondition.precondition(context);
        }
        catch (error) {
            expect(error.message).toBe('Current branch "master" does not match pattern "/^v[0-9]+\\.[0-9]+$/"!');
            return null;
        }
        throw new Error('Precondition should have thrown error');
    });
});
