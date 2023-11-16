(function () {
  // Enum of supported themes. Not strictly needed; just helps avoid typos and magic strings.
  const Theme = {
    LIGHT: 'light',
    DARK: 'dark',
  };
  // We'll use this to write and read to localStorage and save the theme as a data- attribute
  const THEME_STORAGE_KEY = 'theme';
  // :root will own the data- attribute for the current theme override
  const themeOwner = document.documentElement;

  // Check to see if the user previously set a site theme preference. If they did, toggle data attribute immediately to prevent theme flash.
  const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  // This should never be false, but it could be if a user tampers with localStorage directly
  const isValidCachedTheme = !!cachedTheme && new Set(Object.values(Theme)).has(cachedTheme);
  if (isValidCachedTheme) {
    themeOwner.dataset[THEME_STORAGE_KEY] = cachedTheme;
  } else {
    localStorage.removeItem(THEME_STORAGE_KEY);
  }

  // Run this only after DOM parsing so we can grab refs to elements. Putting this code here so it's co-located with the above logic.
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    /* System preference (not app preference). We'll use this to listen for system preference changes so we can sync the button aria-pressed
          state. This will only be used in the case where a user never set an app preference (by clicking the toggle); we'll stop listening as soon
          as they do. Only checking dark mode to mirror CSS (where we assume light is default and override it with media queries). */
    const darkThemePreference = window.matchMedia('(prefers-color-scheme: dark)');

    /** Updates UI to reflect the given theme override. */
    const setTheme = (theme) => {
      themeOwner.dataset[THEME_STORAGE_KEY] = theme;
      themeToggle.setAttribute('aria-pressed', theme === Theme.DARK);
    };

    /** Called when a user clicks the theme toggle. Updates UI to reflect the new theme and persists the preference in storage. */
    const toggleTheme = () => {
      const currentTheme = themeOwner.dataset[THEME_STORAGE_KEY];
      const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      setTheme(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      // As soon as the user opts into a site preference, stop listening to system preference
      darkThemePreference.removeEventListener?.('change', handleSystemThemePreferenceChange);
    };

    /** Given a user's system theme preference (from matchMedia API), updates theme state. */
    const handleSystemThemePreferenceChange = ({ matches: isDarkThemePreferred }) => {
      setTheme(isDarkThemePreferred ? Theme.DARK : Theme.LIGHT);
    };

    const initializeTheme = () => {
      // If user previously expressed preference by toggling the button, sync UI
      if (cachedTheme && isValidCachedTheme) {
        // Partially overlaps with initial logic, but that's okay. We mainly care about the button pressed state (now that DOM has loaded).
        setTheme(cachedTheme);
      } else {
        /* User never chose a theme, so fall back to system preference. Watch for changes and sync UI.
              This is for the rare edge case where a user changes preference while on my site. Note: Using optional chaining since
              addEventListener is only available on Safari 14+. */
        darkThemePreference.addEventListener?.('change', handleSystemThemePreferenceChange);
        // Call manually once to sync initial state on load
        handleSystemThemePreferenceChange(darkThemePreference);
      }
    };

    initializeTheme();
    themeToggle.addEventListener('click', toggleTheme);
  });
})();