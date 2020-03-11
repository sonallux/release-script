import {writeFile as writeFileCallback, WriteFileOptions} from 'fs';
import {promisify} from 'util';

import {PluginInstance} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export class WriteFile implements PluginInstance {

    name = 'WriteFile';

    private writeFile = promisify(writeFileCallback);

    constructor(
        private file: string,
        private content?: (context: ReleaseContext) => string,
        private writeFileOptions: WriteFileOptions = 'utf-8',
    ) {}

    apply: (context: ReleaseContext) => Promise<boolean> = async (context: ReleaseContext) => {
        const content = this.content ? this.content(context) : context.version.version;
        try {
            await this.writeFile(this.file, content, this.writeFileOptions);
            return true;
        }
        catch (err) {
            throw new Error(`Failed to write version to file '${this.file}': ${err.message}`);
        }

    }
}
