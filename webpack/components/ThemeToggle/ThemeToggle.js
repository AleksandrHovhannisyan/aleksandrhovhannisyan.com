const themeMap = {
  light: 'dark',
  dark: 'light',
};

export default class ThemeToggle {
  constructor({ toggleSelector, themeOwner, storageKey }) {
    this.toggleElement = document.querySelector(toggleSelector);
    this.toggleElement.addEventListener('click', () => this.toggle());
    this.themeOwner = themeOwner;
    this.storageKey = storageKey;
    this.theme = localStorage.getItem(storageKey) || 'light';
    this.syncAriaLabelWithStorage();
  }

  get currentTheme() {
    return this.theme;
  }

  toggle() {
    const oldTheme = this.currentTheme;
    const newTheme = themeMap[oldTheme];

    this.themeOwner.classList.remove(oldTheme);
    this.themeOwner.classList.add(newTheme);

    localStorage.setItem(this.storageKey, newTheme);
    this.theme = newTheme;
    this.syncAriaLabelWithStorage();
  }

  syncAriaLabelWithStorage() {
    const nextTheme = themeMap[this.currentTheme];
    this.toggleElement.setAttribute('aria-label', `Switch to ${nextTheme} mode theme`);
  }
}
