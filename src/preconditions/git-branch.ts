import {PreconditionInstance} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export class GitBranch implements PreconditionInstance {

    name = 'GitBranch';

    constructor(private branchName: RegExp | string) {}

    precondition: (context: ReleaseContext) => Promise<boolean> = async (context: ReleaseContext) => {
        const currentBranch = await context.git.getCurrentBranchName();

        if (typeof this.branchName === 'string') {
            if (this.branchName === currentBranch) {
                return true;
            }
            throw new Error(`Expected branch "${this.branchName}" but got "${currentBranch}"!`);
        }
        else if (this.branchName.test(currentBranch)) {
            return true;
        }
        throw new Error(`Current branch "${currentBranch}" does not match pattern "${this.branchName}"!`);

    };


}
