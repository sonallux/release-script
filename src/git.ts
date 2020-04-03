// eslint-disable-next-line import/default
import simplegit, {SimpleGit} from 'simple-git/promise';
import {CommitSummary, DefaultLogFields, StatusResult} from 'simple-git/typings/response';

import {Git} from './types';

export class GitImpl implements Git {

    constructor(private git: SimpleGit) {}

    status(): Promise<StatusResult> {
        return this.git.status();
    }

    revParse(options?: string[]): Promise<string> {
        return this.git.revparse(options);
    }

    async getCurrentBranchName(): Promise<string> {
        return await this.revParse(['--abbrev-ref', 'HEAD']);
    }

    async tags(): Promise<string[]> {
        const tags = await this.git.tags();
        return tags.all;
    }

    async addAndCommit(message: string): Promise<void> {
        const status = await this.status();
        if (status.isClean()) {
            return;
        }
        await this.git.add('.');
        await this.commit(message);
        return;
    }

    commit(message: string, files?: string|string[]): Promise<CommitSummary> {
        return this.git.commit(message, files);
    }

    async tag(tagName: string, tagMessage?: string): Promise<void> {
        if (tagMessage) {
            return this.git.addAnnotatedTag(tagName, tagMessage);
        }
        await this.git.addTag(tagName);
    }

    async getLatestCommit(): Promise<DefaultLogFields> {
        const log = await this.git.log([-1]);
        return log.latest;
    }

    push(): Promise<void> {
        return this.git.push(undefined, undefined, {'--follow-tags': null});
    }

    get simpleGit(): SimpleGit {
        return this.git;
    }
}

export function openRepo(path: string): Git {
    return new GitImpl(simplegit(path));
}
