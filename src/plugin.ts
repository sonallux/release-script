import {PluginFunction, PluginInstance} from '../declarations/ReleaseConfigOptions';

import {ReleaseContext} from './release-context';

function unpackPluginFunc(plugin: PluginInstance|PluginFunction): [string, PluginFunction] {
    if (typeof plugin === 'function') {
        return [plugin.name, plugin];
    }
    else {
        return [plugin.name, plugin.apply];
    }
}

export async function executePlugins(context: ReleaseContext): Promise<void> {
    if (!context.config.plugins) {
        return;
    }

    for (const plugin of context.config.plugins) {
        const [name, pluginFunction] = unpackPluginFunc(plugin);

        const pluginResult = pluginFunction(context);
        if (pluginResult instanceof Promise) {
            try {
                const valid = await pluginResult;
                if (!valid) {
                    return Promise.reject(new Error(`Plugin '${name}' failed to execute`));
                }
            }
            catch (err) {
                return Promise.reject(err instanceof Error ? err : new Error(err));
            }
        }
        else {
            if (!pluginResult) {
                return Promise.reject(new Error(`Plugin '${name}' failed to execute`));
            }
        }
    }
}
