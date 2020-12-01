import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

import SemVer from 'semver/classes/semver';

import {MavenPom} from '../../src/version-hooks/maven';
import {createTestDirectory, createReleaseContext} from '../test-utils';
import type {ReleaseContext} from '../../src/types';

import {mockCommand} from './command.mock';

function getPom(version: string): string {
    return `<project xmlns="http://maven.apache.org/POM/4.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>de.sonallux.release-script</groupId>
    <artifactId>release-script</artifactId>
    <version>${version}</version>
    </project>`;
}

describe('Plugin MavenPom with maven wrapper ', () => {
    let testDir: string;
    let context: ReleaseContext;

    beforeEach(() => {
        testDir = path.resolve('./test-maven');
        context = createReleaseContext(testDir, new SemVer('1.1.0'));
        writeFileSync(path.resolve(testDir, 'pom.xml'), getPom('1.0.0'), 'utf-8');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('creates correct maven command', async () => {
        const mock = mockCommand();
       
        const plugin = MavenPom();
        await plugin(context);

        const expectedCmd = `.${path.sep}mvnw versions:set -DnewVersion="1.1.0" -DgenerateBackupPoms=false`;
        expect(mock).toBeCalledWith(expectedCmd, {maxBuffer: 1048576});
    });

    it('updates version number', async () => {
        const plugin = MavenPom();
        await plugin(context);

        const actualPom = readFileSync(path.resolve(testDir, 'pom.xml')).toString('utf-8');
        const expectedPom = getPom('1.1.0');
        expect(actualPom).toEqual(expectedPom);
    }, 120000);
});

describe('Plugin MavenPom without maven wrapper ', () => {
    let testDir: string;
    let context: ReleaseContext;

    beforeEach(() => {
        testDir = createTestDirectory('TestPluginMaven');
        context = createReleaseContext(testDir, new SemVer('1.1.0'));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('updates version number', async () => {
        const mock = mockCommand();
        
        const plugin = MavenPom();
        await plugin(context);

        const expectedCmd = 'mvn versions:set -DnewVersion="1.1.0" -DgenerateBackupPoms=false';
        expect(mock).toBeCalledWith(expectedCmd, {maxBuffer: 1048576});
    });
});
