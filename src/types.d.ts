import {ExecOptions} from 'child_process';
import {WriteFileOptions} from 'fs';

import SemVer from 'semver/classes/semver';
import {DefaultLogFields, StatusResult} from 'simple-git/typings/response';

export interface Git {
    /**
     * Show the working tree status.
     *
     * @returns {Promise<StatusResult>} Parsed status result.
    */
    status(): Promise<StatusResult>;

    /**
     * Wraps `git rev-parse`. Primarily used to convert friendly commit references (ie branch names) to SHA1 hashes.
     *
     * Options should be an array of string options compatible with the `git rev-parse`
     *
     * @param {string[]} [options]
     * @returns Promise<string>
     * @see https://git-scm.com/docs/git-rev-parse
     */
    revParse(options?: string[]): Promise<string>;

    /**
     * Gets the name fo the current branch
     * 
     * @returns {Promise<string>} The branch name
     */
    getCurrentBranchName(): Promise<string>;

    /**
     * Gets a list of tags.
     *
     * @param {Options} options
     * @returns {Promise<TagResult>} Parsed tag list.
     */
    tags(): Promise<string[]>;

    /**
     * Add all files to staging area and commits them. 
     * This is equivalent to calling `add('.')` followed by `commit(message)`.
     * 
     * @param {string} The commit message
     */
    addAndCommit(message: string): Promise<void>;

    /**
     * Add files to staging area. If no files are specified, all files in the current directory are added.
     * 
     * @param {string|string[]} Files to add 
     */
    add(files?: string | string[]): Promise<void>;

    /**
     * Commits changes in the current working directory - when specific file paths are supplied, only changes on those
     * files will be committed.
     * 
     * @param {string} The commit message 
     * @param {string|string[]} The files to commit 
     */
    commit(message: string, files?: string | string[]): Promise<void>;

    /**
     * Creates a signed commit - when specific file paths are supplied, only changes on those files will be committed.
     * 
     * @param {string} The commit message 
     * @param {string|string[]} The files to commit
     */
    signedCommit(message: string, files?: string | string[]): Promise<void>;

    /**
     * Creates a tag. When a tagMessage is specififed a annotated tag will be creates.
     * 
     * @param {string} The name of the tag 
     * @param {string} The message for an annotated tag
     */
    tag(tagName: string, tagMessage?: string): Promise<void>;

    /**
     * Creates a signed tag.
     * 
     * @param {string} The name of the tag 
     * @param {string} The message of the tag
     */
    signedTag(tagName: string, tagMessage: string): Promise<void>;

    /**
     * Gets the last commit details
     * 
     * @returns {Promise<DefaultLogFields} The details of the last commit
     */
    getLatestCommit(): Promise<DefaultLogFields>;

    /**
     * Performs a push
     */
    push(): Promise<void>;
}

export interface ReleaseContext {
    directory: string;
    version: SemVer;
    config: ReleaseConfigOptions;
    git: Git;
    isNextDevelopmentVersion: boolean;
}

export type PreconditionFunction = (context: ReleaseContext) => Promise<void>;
export type VersionFunction = (context: ReleaseContext) => Promise<void>;
export type ReleaseFunction = (context: ReleaseContext) => Promise<void>;

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
    /**
     * Whether to update to the next development version after the release. If set to `true` and a release of 
     * version `1.0.0`, the next development version will be `1.0.0-0`. A string can used to specify the prerelease
     * id (e.g. using `'dev'` will result in `1.0.0-dev.0`). Defaults to `true`.
     */
    nextDevelopmentVersion?: boolean | string;
    /**
     * Whether to execute the `git push` command. Defaults to `true`.
     */
    push?: boolean;
    /**
     * Whether to perform a `git tag`. A string can be used to specify a prefix for the tag name (e.g. a prefix
     * of `'v'` will generate a git tag `v1.0.0`). Defaults to `'v'`.
     */
    tag?: boolean | string;
    /**
     * Whether to sign git commits and tags
     */
    gitSign?: boolean;
}

export function release(newVersionString: string, config?: ReleaseConfigOptions, directory?: string): Promise<void>;

//Preconditions
export function CleanWorkingTree(): PreconditionFunction
export function GitBranch(branchName: RegExp | string): PreconditionFunction;
export function NewVersion(): PreconditionFunction;

//Hooks
export function Changelog(
    file: string, 
    releaseHeader?: (context: ReleaseContext) => Promise<string>, 
    fileEncoding?: string): VersionFunction;
export function Command(
    cmdString: string | ((context: ReleaseContext) => string), 
    options?: ExecOptions): VersionFunction|ReleaseFunction;
export function MavenPom(options?: ExecOptions): VersionFunction;
export function NpmPackage(options?: ExecOptions): VersionFunction;
export function WriteFile(
    file: string,
    content?: (context: ReleaseContext) => string,
    writeFileOptions?: WriteFileOptions): VersionFunction
