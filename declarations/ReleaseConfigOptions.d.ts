/**
 * This file was automatically generated.
 * DO NOT MODIFY BY HAND.
 * Run `npm run lint-fix` to update
 */

/**
 * Function to perform a precondition check
 *
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "PreconditionFunction".
 */
export type PreconditionFunction = (context: import("../src/release-context").ReleaseContext) => Promise<void>;
/**
 * Function to perform a version update
 *
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "VersionFunction".
 */
export type VersionFunction = (context: import("../src/release-context").ReleaseContext) => Promise<void>;
/**
 * Function to perform a release
 *
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "ReleaseFunction".
 */
export type ReleaseFunction = (context: import("../src/release-context").ReleaseContext) => Promise<void>;
/**
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "BooleanOrString".
 */
export type BooleanOrString = boolean | string;

export interface ReleaseConfigOptions {
    /**
     * Precondition checkers
     */
    preconditions?: PreconditionFunction[];
    /**
     * Functions for the version hook
     */
    versionHook?: VersionFunction[];
    /**
     * Functions for the release hook
     */
    releaseHook?: ReleaseFunction[];
    nextDevelopmentVersion?: BooleanOrString;
    push?: boolean;
    tag?: BooleanOrString;
}
