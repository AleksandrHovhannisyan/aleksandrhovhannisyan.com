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
    this.syncAriaLabelWithStorage();
  }

  toggle() {
    const oldTheme = this.themeOwner.classList.value;
    const newTheme = themeMap[oldTheme];
    this.setColorTheme(oldTheme, newTheme);
  }

  setColorTheme(oldTheme, newTheme) {
    this.themeOwner.classList.remove(oldTheme);
    this.themeOwner.classList.add(newTheme);
    localStorage.setItem(this.storageKey, newTheme);
    this.syncAriaLabelWithStorage();
  }

  syncAriaLabelWithStorage() {
    const currentTheme = localStorage.getItem(this.storageKey);
    const nextTheme = themeMap[currentTheme];
    this.toggleElement.setAttribute('aria-label', `Switch to ${nextTheme} mode theme`);
  }
}
