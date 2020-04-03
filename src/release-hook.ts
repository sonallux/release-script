import {ReleaseContext} from './types';

export async function executeReleaseHooks(context: ReleaseContext): Promise<void> {
    if (!context.config.releaseHook) {
        return;
    }

    for (const plugin of context.config.releaseHook) {
        try {
            await plugin(context);
        }
        catch (err) {
            throw err instanceof Error ? err : new Error(err);
        }
    }
}
