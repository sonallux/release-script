import {writeFileSync} from 'fs';
import path from 'path';

import {ReleaseScript} from '../src/release-script';
import {ReleaseContext} from '../src/release-context';
import {ReleaseFunction} from '../declarations/ReleaseConfigOptions';

import {TestGitRepo} from './test-git-repo';

let repo: TestGitRepo;

beforeEach(() => {
    repo = new TestGitRepo('TestReleaseHookRepo');
    writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

async function executeReleaseScriptSuccess(releaseHook: ReleaseFunction[], newVersion: string):
    Promise<void> {
    const releaseScript = new ReleaseScript({
        releaseHook,
        push: false,
    });

    await releaseScript.release(newVersion, repo.directory);
    expect(await repo.git.tags()).toContain(`v${newVersion}`);
    return;
}

async function executeReleaseScriptFailure(releaseHook: ReleaseFunction[], newVersion: string):
    Promise<Error> {
    const releaseScript = new ReleaseScript({
        releaseHook,
        push: false,
    });

    try {
        await releaseScript.release(newVersion, repo.directory);
    }
    catch (error) {
        expect(await repo.git.tags()).toContain(`v${newVersion}`);
        return error;
    }
    throw new Error('Release Script should have thrown error');
}

describe('Release Hook', () => {
    it('should be called', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.resolve());

        await executeReleaseScriptSuccess([pluginMock], '1.0.0');

        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.reject('Plugin error'));

        const error = await executeReleaseScriptFailure([pluginMock], '1.0.0');
        expect(error.message).toBe('Plugin error');

        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail with error', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.reject(new Error('Plugin error')));

        const error = await executeReleaseScriptFailure([pluginMock], '1.0.0');
        expect(error.message).toBe('Plugin error');

        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });
});
