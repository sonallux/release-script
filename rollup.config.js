import commonjs from '@rollup/plugin-commonjs';
import multiEntry from '@rollup/plugin-multi-entry';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const external = ['buffer', 'child_process', 'fs', 'os', 'path', 'tty', 'util'];

const plugins = [
    nodeResolve(),
    commonjs({include: 'node_modules/**'}),
    typescript(),
]

export default [
    {
        input: ['src/release-script.ts', 'src/preconditions/index.ts', 'src/version-hooks/index.ts'],
        output: {
            file: 'dist/release-script.js',
            format: 'cjs',
        },
        external,
        plugins: [...plugins, multiEntry()],
    },
    {
        input: 'src/cli.ts',
        output: {
            file: 'dist/release-script-cli.js',
            format: 'cjs',
            banner: '#!/usr/bin/env node',
            footer: 'cli();',
        },
        external,
        plugins,
    },
    {
        input: ['src/cli.ts', 'src/preconditions/index.ts', 'src/version-hooks/index.ts'],
        output: {
            file: 'dist/release-script-standalone.js',
            format: 'cjs',
        },
        external,
        plugins: [...plugins, multiEntry()],
    }
];
