import type {SemVer} from 'semver/classes/semver';
import {CommitSummary, DefaultLogFields, StatusResult} from 'simple-git/typings/response';

export interface Git {
    status(): Promise<StatusResult>;
    revParse(options?: string[]): Promise<string>;
    getCurrentBranchName(): Promise<string>;
    tags(): Promise<string[]>;
    addAndCommit(message: string): Promise<void>;
    commit(message: string, files?: string | string[]): Promise<CommitSummary>;
    tag(tagName: string, tagMessage?: string): Promise<void>;
    getLatestCommit(): Promise<DefaultLogFields>;
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
    nextDevelopmentVersion?: boolean | string;
    push?: boolean;
    tag?: boolean | string;
}

export function release(newVersionString: string, config?: ReleaseConfigOptions, directory?: string): Promise<void>;
