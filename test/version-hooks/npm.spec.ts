import {execSync} from 'child_process';
import {readFileSync} from 'fs';
import path from 'path';

import semver from 'semver';

import {NpmPackage} from '../../src/version-hooks';
import {createTestDirectory} from '../test-git-repo';

// eslint-disable-next-line
const context: any = {};

let testDir: string;

beforeEach(() => {
    testDir = createTestDirectory('TestPluginNpmPackage');
});

describe('Plugin NpmPackage', () => {
    it('updates version number', async () => {
        execSync('npm init -y', {cwd: testDir});

        const plugin = NpmPackage({cwd: testDir});
        context.version = semver.parse('1.0.1');
        await plugin(context);

        const packageJson = JSON.parse(readFileSync(path.resolve(testDir, 'package.json')).toString('utf-8'));
        expect(packageJson.version).toEqual('1.0.1');

        return null;
    });

    it('updates to same version number', async () => {
        execSync('npm init -y', {cwd: testDir});

        const plugin = NpmPackage({cwd: testDir});
        context.version = semver.parse('1.0.0');
        await plugin(context);

        const packageJson = JSON.parse(readFileSync(path.resolve(testDir, 'package.json')).toString('utf-8'));
        expect(packageJson.version).toEqual('1.0.0');

        return null;
    });
});
