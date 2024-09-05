export type FontVariantStyle = 'roman' | 'italic';

export type FontVariantEntry = {
    /** The numeric weight for this variant. */
    weight: number;
    /** The `font-style` for this variant. */ 
    style: 'italic' | 'normal';
    /** An absolute path to the font file. */
    url: string;
    /** The value for `font-display`. */
    display: 'swap' | (string & {});
    /** A postscript name used to look up cached font files locally before loading a custom web font. */
    postscriptName: string;
}

export type FontBase = {
    /** The font family name (e.g., `'Fira Sans'`). */
    family: string;
    /** Fallback font families to load first. */
    fallbacks: string[];
    /** Overrides for font metrics. Each number is a percentage as a float (e.g., `0.5` means `50%`). */
    metricOverrides?: Record<'sizeAdjust' | 'ascent' | 'descent', number>;
}

export type VariableFont = FontBase & {
    type: 'variable';
    /** A set of weights to be used as discrete variables from the available axes. */
    weights: Record<string, number>;
    /** Descriptions of the variable font files. */
    variants: Record<FontVariantStyle, Omit<FontVariantEntry, 'weight'> & { weights: Record<'min' | 'max', number>; }>;
}

export type StaticFont = FontBase & {
    type: 'static';
    variants: Record<string, Record<FontVariantStyle, FontVariantEntry>>;
    /** Whether the font is a system font. */
    isSystemFont?: boolean;
}

export type Font = StaticFont | VariableFont;

export type FontConfig = Record<string, Font>;
