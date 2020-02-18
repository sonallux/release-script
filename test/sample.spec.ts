import fs = require('fs');
import path = require('path');

import {ReleaseScript} from '../src/release-script';

import {TestGitRepo} from './test-git-repo';

let repo: TestGitRepo;

beforeEach(() => {
    repo = new TestGitRepo('TestGitRepo')
    fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('ReleaseScript', () => {
    it('should create git tag without creating a new commit', async () => {
        const releaseScript = new ReleaseScript({
            push: false,
        });
        await releaseScript.release('1.0.0', repo.directory);

        expect(await repo.git.tags()).toContain('v1.0.0');
        expect((await repo.git.getLatestCommit()).message).toEqual('Initial commit');

        return null;
    });
});
