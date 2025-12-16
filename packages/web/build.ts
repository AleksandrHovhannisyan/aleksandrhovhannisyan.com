import fs from 'node:fs/promises';
import esbuild from 'esbuild';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';

const isProductionBuild = process.env.ELEVENTY_ENV === 'production';

/**
 * Builds all assets for the site and returns a mapping from `src/` path to `dist/` path for each asset.
 */
export async function buildAssets(): Promise<Record<string, string>> {
  const result = await esbuild.build({
    entryPoints: [
      // styles
      'src/assets/styles/main.css',
      'src/assets/styles/art.css',
      // scripts
      'src/assets/scripts/copyCode.ts',
      'src/assets/scripts/comments.ts',
      'src/assets/scripts/dialog.ts',
      'src/assets/scripts/components/carousel.ts',
      'src/assets/scripts/components/gameLoop.ts',
    ],
    outdir: 'dist/assets',
    loader: { '.css': 'css', '.svg': 'text' },
    // These three options are only relevant for JS
    format: 'esm',
    bundle: true,
    splitting: true,
    // Only add hashes to assets in production builds to avoid polluting dev server with files
    entryNames: isProductionBuild ? '[dir]/[name]-[hash]' : '[dir]/[name]',
    sourcemap: !isProductionBuild,
    minify: isProductionBuild,
    metafile: true,
    plugins: [
      {
        name: 'postcss',
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, async (args) => {
            const source = await fs.readFile(args.path, 'utf8');
            const result = await postcss([postcssImport(), postcssPresetEnv()]).process(source, {
              from: args.path,
            });
            return { contents: result.css, loader: 'css' };
          });
        },
      },
    ],
  });

  // Map each input path to its corresponding output path (reverse sourcemap)
  const sourceMap = {};
  for (const [outputPath, { entryPoint }] of Object.entries(result.metafile.outputs)) {
    if (entryPoint) {
      sourceMap[entryPoint] = outputPath;
    }
  }
  return sourceMap;
}
