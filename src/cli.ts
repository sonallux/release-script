import fs from 'fs';
import path from 'path';

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import {ReleaseConfigOptions} from '../declarations/ReleaseConfigOptions';

import {ReleaseScript} from './release-script';

const DEFAULT_RELEASE_CONFIG_FILE = 'release.config.js';

const cliOptionDefinitions: commandLineUsage.OptionDefinition[] = [
    {
        name: 'help',
        description: 'Display this usage guide',
        alias: 'h',
        type: Boolean,
    },
    {
        name: 'version',
        description: 'Display the version',
        alias: 'v',
        type: Boolean,
    },
    {
        name: 'config',
        description: 'Path to the config file',
        alias: 'c',
        type: String,
        defaultValue: DEFAULT_RELEASE_CONFIG_FILE,
    },
    {
        name: 'release',
        description: 'The version number of the new release',
        alias: 'r',
        type: String,
        defaultOption: true,
    },
];

const helpSections: commandLineUsage.Section[] = [
    {
        header: 'Release script',
        content: 'It automates your release process',
    },
    {
        header: 'Options',
        optionList: cliOptionDefinitions,
    },
];

function getReleaseConfig(userReleaseConfigFile = DEFAULT_RELEASE_CONFIG_FILE): ReleaseConfigOptions|undefined {
    const configFile = path.resolve(userReleaseConfigFile);
    if (!fs.existsSync(configFile)) {
        console.log(`No ${configFile} found!`);
        return undefined;
    }

    return require(configFile.trim()) as ReleaseConfigOptions;
}

function main(): void {
    const options = commandLineArgs(cliOptionDefinitions);

    if (options.help) {
        console.log(commandLineUsage(helpSections));
    }
    else if (options.version) {
        console.log('Current version unknown');
    }
    else {
        const releaseConfig = getReleaseConfig(options.config);
        if (releaseConfig === undefined) {
            return;
        }

        const releaseScript = new ReleaseScript(releaseConfig);
        releaseScript.release(options.release, '.')
            .catch(error => console.log(error));
    }
}

main();
