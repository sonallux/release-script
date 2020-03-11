import path from 'path';

import semver from 'semver';

import {ReleaseConfigOptions} from '../declarations/ReleaseConfigOptions';

import {Git} from './git';
import {validate} from './validate';
import {checkPreconditions} from './precondition';
import {ReleaseContext} from './release-context';
import {executePlugins} from './plugin';

function addDefaultOptions(releaseConfig: ReleaseConfigOptions): void {
    if (!releaseConfig.preconditions) {
        releaseConfig.preconditions = [];
    }

    if (!releaseConfig.tag || releaseConfig.tag === true) {
        releaseConfig.tag = 'v';
    }
}

export class ReleaseScript {
    constructor(private releaseConfig: ReleaseConfigOptions = {}) {
        validate(releaseConfig);
        addDefaultOptions(releaseConfig);
    }

    public async release(newVersionString: string, directory = '.'): Promise<void> {
        const newVersion = semver.parse(newVersionString);
        if (newVersion === null) {
            console.log(`New version does not follow the semantic version specification: ${newVersion}`);
            return;
        }

        const git = Git.openRepo(path.resolve(directory));
        const context = new ReleaseContext(git, newVersion, this.releaseConfig);

        await checkPreconditions(context);
        await executePlugins(context);
        await context.git.addAndCommit(`Release version ${context.version} [CI SKIP]`);
        await context.doGitTag();
        const nextContext = context.getNextContext();
        if (nextContext !== null) {
            await executePlugins(nextContext);
            await nextContext.git.addAndCommit('Prepare next release [CI SKIP]');
        }

        await context.doGitPush();
        console.log('Finished release!');
    }
}
