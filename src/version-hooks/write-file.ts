import {writeFile as writeFileCallback, WriteFileOptions} from 'fs';
import {promisify} from 'util';
import {resolve} from 'path';

import type {ReleaseContext, VersionFunction} from '../types';

const writeFile = promisify(writeFileCallback);

export function WriteFile(
    file: string,
    content?: (context: ReleaseContext) => string,
    writeFileOptions: WriteFileOptions = 'utf-8',
): VersionFunction {
    function pluginFunction(context: ReleaseContext): Promise<void> {
        const fileContent = content ? content(context) : context.version.version;
        const fullFilePath = resolve(context.directory, file);
        return writeFile(fullFilePath, fileContent, writeFileOptions);
    }

    return pluginFunction;
}
