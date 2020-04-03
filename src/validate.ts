/* eslint-disable @typescript-eslint/no-explicit-any */
import {ReleaseConfigOptions} from './types';

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

export function validateConfig(releaseConfig: any): releaseConfig is ReleaseConfigOptions {
    if ('preconditions' in releaseConfig && !isArrayOfFunctions(releaseConfig.preconditions)) {
        return false;
    }
    if ('versionHook' in releaseConfig && !isArrayOfFunctions(releaseConfig.versionHook)) {
        return false;
    }
    if ('releaseHook' in releaseConfig && !isArrayOfFunctions(releaseConfig.releaseHook)) {
        return false;
    }
    if ('nextDevelopmentVersion' in releaseConfig 
        && !isOfType(releaseConfig.nextDevelopmentVersion, 'string', 'boolean')) {
        return false;
    }
    if ('push' in releaseConfig && !isOfType(releaseConfig.push, 'boolean')) {
        return false;
    }
    if ('tag' in releaseConfig && !isOfType(releaseConfig.tag, 'string', 'boolean')) {
        return false;
    }
    return true;
}
