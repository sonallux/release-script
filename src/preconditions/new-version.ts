import semverCoerce from 'semver/functions/coerce';

import type {PreconditionFunction, ReleaseContext} from '../types';

export function NewVersion(): PreconditionFunction {

    function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
        return value !== null && value !== undefined;
    }

    async function precondition(context: ReleaseContext): Promise<void> {
        const tags = await context.git.tags();
        const isNewVersion = tags
            .map(v => semverCoerce(v))
            .filter(notEmpty)
            .every(v => context.version.compare(v) !== 0);

        if (isNewVersion) {
            return;
        }

        throw new Error(`Version has already been released: ${context.version.version}!`);
    }

    return precondition;
}
