import fs = require('fs');
import path = require('path');

import {CleanWorkingTree} from '../../src/preconditions';
import {TestGitRepo} from '../test-git-repo';

let repo: TestGitRepo;

// eslint-disable-next-line
const context: any = {};

beforeEach(() => {
    repo = new TestGitRepo('TestPreconditionCleanWorkingTree');
    context.git = repo.git;
    fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

describe('Precondition CleanWorkingTree', () => {

    it('should pass', () => {
        const precondition = CleanWorkingTree();
        return expect(precondition(context)).resolves.toBe(undefined);
    });

    it('should fail', () => {
        fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a changed test file!');

        const precondition = CleanWorkingTree();
        return expect(precondition(context))
            .rejects.toHaveProperty('message', 'Working Tree is not clean!');
    });

});
