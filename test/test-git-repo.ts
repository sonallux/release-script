import {existsSync, readdirSync, mkdirSync} from 'fs';
import path from 'path';

import rimraf from 'rimraf';
import {SemVer} from 'semver';
import simplegit from 'simple-git/promise';

import {GitImpl} from '../src/git';
import {ReleaseContext} from '../src/types';
import {ReleaseContextImpl} from '../src/release-context';

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

    constructor(
        private _directory: string,
        private _git: GitImpl,
    ) {}

    static async create(name: string): Promise<TestGitRepo> {
        const directory = createTestDirectory(name);
        const simpleGit = simplegit(directory);
        await simpleGit.init();
        await simpleGit.addConfig('user.name', 'Test Executor');
        await simpleGit.addConfig('user.email', 'test@test.com');
        const gitImpl = new GitImpl(simpleGit);
        return new TestGitRepo(directory, gitImpl);
    }

    context(version = new SemVer('1.0.0'), config = {}, isNextDevVersion = false): ReleaseContext {
        return new ReleaseContextImpl(this._directory, version, config, this._git, isNextDevVersion);
    }

    get git(): GitImpl {
        return this._git;
    }

    get directory(): string {
        return this._directory;
    }
}
