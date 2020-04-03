import {validateConfig} from '../src/validate';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function voidFunction(): void {}

describe('validateConfig', () => {
    it('should pass for empty config', () => {
        expect(validateConfig({})).toBeTruthy();
    });

    it('should check preconditions', () => {
        expect(validateConfig({preconditions: 'fail'})).toBeFalsy();
        expect(validateConfig({preconditions: ['fail']})).toBeFalsy();
        expect(validateConfig({preconditions: []})).toBeTruthy();
        expect(validateConfig({preconditions: [voidFunction]})).toBeTruthy();
    });

    it('should check versionHook', () => {
        expect(validateConfig({versionHook: 'fail'})).toBeFalsy();
        expect(validateConfig({versionHook: ['fail']})).toBeFalsy();
        expect(validateConfig({versionHook: []})).toBeTruthy();
        expect(validateConfig({versionHook: [voidFunction]})).toBeTruthy();
    });

    it('should check releaseHook', () => {
        expect(validateConfig({releaseHook: 'fail'})).toBeFalsy();
        expect(validateConfig({releaseHook: ['fail']})).toBeFalsy();
        expect(validateConfig({releaseHook: []})).toBeTruthy();
        expect(validateConfig({releaseHook: [voidFunction]})).toBeTruthy();
    });

    it('should check nextDevelopmentVersion', () => {
        expect(validateConfig({nextDevelopmentVersion: 123})).toBeFalsy();
        expect(validateConfig({nextDevelopmentVersion: []})).toBeFalsy();
        expect(validateConfig({nextDevelopmentVersion: voidFunction})).toBeFalsy();
        expect(validateConfig({nextDevelopmentVersion: true})).toBeTruthy();
        expect(validateConfig({nextDevelopmentVersion: 'test'})).toBeTruthy();
    });

    it('should check push', () => {
        expect(validateConfig({push: 123})).toBeFalsy();
        expect(validateConfig({push: []})).toBeFalsy();
        expect(validateConfig({push: voidFunction})).toBeFalsy();
        expect(validateConfig({push: true})).toBeTruthy();
        expect(validateConfig({push: 'test'})).toBeFalsy();
    });

    it('should check tag', () => {
        expect(validateConfig({tag: 123})).toBeFalsy();
        expect(validateConfig({tag: []})).toBeFalsy();
        expect(validateConfig({tag: voidFunction})).toBeFalsy();
        expect(validateConfig({tag: true})).toBeTruthy();
        expect(validateConfig({tag: 'test'})).toBeTruthy();
    });
});
