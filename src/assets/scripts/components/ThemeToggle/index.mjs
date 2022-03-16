/**
 * @typedef ThemeToggleProps
 * @property {HTMLElement} toggleElement The element to be toggled.
 * @property {string} initialTheme The initial theme for the switch, which must exist in the `themes` map.
 * @property {(theme: string) => void} setTheme Callback to set the current theme, both on mount and on toggle. Logic to update your UI should go here.
 * @property {(theme: string) => void} [setCachedTheme] Optionally caches the theme on toggle. Called alongside `setTheme` when the toggle element is clicked.
 * @property {string | null} [cachedTheme] The cached theme, if one exists. If specified, this takes priority over `defaultTheme` and is used to initialize the component.
 * @property {Record<string, string>} themes A map of theme state transitions. On toggle, the current theme will get set to the next theme specified in this map. Note that all keys must be reachable—i.e., they must be values in the map. Likewise, all values need to be keys so that toggling from that state does not yield an indeterminate state.
 */

export default class ThemeToggle {
  /**
   * @param {ThemeToggleProps} props The props with which to initialize this theme toggle.
   * @throws if the initial theme, or any other theme in the theme map, is unreachable or has no target state.
   */
  constructor(props) {
    this.props = props;
    this._validateThemes();
    this.props.toggleElement.addEventListener('click', () => this.toggle());
    this._setTheme(this.props.initialTheme);
  }

  /** The next theme that will get set when `toggle` is called. */
  get nextTheme() {
    return this.props.themes[this.theme];
  }

  /** Validates all themes supplied to the toggle. If a theme is not recognized (i.e., unspecified in the theme map), throws an error. */
  _validateThemes() {
    const uniqueThemeKeys = new Set(Object.keys(this.props.themes));
    const uniqueThemeValues = new Set(Object.values(this.props.themes));
    const allUniqueThemes = new Set([...uniqueThemeKeys, ...uniqueThemeValues, this.props.initialTheme]);

    if (allUniqueThemes.size !== uniqueThemeKeys.size || allUniqueThemes.size !== uniqueThemeValues.size) {
      throw new Error(`One or more themes do not have a target state transition or are unreachable from other states.`);
    }
  }

  /** Sets the current theme to the specified theme internally and invokes the `setTheme` callback prop, if it exists. */
  _setTheme(newTheme) {
    this.theme = newTheme;
    this.props.setTheme(newTheme);
  }

  /** Cycles through the theme map, toggling the current theme to the next theme. */
  toggle() {
    const newTheme = this.nextTheme;
    this._setTheme(newTheme);
    this.props.setCachedTheme?.(newTheme);
  }
}
