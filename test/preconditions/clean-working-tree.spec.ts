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

    it('should pass', async () => {
        const precondition = new CleanWorkingTree();
        expect(await precondition.precondition(context)).toBe(true);
        return null;
    });

    it('should fail', async () => {
        fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a changed test file!');

        const precondition = new CleanWorkingTree();
        expect(await precondition.precondition(context)).toBe(false);
        return null;
    });

});
