import commonjs from '@rollup/plugin-commonjs';
import multiEntry from '@rollup/plugin-multi-entry';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const nodeExternals = ['buffer', 'child_process', 'fs', 'os', 'path', 'tty', 'util'];
const myExternals = [
    'command-line-args',
    'command-line-usage',
    'semver/classes/semver',
    'semver/functions/parse', 
    'semver/functions/coerce',
    'simple-git',
]

export default [
    {
        input: ['src/release-script.ts', 'src/preconditions/index.ts', 'src/version-hooks/index.ts'],
        output: {
            file: 'dist/release-script.js',
            format: 'cjs',
        },
        external: [...nodeExternals, ...myExternals],
        plugins: [typescript(), multiEntry()],
    },
    {
        input: 'src/cli.ts',
        output: {
            file: 'dist/release-script-cli.js',
            format: 'cjs',
            banner: '#!/usr/bin/env node',
            footer: 'cli();',
        },
        external: [...nodeExternals, ...myExternals],
        plugins: [typescript()],
    },
    {
        input: ['src/cli.ts', 'src/preconditions/index.ts', 'src/version-hooks/index.ts'],
        output: {
            file: 'dist/release-script-standalone.js',
            format: 'cjs',
        },
        external: [...nodeExternals],
        plugins: [
            nodeResolve(),
            commonjs({include: 'node_modules/**'}),
            typescript(),
            multiEntry(),
        ],
    }
];
