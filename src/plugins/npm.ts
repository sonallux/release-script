import {ExecOptions} from 'child_process';

import {ReleaseContext} from '../release-context';

import {Command} from './command';

export class NpmPackage extends Command {

    name = 'NpmPackage';

    constructor(options?: ExecOptions){
        super(NpmPackage.npmVersionCmd, options);
    }

    private static npmVersionCmd: (context: ReleaseContext) => string = (context: ReleaseContext) =>
        `npm -no-git-tag-version --allow-same-version version ${context.version.version}`;
}
