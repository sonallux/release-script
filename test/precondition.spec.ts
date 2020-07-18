import {writeFileSync} from 'fs';
import path from 'path';

import {release} from '../src/release-script';
import type {PreconditionFunction, ReleaseContext} from '../src/types';

import {TestGitRepo} from './test-git-repo';

let repo: TestGitRepo;

beforeEach(async () => {
    repo = await TestGitRepo.create('TestPreconditionRepo');
    writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

async function executeReleaseScriptSuccess(preconditions: PreconditionFunction[],
    newVersion: string): Promise<void> {
    const config = {
        preconditions,
        push: false,
    };

    await release(newVersion, config, repo.directory);
    expect(await repo.git.tags()).toContain(`v${newVersion}`);
    return;
}

async function executeReleaseScriptFailure(preconditions: PreconditionFunction[],
    newVersion: string): Promise<Error> {
    const config = {
        preconditions,
        push: false,
    };

    try {
        await release(newVersion, config, repo.directory);
    }
    catch (error) {
        expect((await repo.git.tags()).length).toBe(0);
        return error as Error;
    }
    throw new Error('Release Script should have thrown error');
}

describe('PreconditionFunction', () => {
    it('should be called and handle returned Promise', async () => {
        const preconditionMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.resolve());

        await executeReleaseScriptSuccess([preconditionMock], '1.0.0');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail', async () => {
        const preconditionMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.reject('Test error'));

        const error = await executeReleaseScriptFailure([preconditionMock], '1.0.0');
        expect(error.message).toBe('Test error');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail with error', async () => {
        const preconditionMock =
            jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.reject(new Error('Test error')));

        const error = await executeReleaseScriptFailure([preconditionMock], '1.0.0');
        expect(error.message).toBe('Test error');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should early exit', async () => {
        const preconditionMock1 = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.reject('Test error 1'));
        const preconditionMock2 = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.reject('Test error 2'));

        const error = await executeReleaseScriptFailure([preconditionMock1, preconditionMock2], '1.0.0');
        expect(error.message).toBe('Test error 1');

        expect(preconditionMock1).toHaveBeenCalledTimes(1);
        expect(preconditionMock1.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(preconditionMock2).toHaveBeenCalledTimes(0);

        return null;
    });
});
