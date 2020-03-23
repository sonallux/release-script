import {readFileSync} from 'fs';
import path from 'path';

import semverParse from 'semver/functions/parse';

import {WriteFile} from '../../src/version-hooks';
import {createTestDirectory} from '../test-git-repo';

// eslint-disable-next-line
const context: any = {
    version: semverParse('1.0.0'),
};

const testDir = createTestDirectory('TestPluginWriteFile');

describe('Plugin WriteFile', () => {
    it('write correct version', async () => {
        const file = path.resolve(testDir, 'version.txt');
        const command = WriteFile(file);
        await command(context);

        expect(readFileSync(file, 'utf-8')).toEqual('1.0.0');
        return null;
    });

    it('write costom content', async () => {
        const file = path.resolve(testDir, 'version.txt');
        const command = WriteFile(file,
            ctx => `Major: ${ctx.version.major}\nMinor: ${ctx.version.minor}\nPatch: ${ctx.version.patch}\n`);
        await command(context);

        expect(readFileSync(file, 'utf-8')).toEqual('Major: 1\nMinor: 0\nPatch: 0\n');
        return null;
    });
});
