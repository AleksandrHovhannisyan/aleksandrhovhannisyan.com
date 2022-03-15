export const Themes = {
  LIGHT: 'light',
  DARK: 'dark',
};

/**
 * @typedef ThemeToggleProps
 * @property {HTMLElement} toggleElement The element to be toggled.
 * @property {string} storageKey A unique key to use when caching the current theme in `localStorage`.
 * @property {HTMLElement} root The element on which a data-`storageKey` attribute should get set.
 * @property {string} defaultTheme The default theme for the switch.
 * @property {string | undefined} preferredTheme The user's preferred theme (optional).
 * @property {Record<string, string>} themes A map of theme state transitions. On toggle, the current theme will get set to the next theme specified in this map.
 * @property {(theme: string) => boolean} isPressed A callback to determine whether the given theme corresponds to the pressed state.
 */

export default class ThemeToggle {
  /**
   * @param {ThemeToggleProps} props The props with which to initialize this theme toggle.
   */
  constructor(props) {
    this.props = props;
    this.validateTheme(this.props.defaultTheme);
    this.validateTheme(this.props.preferredTheme);
    this.props.toggleElement.addEventListener('click', () => this.toggle());

    const cachedTheme = localStorage.getItem(this.props.storageKey);
    const initialTheme = cachedTheme ?? this.props.preferredTheme ?? this.props.defaultTheme;
    this.setTheme(initialTheme);
  }

  /** The currently active theme. */
  get theme() {
    return this.props.root.dataset[this.props.storageKey];
  }

  /** The next theme that will get set when `toggle` is called. */
  get nextTheme() {
    return this.props.themes[this.theme];
  }

  /** Validates the given theme. If it's not recognized (i.e., unspecified in the theme map), throws an error. */
  validateTheme(theme) {
    if (theme && !this.props.themes[theme]) {
      throw new Error(`${theme} is not a recognized theme.`);
    }
  }

  /** Sets the current theme to the specified theme. */
  setTheme(newTheme) {
    this.validateTheme(newTheme);
    this.props.root.dataset[this.props.storageKey] = newTheme;
    const isPressed = this.props.isPressed?.(newTheme);
    this.props.toggleElement.setAttribute('aria-pressed', !!isPressed);
  }

  /** Writes the current theme to `localStorage`. */
  syncLocalStorage() {
    localStorage.setItem(this.props.storageKey, this.theme);
  }

  /** Toggles the current theme according to the relationship specified in the theme map. */
  toggle() {
    const newTheme = this.nextTheme;
    this.setTheme(newTheme);
    this.syncLocalStorage();
  }
}
