import {PreconditionFunction, PreconditionInstance} from '../declarations/ReleaseConfigOptions';

import {ReleaseContext} from './release-context';

function unpackPrecondition(precondition: PreconditionInstance | PreconditionFunction): [string, PreconditionFunction] {
    if (typeof precondition === 'function') {
        return [precondition.name, precondition];
    }
    else {
        return [precondition.name, precondition.precondition]
    }
}

export async function checkPreconditions(context: ReleaseContext): Promise<void> {
    if (!context.config.preconditions) {
        return;
    }

    for (const precondition of context.config.preconditions) {
        const [name, preconditionFunc] = unpackPrecondition(precondition);

        const preconditionResult = preconditionFunc(context);
        if (preconditionResult instanceof Promise) {
            try {
                const valid = await preconditionResult;
                if (!valid) {
                    return Promise.reject(new Error(`Precondition '${name}' failed`));
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        else {
            const [valid, errorMessage] = preconditionResult;
            if (!valid) {
                return Promise.reject(new Error(errorMessage ? errorMessage : `Precondition '${name}' failed`));
            }
        }
    }
}
