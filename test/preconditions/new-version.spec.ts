import {writeFileSync} from 'fs';
import path from 'path';

import semverParse from 'semver/functions/parse';

import {NewVersion} from '../../src/preconditions';
import {TestGitRepo} from '../test-git-repo';

let repo: TestGitRepo;

beforeEach(async() => {
    repo = await TestGitRepo.create('TestPreconditionNewVersion');
    writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('NewVersion', () => {
    it('should work on unreleased version', async () => {
        await repo.git.tag('v0.0.1', 'Release 1.0.0');
        await repo.git.tag('v1.0.0', 'Release 1.0.0');

        const context = repo.context(semverParse('1.0.1'));

        const precondition = NewVersion();
        return expect(precondition(context)).resolves.toBe(undefined);
    });

    it('should not work on released version', async () => {
        await repo.git.tag('v1.0.0', 'Release 1.0.0');

        const context = repo.context(semverParse('1.0.0'));

        const precondition = NewVersion();
        return expect(precondition(context))
            .rejects.toHaveProperty('message', 'Version has already been released: 1.0.0!');
    });
});
