import type {ReleaseConfigOptions} from './types';

function isArrayOfFunctions(functions: unknown): functions is [(arg: unknown) => unknown] {
    if (functions instanceof Array) {
        return functions.every(f => typeof f === 'function');
    }
    return false;
}

function isBoolean(x: unknown): x is boolean {
    return typeof x === 'boolean';
}
  
function isString(x: unknown): x is string {
    return typeof x === 'string';
}
  
// eslint-disable-next-line @typescript-eslint/ban-types
function isObject(x: unknown): x is object {
    return typeof x === 'object' && x !== null;
}

// Helper function to fix issue that `in` operator as type guard is not widening type with the asserted property key
// See https://github.com/microsoft/TypeScript/issues/21732
// eslint-disable-next-line @typescript-eslint/ban-types
function hasProperty<P extends PropertyKey, O extends object> (obj: O, name: P): obj is O & { [K in P]: unknown } {
    return name in obj;
}

export class ConfigValidator {

    private errors: string[] = [];

    validate(releaseConfig: unknown): releaseConfig is ReleaseConfigOptions {
        this.errors = [];
        if (!isObject(releaseConfig)) {
            this.errors.push('config must be an object');
            return false;
        }
        if (hasProperty(releaseConfig, 'preconditions') && !isArrayOfFunctions(releaseConfig.preconditions)) {
            this.errors.push('config.preconditions must be an array of PreconditionFunctions');
        }
        if (hasProperty(releaseConfig, 'versionHook') && !isArrayOfFunctions(releaseConfig.versionHook)) {
            this.errors.push('config.versionHook must be an array of VersionFunctions');
        }
        if (hasProperty(releaseConfig, 'releaseHook') && !isArrayOfFunctions(releaseConfig.releaseHook)) {
            this.errors.push('config.releaseHook must be an array of ReleaseFunctions');
        }
        if (hasProperty(releaseConfig, 'nextDevelopmentVersion') 
            && !isString(releaseConfig.nextDevelopmentVersion) && !isBoolean(releaseConfig.nextDevelopmentVersion)) {
            this.errors.push('config.nextDevelopmentVersion must be a string or boolean');
        }
        if (hasProperty(releaseConfig, 'push') && !isBoolean(releaseConfig.push)) {
            this.errors.push('config.push must be a boolean');
        }
        if (hasProperty(releaseConfig, 'tag') && !isString(releaseConfig.tag) && !isBoolean(releaseConfig.tag)) {
            this.errors.push('config.tag must be a string or boolean');
        }
        if (hasProperty(releaseConfig, 'gitSign') && !isBoolean(releaseConfig.gitSign)) {
            this.errors.push('config.gitSign must be a boolean');
        }
        return this.errors.length === 0;
    }

    getErrors(): string[] {
        return this.errors;
    }
}
