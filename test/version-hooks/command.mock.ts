import type {ExecOptions} from 'child_process';

import * as CommandModule from '../../src/version-hooks/command';
import type {ReleaseContext, VersionFunction} from '../../src/types';

/**
 * Mocks the Command version hook with a jest mock function and returns it to track the calls.
 * The returned `jest.Mock` is always called with the real command string that would be passed
 * to `child_process.exec` method. The optional `ExecOptions` are also tracked by the mock.
 * 
 * IMPORTANT: This function uses jest.spyOn to replace the real Command module. Therefore it is recommanded
 * to add `afterEach(() => jest.restoreAllMocks());` to your test to restore the mock after the test case.
 */
export function mockCommand(): jest.Mock<Promise<void>, [cmdString: string, options?: ExecOptions]> {
    const mock = jest.fn<Promise<void>, [cmdString: string, options?: ExecOptions]>(() => Promise.resolve());

    const mockedCommand = (cmdString: string | ((context: ReleaseContext) => string), options?: ExecOptions):
    VersionFunction => {
        return (context: ReleaseContext) => {
            const command = typeof cmdString === 'string' ? cmdString : cmdString(context);
            return mock(command, options);
        };
    };

    jest.spyOn(CommandModule, 'Command').mockImplementation(mockedCommand);

    return mock;
}
