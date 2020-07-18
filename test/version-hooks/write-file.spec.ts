import {readFileSync} from 'fs';
import path from 'path';

import semverParse from 'semver/functions/parse';

import {WriteFile} from '../../src/version-hooks';
import {createTestDirectory} from '../test-git-repo';
import {ReleaseContext} from '../../src/types';

const context: ReleaseContext = {
    version: undefined,
    directory: undefined,
    config: undefined,
    git: undefined,
    isNextDevelopmentVersion: false,
};

let testDir: string;

beforeEach(() => {
    testDir = createTestDirectory('TestPluginWriteFile');
    context.directory = testDir;
    context.version = semverParse('1.0.0');
});

describe('Plugin WriteFile', () => {
    it('write correct version', async () => {
        const command = WriteFile('version.txt');
        await command(context);

        expect(readFileSync(path.resolve(testDir, 'version.txt'), 'utf-8')).toEqual('1.0.0');
        return null;
    });

    it('write costom content', async () => {
        const command = WriteFile('version.txt',
            ctx => `Major: ${ctx.version.major}\nMinor: ${ctx.version.minor}\nPatch: ${ctx.version.patch}\n`);
        await command(context);

        expect(readFileSync(path.resolve(testDir, 'version.txt'), 'utf-8')).toEqual('Major: 1\nMinor: 0\nPatch: 0\n');
        return null;
    });
});
