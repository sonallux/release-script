import simplegit, {SimpleGit, DefaultLogFields, StatusResult} from 'simple-git';

import type {Git} from './types';

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
        await this.add();
        await this.commit(message);
        return;
    }

    async add(files?: string|string[]): Promise<void> {
        await this.git.add(files ?? '.');
        return;
    }

    async commit(message: string, files?: string|string[]): Promise<void> {
        const status = await this.status();
        if (status.isClean()) {
            return;
        }
        await this.git.commit(message, files);
        return;
    }

    async signedCommit(message: string, files?: string|string[]): Promise<void> {
        const status = await this.status();
        if (status.isClean()) {
            return;
        }
        await this.git.commit(message, files, {'-S': null});
        return;
    }

    async tag(tagName: string, tagMessage?: string): Promise<void> {
        if (tagMessage) {
            await this.git.addAnnotatedTag(tagName, tagMessage);
        } 
        else {
            await this.git.addTag(tagName);
        }
        return;
    }

    async signedTag(tagName: string, tagMessage: string): Promise<void> {
        await this.git.raw(['tag', '-s', '-m', tagMessage, tagName]);
        return;
    }

    async getLatestCommit(): Promise<DefaultLogFields> {
        const log = await this.git.log({'--max-count': 1});
        return log.latest;
    }

    async push(): Promise<void> {
        await this.git.push(undefined, undefined, {'--follow-tags': null});
        return;
    }

    get simpleGit(): SimpleGit {
        return this.git;
    }
}

export function openRepo(path: string): Git {
    return new GitImpl(simplegit(path));
}
