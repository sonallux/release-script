import {execSync} from 'child_process';
import {readFileSync} from 'fs';
import path from 'path';

import semverParse from 'semver/functions/parse';

import {NpmPackage} from '../../src/version-hooks';
import {createTestDirectory} from '../test-git-repo';
import {ReleaseContext} from '../../src/types';

const context: ReleaseContext= {
    version: undefined,
    directory: undefined,
    config: undefined,
    git: undefined,
    isNextDevelopmentVersion: false,
};

let testDir: string;

beforeEach(() => {
    testDir = createTestDirectory('TestPluginNpmPackage');
    context.directory = testDir;
});

describe('Plugin NpmPackage', () => {
    it('updates version number', async () => {
        execSync('npm init -y', {cwd: testDir});

        const plugin = NpmPackage();
        context.version = semverParse('1.0.1');
        await plugin(context);

        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const {version} = JSON.parse(readFileSync(path.resolve(testDir, 'package.json')).toString('utf-8'));
        expect(version).toEqual('1.0.1');

        return null;
    });

    it('updates to same version number', async () => {
        execSync('npm init -y', {cwd: testDir});

        const plugin = NpmPackage();
        context.version = semverParse('1.0.0');
        await plugin(context);

        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const {version} = JSON.parse(readFileSync(path.resolve(testDir, 'package.json')).toString('utf-8'));
        expect(version).toEqual('1.0.0');

        return null;
    });
});
