import {writeFile as writeFileCallback, WriteFileOptions} from 'fs';
import {promisify} from 'util';
import path from 'path';

import type {ReleaseContext, VersionFunction} from '../types';

export function WriteFile(
    file: string,
    content?: (context: ReleaseContext) => string,
    writeFileOptions: WriteFileOptions = 'utf-8',
): VersionFunction {
    const writeFile = promisify(writeFileCallback);

    function pluginFunction(context: ReleaseContext): Promise<void> {
        const fileContent = content ? content(context) : context.version.version;
        const fullFilePath = path.resolve(context.directory, file);
        return writeFile(fullFilePath, fileContent, writeFileOptions);
    }

    return pluginFunction;
}
