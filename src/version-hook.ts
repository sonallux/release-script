import {ReleaseContext} from './types';

export async function executeVersionHooks(context: ReleaseContext): Promise<void> {
    if (!context.config.versionHook) {
        return;
    }

    for (const plugin of context.config.versionHook) {
        try {
            await plugin(context);
        }
        catch (err) {
            throw err instanceof Error ? err : new Error(err);
        }
    }
}
