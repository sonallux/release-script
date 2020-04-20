import {ConfigValidator} from '../src/validate';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function voidFunction(): void {}

let validator: ConfigValidator;

beforeAll(() => {
    validator = new ConfigValidator();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function expectValidConfig(config: any): void {
    expect(validator.validate(config)).toBeTruthy();
    expect(validator.getErrors().length).toBe(0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function expectInValidConfig(config: any): string[] {
    expect(validator.validate(config)).toBeFalsy();
    const errors = validator.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    return errors;
}

describe('validateConfig', () => {
    it('should pass for empty config', () => {
        expectValidConfig({});
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

    it('should return multiple errors', () => {
        expect(expectInValidConfig({tag: 123, push: 123, nextDevelopmentVersion: 123}))
            .toEqual(expect.arrayContaining([
                'config.nextDevelopmentVersion must be a string or boolean',
                'config.tag must be a string or boolean',
                'config.push must be a boolean',
            ]));
    });
});
