import {PreconditionFunction} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export function CleanWorkingTree(): PreconditionFunction {
    async function precondition(context: ReleaseContext): Promise<void> {
        const status = await context.git.status();
        if (status.isClean()) {
            return;
        }
        else {
            throw new Error('Working Tree is not clean!');
        }
    }

    return precondition;
}
