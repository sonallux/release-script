import {exec as execCallback, ExecOptions} from 'child_process';
import {promisify} from 'util';

import {PluginInstance} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export class Command implements PluginInstance {

    name = 'Command';

    private exec = promisify(execCallback);

    constructor(
        private cmdString: string | ((context: ReleaseContext) => string),
        private options?: ExecOptions,
    ) {}

    apply: (context: ReleaseContext) => Promise<boolean> = async (context: ReleaseContext) => {
        const command = typeof this.cmdString === 'string' ? this.cmdString : this.cmdString(context);
        try {
            await this.exec(command, this.options);
            return true;
        }
        catch (err) {
            throw new Error(`Failed to execute Command plugin: ${err.message}`);
        }
    }
}
