import {exec as execCallback, ExecOptions} from 'child_process';
import {promisify} from 'util';

import {VersionFunction} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export function Command(
    cmdString: string | ((context: ReleaseContext) => string),
    options?: ExecOptions,
): VersionFunction {
    const exec = promisify(execCallback);

    async function pluginFunction(context: ReleaseContext): Promise<void> {
        const command = typeof cmdString === 'string' ? cmdString : cmdString(context);
        try {
            await exec(command, options);
            return;
        }
        catch (err) {
            throw new Error(`Failed to execute Command plugin: ${err.message}`);
        }
    }

    return pluginFunction;
}
