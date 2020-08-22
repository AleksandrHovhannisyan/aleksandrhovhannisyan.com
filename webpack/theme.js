const html = document.documentElement;

function setColorTheme(newTheme, oldTheme) {
  html.classList.add(newTheme);
  html.classList.remove(oldTheme);
  localStorage.setItem('theme', newTheme);
}

function toggleColorTheme() {
  if (html.classList.contains('dark')) {
    setColorTheme('light', 'dark');
  } else {
    setColorTheme('dark', 'light');
  }
}

export default toggleColorTheme;
