import {PreconditionFunction, ReleaseContext} from '../types';

export function GitBranch(branchName: RegExp | string): PreconditionFunction {
    async function precondition(context: ReleaseContext): Promise<void> {
        const currentBranch = await context.git.getCurrentBranchName();

        if (typeof branchName === 'string') {
            if (branchName === currentBranch) {
                return;
            }
            throw new Error(`Expected branch "${branchName}" but got "${currentBranch}"!`);
        }
        else if (branchName.test(currentBranch)) {
            return;
        }
        throw new Error(`Current branch "${currentBranch}" does not match pattern "${branchName}"!`);
    }

    return precondition;
}
