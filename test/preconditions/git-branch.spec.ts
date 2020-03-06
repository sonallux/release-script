import fs = require('fs');
import path = require('path');

import {ReleaseScript} from '../../src/release-script';
import {GitBranch} from '../../src/preconditions/git-branch';
import {TestGitRepo} from '../test-git-repo';

let repo: TestGitRepo;

beforeEach(() => {
    repo = new TestGitRepo('TestGitBranchRepo')
    fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('GitBranch with string', () => {
    it('should work on correct branch', async () => {
        const releaseScript = new ReleaseScript({
            preconditions: [new GitBranch('master')],
            push: false,
        })

        await releaseScript.release('1.0.0', repo.directory);
        expect(await repo.git.tags()).toContain('v1.0.0');
        return null;
    });

    it('should not work on wrong branch', async () => {
        const releaseScript = new ReleaseScript({
            preconditions: [new GitBranch('test')],
            push: false,
        })

        try {
            await releaseScript.release('1.0.0', repo.directory);
        }
        catch (error) {
            expect((await repo.git.tags()).length).toBe(0);
            expect(error.message).toBe('Expected branch "test" but got "master"!');
            return null;
        }
        throw new Error('Release Script should have thrown error');
    });
});

describe('GitBranch with RegExp', () => {
    it('should work on correct branch', async () => {
        const releaseScript = new ReleaseScript({
            preconditions: [new GitBranch(/^v[0-9]+\.[0-9]+$/)],
            push: false,
        })

        await repo.git.simpleGit.checkout(['-b', 'v1.0']);

        await releaseScript.release('1.0.0', repo.directory);
        expect(await repo.git.tags()).toContain('v1.0.0');
        return null;
    });

    it('should not work on wrong branch', async () => {
        const releaseScript = new ReleaseScript({
            preconditions: [new GitBranch(/^v[0-9]+\.[0-9]+$/)],
            push: false,
        })

        try {
            await releaseScript.release('1.0.0', repo.directory);
        }
        catch (error) {
            expect((await repo.git.tags()).length).toBe(0);
            expect(error.message).toBe('Current branch "master" does not match pattern "/^v[0-9]+\\.[0-9]+$/"!');
            return null;
        }
        throw new Error('Release Script should have thrown error');
    });
});
