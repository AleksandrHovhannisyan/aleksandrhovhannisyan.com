/**
 * @typedef FontVariantEntry
 * @property {number} weight The numeric weight for this variant.
 * @property {string]} style The `font-style` for this variant.
 * @property {string} url An absolute path to the font file.
 * @property {string} display The value for `font-display`.
 * @property {string} postscriptName A postscript name for looking up cached font files locally.
 */

/**
 * @typedef {'roman' | 'italic'} FontVariantStyle
 */

/**
 * @typedef Font
 * @property {string} family The font family name (e.g., `'Fira Sans'`)
 * @property {string[]} fallbacks Fallback font families. Used when assembling font variables.
 * @property {Record<'min' | 'max', number>} [weightAxes] Weight axes for variable fonts.
 * @property {Record<string, Record<FontVariantStyle, FontVariantEntry>>} variants
 * @property {boolean} [isNativeFont] Whether the font is a built-in one.
 */

/**
 * @typedef {Record<string, Font>} FontConfig
 */
