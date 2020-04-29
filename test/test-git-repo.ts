import {existsSync, readdirSync, mkdirSync} from 'fs';
import path from 'path';

import rimraf from 'rimraf';
import simplegit from 'simple-git/promise';

import {GitImpl} from '../src/git';

const DEFAULT_REPO_FOLDER = './test-temp';

export function createTestDirectory(name: string): string {
    const directory = path.resolve(DEFAULT_REPO_FOLDER, name);
    if (existsSync(directory)) {
        for (const file of readdirSync(directory)) {
            //console.log(`Deleting: ${path.resolve(this._directory, file)}`);
            rimraf.sync(path.resolve(directory, file));
        }
    }
    else {
        mkdirSync(directory, {recursive: true});
    }
    return directory;
}

export class TestGitRepo {

    private _directory: string;
    private _git: GitImpl;

    constructor(name: string) {
        this._directory = createTestDirectory(name);
        const simpleGit = simplegit(this._directory);
        simpleGit.init();
        simpleGit.addConfig('user.name', 'Test Executor');
        simpleGit.addConfig('user.email', 'test@test.com');
        this._git = new GitImpl(simpleGit);
    }

    get git(): GitImpl {
        return this._git;
    }

    get directory(): string {
        return this._directory;
    }
}
