import {writeFile as writeFileCallback, WriteFileOptions} from 'fs';
import {promisify} from 'util';

import {VersionFunction} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export function WriteFile(
    file: string,
    content?: (context: ReleaseContext) => string,
    writeFileOptions: WriteFileOptions = 'utf-8',
): VersionFunction {
    const writeFile = promisify(writeFileCallback);

    function pluginFunction(context: ReleaseContext): Promise<void> {
        const fileContent = content ? content(context) : context.version.version;
        return writeFile(file, fileContent, writeFileOptions);
    }

    return pluginFunction;
}
