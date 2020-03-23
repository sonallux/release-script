import {writeFile as writeFileCallback, readFile as readFileCallback} from 'fs';
import {promisify} from 'util';

import {VersionFunction} from '../../declarations/ReleaseConfigOptions';
import {ReleaseContext} from '../release-context';

export function Changelog(
    file: string,
    fileEncoding = 'utf-8',
): VersionFunction {
    const writeFile = promisify(writeFileCallback);
    const readFile = promisify(readFileCallback);

    async function pluginFunction(context: ReleaseContext): Promise<void> {
        if (!context.isNextDevelopmentVersion) {
            const oldChangelog = await readFile(file, fileEncoding);
            const lines = oldChangelog.split('\n');
            let unreleasedLineIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('Unreleased')) {
                    unreleasedLineIndex = i;
                    break;
                }
                
            }
            if (unreleasedLineIndex === -1) {
                throw new Error(`Changelog could not find Unreleased section in ${file}!`);
            }
            const newVersionSection = `## [${context.version.version}]`;
            lines.splice(unreleasedLineIndex + 1, 0, '', newVersionSection);

            await writeFile(file, lines.join('\n'), fileEncoding);
        }
    }

    return pluginFunction;
}