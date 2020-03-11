import {Command} from '../../src/plugins/command';

// eslint-disable-next-line
const context: any = {};

describe('Plugin command executes', () => {
    it('with string', async () => {
        const command = new Command('exit 0');
        await command.apply(context);
        return null;
    });

    it('with function', async () => {
        const command = new Command(() => 'exit 0');
        await command.apply(context);
        return null;
    });
});

describe('Plugin command failes', () => {
    it('with string', async () => {
        const command = new Command('exit 1');
        try {
            await command.apply(context);
        }
        catch (error) {
            expect(error.message).toBe('Failed to execute Command plugin: Command failed: exit 1\n');
            return null;
        }
        throw new Error('Command should have thrown error');
    });

    it('with function', async () => {
        const command = new Command(() => 'exit 1');
        try {
            await command.apply(context);
        }
        catch (error) {
            expect(error.message).toBe('Failed to execute Command plugin: Command failed: exit 1\n');
            return null;
        }
        throw new Error('Command should have thrown error');
    });
});
