/**
 * @typedef FontVariantEntry
 * @property {number} weight The numeric weight for this variant.
 * @property {string} style The `font-style` for this variant.
 * @property {string} url An absolute path to the font file.
 * @property {string} display The value for `font-display`.
 * @property {string} postscriptName A postscript name for looking up cached font files locally.
 */

/**
 * @typedef {'roman' | 'italic'} FontVariantStyle
 */

/**
 * @typedef FontBase
 * @property {string} family The font family name (e.g., `'Fira Sans'`)
 * @property {string[]} fallbacks Fallback font families. Used when assembling font variables.
 * @property {Record<'sizeAdjust'|'ascent'|'descent', number>} [metricOverrides] Overrides for font metrics. Each number is a percentage / 100 (e.g., 0.5 = 50%).
 */

/**
 * @typedef VariableFontType
 * @property {'variable'} type
 * @property {Record<string, number>} weights A set of weights to be used as discrete variables from the available axes.
 * @property {Record<FontVariantStyle, Omit<FontVariantEntry, 'weight'> & { weights: Record<'min'|'max', number> }>} variants Descriptions of the font files.
 * @typedef {FontBase & VariableFontType} VariableFont
 */

/**
 * @typedef StaticFontType
 * @property {'static'} type
 * @property {Record<string, Record<FontVariantStyle, FontVariantEntry>>} variants
 * @property {boolean} [isNativeFont] Whether the font is a built-in one.
 * @typedef {FontBase & StaticFontType} StaticFont
 */

/**
 * @typedef {StaticFont|VariableFont} Font
 */

/**
 * @typedef {Record<string, Font>} FontConfig
 */

module.exports = {};
