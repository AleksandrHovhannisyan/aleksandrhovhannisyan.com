// Since this script gets put in the <head>, wrap it in an IIFE to avoid exposing variables
(function () {
  // Enum of supported themes. Not strictly needed; just helps avoid typos and magic strings.
  const Theme = {
    LIGHT: 'light',
    DARK: 'dark',
  };
  // We'll use this to write and read to localStorage and save the theme as a data- attribute
  const THEME_STORAGE_KEY = 'theme';
  // :root will own the data- attribute for the current theme override; it is the only eligible theme owner when this script is parsed in <head>
  const THEME_OWNER = document.documentElement;

  // Check to see if the user previously set a site theme preference.
  const cachedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const isValidCachedTheme = !!cachedTheme && new Set(Object.values(Theme)).has(cachedTheme);
  // If they did and the theme is valid, toggle data attribute immediately to prevent theme flash. This should never be false, but it could be if a user tampers with localStorage directly
  if (isValidCachedTheme) {
    THEME_OWNER.dataset[THEME_STORAGE_KEY] = cachedTheme;
  } else {
    localStorage.removeItem(THEME_STORAGE_KEY);
  }

  // Run this only after DOM parsing so we can grab refs to elements. Putting this code here so it's co-located with the above logic.
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // System preference (not app preference). We'll use this to listen for system preference changes so we can sync the button aria-pressed state. This will only be used in the case where a user never set an app preference (by clicking the toggle); we'll stop listening as soon as they do. Only checking dark mode to mirror CSS (where we assume light is default and override it with prefers-color-scheme queries).
    const darkThemePreference = window.matchMedia('(prefers-color-scheme: dark)');

    /** Updates the toggle button's pressed state to reflect current theme. Since only themes are light/dark, I'm treating it as a binary toggle. */
    const setIsTogglePressed = (isPressed) => themeToggle.setAttribute('aria-pressed', isPressed);

    /** Updates UI to reflect the given theme override. */
    const setTheme = (theme) => {
      THEME_OWNER.dataset[THEME_STORAGE_KEY] = theme;
      setIsTogglePressed(theme === Theme.DARK);
    };

    /** Called when a user clicks the theme toggle. Updates UI to reflect the new theme and persists the preference in storage. */
    const toggleTheme = () => {
      // Not the best idea to store state in client-side UI since it can be tampered with, but this is a harmless script
      const currentTheme = THEME_OWNER.dataset[THEME_STORAGE_KEY];
      const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      setTheme(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      // As soon as the user opts into a site preference, stop listening to system preference
      darkThemePreference.removeEventListener?.('change', handleSystemDarkThemePreferenceChange);
    };

    /** Given a user's system theme preference (from matchMedia API), updates theme state. */
    const handleSystemDarkThemePreferenceChange = ({ matches: isDarkThemePreferred }) => {
      // Note: No need to also set the theme on the root as a data- attribute. CSS prefers-color-scheme queries will take care of this for us.
      setIsTogglePressed(isDarkThemePreferred);
    };

    const initializeTheme = () => {
      // If user previously expressed preference by toggling the button, sync UI
      if (isValidCachedTheme) {
        // We couldn't do this before since the DOM hadn't been parsed yet, but we can (and should) do it now.
        setIsTogglePressed(cachedTheme === Theme.DARK);
      } else {
        // User never chose a theme, so fall back to system preference. Watch for changes and sync UI. This is for the rare edge case where a user changes preference while on my site. Note: Using optional chaining since addEventListener is only available on Safari 14+.
        darkThemePreference.addEventListener?.('change', handleSystemDarkThemePreferenceChange);
        // Call manually once to sync initial state on load
        handleSystemDarkThemePreferenceChange(darkThemePreference);
      }
    };

    initializeTheme();
    themeToggle.addEventListener('click', toggleTheme);
  });
})();
