import {writeFileSync, readFileSync} from 'fs';
import path from 'path';

import semverParse from 'semver/functions/parse';

import {Changelog} from '../../src/version-hooks';
import {createTestDirectory} from '../test-git-repo';

// eslint-disable-next-line
const context: any = {};

let testChangelogFile: string;

beforeEach(() => {
    const testDir = createTestDirectory('TestPluginChangelog');
    testChangelogFile = path.resolve(testDir, 'CHANGELOG.md');
});

describe('Version Hook Changelog', () => {
    it('should do nothing on next development version', () => {
        writeFileSync(testChangelogFile, 'Wrong Changelog format\nTest\n');
        const plugin = Changelog(testChangelogFile);
        context.isNextDevelopmentVersion = true;
        return expect(plugin(context)).resolves.toBe(undefined);
    });

    it('should throw error in malformed changelog file', () => {
        writeFileSync(testChangelogFile, 'Wrong Changelog format\nTest\n');

        const plugin = Changelog(testChangelogFile);
        context.isNextDevelopmentVersion = false;
        return expect(plugin(context))
            .rejects.toHaveProperty('message', `Changelog could not find Unreleased section in ${testChangelogFile}!`);
    });

    it('should update changelog file', async () => {
        writeFileSync(testChangelogFile, '# Changelog\n\n## [Unreleased]\n- Foo\n\n## [1.0.0]\n- Bar\n');

        const plugin = Changelog(testChangelogFile);
        context.isNextDevelopmentVersion = false;
        context.version = semverParse('1.1.0');

        await plugin(context);

        expect(readFileSync(testChangelogFile, 'utf-8'))
            .toEqual('# Changelog\n\n## [Unreleased]\n\n## [1.1.0]\n- Foo\n\n## [1.0.0]\n- Bar\n');
    });
});