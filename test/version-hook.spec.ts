import fs = require('fs');
import path = require('path');

import {ReleaseScript} from '../src/release-script';
import {ReleaseContext} from '../src/release-context';
import {VersionFunction} from '../declarations/ReleaseConfigOptions';

import {TestGitRepo} from './test-git-repo';

let repo: TestGitRepo;

beforeEach(() => {
    repo = new TestGitRepo('TestVersionHookRepo');
    fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

async function executeReleaseScriptSuccess(versionHook: VersionFunction[], newVersion: string):
    Promise<void> {
    const releaseScript = new ReleaseScript({
        versionHook,
        push: false,
    });

    await releaseScript.release(newVersion, repo.directory);
    expect(await repo.git.tags()).toContain(`v${newVersion}`);
    return;
}

async function executeReleaseScriptFailure(versionHook: VersionFunction[], newVersion: string):
    Promise<Error> {
    const releaseScript = new ReleaseScript({
        versionHook,
        push: false,
    });

    try {
        await releaseScript.release(newVersion, repo.directory);
    }
    catch (error) {
        expect((await repo.git.tags()).length).toBe(0);
        return error;
    }
    throw new Error('Release Script should have thrown error');
}

describe('Version Hook', () => {
    it('should be called two times', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.resolve());

        await executeReleaseScriptSuccess([pluginMock], '1.0.0');

        expect(pluginMock).toHaveBeenCalledTimes(2);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock.mock.calls[1][0].version.version).toBe('1.0.1-0');

        return null;
    });

    it('should be called only once', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.resolve());

        const releaseScript = new ReleaseScript({
            versionHook: [pluginMock],
            developmentVersion: false,
            push: false,
        });

        await releaseScript.release('1.0.0', repo.directory);
        expect(await repo.git.tags()).toContain('v1.0.0');
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
