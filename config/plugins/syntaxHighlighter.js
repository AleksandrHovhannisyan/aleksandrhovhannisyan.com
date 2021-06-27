module.exports = {
  // Change which Eleventy template formats use syntax highlighters
  templateFormats: ['*'], // default
  // Added in 3.0, set to true to always wrap lines in `<span class="highlight-line">`
  // The default (false) only wraps when line numbers are passed in.
  alwaysWrapLineHighlights: false,
  // Added in 3.0.2, set to false to opt-out of pre-highlight removal of leading
  // and trailing whitespace
  trim: true,
  // Added in 3.0.4, change the separator between lines (you may want "\n")
  lineSeparator: '<br>',
  // Added in 3.1.1, add HTML attributes to the <pre> or <code> tags
  preAttributes: {},
  codeAttributes: {},
};
