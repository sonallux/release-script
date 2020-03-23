import SemVer from 'semver/classes/semver';

import {ReleaseConfigOptions} from '../declarations/ReleaseConfigOptions';

import {Git} from './git';

export class ReleaseContext {

    constructor(
        public git: Git,
        public version: SemVer,
        public config: ReleaseConfigOptions) {}

    doGitTag(): Promise<void> {
        if (this.config.tag === false) {
            console.log('Git tag disabled');
            return Promise.resolve();
        }
        const tagPrefix = this.config.tag === true || this.config.tag === undefined ? 'v' : this.config.tag;
        const tagName = `${tagPrefix}${this.version.version}`;
        console.log(`Creating git tag: ${tagName}`);
        return this.git.tag(tagName, `Release ${this.version.version}`);
    }

    doGitPush(): Promise<void> {
        if (this.config.push === false) {
            return Promise.resolve();
        }
        return this.git.push();
    }

    getNextContext(): ReleaseContext | null {
        if (this.config.developmentVersion === false) {
            return null;
        }
        const id = this.config.developmentVersion === true || this.config.developmentVersion === undefined
            ? undefined
            : this.config.developmentVersion;
        const nextVersion = new SemVer(this.version.version).inc('prerelease', id);
        return new ReleaseContext(this.git, nextVersion, this.config);
    }
}
