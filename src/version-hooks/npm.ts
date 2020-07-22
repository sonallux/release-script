import {ExecOptions} from 'child_process';

import type {ReleaseContext, VersionFunction} from '../types';

import {Command} from './command';

export function NpmPackage(options?: ExecOptions): VersionFunction {
    const npmVersionCmd = (context: ReleaseContext) =>
        `npm --no-git-tag-version --allow-same-version version ${context.version.version}`;

    return Command(npmVersionCmd, options);
}
