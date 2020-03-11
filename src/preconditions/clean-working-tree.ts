import {PreconditionInstance} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export class CleanWorkingTree implements PreconditionInstance {

    name = 'CleanWorkingTree';

    precondition: (context: ReleaseContext) => Promise<boolean> = async (context: ReleaseContext) => {
        const status = await context.git.status();
        return status.isClean();
    }
}
