import {validate} from '../src/validate';

describe('validate', () => {
    it('should report error', () => {
        try {
            // eslint-disable-next-line
            const config: any = {bar: 'foo'};
            validate(config);
        }
        catch(err) {
            expect(err.message).toEqual(expect.stringContaining('Invalid configuration object.'));
        }
    });

});
