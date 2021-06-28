export default class ThemeToggle {
  constructor({ toggleElement, themeOwner, storageKey, defaultTheme, themeMap }) {
    this.themeOwner = themeOwner;
    this.toggleElement = toggleElement;
    this.toggleElement.addEventListener('click', () => this.toggle());
    this.storageKey = storageKey;
    this.themeMap = themeMap;
    this.theme = localStorage.getItem(storageKey) ?? defaultTheme;

    // On init, only update the class names and sync the aria label. The main
    // init logic comes from the IIFE in src/_layouts/default.html.
    this.updateClassNames(defaultTheme, this.theme);
    this.syncAriaLabelWithStorage();
  }

  get currentTheme() {
    return this.theme;
  }

  get nextTheme() {
    return this.themeMap[this.theme];
  }

  updateClassNames(oldTheme, newTheme) {
    this.themeOwner.classList.remove(oldTheme);
    this.themeOwner.classList.add(newTheme);
  }

  syncAriaLabelWithStorage() {
    this.toggleElement.setAttribute('aria-label', `Switch to ${this.nextTheme} mode theme`);
  }

  setTheme(newTheme) {
    this.updateClassNames(this.theme, newTheme);
    this.theme = newTheme;
    localStorage.setItem(this.storageKey, newTheme);
    this.syncAriaLabelWithStorage();
  }

  toggle() {
    this.setTheme(this.nextTheme);
  }
}
