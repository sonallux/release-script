import {ExecOptions} from 'child_process';
import path from 'path';

import {VersionFunction} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

import {Command} from './command';

export function MavenPom(options?: ExecOptions): VersionFunction {

    const mavenPomCmd: (context: ReleaseContext) => string = (context: ReleaseContext) =>
        `.${path.sep}mvnw versions:set -DnewVersion="${context.version.version}" -DgenerateBackupPoms=false`;

    return Command(mavenPomCmd, options);
}
