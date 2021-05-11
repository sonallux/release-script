import type {ExecOptions} from 'child_process';
import {existsSync} from 'fs';
import {resolve, sep as pathSeparator} from 'path';

import type {ReleaseContext, VersionFunction} from '../types';

import {Command} from './command';

export function MavenPom(options?: ExecOptions): VersionFunction {

    const mavenPomCmd = (context: ReleaseContext) => {
        const mvn = existsSync(resolve(context.directory, 'mvnw')) ? `.${pathSeparator}mvnw` : 'mvn';
        return `${mvn} versions:set -DnewVersion="${context.version.version}" -DgenerateBackupPoms=false`;
    };

    return Command(mavenPomCmd, {maxBuffer: 1024 * 1024, ...options});
}
