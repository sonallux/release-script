import {Command} from '../../src/version-hooks';
import {createReleaseContext} from '../test-utils';

describe('Plugin command executes', () => {
    it('with string', () => {
        const command = Command('exit 0');
        return expect(command(createReleaseContext())).resolves.toBe(undefined);
    });

    it('with function', () => {
        const command = Command(() => 'exit 0');
        return expect(command(createReleaseContext())).resolves.toBe(undefined);
    });
});

describe('Plugin command failes', () => {
    it('with string', () => {
        const command = Command('exit 1');
        return expect(command(createReleaseContext()))
            .rejects.toHaveProperty('message', 'Failed to execute Command plugin: Error: Command failed: exit 1\n');
    });

    it('with function', () => {
        const command = Command(() => 'exit 1');
        return expect(command(createReleaseContext()))
            .rejects.toHaveProperty('message', 'Failed to execute Command plugin: Error: Command failed: exit 1\n');
    });
});
