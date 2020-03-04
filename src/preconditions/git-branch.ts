import {PreconditionInstance} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export class GitBranch implements PreconditionInstance {

    name = 'GitBranch';

    constructor(private branchName: string) {}

    precondition: (context: ReleaseContext) => Promise<boolean> = async (context: ReleaseContext) => {
        const currentBranch = await context.git.revParse(['--symbolic-full-name', 'HEAD']);
        try {
            const expectedBranch = await context.git.revParse(['--symbolic-full-name', this.branchName]);
            if (currentBranch === expectedBranch) {
                return true;
            }
        }
        catch (error) {
            //ignore
        }
        throw new Error(`Expected branch "${this.branchName}" but got "${currentBranch}"!`);
    };
}
