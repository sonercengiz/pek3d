import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sucrase from 'rollup-plugin-sucrase'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    },
  ],
  plugins: [
    peerDepsExternal(),     // externalize peerDependencies
    resolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.jsx', '.ts', '.tsx'],
      mainFields: ['module', 'main']
    }),              // locate modules using node resolution
    commonjs(),             // convert CommonJS to ES modules
    sucrase({               // transpile JSX and TS in JS/TS files
      exclude: ['node_modules/**'],
      transforms: ['jsx', 'typescript'],
    }),
    typescript({            // type-check and emit declarations
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types',
    }),
    terser(),               // minify bundle
  ],
  // ensure these file extensions are resolved
  preserveEntrySignatures: 'strict',
  onwarn(warning, warn) {
    // skip certain warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY' || warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
    // skip circular dependency warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning);
  }
}
