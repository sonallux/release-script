import {ConfigValidator} from '../src/validate';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function voidFunction(): void {}

let validator: ConfigValidator;

beforeAll(() => {
    validator = new ConfigValidator();
});

function expectValidConfig(config: unknown): void {
    expect(validator.validate(config)).toBeTruthy();
    expect(validator.getErrors().length).toBe(0);
}

function expectInValidConfig(config: unknown): string[] {
    expect(validator.validate(config)).toBeFalsy();
    const errors = validator.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    return errors;
}

describe('validateConfig', () => {
    it('should pass for empty config', () => {
        expectValidConfig({});
    });

    it('should fail for non config object', () => {
        expect(expectInValidConfig(undefined))
            .toEqual(['config must be an object']);
        expect(expectInValidConfig(null))
            .toEqual(['config must be an object']);
        expect(expectInValidConfig(42))
            .toEqual(['config must be an object']);
        expect(expectInValidConfig(false))
            .toEqual(['config must be an object']);
        expect(expectInValidConfig(true))
            .toEqual(['config must be an object']);
        expect(expectInValidConfig('foo'))
            .toEqual(['config must be an object']);
    });

    it('should check preconditions', () => {
        expect(expectInValidConfig({preconditions: 'fail'}))
            .toEqual(['config.preconditions must be an array of PreconditionFunctions']);
        expect(expectInValidConfig({preconditions: ['fail']}))
            .toEqual(['config.preconditions must be an array of PreconditionFunctions']);
        expectValidConfig({preconditions: []});
        expectValidConfig({preconditions: [voidFunction]});
    });

    it('should check versionHook', () => {
        expect(expectInValidConfig({versionHook: 'fail'}))
            .toEqual(['config.versionHook must be an array of VersionFunctions']);
        expect(expectInValidConfig({versionHook: ['fail']}))
            .toEqual(['config.versionHook must be an array of VersionFunctions']);
        expectValidConfig({versionHook: []});
        expectValidConfig({versionHook: [voidFunction]});
    });

    it('should check releaseHook', () => {
        expect(expectInValidConfig({releaseHook: 'fail'}))
            .toEqual(['config.releaseHook must be an array of ReleaseFunctions']);
        expect(expectInValidConfig({releaseHook: ['fail']}))
            .toEqual(['config.releaseHook must be an array of ReleaseFunctions']);
        expectValidConfig({releaseHook: []});
        expectValidConfig({releaseHook: [voidFunction]});
    });

    it('should check nextDevelopmentVersion', () => {
        expect(expectInValidConfig({nextDevelopmentVersion: 123}))
            .toEqual(['config.nextDevelopmentVersion must be a string or boolean']);
        expect(expectInValidConfig({nextDevelopmentVersion: []}))
            .toEqual(['config.nextDevelopmentVersion must be a string or boolean']);
        expect(expectInValidConfig({nextDevelopmentVersion: voidFunction}))
            .toEqual(['config.nextDevelopmentVersion must be a string or boolean']);
        expectValidConfig({nextDevelopmentVersion: true});
        expectValidConfig({nextDevelopmentVersion: 'test'});
    });

    it('should check push', () => {
        expect(expectInValidConfig({push: 123}))
            .toEqual(['config.push must be a boolean']);
        expect(expectInValidConfig({push: []}))
            .toEqual(['config.push must be a boolean']);
        expect(expectInValidConfig({push: voidFunction}))
            .toEqual(['config.push must be a boolean']);
        expect(expectInValidConfig({push: 'test'}))
            .toEqual(['config.push must be a boolean']);
        expectValidConfig({push: true});
    });

    it('should check tag', () => {
        expect(expectInValidConfig({tag: 123}))
            .toEqual(['config.tag must be a string or boolean']);
        expect(expectInValidConfig({tag: []}))
            .toEqual(['config.tag must be a string or boolean']);
        expect(expectInValidConfig({tag: voidFunction}))
            .toEqual(['config.tag must be a string or boolean']);
        expectValidConfig({tag: true});
        expectValidConfig({tag: 'test'});
    });

    it('should check gitSign', () => {
        expect(expectInValidConfig({gitSign: 123}))
            .toEqual(['config.gitSign must be a boolean']);
        expect(expectInValidConfig({gitSign: []}))
            .toEqual(['config.gitSign must be a boolean']);
        expect(expectInValidConfig({gitSign: voidFunction}))
            .toEqual(['config.gitSign must be a boolean']);
        expect(expectInValidConfig({gitSign: 'test'}))
            .toEqual(['config.gitSign must be a boolean']);
        expectValidConfig({gitSign: true});
    });

    it('should return multiple errors', () => {
        expect(expectInValidConfig({tag: 123, push: 123, nextDevelopmentVersion: 123}))
            .toEqual(expect.arrayContaining([
                'config.nextDevelopmentVersion must be a string or boolean',
                'config.tag must be a string or boolean',
                'config.push must be a boolean',
            ]));
    });
});
