import semver from 'semver';

import {PreconditionFunction} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export function NewVersion(): PreconditionFunction {

    function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
        return value !== null && value !== undefined;
    }

    async function precondition(context: ReleaseContext): Promise<void> {
        const tags = await context.git.simpleGit.tags();

        const isNewVersion = tags.all
            .map(v => semver.coerce(v))
            .filter(notEmpty)
            .every(v => context.version.compare(v) !== 0);

        if (isNewVersion) {
            return;
        }

        throw new Error(`Version has already been released: ${context.version.version}!`);
    }

    return precondition;
}
