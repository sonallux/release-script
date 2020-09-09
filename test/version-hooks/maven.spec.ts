import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

import SemVer from 'semver/classes/semver';

import {MavenPom} from '../../src/version-hooks';
import {createReleaseContext} from '../test-utils';
import type {ReleaseContext} from '../../src/types';

let testDir: string;
let context: ReleaseContext;

function getPom(version: string): string {
    return `<project xmlns="http://maven.apache.org/POM/4.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>de.jsone-studios.release-script</groupId>
    <artifactId>release-script</artifactId>
    <version>${version}</version>
    </project>`;
}

beforeEach(() => {
    testDir = path.resolve('./test-maven');
    context = createReleaseContext(testDir, new SemVer('1.1.0'));
    writeFileSync(path.resolve(testDir, 'pom.xml'), getPom('1.0.0'), 'utf-8');
});

describe('Plugin MavenPom', () => {
    it('updates version number', async () => {
        const plugin = MavenPom();
        await plugin(context);

        const actualPom = readFileSync(path.resolve(testDir, 'pom.xml')).toString('utf-8');
        const expectedPom = getPom('1.1.0');
        expect(actualPom).toEqual(expectedPom);

        return null;
    }, 120000);
});
