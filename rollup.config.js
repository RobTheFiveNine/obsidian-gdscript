import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default'
  },
  external: ['obsidian'],
  plugins: [
    nodeResolve({browser: true}),
    commonjs(),
    copy({
      targets: [
        {
          src: 'manifest.json',
          dest: 'dist',
        },
      ],
    }),
  ]
};