/**
 * This file was automatically generated.
 * DO NOT MODIFY BY HAND.
 * Run `npm run lint-fix` to update
 */

/**
 * Function acting as precondition checker
 *
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "PreconditionFunction".
 */
export type PreconditionFunction = (
    context: import("../src/release-context").ReleaseContext
) => Promise<boolean> | [boolean, string?];
/**
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "BooleanOrString".
 */
export type BooleanOrString = boolean | string;
/**
 * Function acting as plugin
 *
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "PluginFunction".
 */
export type PluginFunction = (context: import("../src/release-context").ReleaseContext) => Promise<boolean> | boolean;

export interface ReleaseConfigOptions {
    /**
     * Precondition checkers
     */
    preconditions?: (PreconditionInstance | PreconditionFunction)[];
    shapshot?: BooleanOrString;
    push?: boolean;
    tag?: BooleanOrString;
    /**
     * Plugins for the version updater
     */
    plugins?: (PluginInstance | PluginFunction)[];
}
/**
 * Precondition checker instance
 *
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "PreconditionInstance".
 */
export interface PreconditionInstance {
    precondition: PreconditionFunction;
    /**
     * Name of this precondition
     */
    name: string;
    [k: string]: any;
}
/**
 * Plugin instance
 *
 * This interface was referenced by `ReleaseConfigOptions`'s JSON-Schema
 * via the `definition` "PluginInstance".
 */
export interface PluginInstance {
    apply: PluginFunction;
    /**
     * Name of this plugin
     */
    name: string;
    [k: string]: any;
}
