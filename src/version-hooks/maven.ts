import type {ExecOptions} from 'child_process';
import {existsSync} from 'fs';
import path from 'path';

import type {ReleaseContext, VersionFunction} from '../types';

import {Command} from './command';

export function MavenPom(options?: ExecOptions): VersionFunction {

    const mavenPomCmd = (context: ReleaseContext) => {
        const mvn = existsSync(path.resolve(context.directory, 'mvnw')) ? `.${path.sep}mvnw` : 'mvn';
        return `${mvn} versions:set -DnewVersion="${context.version.version}" -DgenerateBackupPoms=false`;
    };

    return Command(mavenPomCmd, {maxBuffer: 1024 * 1024, ...options});
}
