import SemVer from 'semver/classes/semver';

import {Git, ReleaseConfigOptions, ReleaseContext} from './types';

export class ReleaseContextImpl implements ReleaseContext {

    constructor(
        public directory: string,
        public version: SemVer,
        public config: ReleaseConfigOptions,
        public git: Git,
        public isNextDevelopmentVersion: boolean) {}

    doGitTag(): Promise<void> {
        if (this.config.tag === false) {
            console.log('Git tag disabled');
            return Promise.resolve();
        }
        const tagPrefix = this.config.tag === true || this.config.tag === undefined ? 'v' : this.config.tag;
        const tagName = `${tagPrefix}${this.version.version}`;
        console.log(`Creating git tag: ${tagName}`);
        if (this.config.gitSign === true) {
            return this.git.signedTag(tagName, `Release ${this.version.version}`);
        }
        else {
            return this.git.tag(tagName, `Release ${this.version.version}`);
        }
    }

    doGitPush(): Promise<void> {
        if (this.config.push === false) {
            return Promise.resolve();
        }
        return this.git.push();
    }

    async doGitCommit(message: string): Promise<void> {
        await this.git.add();
        if (this.config.gitSign === true) {
            return this.git.signedCommit(message);
        }
        else {
            return this.git.commit(message);
        }
    }

    getNextContext(): ReleaseContextImpl | null {
        if (this.config.nextDevelopmentVersion === false) {
            return null;
        }
        const id = this.config.nextDevelopmentVersion === true || this.config.nextDevelopmentVersion === undefined
            ? undefined
            : this.config.nextDevelopmentVersion;
        const nextVersion = new SemVer(this.version.version).inc('prerelease', id);
        return new ReleaseContextImpl(this.directory, nextVersion, this.config, this.git, true);
    }
}
