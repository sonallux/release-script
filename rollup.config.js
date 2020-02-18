import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const defaultConfig = {
    external: ['buffer', 'child_process', 'fs', 'os', 'path', 'tty', 'util'],
    plugins: [
        json(),
        nodeResolve(),
        commonjs({ include: 'node_modules/**' }),
        typescript(),
    ],
    output: {
        entryFileNames: '[name]',
        dir: 'dist',
        format: 'cjs',
    }
}

export default [
    {
        input: {'release-script.js': 'src/release-script.ts'},
        ...defaultConfig
    },
    {
        input: {'release-script-cli.js': 'src/cli.ts'},
        ...defaultConfig
    }
];
