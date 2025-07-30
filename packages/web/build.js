import esbuild from 'esbuild';

const isProductionBuild = process.env.ELEVENTY_ENV === 'production';

/**
 * @param {Omit<esbuild.BuildOptions, 'entryNames' | 'metaFile' | 'sourcemap' | 'minify'>} options
 */
async function build(options) {
  const result = await esbuild.build({
    ...options,
    entryNames: isProductionBuild ? '[dir]/[name]-[hash]' : '[dir]/[name]', // Only add hashes to assets in production builds
    sourcemap: !isProductionBuild,
    minify: isProductionBuild,
    metafile: true,
  });
  return result.metafile.outputs;
}

async function buildStyles() {
  return await build({
    entryPoints: ['src/assets/styles/main.css', 'src/assets/styles/art.css'],
    outdir: 'dist/assets/styles',
    loader: { '.css': 'css' },
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
