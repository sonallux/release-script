import fs = require('fs');
import path = require('path');

import {ReleaseScript} from '../src/release-script';
import {ReleaseContext} from '../src/release-context';
import {PreconditionInstance, PreconditionFunction} from '../declarations/ReleaseConfigOptions';

import {TestGitRepo} from './test-git-repo';

let repo: TestGitRepo;

beforeEach(() => {
    repo = new TestGitRepo('TestPreconditionRepo')
    fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

async function executeReleaseScriptSuccess(preconditions: (PreconditionInstance | PreconditionFunction)[],
    newVersion: string): Promise<void> {
    const releaseScript = new ReleaseScript({
        preconditions,
        push: false,
    });

    await releaseScript.release(newVersion, repo.directory);
    expect(await repo.git.tags()).toContain('v1.0.0');
    return;
}

async function executeReleaseScriptFailure(preconditions: (PreconditionInstance | PreconditionFunction)[],
    newVersion: string): Promise<Error> {
    const releaseScript = new ReleaseScript({
        preconditions,
        push: false,
    });

    try {
        await releaseScript.release(newVersion, repo.directory);
        throw new Error('Release Script should have thrown error');
    }
    catch (error) {
        expect((await repo.git.tags()).length).toBe(0);
        return error;
    }
}

describe('PreconditionObject', () => {
    it('should be called', async () => {
        const preconditionMock = jest.fn<[boolean], [ReleaseContext]>(() => [true]);

        await executeReleaseScriptSuccess([{name: 'Test', precondition: preconditionMock}], '1.0.0');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail', async () => {
        const preconditionMock = jest.fn<[boolean, string], [ReleaseContext]>(() => [false, 'Test error']);

        const error = await executeReleaseScriptFailure([{name: 'Test', precondition: preconditionMock}], '1.0.0');
        expect(error.message).toBe('Test error');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail without message', async () => {
        const preconditionMock = jest.fn<[boolean], [ReleaseContext]>(() => [false]);

        const error = await executeReleaseScriptFailure([{name: 'Test', precondition: preconditionMock}], '1.0.0');
        expect(error.message).toBe('Precondition \'Test\' failed');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should early exit', async () => {
        const preconditionMock1 = jest.fn<[boolean, string], [ReleaseContext]>(() => [false, 'Test error 1']);
        const preconditionMock2 = jest.fn<[boolean, string], [ReleaseContext]>(() => [false, 'Test error 2']);

        const error = await executeReleaseScriptFailure([
            {name: 'Test 1', precondition: preconditionMock1},
            {name: 'Test 2', precondition: preconditionMock2},
        ], '1.0.0');
        expect(error.message).toBe('Test error 1');

        expect(preconditionMock1).toHaveBeenCalledTimes(1);
        expect(preconditionMock1.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(preconditionMock2).toHaveBeenCalledTimes(0);

        return null;
    });
});

describe('PreconditionFunction', () => {
    it('should be called', async () => {
        const preconditionMock = jest.fn<[boolean], [ReleaseContext]>(() => [true]);

        await executeReleaseScriptSuccess([preconditionMock], '1.0.0');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail', async () => {
        const preconditionMock = jest.fn<[boolean, string], [ReleaseContext]>(() => [false, 'Test error']);

        const error = await executeReleaseScriptFailure([preconditionMock], '1.0.0');
        expect(error.message).toBe('Test error');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail without message', async () => {
        const preconditionMock = jest.fn<[boolean], [ReleaseContext]>(() => [false]);

        const error = await executeReleaseScriptFailure([preconditionMock], '1.0.0');
        expect(error.message).toBe('Precondition \'mockConstructor\' failed');

        expect(preconditionMock).toHaveBeenCalledTimes(1);
        expect(preconditionMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should early exit', async () => {
        const preconditionMock1 = jest.fn<[boolean, string], [ReleaseContext]>(() => [false, 'Test error 1']);
        const preconditionMock2 = jest.fn<[boolean, string], [ReleaseContext]>(() => [false, 'Test error 2']);

        const error = await executeReleaseScriptFailure([preconditionMock1, preconditionMock2], '1.0.0');
        expect(error.message).toBe('Test error 1');

        expect(preconditionMock1).toHaveBeenCalledTimes(1);
        expect(preconditionMock1.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(preconditionMock2).toHaveBeenCalledTimes(0);

        return null;
    });
});

describe('Mixed Function and Instance', () => {
    it('should both be called', async () => {
        const preconditionMock1 = jest.fn<[boolean], [ReleaseContext]>(() => [true]);
        const preconditionMock2 = jest.fn<[boolean], [ReleaseContext]>(() => [true]);

        await executeReleaseScriptSuccess([
            preconditionMock1,
            {name: 'Test', precondition: preconditionMock2},
        ], '1.0.0');

        expect(preconditionMock1).toHaveBeenCalledTimes(1);
        expect(preconditionMock1.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(preconditionMock2).toHaveBeenCalledTimes(1);
        expect(preconditionMock2.mock.calls[0][0].version.version).toBe('1.0.0');
        return null;
    });
})
