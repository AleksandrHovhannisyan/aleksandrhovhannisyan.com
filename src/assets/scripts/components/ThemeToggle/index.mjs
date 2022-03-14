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
    const { toggleElement, root, storageKey, defaultTheme, themes, isPressed, preferredTheme } = props;
    this.root = root;
    this.toggleElement = toggleElement;
    this.toggleElement.addEventListener('click', () => this.toggle());
    this.storageKey = storageKey;
    this.themes = themes;
    this.isPressed = isPressed;

    this.validateTheme(defaultTheme);
    this.validateTheme(preferredTheme);

    const cachedTheme = localStorage.getItem(storageKey);
    const initialTheme = cachedTheme ?? preferredTheme ?? defaultTheme;
    this.setTheme(initialTheme);
  }

  /** The currently active theme. */
  get theme() {
    return this.root.dataset[this.storageKey];
  }

  /** The next theme that will get set when `toggle` is called. */
  get nextTheme() {
    return this.themes[this.theme];
  }

  /** Validates the given theme. If it's not recognized (i.e., unspecified in the theme map), throws an error. */
  validateTheme(theme) {
    if (theme && !this.themes[theme]) {
      throw new Error(`${theme} is not a recognized theme.`);
    }
  }

  /** Sets the current theme to the specified theme. */
  setTheme(newTheme) {
    this.validateTheme(newTheme);
    this.root.dataset[this.storageKey] = newTheme;
    const isPressed = this.isPressed?.(newTheme);
    this.toggleElement.setAttribute('aria-pressed', !!isPressed);
  }

  /** Writes the current theme to `localStorage`. */
  syncLocalStorage() {
    localStorage.setItem(this.storageKey, this.theme);
  }

  /** Toggles the current theme according to the relationship specified in the theme map. */
  toggle() {
    const newTheme = this.nextTheme;
    this.setTheme(newTheme);
    this.syncLocalStorage();
  }
}
