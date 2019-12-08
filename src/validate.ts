import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import {ReleaseConfigOptions} from '../declarations/ReleaseConfigOptions';

import releaseConfigSchema from './schemas/ReleaseConfigOptions.json';

const ajv = new Ajv({
    allErrors: true,
});

ajvKeywords(ajv, [
    'instanceof',
]);

export function validate(releaseConfig: ReleaseConfigOptions): void {
    const compiledSchema = ajv.compile(releaseConfigSchema);
    const valid = compiledSchema(releaseConfig);
    if (valid || !compiledSchema.errors) {
        return;
    }

    const errors = [];
    for (const error of compiledSchema.errors) {
        errors.push(`- ReleaseConfig${error.dataPath} ${error.message}`);
    }
    console.log('Invalid configuration object.'
        + 'ReleaseScript has been initialised using a configuration object that does not match the API schema.\n'
        + `${errors.join('\n')}\n`);
    process.exit(1);
}
