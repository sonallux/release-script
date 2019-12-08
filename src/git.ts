import simplegit = require('simple-git/promise');
import {CommitSummary, SimpleGit, StatusResult} from 'simple-git/promise';
import {DefaultLogFields} from 'simple-git/typings/response';

export class Git {

    constructor(private git: SimpleGit) {}

    static openRepo(path: string): Git {
        return new Git(simplegit(path));
    }

    status(): Promise<StatusResult> {
        return this.git.status();
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
        try {
            await this.commit(message);
            return;
        }
        catch (err) {
            return Promise.reject(err);
        }
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
        return this.git.push();
    }

    get simpleGit(): SimpleGit {
        return this.git;
    }
}
