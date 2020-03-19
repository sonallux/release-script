import {Command} from '../../src/version-hooks';

// eslint-disable-next-line
const context: any = {};

describe('Plugin command executes', () => {
    it('with string', () => {
        const command = Command('exit 0');
        return expect(command(context)).resolves.toBe(undefined);
    });

    it('with function', () => {
        const command = Command(() => 'exit 0');
        return expect(command(context)).resolves.toBe(undefined);
    });
});

describe('Plugin command failes', () => {
    it('with string', () => {
        const command = Command('exit 1');
        return expect(command(context))
            .rejects.toHaveProperty('message', 'Failed to execute Command plugin: Command failed: exit 1\n');
    });

    it('with function', () => {
        const command = Command(() => 'exit 1');
        return expect(command(context))
            .rejects.toHaveProperty('message', 'Failed to execute Command plugin: Command failed: exit 1\n');
    });
});
