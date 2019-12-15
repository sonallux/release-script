import fs = require('fs');
import path = require('path');

import {ReleaseScript} from '../src/release-script';
import {ReleaseContext} from '../src/release-context';
import {PluginInstance, PluginFunction} from '../declarations/ReleaseConfigOptions';

import {TestGitRepo} from './test-git-repo';

let repo: TestGitRepo;

beforeEach(() => {
    repo = new TestGitRepo('TestPluginRepo')
    fs.writeFileSync(path.resolve(repo.directory, 'test.txt'), 'This is a test file!');
    return repo.git.addAndCommit('Initial commit');
});

async function executeReleaseScriptSuccess(plugins: (PluginInstance | PluginFunction)[],
    newVersion: string): Promise<void> {
    const releaseScript = new ReleaseScript({
        plugins,
        push: false,
    });

    await releaseScript.release(newVersion, repo.directory);
    expect(await repo.git.tags()).toContain(`v${newVersion}`);
    return;
}

async function executeReleaseScriptFailure(plugins: (PluginInstance | PluginFunction)[],
    newVersion: string): Promise<Error> {
    const releaseScript = new ReleaseScript({
        plugins,
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

describe('PluginObject', () => {
    it('should be called', async () => {
        let pluginCalledCount = 0;
        const pluginFunc = (): boolean => {
            pluginCalledCount++;
            return true;
        };

        await executeReleaseScriptSuccess([{name: 'Test', apply: pluginFunc}] , '1.0.0');
        expect(pluginCalledCount).toBe(2);
        return null;
    });

    it('should be called', async () => {
        const pluginMock = jest.fn<boolean, [ReleaseContext]>(() => true);

        await executeReleaseScriptSuccess([{name: 'Test', apply: pluginMock}], '1.0.0');

        expect(pluginMock).toHaveBeenCalledTimes(2);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock.mock.calls[1][0].version.version).toBe('1.0.1-0');

        return null;
    });

    it('should be called and handle returned promise', async () => {
        const pluginMock = jest.fn<Promise<boolean>, [ReleaseContext]>(() => Promise.resolve(true));

        await executeReleaseScriptSuccess([{name: 'Test', apply: pluginMock}], '1.0.0');

        expect(pluginMock).toHaveBeenCalledTimes(2);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock.mock.calls[1][0].version.version).toBe('1.0.1-0');

        return null;
    });

    it('should fail', async () => {
        const pluginMock = jest.fn<boolean, [ReleaseContext]>(() => false);

        const error = await executeReleaseScriptFailure([{name: 'Test', apply: pluginMock}], '1.0.0');
        expect(error.message).toBe('Plugin \'Test\' failed to execute');

        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail and hanlde returned promise', async () => {
        const pluginMock = jest.fn<Promise<boolean>, [ReleaseContext]>(() => Promise.reject('Plugin error'));

        const error = await executeReleaseScriptFailure([{name: 'Test', apply: pluginMock}], '1.0.0');
        expect(error.message).toBe('Plugin error');

        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });
});

describe('PluginFunction', () => {
    it('should be called', async () => {
        let pluginCalledCount = 0;
        const pluginFunc = (): boolean => {
            pluginCalledCount++;
            return true;
        };

        await executeReleaseScriptSuccess([pluginFunc] , '1.0.0');
        expect(pluginCalledCount).toBe(2);
        return null;
    });

    it('should be called', async () => {
        const pluginMock = jest.fn<boolean, [ReleaseContext]>(() => true);

        await executeReleaseScriptSuccess([pluginMock], '1.0.0');

        expect(pluginMock).toHaveBeenCalledTimes(2);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock.mock.calls[1][0].version.version).toBe('1.0.1-0');

        return null;
    });

    it('should be called and handle returned promise', async () => {
        const pluginMock = jest.fn<Promise<boolean>, [ReleaseContext]>(() => Promise.resolve(true));

        await executeReleaseScriptSuccess([pluginMock], '1.0.0');

        expect(pluginMock).toHaveBeenCalledTimes(2);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock.mock.calls[1][0].version.version).toBe('1.0.1-0');

        return null;
    });

    it('should fail', async () => {
        const pluginMock = jest.fn<boolean, [ReleaseContext]>(() => false);

        const error = await executeReleaseScriptFailure([pluginMock], '1.0.0');
        expect(error.message).toBe('Plugin \'mockConstructor\' failed to execute');

        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });

    it('should fail and handle returned promise', async () => {
        const pluginMock = jest.fn<Promise<boolean>, [ReleaseContext]>(() => Promise.reject('Plugin error'));

        const error = await executeReleaseScriptFailure([pluginMock], '1.0.0');
        expect(error.message).toBe('Plugin error');

        expect(pluginMock).toHaveBeenCalledTimes(1);
        expect(pluginMock.mock.calls[0][0].version.version).toBe('1.0.0');

        return null;
    });
});

describe('Mixed Function and Instance', () => {
    it('should both be called', async () => {
        const pluginMock1 = jest.fn<boolean, [ReleaseContext]>(() => true);
        const pluginMock2 = jest.fn<boolean, [ReleaseContext]>(() => true);

        await executeReleaseScriptSuccess([
            pluginMock1,
            {name: 'Test', apply: pluginMock2},
        ], '1.0.0');

        expect(pluginMock1).toHaveBeenCalledTimes(2);
        expect(pluginMock1.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock1.mock.calls[1][0].version.version).toBe('1.0.1-0');
        expect(pluginMock2).toHaveBeenCalledTimes(2);
        expect(pluginMock2.mock.calls[0][0].version.version).toBe('1.0.0');
        expect(pluginMock2.mock.calls[1][0].version.version).toBe('1.0.1-0');
        return null;
    });
});
