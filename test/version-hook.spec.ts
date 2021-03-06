import {writeFileSync} from 'fs';
import path from 'path';

import {release} from '../src/release-script';
import type {ReleaseContext, VersionFunction} from '../src/types';

import {TestGitRepo} from './test-utils';

let repo: TestGitRepo;

beforeEach(async () => {
    repo = await TestGitRepo.create('TestVersionHookRepo');
    writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

async function executeReleaseScriptFailure(versionHook: VersionFunction[], newVersion: string):
    Promise<Error> {

    try {
        await release(newVersion, {versionHook, push: false}, repo.directory);
    }
    catch (error) {
        expect((await repo.git.tags()).length).toBe(0);
        return error as Error;
    }
    throw new Error('Release Script should have thrown error');
}

describe('Version Hook', () => {
    it('should create next development version without prerelease id', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.resolve());

        const config = {
            versionHook: [pluginMock],
            push: false,
        };

        await release('1.0.0', config, repo.directory);
        expect(await repo.git.tags()).toContain('v1.0.0');
        expect(pluginMock).toHaveBeenCalledTimes(2);
        expect(pluginMock.mock.calls[0][0].isNextDevelopmentVersion).toBe(false);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock.mock.calls[1][0].isNextDevelopmentVersion).toBe(true);
        expect(pluginMock.mock.calls[1][0].version.version).toBe('1.0.1-0');

        return null;
    });

    it('should create next development version with prerelease id', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.resolve());

        const config = {
            versionHook: [pluginMock],
            nextDevelopmentVersion: 'dev',
            push: false,
        };

        await release('1.0.0', config, repo.directory);
        expect(await repo.git.tags()).toContain('v1.0.0');
        expect(pluginMock).toHaveBeenCalledTimes(2);
        expect(pluginMock.mock.calls[0][0].isNextDevelopmentVersion).toBe(false);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock.mock.calls[1][0].isNextDevelopmentVersion).toBe(true);
        expect(pluginMock.mock.calls[1][0].version.version).toBe('1.0.1-dev.0');

        return null;
    });

    it('should be called only once', async () => {
        const pluginMock = jest.fn<Promise<void>, [ReleaseContext]>(() => Promise.resolve());

        const config = {
            versionHook: [pluginMock],
            nextDevelopmentVersion: false,
            push: false,
        };

        await release('1.0.0', config, repo.directory);
        expect(await repo.git.tags()).toContain('v1.0.0');
        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].isNextDevelopmentVersion).toBe(false);
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
