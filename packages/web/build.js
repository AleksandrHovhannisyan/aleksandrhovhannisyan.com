import fs from 'node:fs/promises';
import esbuild from 'esbuild';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

const isProductionBuild = process.env.ELEVENTY_ENV === 'production';

/**
 * @param {Omit<esbuild.BuildOptions, 'entryNames' | 'metaFile' | 'sourcemap' | 'minify'>} options
 */
async function build(options) {
  const result = await esbuild.build({
    ...options,
    // Only add hashes to assets in production builds to avoid polluting dev server with files
    entryNames: isProductionBuild ? '[dir]/[name]-[hash]' : '[dir]/[name]',
    sourcemap: !isProductionBuild,
    minify: isProductionBuild,
    metafile: true,
  });
  return result.metafile.outputs;
}

async function buildStyles() {
  const postcssProcessor = postcss([postcssPresetEnv()]);
  return await build({
    entryPoints: ['src/assets/styles/main.css', 'src/assets/styles/art.css'],
    outdir: 'dist/assets/styles',
    loader: { '.css': 'css' },
    plugins: [
      {
        name: 'postcss',
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, async (args) => {
            const source = await fs.readFile(args.path, 'utf8');
            const result = await postcssProcessor.process(source, { from: args.path });
            return { contents: result.css, loader: 'css' };
          });
        },
      },
    ],
  });
}

async function buildScripts() {
  return await build({
    entryPoints: [
      'src/assets/scripts/copyCode.ts',
      'src/assets/scripts/comments.ts',
      'src/assets/scripts/dialog.ts',
      'src/assets/scripts/components/carousel.ts',
      'src/assets/scripts/components/gameLoop.ts',
    ],
    outdir: 'dist/assets/scripts',
    format: 'esm',
    bundle: true,
    splitting: true,
    loader: { '.svg': 'text' },
  });
}

/**
 * Builds all assets for the site and returns a mapping from `src/` path to `dist/` path for each asset.
 * @returns {Promise<Record<string, string>>}
 */
export async function buildAssets() {
  const inputToOutputPathMap = {};
  const results = await Promise.all([buildStyles(), buildScripts()]);
  for (const result of results) {
    for (let [outputPath, { entryPoint }] of Object.entries(result)) {
      if (entryPoint) {
        inputToOutputPathMap[entryPoint] = outputPath;
      }
    }
  }
  return inputToOutputPathMap;
}
