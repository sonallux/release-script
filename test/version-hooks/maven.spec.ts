import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

import semver from 'semver';

import {MavenPom} from '../../src/version-hooks';

// eslint-disable-next-line
const context: any = {};

let testDir: string;

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
    writeFileSync(path.resolve(testDir, 'pom.xml'), getPom('1.0.0'), 'utf-8');
});

describe('Plugin MavenPom', () => {
    it('updates version number', async () => {
        const plugin = MavenPom({cwd: testDir});
        context.version = semver.parse('1.1.0');
        await plugin(context);

        const actualPom = readFileSync(path.resolve(testDir, 'pom.xml')).toString('utf-8');
        const expectedPom = getPom('1.1.0');
        expect(actualPom).toEqual(expectedPom);

        return null;
    }, 60000);
});