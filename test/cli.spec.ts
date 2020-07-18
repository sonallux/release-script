import {writeFileSync} from 'fs';
import path from 'path';

import * as releaseModule from '../src/release-script';
import {cli} from '../src/cli';
import type {ReleaseConfigOptions} from '../src/types';

import {createTestDirectory} from './test-utils';

jest.mock('../src/release-script');

let testDir: string;

beforeEach(() => {
    testDir = createTestDirectory('TestCli');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('CLI', () => {
    it('should use passed configuration', () => {
        const releaseMock = jest.spyOn(releaseModule, 'release').mockReturnValue(Promise.resolve());
        process.argv = ['node', 'release', '1.0.0'];

        const config: ReleaseConfigOptions = {};
        cli(config);

        expect(releaseMock).toBeCalledWith('1.0.0', config);
    });

    it('should use no configuration', () => {
        const releaseMock = jest.spyOn(releaseModule, 'release').mockReturnValue(Promise.resolve());
        process.argv = ['node', 'release', '1.0.0'];

        cli();

        expect(releaseMock).toBeCalledWith('1.0.0', undefined);    
    });

    it('should handle missing configuration', () => {
        const releaseMock = jest.spyOn(releaseModule, 'release').mockReturnValue(Promise.resolve());
        process.argv = ['node', 'release', '1.0.0', '-c', 'test-foo.js'];
        expect.assertions(2);
        try {
            cli();
        }
        catch (err) {
            expect(err).toHaveProperty('message', 'No test-foo.js found!');
            expect(releaseMock).toBeCalledTimes(0);
        }
    });

    it('should load specified config file', () => {
        const configFile = path.resolve(testDir, 'release.config.js');
        writeFileSync(configFile, 'module.exports = {tag: "test"};', 'utf-8');
        const releaseMock = jest.spyOn(releaseModule, 'release').mockReturnValue(Promise.resolve());
        process.argv = ['node', 'release', '1.0.0', '-c', path.relative('.', configFile)];

        cli();

        expect(releaseMock).toBeCalledWith('1.0.0', {tag: 'test'});        
    });
});
