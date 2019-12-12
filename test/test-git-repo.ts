import path = require('path');
import fs = require('fs');

import rimraf = require('rimraf');
import mkdirp = require('mkdirp');
import simplegit = require('simple-git/promise');

import {Git} from '../src/git';

const DEFAULT_REPO_FOLDER = './test-temp';

export class TestGitRepo {

    private _directory: string;
    private _git: Git;

    constructor(name: string) {
        this._directory = path.resolve(DEFAULT_REPO_FOLDER, name);
        //console.log(`Created test git repo ${name} in ${this._directory}`);
        this.setUpDirectory();
        const simpleGit = simplegit(this._directory);
        simpleGit.init();
        simpleGit.addConfig('user.name', 'Test Executor');
        simpleGit.addConfig('user.email', 'test@test.com');
        this._git = new Git(simpleGit);
    }

    private setUpDirectory(): void {
        if (fs.existsSync(this._directory)) {
            for (const file of fs.readdirSync(this._directory)) {
                //console.log(`Deleting: ${path.resolve(this._directory, file)}`);
                rimraf.sync(path.resolve(this._directory, file));
            }
        }
        else {
            mkdirp.sync(this._directory);
        }
    }

    get git(): Git {
        return this._git;
    }

    get directory(): string {
        return this._directory;
    }
}
