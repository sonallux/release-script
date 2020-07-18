import {writeFileSync} from 'fs';
import path from 'path';

import {CleanWorkingTree} from '../../src/preconditions';
import {TestGitRepo} from '../test-git-repo';

let repo: TestGitRepo;

beforeEach(async () => {
    repo = await TestGitRepo.create('TestPreconditionCleanWorkingTree');
    writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('Precondition CleanWorkingTree', () => {

    it('should pass', () => {
        const precondition = CleanWorkingTree();
        return expect(precondition(repo.context())).resolves.toBe(undefined);
    });

    it('should fail', () => {
        writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a changed test file!');

        const precondition = CleanWorkingTree();
        return expect(precondition(repo.context()))
            .rejects.toHaveProperty('message', 'Working Tree is not clean!');
    });

});
