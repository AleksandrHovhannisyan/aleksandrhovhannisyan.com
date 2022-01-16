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

const copyableCodeBlocks = document.querySelectorAll('code[data-copyable="true"]');
copyableCodeBlocks.forEach((codeBlock) => {
  const code = codeBlock.innerText;

  const copyCodeButton = document.createElement('button');
  copyCodeButton.className = 'copy-code-button font-sm';
  copyCodeButton.setAttribute('aria-label', 'Copy code to clipboard');
  copyCodeButton.type = 'button';
  codeBlock.prepend(copyCodeButton);

  copyCodeButton.addEventListener('click', () => {
    window.navigator.clipboard.writeText(code);
    copyCodeButton.classList.add('copied');

    setTimeout(() => {
      copyCodeButton.classList.remove('copied');
    }, 2000);
  });
});
