import {writeFileSync} from 'fs';
import path from 'path';

import {release} from '../src/release-script';
import {ReleaseConfigOptions} from '../src/types';

import {TestGitRepo} from './test-git-repo';

let repo: TestGitRepo;

beforeEach(() => {
    repo = new TestGitRepo('TestReleaseScript');
    writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('ReleaseScript', () => {
    it('should create git tag without creating a new commit', async () => {
        await release('1.0.0', {push: false}, repo.directory);

        expect(await repo.git.tags()).toEqual(expect.arrayContaining(['v1.0.0']));
        expect((await repo.git.getLatestCommit()).message).toEqual('Initial commit');
    });

    it('should not git tag', async () => {
        await release('1.1.0', {push: false, tag: false}, repo.directory);

        expect(await repo.git.tags()).not.toEqual(expect.arrayContaining(['v1.1.0']));
        expect((await repo.git.getLatestCommit()).message).toEqual('Initial commit');
    });

    it('should do nothing on invalid semantic version number', async () => {
        try {
            await release('a.b');
            expect(true).toBeFalsy();
        }
        catch(err) {
            expect(err.message).toContain('New version does not follow the semantic version specification');
        }

        expect((await repo.git.tags()).length).toBe(0);
        expect((await repo.git.getLatestCommit()).message).toEqual('Initial commit');
    });

    it('should reject for invalid config', async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const config: any = {preconditions: ['test']};
            await release('1.0.0', config as ReleaseConfigOptions);
            expect(true).toBeFalsy();
        }
        catch(err) {
            expect(err.message).toContain('Invalid configuration object.');
        }

        expect((await repo.git.tags()).length).toBe(0);
        expect((await repo.git.getLatestCommit()).message).toEqual('Initial commit');
    });
});
