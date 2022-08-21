import { THEME_KEY, Themes, copyToClipboardButtonStrings } from './constants.mjs';
import ThemeToggle from './components/ThemeToggle.mjs';

const themeToggleElement = document.getElementById('theme-toggle');

if (themeToggleElement) {
  const cachedTheme = localStorage.getItem(THEME_KEY);
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? Themes.DARK : Themes.LIGHT;

  // eslint-disable-next-line no-unused-vars
  const themeToggle = new ThemeToggle({
    toggleElement: themeToggleElement,
    initialTheme: cachedTheme ?? preferredTheme,
    setTheme: (theme) => {
      document.documentElement.dataset[THEME_KEY] = theme;
      themeToggleElement.setAttribute('aria-pressed', theme === Themes.DARK);
    },
    setCachedTheme: (theme) => localStorage.setItem(THEME_KEY, theme),
    themes: {
      [Themes.LIGHT]: Themes.DARK,
      [Themes.DARK]: Themes.LIGHT,
    },
  });
}

document.querySelectorAll('code[class*=language-]').forEach((codeBlock) => {
  // TODO: This is my only option until https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/72 is addressed
  codeBlock.setAttribute('tabindex', 0);

  if (codeBlock.getAttribute('data-copyable')) {
    const code = codeBlock.innerText;
    const copyCodeButton = document.createElement('button');
    copyCodeButton.className = 'copy-code-button fs-sm';
    copyCodeButton.innerText = copyToClipboardButtonStrings.default;
    // Set an aria label explicitly to clarify the button's action a bit better for screen reader users; sighted users should be able to relate "Copy" to the code block in which the button is positioned
    copyCodeButton.setAttribute('aria-label', copyToClipboardButtonStrings.ariaLabel);
    copyCodeButton.type = 'button';
    codeBlock.parentElement.append(copyCodeButton);

    // Accessible alert whose inner text changes when we copy.
    const copiedAlert = document.createElement('span');
    copiedAlert.setAttribute('role', 'alert');
    copiedAlert.classList.add('screen-reader-only');
    codeBlock.parentElement.append(copiedAlert);

    copyCodeButton.addEventListener('click', () => {
      window.navigator.clipboard.writeText(code);
      copyCodeButton.classList.add('copied');
      copyCodeButton.innerText = copyToClipboardButtonStrings.copied;
      copiedAlert.innerText = copyToClipboardButtonStrings.copied;

      setTimeout(() => {
        copyCodeButton.classList.remove('copied');
        copyCodeButton.innerText = copyToClipboardButtonStrings.default;
        copiedAlert.innerText = '';
      }, 2000);
    });
  }
});
