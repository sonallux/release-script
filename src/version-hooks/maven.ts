import {ExecOptions} from 'child_process';
import path from 'path';

import {ReleaseContext, VersionFunction} from '../types';

import {Command} from './command';

export function MavenPom(options?: ExecOptions): VersionFunction {

    const mavenPomCmd: (context: ReleaseContext) => string = (context: ReleaseContext) =>
        `.${path.sep}mvnw versions:set -DnewVersion="${context.version.version}" -DgenerateBackupPoms=false`;

    return Command(mavenPomCmd, {maxBuffer: 1024 * 1024, ...options});
}
