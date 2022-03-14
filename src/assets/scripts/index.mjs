import ThemeToggle, { Themes } from './components/ThemeToggle/index.mjs';

// eslint-disable-next-line no-unused-vars
const themeToggle = new ThemeToggle({
  root: document.documentElement,
  toggleElement: document.getElementById('theme-toggle'),
  storageKey: 'theme',
  defaultTheme: Themes.LIGHT,
  themes: {
    [Themes.LIGHT]: Themes.DARK,
    [Themes.DARK]: Themes.LIGHT,
  },
  preferredTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? Themes.DARK : undefined,
  isPressed: (theme) => theme === Themes.DARK,
});

const copyableCodeBlocks = document.querySelectorAll('code[data-copyable="true"]');
copyableCodeBlocks.forEach((codeBlock) => {
  const code = codeBlock.innerText;

  const copyCodeButton = document.createElement('button');
  copyCodeButton.className = 'copy-code-button fs-sm';
  copyCodeButton.setAttribute('aria-label', 'Copy code to clipboard');
  copyCodeButton.type = 'button';
  codeBlock.append(copyCodeButton);

  copyCodeButton.addEventListener('click', () => {
    window.navigator.clipboard.writeText(code);
    copyCodeButton.classList.add('copied');

    setTimeout(() => {
      copyCodeButton.classList.remove('copied');
    }, 2000);
  });
});
