import {exec as execCallback, ExecOptions} from 'child_process';
import {promisify} from 'util';

import type {ReleaseContext, VersionFunction, ReleaseFunction} from '../types';

const exec = promisify(execCallback);

export function Command(
    cmdString: string | ((context: ReleaseContext) => string),
    options?: ExecOptions,
): VersionFunction|ReleaseFunction {
    async function pluginFunction(context: ReleaseContext): Promise<void> {
        const command = typeof cmdString === 'string' ? cmdString : cmdString(context);
        try {
            await exec(command, {cwd: context.directory, ...options});
            return;
        }
        catch (err) {
            throw new Error(`Failed to execute Command plugin: ${err as string}`);
        }
    }

    return pluginFunction;
}
