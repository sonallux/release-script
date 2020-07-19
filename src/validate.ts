/* eslint-disable @typescript-eslint/no-explicit-any */
import type {ReleaseConfigOptions} from './types';

function isArrayOfFunctions(functions: any): boolean {
    if (functions instanceof Array) {
        return functions.every(f => typeof f === 'function');
    }
    return false;
}

function isOfType(object: any, ...types: string[]): boolean {
    const objectType = typeof object;
    for (const type of types) {
        if (objectType === type) {
            return true;
        }
    }
    return false;
}

export class ConfigValidator {

    private errors: string[] = [];

    validate(releaseConfig: ReleaseConfigOptions): releaseConfig is ReleaseConfigOptions {
        this.errors = [];
        if ('preconditions' in releaseConfig && !isArrayOfFunctions(releaseConfig.preconditions)) {
            this.errors.push('config.preconditions must be an array of PreconditionFunctions');
        }
        if ('versionHook' in releaseConfig && !isArrayOfFunctions(releaseConfig.versionHook)) {
            this.errors.push('config.versionHook must be an array of VersionFunctions');
        }
        if ('releaseHook' in releaseConfig && !isArrayOfFunctions(releaseConfig.releaseHook)) {
            this.errors.push('config.releaseHook must be an array of ReleaseFunctions');
        }
        if ('nextDevelopmentVersion' in releaseConfig 
            && !isOfType(releaseConfig.nextDevelopmentVersion, 'string', 'boolean')) {
            this.errors.push('config.nextDevelopmentVersion must be a string or boolean');
        }
        if ('push' in releaseConfig && !isOfType(releaseConfig.push, 'boolean')) {
            this.errors.push('config.push must be a boolean');
        }
        if ('tag' in releaseConfig && !isOfType(releaseConfig.tag, 'string', 'boolean')) {
            this.errors.push('config.tag must be a string or boolean');
        }
        if ('gitSign' in releaseConfig && !isOfType(releaseConfig.gitSign, 'boolean')) {
            this.errors.push('config.gitSign must be a boolean');
        }
        return this.errors.length === 0;
    }

    getErrors(): string[] {
        return this.errors;
    }
}
