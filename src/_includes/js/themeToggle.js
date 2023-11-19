// Since this script gets put in the <head>, wrap it in an IIFE to avoid exposing variables
(function () {
  // Enum of supported themes. Not strictly needed; just helps avoid typos and magic strings.
  const Theme = { LIGHT: 'light', DARK: 'dark' };
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
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // For the case where a user never set a color preference for the site
    let darkThemeSystemPreference;

    /** Updates the toggle button's pressed state to reflect current theme. Since the only supported themes are light/dark, I'm treating it as a binary toggle. */
    const setIsTogglePressed = (isPressed) => themeToggle.setAttribute('aria-pressed', isPressed);

    /** Called when a user clicks the theme toggle. Updates UI to reflect the new theme and persists the preference in storage. */
    const toggleTheme = () => {
      // Not the best idea to store state in client-side UI since it can be tampered with, but this is a harmless script
      const oldTheme = THEME_OWNER.dataset[THEME_STORAGE_KEY];
      const newTheme = oldTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      THEME_OWNER.dataset[THEME_STORAGE_KEY] = newTheme;
      setIsTogglePressed(newTheme === Theme.DARK);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      // As soon as the user opts into a site preference, stop listening to system preference
      darkThemeSystemPreference?.removeEventListener?.('change', handleSystemDarkThemePreferenceChange);
    };

    /** Given a user's system theme preference (from matchMedia API), updates theme state. */
    const handleSystemDarkThemePreferenceChange = ({ matches: isDarkThemePreferred }) => {
      // Note: No need to also set the theme on the root as a data- attribute. CSS prefers-color-scheme queries will take care of this for us.
      setIsTogglePressed(isDarkThemePreferred);
    };

    if (!cachedTheme) {
      darkThemeSystemPreference = window.matchMedia('(prefers-color-scheme: dark)');
      darkThemeSystemPreference.addEventListener?.('change', handleSystemDarkThemePreferenceChange);
    }

    // Set initial pressed state and listen for manual toggles
    setIsTogglePressed(cachedTheme === Theme.DARK || !!darkThemeSystemPreference?.matches);
    themeToggle.addEventListener('click', toggleTheme);
  });
})();