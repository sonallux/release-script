import fs from 'fs';
import path from 'path';

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import {release} from './release-script';
import type {ReleaseConfigOptions} from './types';

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

function getReleaseConfig(userReleaseConfigFile?: string): ReleaseConfigOptions | undefined {
    let configFile: string;
    if (userReleaseConfigFile === undefined ) {
        configFile = path.resolve(DEFAULT_RELEASE_CONFIG_FILE);
        if (!fs.existsSync(DEFAULT_RELEASE_CONFIG_FILE)) {
            return;
        }
    }
    else {
        configFile = path.resolve(userReleaseConfigFile);
        if (!fs.existsSync(configFile)) {
            throw new Error(`No ${userReleaseConfigFile} found!`);
        }
    }
    return require(configFile) as ReleaseConfigOptions;
}

export function cli(config?: ReleaseConfigOptions): void {
    const options = commandLineArgs(cliOptionDefinitions);

    if (options.help) {
        console.log(commandLineUsage(helpSections));
    }
    else if (options.version) {
        console.log('Current version unknown');
    }
    else {
        if (config === undefined) {
            config = getReleaseConfig(options.config);
        }

        release(options.release, config)
            .catch(error => console.log(error));
    }
}
