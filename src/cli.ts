import {existsSync} from 'fs';
import {resolve} from 'path';

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import {release} from './release-script';
import type {ReleaseConfigOptions} from './types';

const DEFAULT_RELEASE_CONFIG_FILE = 'release.config.js';

interface CliOptions {
    help: boolean
    version: boolean
    config?: string
    release: string
}

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
        configFile = resolve(DEFAULT_RELEASE_CONFIG_FILE);
        if (!existsSync(DEFAULT_RELEASE_CONFIG_FILE)) {
            return;
        }
    }
    else {
        configFile = resolve(userReleaseConfigFile);
        if (!existsSync(configFile)) {
            throw new Error(`No ${userReleaseConfigFile} found!`);
        }
    }
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(configFile) as ReleaseConfigOptions;
}

export function cli(config?: ReleaseConfigOptions): void {
    const options = commandLineArgs(cliOptionDefinitions) as CliOptions;

    if (options.help) {
        console.log(commandLineUsage(helpSections));
    }
    else if (options.version) {
        console.log('Current version unknown');
    }
    else {
        release(options.release, config ?? getReleaseConfig(options.config))
            .catch(error => console.log(error));
    }
}
