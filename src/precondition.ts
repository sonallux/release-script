import {ReleaseContext} from './release-context';

export async function checkPreconditions(context: ReleaseContext): Promise<void> {
    if (!context.config.preconditions) {
        return;
    }

    for (const precondition of context.config.preconditions) {
        try {
            await precondition(context);
        }
        catch (err) {
            throw err instanceof Error ? err : new Error(err);
        }
    }
}
