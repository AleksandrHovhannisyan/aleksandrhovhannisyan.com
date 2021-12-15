import ThemeToggle from './components/ThemeToggle/index.mjs';

// eslint-disable-next-line no-unused-vars
const themeToggle = new ThemeToggle({
  root: document.documentElement,
  toggleElement: document.getElementById('theme-toggle'),
  storageKey: 'theme',
  defaultTheme: 'light',
  themes: {
    light: 'dark',
    dark: 'light',
  },
});

const copyableCodeBlocks = document.querySelectorAll('.code-header.with-copy-button + pre[class*="language-"]');
const copyCodeButtons = document.querySelectorAll('.copy-code-button');

copyCodeButtons.forEach((copyCodeButton, index) => {
  const code = copyableCodeBlocks[index].innerText;

  copyCodeButton.addEventListener('click', () => {
    window.navigator.clipboard.writeText(code);
    copyCodeButton.classList.add('copied');

    setTimeout(() => {
      copyCodeButton.classList.remove('copied');
    }, 2000);
  });
});
