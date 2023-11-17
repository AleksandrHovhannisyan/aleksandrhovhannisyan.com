// Since this script gets put in the <head>, wrap it in an IIFE to avoid exposing variables
(function () {
  // Enum of supported themes. Not strictly needed; just helps avoid typos and magic strings.
  const Theme = { SYSTEM: 'system', LIGHT: 'light', DARK: 'dark' };
  // We'll use this to write and read to localStorage and save the theme as a data- attribute
  const THEME_STORAGE_KEY = 'theme';
  // :root will own the data- attribute for the current theme override; it is the only eligible theme owner when this script is parsed in <head>
  const THEME_OWNER = document.documentElement;

  // Check to see if the user previously set a site theme preference.
  const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (cachedTheme) {
    // If they did, toggle data attribute immediately to prevent theme flash.
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
  }

  // Run this only after DOM parsing so we can grab refs to elements. Putting this code here so it's co-located with the above logic.
  document.addEventListener('DOMContentLoaded', () => {
    const themePicker = document.getElementById('theme-picker');
    if (!themePicker) return;

    // Listen for change to sync localStorage and data- attribute
    themePicker.addEventListener('change', (e) => {
      const theme = e.target.value;
      if (theme === Theme.SYSTEM) {
        // Remove JS-set theme so the CSS :not([data-theme]) selectors kick in
        delete THEME_OWNER.dataset[THEME_STORAGE_KEY];
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        THEME_OWNER.dataset[THEME_STORAGE_KEY] = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    });

    // Sync picker's selected state to reflect initial theme
    const initialTheme = cachedTheme ?? Theme.SYSTEM;
    themePicker.querySelector('option[selected]').removeAttribute('selected');
    themePicker.querySelector(`option[value="${initialTheme}"]`).setAttribute('selected', '');
  });
})();
