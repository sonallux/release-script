import path from 'path';

import semverParse from 'semver/functions/parse';

import {ReleaseConfigOptions} from './types';
import {openRepo} from './git';
import {ConfigValidator} from './validate';
import {checkPreconditions} from './precondition';
import {ReleaseContextImpl} from './release-context';
import {executeReleaseHooks} from './release-hook';
import {executeVersionHooks} from './version-hook';

export async function release(
    newVersionString: string, releaseConfig: ReleaseConfigOptions = {}, directory = '.'): Promise<void> {

    const configValidator = new ConfigValidator();

    if (!configValidator.validate(releaseConfig)) {
        const errors = configValidator.getErrors().map(error => `- ${error}`).join('\n');
        return Promise.reject(new Error(
            `Invalid configuration object.\n${errors}`));
    }

    const newVersion = semverParse(newVersionString);
    if (newVersion === null) {
        return Promise.reject(
            new Error(`New version does not follow the semantic version specification: ${newVersion}`));
    }

    const currentDirectory = path.resolve(directory);
    const git = openRepo(path.resolve(currentDirectory));
    const context = new ReleaseContextImpl(currentDirectory, newVersion, releaseConfig, git, false);

    await checkPreconditions(context);
    await executeVersionHooks(context);
    await context.git.addAndCommit(`Release version ${context.version} [CI SKIP]`);
    await context.doGitTag();
    await executeReleaseHooks(context);

    const nextContext = context.getNextContext();
    if (nextContext !== null) {
        await executeVersionHooks(nextContext);
        await nextContext.git.addAndCommit('Prepare next release [CI SKIP]');
    }

    await context.doGitPush();
    console.log('Finished release!');
}
