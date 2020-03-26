import path from 'path';

import semverParse from 'semver/functions/parse';

import {ReleaseConfigOptions} from '../declarations/ReleaseConfigOptions';

import {Git} from './git';
import {validate} from './validate';
import {checkPreconditions} from './precondition';
import {ReleaseContext} from './release-context';
import {executeReleaseHooks} from './release-hook';
import {executeVersionHooks} from './version-hook';

export class ReleaseScript {
    constructor(private releaseConfig: ReleaseConfigOptions = {}) {
        validate(releaseConfig);
    }

    public async release(newVersionString: string, directory = '.'): Promise<void> {
        const newVersion = semverParse(newVersionString);
        if (newVersion === null) {
            console.log(`New version does not follow the semantic version specification: ${newVersion}`);
            return;
        }

        const currentDirectory = path.resolve(directory);
        const git = Git.openRepo(path.resolve(currentDirectory));
        const context = new ReleaseContext(currentDirectory, newVersion, this.releaseConfig, git, false);

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
}
