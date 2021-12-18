export default class ThemeToggle {
  constructor({ toggleElement, root, storageKey, defaultTheme, themes }) {
    this.root = root;
    this.toggleElement = toggleElement;
    this.toggleElement.addEventListener('click', () => this.toggle());
    this.storageKey = storageKey;
    this.themes = themes;

    const initialTheme = localStorage.getItem(storageKey) ?? defaultTheme;
    this.setTheme(initialTheme, false);
  }

  get currentTheme() {
    return this.root.dataset.theme;
  }

  get nextTheme() {
    return this.themes[this.currentTheme];
  }

  setTheme(newTheme, shouldUpdateLocalStorage = true) {
    this.root.dataset.theme = newTheme;
    this.toggleElement.setAttribute('aria-label', `Switch to ${this.nextTheme} theme`);
    if (shouldUpdateLocalStorage) {
      localStorage.setItem(this.storageKey, newTheme);
    }
  }

  toggle() {
    this.setTheme(this.nextTheme);
  }
}
